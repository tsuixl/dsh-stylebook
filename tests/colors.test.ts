import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {surfaceColors,resolvePalette,readableText,contrastRatio} from '../src/model/colors.ts';

test('overlay controls keep default design colors and follow a custom overlay',()=>{
 assert.deepEqual(surfaceColors('#ffffff','light'),{surface:'#ffffff',control:'#ffffff',subtle:'#f8f9fc',hover:'#f0f2f7'});
 assert.deepEqual(surfaceColors('#242934','dark'),{surface:'#222630',control:'#292e39',subtle:'#1d2029',hover:'#313745'});
 assert.deepEqual(surfaceColors('#F2F2ED','light'),{surface:'#f2f2ed',control:'#f2f2ed',subtle:'#ebecea',hover:'#e3e5e5'});
 assert.equal(surfaceColors('#000000','dark').surface,'#000000');
 assert.equal(surfaceColors('#ffffff','dark').control,'#ffffff');
});

test('three colors derive every region with readable primary and secondary text',()=>{
 for(const theme of ['#ffffff','#242934','#F2F2ED','#808080','#005500'])for(const mode of ['light','dark'] as const){
  const base={theme,sidebar:'#101820',accent:'#4d6bfe'};const p=resolvePalette(base,mode);
  assert.equal(p.workspace,theme.toLowerCase());assert.equal(p.overlay,p.workspace);assert.equal(p.tools,p.sidebar);
  assert.ok(contrastRatio(p.workspace,p.text)>=4.5);assert.ok(contrastRatio(p.workspace,p.muted)>=4.5);
  assert.ok(contrastRatio(p.sidebar,p.sidebarText)>=4.5);assert.ok(contrastRatio(p.sidebar,p.sidebarMuted)>=4.5);
 }
});

test('standalone design and plugin share the same palette implementation',()=>{
 const html=readFileSync('docs/design/appearance.html','utf8');
 const model=html.split('/* stylebook-model:start */')[1].split('/* stylebook-model:end */')[0];
 for(const theme of ['#ffffff','#242934','#F2F2ED','#123456'])for(const mode of ['light','dark'] as const){
  const base={theme,sidebar:'#f0f2f1',accent:'#3366ff'};
  const actual=runInNewContext(model+'\nJSON.stringify(StylebookModel.resolvePalette(base,mode))',{base,mode,structuredClone});
  assert.deepEqual(JSON.parse(actual),resolvePalette(base,mode));
 }
});
