// src/routes/me.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  // authMiddleware already attached user to req
  const { id, name, email, role } = req.user;
  res.json({ id, name, email, role });
});

module.exports = router;
