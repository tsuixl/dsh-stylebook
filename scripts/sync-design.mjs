import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
const result=await build({entryPoints:['src/model/browser.ts'],bundle:true,platform:'browser',format:'iife',globalName:'StylebookModel',write:false,target:'chrome140'});
const path='docs/design/appearance.html';
const html=await readFile(path,'utf8');
const pattern=/\/\* stylebook-model:start \*\/[\s\S]*?\/\* stylebook-model:end \*\//;
if(!pattern.test(html))throw new Error('Design model marker missing');
const updated=html.replace(pattern,()=>`/* stylebook-model:start */\n${result.outputFiles[0].text}\n/* stylebook-model:end */`);
if(process.argv.includes('--check')){
 if(updated!==html)throw new Error('Standalone design model is stale. Run pnpm design:sync.');
 console.log('Standalone design model matches source.');
}else{
 await writeFile(path,updated);
 console.log('Synchronized standalone design model.');
}
