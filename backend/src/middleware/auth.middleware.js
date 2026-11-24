// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
 
const authenticate = (req, res, next) => {
  // Get the Authorization header: "Bearer eyJhbGci..."
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: 'No token provided' });
  }
 
  // Extract the token part (after "Bearer ")
  const token = authHeader.split(" ")[1];
 
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user info to the request
    next();              // Proceed to the route handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
 
module.exports = { authenticate };
