const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword, role: 'user' }
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, isPremium: user.isPremium },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: 'User created',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPremium: user.isPremium,
        premiumSince: user.premiumSince
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, isPremium: user.isPremium },
      process.env.JWT_SECRET
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPremium: user.isPremium,
        premiumSince: user.premiumSince
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        isPremium: user.isPremium,
        premiumSince: user.premiumSince
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// Upgrade to premium (requires $50,000 payment)
exports.upgradePremium = async (req, res) => {
  try {
    const { paymentAmount } = req.body;
    const userId = req.userId;

    // Verify payment amount
    if (!paymentAmount || paymentAmount < 50000) {
      return res.status(400).json({ 
        message: 'Premium upgrade requires payment of $50,000',
        required: 50000,
        provided: paymentAmount || 0
      });
    }

    // Check if user already has premium
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.isPremium) {
      return res.status(400).json({ message: 'User already has premium membership' });
    }

    // Upgrade user to premium and grant admin privileges
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumSince: new Date(),
        role: 'admin'
      }
    });

    const newToken = jwt.sign(
      { id: updatedUser.id, role: updatedUser.role, isPremium: updatedUser.isPremium },
      process.env.JWT_SECRET
    );

    res.json({ 
      message: 'Successfully upgraded to premium membership!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isPremium: updatedUser.isPremium,
        premiumSince: updatedUser.premiumSince
      },
      token: newToken
    });
  } catch (error) {
    console.error('Premium upgrade error:', error);
    res.status(500).json({ message: 'Error upgrading to premium', error: error.message });
  }
};
