import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
await mkdir('lib', { recursive: true });
await build({entryPoints:['src/index.ts'],outfile:'lib/index.js',bundle:true,platform:'node',format:'esm',packages:'external',target:'node24'});
const result=await build({entryPoints:['src/client/index.tsx'],bundle:true,platform:'browser',format:'cjs',packages:'external',target:'chrome140',write:false,loader:{'.html':'text','.css':'text'}});
const body=result.outputFiles[0].text;
await writeFile('lib/client.js',`window.__ModuleLoader__.load({id:"dsh-stylebook",factory:(require)=>{var module={exports:{}};var exports=module.exports;\n${body}\nreturn module.exports;}});\n`);
console.log('Built Host and DSH lazy-CJS client bundle.');
