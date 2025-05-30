import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taskName: String,
  description: String,
  category: String,
  dueDate: Date,
  taskCompletedDate: Date,
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
