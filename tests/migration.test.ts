import {test} from 'node:test';
import assert from 'node:assert/strict';
import z from '@deepseek-ai/schemastery';
import {defaultState,readState,validState,type LegacyStoredState} from '../src/model/appearance.ts';
import {readBrowserState} from '../src/model/browser.ts';
import {storedSchema} from '../src/model/schema.ts';

import {legacyFixture} from './fixtures.ts';
test('migrate current settings and all presets once, keeping the complete original backup',()=>{
 const legacy=legacyFixture(),original=structuredClone(legacy),state=readState(legacy)!;
 assert.equal(state.version,2);assert.ok(validState(state));assert.deepEqual(legacy,original);
 assert.deepEqual(state.current.palettes.light,{theme:'#f2f2ed',sidebar:'#f0f2f1',accent:'#3366ff'});
 assert.equal(state.current.uiFont,'Old UI Font');assert.equal(state.current.codeFont,'Old Code Font');
 assert.equal(state.selectedPreset,'custom-kept');assert.equal(state.presets[0].name,'保留的方案');
 assert.equal(state.presets[0].value.mode,'dark');assert.equal(state.presets[0].value.palettes.dark.theme,'#202020');
 assert.deepEqual(state.legacyBackup,original);assert.deepEqual(readState(state),state);
 const wire=new z(JSON.parse(JSON.stringify(storedSchema.toJSON())));
 assert.deepEqual(wire(legacy),legacy);assert.deepEqual(wire(state),state);
});
test('migrate the standalone browser format, preserve backup, refuse malformed or future data',()=>{
 const legacy=legacyFixture();const raw={version:1,config:{...legacy.current,mode:'system'},selectedPreset:legacy.selectedPreset,presets:legacy.presets};
 const state=readBrowserState(raw)!;assert.equal(state.version,2);assert.equal(state.config.mode,'system');
 assert.equal(state.config.palettes.light.theme,'#f2f2ed');assert.deepEqual(state.legacyBackup,legacy);
 assert.deepEqual(readBrowserState(state),state);
 assert.equal(readState({...legacy,version:3}),undefined);
 assert.equal(readState({...defaultState,version:3}),undefined);
 assert.equal(readBrowserState({...raw,version:3}),undefined);
 assert.equal(readState({...legacy,current:{...legacy.current,palettes:{light:{},dark:{}}}}),undefined);
});
