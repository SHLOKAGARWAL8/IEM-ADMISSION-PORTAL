// src/routes/password.js
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Configure nodemailer (SMTP details must be set in .env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Request password reset – generate token and email it
router.post('/request', async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(200).json({ message: 'If the email exists, a reset link will be sent.' });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordReset.upsert({
    where: { userId: user.id },
    update: { token, expiresAt },
    create: { userId: user.id, token, expiresAt },
  });

  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@iem.edu',
    to: email,
    subject: 'IEM Portal Password Reset',
    text: `Click the link to reset your password (valid for 1 hour): ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reset link sent if email exists.' });
  } catch (err) {
    console.error('Email send error', err);
    // In demo we still respond success to avoid enumeration
    res.json({ message: 'Reset link sent if email exists.' });
  }
});

// Reset password – verify token, set new password
router.post('/reset', async (req, res) => {
  const { token, newPassword } = req.body;
  const record = await prisma.passwordReset.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: record.userId }, data: { password: hashed } });
  // Invalidate token
  await prisma.passwordReset.delete({ where: { id: record.id } });
  res.json({ message: 'Password updated' });
});

module.exports = router;
