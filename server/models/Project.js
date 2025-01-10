const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
  taskIds: [{
    type: String,
    ref: 'Task'
  }],
  notes: String,
  color: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = { Project: mongoose.model('Project', projectSchema) }; 