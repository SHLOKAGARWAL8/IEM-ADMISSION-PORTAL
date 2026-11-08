const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// Import the actual router from the project
const authRouter = require('../src/routes/auth');

// Setup a minimal app for testing
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

// Use a separate in‑memory SQLite for tests
process.env.DATABASE_URL = 'file:../test.db';
process.env.JWT_SECRET = 'test_secret';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$executeRaw`DROP TABLE IF EXISTS "User"`;
  await prisma.$executeRaw`DROP TABLE IF EXISTS "PasswordReset"`;
  await prisma.$executeRaw`DROP TABLE IF EXISTS "Program"`;
  // ... drop other tables if needed (prisma migrate will recreate)
  // Run migrations
  const { execSync } = require('child_process');
  execSync('npx prisma migrate dev --name init --skip-seed', { stdio: 'inherit' });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth routes', () => {
  test('Register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'Password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  test('Login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(payload).toHaveProperty('userId');
  });

  test('Login fails with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'WrongPass' });
    expect(res.statusCode).toBe(401);
  });
});
