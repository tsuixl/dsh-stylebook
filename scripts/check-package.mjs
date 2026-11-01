import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile, mkdir} from 'node:fs/promises';
import {extname, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {runInNewContext} from 'node:vm';

/** Inspect the actual archive, including its client registration, without running plugin code. */
export function verifyPackage(archive, source) {
    const entries = execFileSync('tar', ['-tzf', archive], {encoding: 'utf8'}).trim().split(/\r?\n/).filter(name => !name.endsWith('/'));
    for (const name of entries) {
        assert(!name.includes('..') && !name.includes('\\'), `Unsafe archive path: ${name}`);
        assert(/^package\/(?:lib\/|locale\/|package\.json$|cordis\.patch\.yml$|LICENSE$|CHANGELOG\.md$|README(?:\.en)?\.md$)/.test(name), `Unexpected packed file: ${name}`);
    }
    const read = name => execFileSync('tar', ['-xOf', archive, 'package/' + name], {encoding: 'utf8'});
    const required = ['package.json', 'LICENSE', 'CHANGELOG.md', 'README.md', 'README.en.md', 'locale/zh.json', 'locale/en.json'];
    const pkg = JSON.parse(read('package.json'));
    assert.equal(pkg.name, source.name);
    assert.equal(pkg.version, source.version);
    assert.equal(pkg.type, 'module');
    assert.deepEqual(pkg.engines, source.engines);
    assert(pkg.engines.dsh && pkg.license && pkg.repository?.url, 'Missing compatibility/license/repository metadata');
    assert(pkg.dsh?.bundle?.patch, 'Missing dsh.bundle.patch');
    for (const entry of [pkg.exports?.['.'], pkg.exports?.['./client'], pkg.dsh.bundle.patch]) {
        assert(typeof entry === 'string' && entry.startsWith('./') && !entry.includes('..'), 'Invalid plugin entry');
        required.push(entry.slice(2));
    }
    for (const entry of required) assert(entries.includes('package/' + entry), `Missing packed file: ${entry}`);
    for (const hook of ['preinstall', 'install', 'postinstall', 'prepare']) assert(!pkg.scripts?.[hook], `Unexpected install hook: ${hook}`);
    assert.match(read(pkg.dsh.bundle.patch.slice(2)), new RegExp('name:\\s*' + pkg.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\s|$)'));
    for (const lang of ['zh', 'en']) assert(JSON.parse(read(`locale/${lang}.json`)).meta?.title, 'Missing locale title');
    let registration;
    runInNewContext(read(pkg.exports['./client'].slice(2)), {window: {__ModuleLoader__: {load(value) {registration = value;}}}}, {timeout: 1000});
    assert.equal(registration?.id, pkg.name);
    assert.equal(typeof registration.factory, 'function');
    return {version: pkg.version, files: entries.length};
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const pkg = JSON.parse(await readFile('package.json', 'utf8'));
    const manager = process.env.npm_execpath;
    assert(manager, 'Run this check with pnpm package:check.');
    const output = resolve('.local/packages');
    await mkdir(output, {recursive: true});
    // Invoke the current package manager directly; Windows .cmd shell quoting is unnecessary.
    const javascript = /\.[cm]?js$/i.test(extname(manager));
    execFileSync(javascript ? process.execPath : manager, [...(javascript ? [manager] : []), 'pack', '--pack-destination', output], {stdio: 'inherit'});
    const archive = resolve(output, `${pkg.name.replace(/^@/, '').replace('/', '-')}-${pkg.version}.tgz`);
    const result = verifyPackage(archive, pkg);
    console.log(`Verified ${result.version}: ${result.files} files; ${archive}`);
}
