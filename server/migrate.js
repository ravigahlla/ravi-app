const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for migration'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const Task = mongoose.model('Task', new mongoose.Schema({
  name: String,
  column: String,
  projectId: mongoose.Schema.Types.ObjectId,
  userId: String,
  isComplete: Boolean,
  previousColumn: String,
  notes: String,
  subTasks: [String]
}));

const Project = mongoose.model('Project', new mongoose.Schema({
  name: String,
  userId: String,
  notes: String,
  color: String,
  taskIds: [mongoose.Schema.Types.ObjectId],
  createdAt: Date
}));

async function migrate() {
  try {
    console.log('Starting migration...');

    // Get all tasks and projects
    const tasks = await Task.find({});
    const projects = await Project.find({});

    console.log(`Found ${tasks.length} tasks and ${projects.length} projects`);

    // Update tasks: Convert string projectIds to ObjectIds
    for (const task of tasks) {
      if (task.projectId && typeof task.projectId === 'string') {
        try {
          task.projectId = new mongoose.Types.ObjectId(task.projectId);
          await task.save();
          console.log(`Updated task ${task._id}`);
        } catch (err) {
          console.log(`Could not convert projectId for task ${task._id}, setting to null`);
          task.projectId = null;
          await task.save();
        }
      }
    }

    // Update projects: Convert string taskIds to ObjectIds
    for (const project of projects) {
      if (project.taskIds && Array.isArray(project.taskIds)) {
        const newTaskIds = project.taskIds
          .filter(id => typeof id === 'string')
          .map(id => {
            try {
              return new mongoose.Types.ObjectId(id);
            } catch (err) {
              console.log(`Could not convert taskId ${id} for project ${project._id}`);
              return null;
            }
          })
          .filter(id => id !== null);

        project.taskIds = newTaskIds;
        await project.save();
        console.log(`Updated project ${project._id}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrate(); 