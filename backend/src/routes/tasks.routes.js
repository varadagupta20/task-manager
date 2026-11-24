// src/routes/tasks.routes.js
const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/tasks.controller');
 
const router = express.Router();
 
// All task routes require authentication
router.use(authenticate);
 
router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
 
module.exports = router;
