// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../lib/prisma');
 
// ── Validation schemas ──────────────────────
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
 
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
 
// ── Register ────────────────────────────────
const register = async (req, res) => {
  try {
    // 1. Validate input
    const data = registerSchema.parse(req.body);
 
    // 2. Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }
 
    // 3. Hash the password (10 = salt rounds, higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(data.password, 10);
 
    // 4. Create user in database
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      }
    });
 
    // 5. Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }   // token expires in 7 days
    );
 
    // 6. Return token and user info (never return the password!)
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
 
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 
// ── Login ───────────────────────────────────
const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
 
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });
 
    // Always give the same error for wrong email OR wrong password
    // (do not tell attackers which one was wrong)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
 
    // Compare password with stored hash
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
 
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
 
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
 
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
 
module.exports = { register, login };
