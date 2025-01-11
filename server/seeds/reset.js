import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Task, Project } from '../models/index.js';

dotenv.config({
  path: process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development'
});

async function resetDatabase() {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.error('Database reset is not allowed in production!');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Clearing all collections...');
    await Task.deleteMany({});
    await Project.deleteMany({});

    console.log('Database reset completed successfully!');
  } catch (error) {
    console.error('Database reset failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

resetDatabase(); 