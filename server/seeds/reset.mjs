import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task.mjs';
import Project from '../models/Project.mjs';

dotenv.config();

async function resetDatabase() {
  try {
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
