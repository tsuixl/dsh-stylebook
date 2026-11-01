import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInContext} from 'node:vm';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

test('native menu surfaces follow overlay while dialog-only layers stay scoped and removable',async()=>{
 const result=await build({entryPoints:['src/client/dsh/theme.ts'],bundle:true,platform:'browser',format:'iife',globalName:'themeModule',write:false});
 const dom=new JSDOM('<!doctype html><head></head><body></body>',{runScripts:'outside-only'});
 dom.window.structuredClone=structuredClone;
 runInContext(result.outputFiles[0].text,dom.getInternalVMContext());
 let active;
 const ctx={theme:{overrideTokens(source,tokens){const layer={source,tokens};active=layer;return()=>{if(active===layer)active=undefined;};}}};
 const config=structuredClone((await import('../src/model/defaults.ts')).defaults);
 config.palettes.light.theme='#f2f2ed';
 const applier=dom.window.themeModule.createThemeApplier(ctx);applier.apply(config);
 assert.equal(active.tokens['--dsw-specific-menu'].light,'#f2f2ed');
 assert.equal(active.tokens['--dsw-menu-surface-fill'].light,'#f2f2ed');
 assert.equal(active.tokens['--dsw-alias-bg-layer-2'],undefined,'shared layers remain locally scoped');
 assert.equal(active.tokens['--dsw-alias-bg-base'].light,'#f2f2ed');
 const style=dom.window.document.querySelector('style[data-stylebook="regions"]');
 assert.match(style.textContent,/\[role="dialog"\]\{[^}]*--dsw-alias-settings-card-fill:#f2f2ed/);
 assert.match(style.textContent,/\[role="dialog"\]\{[^}]*--dsw-alias-bg-base:#f2f2ed/);
 config.palettes.light.theme='#dce6d8';applier.apply(config);
 assert.equal(active.tokens['--dsw-specific-menu'].light,'#dce6d8','replacing an old layer must retain the new one');
 applier.dispose();assert.equal(active,undefined);assert.equal(style.isConnected,false);dom.window.close();
});
