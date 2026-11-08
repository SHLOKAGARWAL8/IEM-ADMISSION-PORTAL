// src/routes/analytics.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simple admin analytics – counts of applications per status and per program
router.get('/', async (req, res) => {
  const statusCounts = await prisma.application.groupBy({
    by: ['status'],
    _count: { _all: true },
  });
  const programCounts = await prisma.application.groupBy({
    by: ['programId'],
    _count: { _all: true },
  });
  res.json({ statusCounts, programCounts });
});

module.exports = router;
