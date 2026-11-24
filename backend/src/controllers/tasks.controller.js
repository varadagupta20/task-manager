// src/controllers/tasks.controller.js
const { z } = require('zod');
const prisma = require('../lib/prisma');
 
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO","IN_PROGRESS","DONE"]).optional(),
  priority: z.enum(["LOW","MEDIUM","HIGH"]).optional(),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
});
 
// ── Get all tasks for the logged-in user ──
const getTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
 
    // Build a dynamic filter object
    const where = { userId: req.user.userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
 
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },  // newest first
    });
 
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
 
// ── Get single task ──
const getTask = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.userId,  // ensure user owns this task
      }
    });
 
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
 
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};
 
// ── Create task ──
const createTask = async (req, res) => {
  try {
    const data = createTaskSchema.parse(req.body);
 
    const task = await prisma.task.create({
      data: {
        ...data,
        userId: req.user.userId,  // associate task with logged-in user
      }
    });
 
    res.status(201).json(task);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Failed to create task' });
  }
};
 
// ── Update task ──
const updateTask = async (req, res) => {
  try {
    // First verify the task belongs to the user
    const existing = await prisma.task.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.userId }
    });
 
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }
 
    const data = createTaskSchema.partial().parse(req.body);
 
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
 
    res.json(task);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
};
 
// ── Delete task ──
const deleteTask = async (req, res) => {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.userId }
    });
 
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }
 
    await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
 
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
 
module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
