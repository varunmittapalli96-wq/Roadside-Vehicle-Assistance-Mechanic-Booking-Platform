const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, businessName, licenseNumber } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const userRole = ['user', 'mechanic'].includes(role) ? role : 'user';
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: userRole,
      isVerified: userRole === 'user',
      profile: userRole === 'mechanic' ? { businessName, licenseNumber } : undefined,
    });
    const token = signToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', require('../middleware/auth').protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
