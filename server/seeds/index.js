import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Task, Project } from '../models/index.js';

dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
});

async function getSeedData() {
  const env = process.env.NODE_ENV || 'development';
  
  try {
    // Dynamically import the appropriate seed data
    const { projectSeeds } = await import(`./data/${env}/projects.js`);
    const { taskSeeds } = await import(`./data/${env}/tasks.js`);
    return { projectSeeds, taskSeeds };
  } catch (error) {
    console.error(`No seed data found for environment: ${env}`);
    process.exit(1);
  }
}

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('Seeding is not allowed in production!');
      process.exit(1);
    }

    if (process.env.SEED_DATA !== 'true') {
      console.log('Seeding is disabled. Set SEED_DATA=true to enable.');
      process.exit(0);
    }

    const { projectSeeds, taskSeeds } = await getSeedData();

    // Create projects first
    console.log('Seeding projects...');
    const projects = await Project.insertMany(projectSeeds);
    
    // Create tasks with project references
    console.log('Seeding tasks...');
    const tasksWithProjects = taskSeeds.map((task, index) => ({
      ...task,
      projectId: index % projects.length === 0 
        ? projects[0]._id 
        : projects[index % projects.length]._id,
      userId: 'demo-user'
    }));
    
    await Task.insertMany(tasksWithProjects);

    // Update projects with task references
    const tasks = await Task.find();
    for (const project of projects) {
      project.taskIds = tasks
        .filter(task => task.projectId?.equals(project._id))
        .map(task => task._id);
      await project.save();
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase(); 