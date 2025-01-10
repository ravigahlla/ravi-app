import mongoose from 'mongoose';

describe('Task API Integration', () => {
  it('creates a task successfully', async () => {
    const taskData = {
      name: 'Test Task',
      column: 'Todo',
      userId: expect.any(String),
      isComplete: false,
      previousColumn: 'Todo',
      notes: '',
      subTasks: [],
      projectId: null
    };

    const response = await api.createTask(taskData);
    
    expect(response).toEqual({
      _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      ...taskData,
    });
  });

  // ... other tests
}); 