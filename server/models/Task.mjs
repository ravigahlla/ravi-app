import mongoose from 'mongoose';

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
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }
});

const Task = mongoose.model('Task', taskSchema);
export default Task; 