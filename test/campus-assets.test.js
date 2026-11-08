import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public/assets');
const app = fs.readFileSync(path.resolve('public/app.js'), 'utf8');

test('five real campus photographs are bundled locally and referenced by the slideshow', () => {
  const names = ['campus-1.webp','campus-2.webp','campus-3.webp','campus-4.webp','campus-5.webp'];
  for (const name of names) {
    const file = path.join(root, name);
    assert.ok(fs.existsSync(file), `${name} must exist`);
    const bytes = fs.readFileSync(file);
    assert.ok(bytes.length > 10000, `${name} must contain a real image payload`);
    assert.equal(bytes.subarray(0,4).toString('ascii'), 'RIFF', `${name} must be a WebP image`);
    assert.ok(app.includes(`/assets/${name}`), `${name} must be used by the homepage`);
  }
});

test('institutional logos are served from local bundled assets', () => {
  for (const name of ['iem-official.png','uem-official.png']) {
    const file = path.join(root,name);
    assert.ok(fs.existsSync(file), `${name} must exist`);
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.subarray(0,8).toString('hex'), '89504e470d0a1a0a', `${name} must be a valid PNG image`);
    assert.ok(bytes.length > 20000, `${name} must contain the supplied high-resolution logo artwork`);
    assert.ok(app.includes(`/assets/${name}`), `${name} must be referenced locally`);
  }
  assert.ok(!app.includes('dean.iem.edu.in/panel/assets/'), 'no remote logo URL should remain');
});
