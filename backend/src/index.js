// src/index.js

require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/tasks.routes');

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// --------------------
// Health Check Route
// --------------------
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running!',
  });
});

// --------------------
// API Routes
// --------------------

// Authentication
app.use('/api/auth', authRoutes);

// Tasks
app.use('/api/tasks', taskRoutes);

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});