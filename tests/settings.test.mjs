import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInContext} from 'node:vm';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {legacyFixture} from './fixtures.ts';
import {defaultState} from '../src/model/appearance.ts';

async function settingsHarness({writeData,writeMode,afterData}={}) {
 const bundle=(await build({entryPoints:['src/client/dsh/settings.ts'],bundle:true,platform:'browser',format:'iife',globalName:'settingsModule',write:false})).outputFiles[0].text;
 const dom=new JSDOM('<head></head><body></body>',{runScripts:'outside-only'});
 dom.window.structuredClone=structuredClone;runInContext(bundle,dom.getInternalVMContext());
 const state={data:structuredClone(defaultState),preference:'light',dataWrites:0,modeWrites:[],layers:new Set()};
 const listeners=new Set(),nativeListeners=new Set();
 const notify=()=>{for(const f of listeners)f();};
 const form={getSnapshot:()=>({status:'ready',value:{data:state.data},writable:true,revision:state.dataWrites+1}),subscribe:f=>{listeners.add(f);return()=>listeners.delete(f);},
  async set(key,value){state.dataWrites++;if(writeData&&!await writeData(value))return false;state.data=structuredClone(value);notify();await afterData?.();return true;}};
 const native={getSnapshot:()=>({status:'ready',value:{preference:state.preference},writable:true}),subscribe:f=>{nativeListeners.add(f);return()=>nativeListeners.delete(f);},
  async set(key,value){state.modeWrites.push(value);if(writeMode&&!await writeMode(value))return false;state.preference=value;for(const f of nativeListeners)f();return true;}};
 const ctx={configForms:{get:name=>name==='stylebook'?form:native},theme:{getTheme:()=>({preference:state.preference}),overrideTokens(){const token={};state.layers.add(token);return()=>state.layers.delete(token);}}};
 const bridge=new dom.window.settingsModule.StylebookSettings(ctx);
 return {bridge,state,notify,close(){bridge.dispose();dom.window.close();}};
}

test('theme saves serialize both Host forms and the latest selection wins',async()=>{
 const started=Promise.withResolvers(),release=Promise.withResolvers();
 const h=await settingsHarness({writeMode:async mode=>{if(mode==='dark'){started.resolve();await release.promise;}return true;}});
 try{
  const first=h.bridge.save({...h.bridge.snapshot(),config:{...h.bridge.snapshot().config,mode:'dark'}});
  await started.promise;
  const second=h.bridge.save({...h.bridge.snapshot(),config:{...h.bridge.snapshot().config,mode:'light'}});
  await new Promise(setImmediate);
  const statusWhilePending=h.bridge.snapshot().status;
  release.resolve();await Promise.all([first,second]);
  assert.equal(statusWhilePending,'正在保存…');
  assert.equal(h.state.preference,'light');assert.equal(h.bridge.snapshot().config.mode,'light');
  assert.deepEqual(h.state.modeWrites,['dark','light']);assert.equal(h.bridge.snapshot().status,'已保存');
 }finally{release.resolve();h.close();}
});

test('flush follows edits queued while an earlier save is pending',async()=>{
 const started=Promise.withResolvers(),release=Promise.withResolvers(),modeStarted=Promise.withResolvers(),releaseMode=Promise.withResolvers();
 const h=await settingsHarness({writeData:async()=>{started.resolve();await release.promise;return true;},writeMode:async()=>{modeStarted.resolve();await releaseMode.promise;return true;}});
 try{
  const first=h.bridge.save({...h.bridge.snapshot(),config:{...h.bridge.snapshot().config,uiSize:15}});
  await started.promise;
  const flushing=h.bridge.flush();
  const second=h.bridge.save({...h.bridge.snapshot(),config:{...h.bridge.snapshot().config,mode:'dark',codeSize:22}});
  let flushed=false;void flushing.then(()=>{flushed=true;});
  release.resolve();await modeStarted.promise;await new Promise(setImmediate);const premature=flushed;
  releaseMode.resolve();assert.equal(await flushing,true);await Promise.all([first,second]);
  assert.equal(premature,false,'closing must wait for the newer theme write');
  assert.equal(h.state.data.current.codeSize,22);assert.equal(h.state.preference,'dark');
 }finally{release.resolve();releaseMode.resolve();h.close();}
});

