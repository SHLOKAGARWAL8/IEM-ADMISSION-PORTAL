import { DatabaseSync } from 'node:sqlite'; import fs from 'node:fs'; import path from 'node:path'; import bcrypt from 'bcryptjs';
const dbPath=process.env.DATABASE_PATH||'./data/iem.sqlite'; fs.mkdirSync(path.dirname(path.resolve(dbPath)),{recursive:true});
export const db=new DatabaseSync(dbPath); db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
// Keep the familiar synchronous transaction helper while using Node's built-in SQLite.
db.transaction=(fn)=>()=>{db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(error){db.exec('ROLLBACK');throw error;}};
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL COLLATE NOCASE,phone TEXT,password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'applicant' CHECK(role IN ('applicant','officer','admin')),created_at TEXT DEFAULT CURRENT_TIMESTAMP,active INTEGER DEFAULT 1,email_verified INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS programs(id TEXT PRIMARY KEY,degree TEXT,name TEXT NOT NULL,department TEXT,duration TEXT,eligibility TEXT,fee_info TEXT,intake INTEGER,active INTEGER DEFAULT 1,email_verified INTEGER NOT NULL DEFAULT 0,entrance_exam TEXT);
CREATE TABLE IF NOT EXISTS faculty(id TEXT PRIMARY KEY,name TEXT,designation TEXT,department TEXT,qualifications TEXT,research_interests TEXT,photo TEXT,data_note TEXT);
CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,title TEXT,category TEXT,event_date TEXT,description TEXT,image TEXT,data_note TEXT);
CREATE TABLE IF NOT EXISTS fees(id TEXT PRIMARY KEY,program_id TEXT REFERENCES programs(id),component TEXT,amount REAL,billing_frequency TEXT,data_note TEXT);
CREATE TABLE IF NOT EXISTS applications(id INTEGER PRIMARY KEY,application_code TEXT UNIQUE NOT NULL,user_id INTEGER NOT NULL REFERENCES users(id),status TEXT NOT NULL DEFAULT 'Draft',step INTEGER DEFAULT 1,personal_json TEXT DEFAULT '{}',academic_json TEXT DEFAULT '{}',program_id TEXT REFERENCES programs(id),guardian_json TEXT DEFAULT '{}',declaration INTEGER DEFAULT 0,admin_note TEXT,submitted_at TEXT,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS documents(id INTEGER PRIMARY KEY,application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,doc_type TEXT NOT NULL,original_name TEXT NOT NULL,stored_name TEXT NOT NULL,mime_type TEXT,size INTEGER,verified TEXT DEFAULT 'Pending',admin_note TEXT,uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(application_id,doc_type));
CREATE TABLE IF NOT EXISTS status_history(id INTEGER PRIMARY KEY,application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,status TEXT NOT NULL,note TEXT,actor_id INTEGER REFERENCES users(id),created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,title TEXT,message TEXT,read_at TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS site_content(key TEXT PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit_logs(id INTEGER PRIMARY KEY,actor_id INTEGER,action TEXT,entity TEXT,entity_id TEXT,details TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
`);
// Safe additive migration for databases created by earlier portal versions.
const programColumns=db.prepare('PRAGMA table_info(programs)').all().map(c=>c.name);
if(!programColumns.includes('entrance_exam')) db.exec('ALTER TABLE programs ADD COLUMN entrance_exam TEXT');
const userColumns=db.prepare('PRAGMA table_info(users)').all().map(c=>c.name);
if(!userColumns.includes('email_verified')) db.exec('ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0');
db.exec(`CREATE TABLE IF NOT EXISTS email_verifications(
 user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 code_hash TEXT NOT NULL, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL
);`);

export const audit=(actor,action,entity,id,details='')=>db.prepare('INSERT INTO audit_logs(actor_id,action,entity,entity_id,details) VALUES(?,?,?,?,?)').run(actor,action,entity,String(id??''),details);
export const notify=(user,title,message)=>db.prepare('INSERT INTO notifications(user_id,title,message) VALUES(?,?,?)').run(user,title,message);
export function ensureDemoUsers(){if(process.env.NODE_ENV==='production')return;const add=db.prepare('INSERT OR IGNORE INTO users(name,email,phone,password_hash,role) VALUES(?,?,?,?,?)');add.run('Portal Administrator','admin@iem.demo','9000000001',bcrypt.hashSync('Admin@12345',10),'admin');add.run('Admissions Officer','officer@iem.demo','9000000002',bcrypt.hashSync('Officer@12345',10),'officer');add.run('Demo Applicant','student@iem.demo','9000000003',bcrypt.hashSync('Student@12345',10),'applicant');db.prepare("UPDATE users SET email_verified=1 WHERE email IN ('admin@iem.demo','officer@iem.demo','student@iem.demo')").run();}
