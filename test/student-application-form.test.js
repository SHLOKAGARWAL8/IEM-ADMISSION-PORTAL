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
test('student tracker calculates five milestones using real saved data and equal 20 percent weights', () => {
  assert.match(app, /function applicationProgress\(a,documents=\[\]\)/);
  for (const label of ['Personal information','Academic details','Programme selection','Documents','Final submission']) assert.ok(app.includes(label), label);
  assert.match(app, /docsPct=Math\.round\(uploaded\/requiredDocs\.length\*20\)/);
  assert.match(app, /total:stages\.reduce\(\(sum,x\)=>sum\+x\.points,0\)/);
  assert.match(app, /progress\.stages\.map/);
});
