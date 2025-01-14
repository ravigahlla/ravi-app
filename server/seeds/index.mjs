import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task.mjs';
import Project from '../models/Project.mjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env file
dotenv.config({
  path: join(__dirname, '../../.env')
});

// Get user ID from environment variable
const AUTH0_USER_ID = process.env.SEED_AUTH0_USER_ID;
console.log('🔑 Checking Auth0 User ID configuration...');

if (!AUTH0_USER_ID) {
  console.error('❌ SEED_AUTH0_USER_ID environment variable is required');
  console.error('Please set SEED_AUTH0_USER_ID in your .env file');
  process.exit(1);
}

async function getSeedData() {
  const env = process.env.NODE_ENV || 'development';
  
  try {
    const { projectSeeds } = await import(`./data/${env}/projects.mjs`);
    const { taskSeeds } = await import(`./data/${env}/tasks.mjs`);
    
    // Add userId to all projects
    const projectsWithUserId = projectSeeds.map(project => ({
      ...project,
      userId: AUTH0_USER_ID
    }));
    
    // Add userId to all tasks
    const tasksWithUserId = taskSeeds.map(task => ({
      ...task,
      userId: AUTH0_USER_ID
    }));
    
    return { 
      projectSeeds: projectsWithUserId, 
      taskSeeds: tasksWithUserId 
    };
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

    const { projectSeeds, taskSeeds } = await getSeedData();

    // Create projects first
    console.log('Seeding projects...');
    console.log('Projects to seed:', projectSeeds);
    const projects = await Project.insertMany(projectSeeds);
    console.log('Seeded projects:', projects);
    
    // Create tasks with project references
    console.log('Seeding tasks...');
    const tasksWithProjects = taskSeeds.map((task, index) => ({
      ...task,
      projectId: index % 2 === 0 ? projects[0]._id : null,
      userId: AUTH0_USER_ID
    }));
    console.log('Tasks to seed:', tasksWithProjects);
    
    await Task.insertMany(tasksWithProjects);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase(); 