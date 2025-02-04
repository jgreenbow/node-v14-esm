'use strict';

const common = require('../common');

if (!common.hasCrypto)
  common.skip('missing crypto');

common.requireNoPackageJSONAbove();

const assert = require('assert');
const { spawnSync } = require('child_process');
const fixtures = require('../common/fixtures.js');

{
  const policyFilepath = fixtures.path('policy-manifest', 'onerror-exit.json');
  const result = spawnSync(process.execPath, [
    '--experimental-policy',
    policyFilepath,
    '-e',
    'require("os").cpus()',
  ]);

  assert.notStrictEqual(result.status, 0);
  const stderr = result.stderr.toString();
  assert.match(stderr, /ERR_MANIFEST_DEPENDENCY_MISSING/);
  assert.match(stderr, /does not list os as a dependency specifier for conditions: require, node, node-addons/);
}

{
  const policyFilepath = fixtures.path('policy-manifest', 'onerror-exit.json');
  const mainModuleBypass = fixtures.path(
    'policy-manifest',
    'main-module-bypass.js',
  );
  const result = spawnSync(process.execPath, [
    '--experimental-policy',
    policyFilepath,
    mainModuleBypass,
  ]);

  assert.notStrictEqual(result.status, 0);
  const stderr = result.stderr.toString();
  assert.match(stderr, /ERR_MANIFEST_DEPENDENCY_MISSING/);
  assert.match(stderr, /does not list os as a dependency specifier for conditions: require, node, node-addons/);
}

{
  const policyFilepath = fixtures.path(
    'policy-manifest',
    'onerror-resource-exit.json',
  );
  const objectDefinePropertyBypass = fixtures.path(
    'policy-manifest',
    'object-define-property-bypass.js',
  );
  const result = spawnSync(process.execPath, [
    '--experimental-policy',
    policyFilepath,
    objectDefinePropertyBypass,
  ]);

  assert.strictEqual(result.status, 0);
}

{
  const policyFilepath = fixtures.path('policy-manifest', 'onerror-exit.json');
  const mainModuleBypass = fixtures.path('policy-manifest', 'main-module-proto-bypass.js');
  const result = spawnSync(process.execPath, [
    '--experimental-policy',
    policyFilepath,
    mainModuleBypass,
  ]);

  assert.notStrictEqual(result.status, 0);
  const stderr = result.stderr.toString();
  assert.match(stderr, /ERR_MANIFEST_DEPENDENCY_MISSING/);
  assert.match(stderr, /does not list os as a dependency specifier for conditions: require, node, node-addons/);
}
