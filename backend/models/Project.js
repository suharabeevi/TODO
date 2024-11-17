
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
     type: String,
     required: true },
     userId: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdDate: { 
    type: Date,
     default: Date.now },
  todos: [{
     type: mongoose.Schema.Types.ObjectId, 
    ref: 'Todo' }]
});

module.exports = mongoose.model('Project', projectSchema);
