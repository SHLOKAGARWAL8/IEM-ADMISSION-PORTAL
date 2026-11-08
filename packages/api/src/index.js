const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Simple file upload config (store in ./uploads)
const upload = multer({ dest: 'uploads/' });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Register routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Me route (get logged‑in user)
const meRouter = require('./routes/me');
app.use('/api/me', authMiddleware, meRouter);

// Password‑reset routes
const passwordRouter = require('./routes/password');
app.use('/api/password', passwordRouter);

// Admission routes (student side)
const appRouter = require('./routes/application');
app.use('/api/applications', authMiddleware, requireRole('STUDENT'), appRouter);

// Admin CRUD routes (protected by ADMIN role)
const programRouter = require('./routes/program');
app.use('/api/programs', authMiddleware, requireRole('ADMIN'), programRouter);

const facultyRouter = require('./routes/faculty');
app.use('/api/faculty', authMiddleware, requireRole('ADMIN'), facultyRouter);

const eventRouter = require('./routes/event');
app.use('/api/events', authMiddleware, requireRole('ADMIN'), eventRouter);

const feeRouter = require('./routes/fee');
app.use('/api/fees', authMiddleware, requireRole('ADMIN'), feeRouter);

// Analytics route (admin)
const analyticsRouter = require('./routes/analytics');
app.use('/api/analytics', authMiddleware, requireRole('ADMIN'), analyticsRouter);

// TODO: Add admission and admin routes later

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
