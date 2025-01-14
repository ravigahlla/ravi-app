import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkJwt } from './middleware/auth.mjs';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  preflightContinue: true,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// Handle preflight requests
app.options('*', cors());

// MongoDB connection with debug logging
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Connection string:', process.env.MONGODB_URI);
    console.log('Port:', mongoose.connection.port);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Create Task schema
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  column: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  userId: { type: String },
  isComplete: { type: Boolean, default: false },
  previousColumn: String,
  notes: { type: String, default: '' },
  subTasks: { type: [String], default: [] }
});

const Task = mongoose.model('Task', taskSchema);

// Create Project schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  notes: String,
  color: { type: String, default: '#6c757d' },
  taskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

// Debug route
app.get('/api/schema', (req, res) => {
  res.json(Task.schema.paths);
});

// Project routes
app.get('/api/projects/:userId', checkJwt, async (req, res) => {
  try {
    console.log('📝 GET /projects - userId:', req.params.userId);
    console.log('🔑 Request headers:', req.headers);
    console.log('🔍 Looking for projects with query:', { userId: req.params.userId });
    const projects = await Project.find({ userId: req.params.userId });
    console.log('🔍 MongoDB Query Result:', projects);
    console.log('📤 Sending projects:', projects);
    res.json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    const project = new Project({
      ...req.body,
      taskIds: []  // Initialize with empty array
    });
    const savedProject = await project.save();
    console.log('Created project:', savedProject);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get associated tasks count
    const associatedTasks = await Task.find({ projectId: req.params.id });
    
    if (req.query.deleteTasks === 'true') {
      // Delete associated tasks if requested
      await Task.deleteMany({ projectId: req.params.id });
    } else {
      // Just remove project association from tasks
      await Task.updateMany(
        { projectId: req.params.id },
        { $set: { projectId: null } }
      );
    }

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);
    res.json({ 
      message: 'Project deleted successfully',
      tasksCount: associatedTasks.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Debug route to get all tasks
app.get('/api/tasks/all', async (req, res) => {
  try {
    const tasks = await Task.find({});
    console.log('All tasks in database:', tasks);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get tasks by userId
app.get('/api/tasks/:userId', checkJwt, async (req, res) => {
  try {
    console.log('📝 GET /tasks - userId:', req.params.userId);
    console.log('🔑 Request headers:', req.headers);
    console.log('🔍 Looking for tasks with query:', { userId: req.params.userId });
    const tasks = await Task.find({ userId: req.params.userId });
    console.log('🔍 MongoDB Query Result:', tasks);
    console.log('📤 Sending tasks:', tasks);
    res.json(tasks);
  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Routes with debug logging
app.post('/api/tasks', async (req, res) => {
  try {
    console.log('Creating task with data:', req.body);
    const task = new Task(req.body);
    const savedTask = await task.save();
    console.log('Created task:', savedTask);
    
    // Convert _id to string for client
    const taskForClient = savedTask.toObject();
    taskForClient._id = taskForClient._id.toString();
    
    // If projectId is provided, update the project's taskIds
    if (req.body.projectId) {
      await Project.findByIdAndUpdate(
        req.body.projectId,
        { $addToSet: { taskIds: savedTask._id } }
      );
    }
    
    res.status(201).json(taskForClient);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    console.log('Attempting to delete task:', req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    const taskId = new mongoose.Types.ObjectId(req.params.id);
    const task = await Task.findById(taskId);
    console.log('Found task:', task);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If task was in a project, remove it from project's taskIds
    if (task.projectId) {
      await Project.findByIdAndUpdate(
        task.projectId,
        { $pull: { taskIds: taskId } }
      );
    }

    // Delete the task
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If projectId changed, update the relevant projects
    if (req.body.projectId !== undefined) {
      // Remove task from old project if it existed
      if (task.projectId) {
        await Project.findByIdAndUpdate(
          task.projectId,
          { $pull: { taskIds: task._id } }
        );
      }
      // Add task to new project if one is specified
      if (req.body.projectId) {
        await Project.findByIdAndUpdate(
          req.body.projectId,
          { $addToSet: { taskIds: task._id } }
        );
      }
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: error.message });
  }
});

// Debug route to get all projects
app.get('/api/projects/all', async (req, res) => {
  try {
    const projects = await Project.find({});
    console.log('All projects in database:', projects);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({ message: error.message });
  }
});

// Debug routes - remove in production
app.get('/api/debug/all', async (req, res) => {
  try {
    const tasks = await Task.find({});
    const projects = await Project.find({});
    console.log('🔍 All Tasks:', tasks);
    console.log('🔍 All Projects:', projects);
    res.json({ tasks, projects });
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
