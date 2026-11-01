import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaultState,validState,validAppearance,clone,fontFamily,sameAppearance} from '../src/model/appearance.ts';
import {defaults} from '../src/model/defaults.ts';
import z from '@deepseek-ai/schemastery';
import {storedSchema} from '../src/model/schema.ts';
test('Host schema survives the DSH JSON form boundary',()=>{
 const browserSchema=new z(JSON.parse(JSON.stringify(storedSchema.toJSON())));
 assert.deepEqual(browserSchema(clone(defaultState)),defaultState);
 const invalid=clone(defaultState);invalid.current.codeSize=23;
 assert.throws(()=>browserSchema(invalid));
 assert.throws(()=>browserSchema({...clone(defaultState),version:3}));
});
test('reject invalid persisted state without clamping user data',()=>{
 assert.ok(validState(defaultState));
 for(const size of [9,23,12.5,NaN])assert.equal(validAppearance({...defaults,uiSize:size}),false);
 assert.ok(validAppearance({...defaults,codeSize:22}));
 assert.equal(validState({...defaultState,version:3}),false);
 const state=clone(defaultState);state.presets=[{id:'custom-a',name:'工作',value:clone(defaults)},{id:'custom-b',name:'工作',value:clone(defaults)}];
 assert.equal(validState(state),false);
 assert.equal(validAppearance({...defaults,palettes:{light:{},dark:{}}}),false);
});
test('unknown preset and unsafe font input never enter CSS declarations',()=>{
 assert.equal(validState({...defaultState,selectedPreset:'missing'}),false);
 assert.ok(!fontFamily('A";color:red;/*').includes('";color'));
 assert.match(fontFamily('',true),/monospace$/);
});

test('modified badge compares appearance values instead of serialized key order',()=>{
 const {mode,...fields}=clone(defaults);const reordered={...fields,mode};
 reordered.palettes.light={accent:defaults.palettes.light.accent.toUpperCase(),sidebar:defaults.palettes.light.sidebar,theme:defaults.palettes.light.theme};
 assert.equal(sameAppearance(defaults,reordered),true);
 assert.equal(sameAppearance(defaults,{...reordered,codeSize:22}),false);
});
