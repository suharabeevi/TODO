
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Project', required: true },
  description: {
     type: String,
      required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed'],
     default: 'Pending' },
  createdDate: {
     type: Date,
      default: Date.now },
  updatedDate: {
     type: Date }
});

module.exports = mongoose.model('Todo', todoSchema);
