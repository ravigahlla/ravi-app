import mongoose from 'mongoose';

export const mockTasks = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Test Task 1',
    column: 'Todo',
    isComplete: false,
    previousColumn: 'Todo',
    notes: '',
    subTasks: [],
    projectId: null,
    userId: 'test-user-id'
  },
  // ... other mock tasks
]; 

export const mockProjects = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Test Project 1',
    notes: '',
    color: '#6c757d',
    taskIds: [],
    userId: 'test-user-id'
  }
]; 