import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('Graphify workflow skips stale publish races instead of failing the branch', async () => {
  const workflow = await readFile(path.join(root, '.github', 'workflows', 'graphify.yml'), 'utf8');

  assert.match(workflow, /graphify cluster-only \./);
  assert.match(workflow, /git ls-remote origin/);
  assert.match(workflow, /remote_head/);
  assert.match(workflow, /\$GITHUB_SHA/);
  assert.match(workflow, /a newer Graphify run will publish the graph/);
  assert.match(workflow, /if ! git push origin/);
});
