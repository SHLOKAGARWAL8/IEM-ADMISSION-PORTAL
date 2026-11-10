import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const server=fs.readFileSync(new URL('../src/server.js',import.meta.url),'utf8');
const db=fs.readFileSync(new URL('../src/db.js',import.meta.url),'utf8');
const ui=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
test('password recovery endpoints use one-time expiring hashed tokens',()=>{
  assert.match(server,/\/api\/auth\/forgot-password/);
  assert.match(server,/\/api\/auth\/reset-password/);
  assert.match(server,/createHash\('sha256'\)/);
  assert.match(server,/30\*60\*1000/);
  assert.match(server,/DELETE FROM sessions WHERE user_id=\?/);
  assert.match(db,/password_reset_tokens/);
});
test('student and admin login expose forgot-password and reset forms',()=>{
  assert.match(ui,/Forgot password\?/);
  assert.match(ui,/forgot-password-form/);
  assert.match(ui,/reset-password-form/);
  assert.match(ui,/#forgot-password/);
});
test('password reset email is configured only through server environment variables',()=>{
  assert.match(server,/RESEND_API_KEY/);
  assert.match(server,/PASSWORD_RESET_FROM/);
  assert.match(server,/APP_BASE_URL/);
});
