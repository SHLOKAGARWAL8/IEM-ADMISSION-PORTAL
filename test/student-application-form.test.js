import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
test('student application exposes academic details and active programme selection on one page', () => {
  for (const field of ['Class 10 board','Class 10 passing year','Class 10 percentage','Class 12 board','Class 12 passing year','Class 12 percentage']) assert.ok(app.includes(field), field);
  assert.match(app, /name="programId" required/);
  assert.match(app, /Select the programme you want to enrol in/);
  assert.match(app, /filter\(p=>Number\(p\.active\)!==0\)/);
  assert.match(app, /step:4/);
});
