import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task.mjs';
import Project from '../models/Project.mjs';

dotenv.config();

async function resetDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Current collections:', await mongoose.connection.db.collections());
    console.log('Dropping all collections...');

    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      console.log('Dropping collection:', collection.collectionName);
      await collection.drop();
    }

    console.log('Database reset complete!');
  } catch (error) {
    console.error('Failed to reset database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

resetDatabase();
