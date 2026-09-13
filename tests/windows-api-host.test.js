import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { test } from 'node:test';

const retiredHost = ['maynardapp', 'azurewebsites.net'].join('.');
const textExtensions = new Set([
  '',
  '.cjs',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.svelte',
  '.toml',
  '.ts',
  '.yml',
  '.yaml',
]);
const ignoredDirectories = new Set(['.git', '.svelte-kit', 'build', 'node_modules']);

function collectTextFiles(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    const entryPath = join(path, entry.name);
    return entry.isDirectory()
      ? ignoredDirectories.has(entry.name)
        ? []
        : collectTextFiles(entryPath)
      : textExtensions.has(extname(entry.name))
        ? [entryPath]
        : [];
  });
}

test('repository does not reference the retired Windows API host', () => {
  const files = collectTextFiles('.');
  const offenders = files.filter(file => readFileSync(file, 'utf8').includes(retiredHost));

  assert.deepEqual(offenders, []);
});