test('Host refusal and transport errors remain failures without poisoning a later save',async()=>{
 for(const kind of ['data-refused','mode-refused','transport']){
  let fail=true;
  const h=await settingsHarness({writeData:async()=>{if(fail&&kind==='transport')throw new Error('offline');return !(fail&&kind==='data-refused');},writeMode:async()=>!(fail&&kind==='mode-refused')});
  try{
   const draft={...h.bridge.snapshot(),config:{...h.bridge.snapshot().config,mode:'dark',uiSize:17}};
   assert.equal(await h.bridge.save(draft),false);assert.equal(await h.bridge.flush(),false);
   assert.match(h.bridge.snapshot().status,/保存失败/);assert.equal(h.bridge.snapshot().config.mode,'light');
   assert.equal(h.bridge.snapshot().config.uiSize,kind==='mode-refused'?17:14);
   fail=false;assert.equal(await h.bridge.save(draft),true);assert.equal(await h.bridge.flush(),true);
   assert.equal(h.state.preference,'dark');assert.equal(h.bridge.snapshot().status,'已保存');
  }finally{h.close();}
 }
});

test('settlement reads accepted Host changes that arrived while saving',async()=>{
 const started=Promise.withResolvers(),release=Promise.withResolvers();
 const h=await settingsHarness({afterData:async()=>{started.resolve();await release.promise;}});
 try{
  const save=h.bridge.save({...h.bridge.snapshot(),config:{...h.bridge.snapshot().config,uiSize:15}});
  await started.promise;
  // A newer accepted snapshot can arrive before the original request settles.
  h.state.data={...h.state.data,current:{...h.state.data.current,codeSize:19}};h.notify();
  release.resolve();await save;
  assert.equal(h.bridge.snapshot().config.codeSize,h.state.data.current.codeSize);
 }finally{release.resolve();h.close();}
});

test('disposing during a save cancels queued edits and never reinstalls token layers',async()=>{
 const started=Promise.withResolvers(),release=Promise.withResolvers();
 const h=await settingsHarness({writeData:async()=>{started.resolve();await release.promise;return true;}});
 try{
  const first=h.bridge.save({...h.bridge.snapshot(),config:{...h.bridge.snapshot().config,mode:'dark'}});
  await started.promise;
  const second=h.bridge.save({...h.bridge.snapshot(),config:{...h.bridge.snapshot().config,uiSize:17}});
  h.bridge.dispose();release.resolve();await Promise.all([first,second]);
  assert.equal(h.state.dataWrites,1);assert.deepEqual(h.state.modeWrites,[]);assert.equal(h.state.layers.size,0);
 }finally{release.resolve();h.close();}
});

test('Host migration uses the observed revision, preserves backup on edits, and handles refusal/read-only/future data',async()=>{
 const bundle=(await build({entryPoints:['src/client/dsh/settings.ts'],bundle:true,platform:'browser',format:'iife',globalName:'settingsModule',write:false})).outputFiles[0].text;
 for(const scenario of ['accepted','refused','read-only','future']){
  const dom=new JSDOM('<head></head><body></body>',{runScripts:'outside-only'});
  dom.window.structuredClone=structuredClone;runInContext(bundle,dom.getInternalVMContext());
  const original=legacyFixture();let data=structuredClone(original),revision=4,writes=0;const listeners=new Set();
  if(scenario==='future')data.version=3;
  const form={getSnapshot:()=>({status:'ready',value:{data},writable:scenario!=='read-only',revision}),subscribe:f=>{listeners.add(f);return()=>listeners.delete(f);},
   async mutate(ops,expected){writes++;assert.equal(expected,4);if(scenario==='refused')return false;data=structuredClone(ops[0].value);revision++;for(const f of listeners)f();return true;},
   async set(key,value){writes++;assert.equal(key,'data');data=structuredClone(value);revision++;for(const f of listeners)f();return true;}};
  const native={getSnapshot:()=>({value:{preference:'system'},writable:true}),subscribe:()=>()=>{},set:async()=>true};
  const ctx={configForms:{get:name=>name==='stylebook'?form:native},theme:{getTheme:()=>({preference:'system'}),overrideTokens:()=>()=>{}}};
  const bridge=new dom.window.settingsModule.StylebookSettings(ctx);await bridge.flush();
  if(scenario==='accepted'){
   assert.equal(data.version,2);assert.deepEqual(data.legacyBackup,original);assert.equal(writes,1);
   const draft=bridge.snapshot();assert.equal(draft.config.palettes.light.theme,'#f2f2ed');
   await bridge.save({...draft,config:{...draft.config,uiSize:17}});
   assert.equal(data.current.uiSize,17);assert.deepEqual(data.legacyBackup,original);
   const count=writes;for(const f of listeners)f();assert.equal(writes,count,'reading v2 must not migrate again');
  }else{
   assert.deepEqual(data,scenario==='future'?{...original,version:3}:original);
   assert.equal(writes,scenario==='refused'?1:0);
   assert.equal(bridge.snapshot().writable,scenario==='refused');
  }
  bridge.dispose();assert.equal(listeners.size,0);dom.window.close();
 }
});
