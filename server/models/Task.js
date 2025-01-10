const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  column: {
    type: String,
    enum: ['Todo', 'Now', 'Next', 'Later', 'Done'],
    default: 'Todo'
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  previousColumn: String,
  notes: String,
  subTasks: [String],
  projectIds: [{
    type: String,
    ref: 'Project'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = { Task: mongoose.model('Task', taskSchema) }; 