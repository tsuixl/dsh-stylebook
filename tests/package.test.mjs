import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtemp, mkdir, readFile, writeFile, unlink, rm} from 'node:fs/promises';
import {join, dirname, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {verifyPackage} from '../scripts/check-package.mjs';

test('archive checks reject missing runtime entries and accidental private files', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'stylebook-package-'));
    const root = join(directory, 'package'), archive = join(directory, 'fixture.tgz');
    const pkg = JSON.parse(await readFile('package.json', 'utf8'));
    try {
        await mkdir(join(root, 'lib'), {recursive: true});
        await mkdir(join(root, 'locale'));
        const client = `window.__ModuleLoader__.load({id:${JSON.stringify(pkg.name)},factory(){}});`;
        const files = {'package.json': JSON.stringify(pkg), 'LICENSE': 'fixture', 'CHANGELOG.md': 'fixture', 'README.md': 'fixture', 'README.en.md': 'fixture', 'lib/index.js': 'export function apply() {}', 'lib/client.js': client, 'locale/zh.json': '{"meta":{"title":"Stylebook"}}', 'locale/en.json': '{"meta":{"title":"Stylebook"}}', 'cordis.patch.yml': await readFile('cordis.patch.yml', 'utf8')};
        for (const [name, text] of Object.entries(files)) await writeFile(join(root, name), text);
        const pack = () => execFileSync('tar', ['-czf', archive, '-C', directory, 'package']);
        pack();assert.equal(verifyPackage(archive, pkg).version, pkg.version);
        await unlink(join(root, 'lib/client.js'));
        pack();assert.throws(() => verifyPackage(archive, pkg), /Missing packed file: lib\/client.js/);
        await writeFile(join(root, 'lib/client.js'), client);
        await mkdir(join(root, '.local'));await writeFile(join(root, '.local/private.json'), '{}');
        pack();assert.throws(() => verifyPackage(archive, pkg), /Unexpected packed file/);
    } finally {
        // This directory is the unique mkdtemp result above; no workspace or user data is removed.
        assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
        assert(directory.startsWith(join(tmpdir(), 'stylebook-package-')));
        await rm(directory, {recursive: true, force: true});
    }
});
