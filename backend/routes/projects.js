const express = require('express');
const Project = require('../models/Project');
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new project
router.post('/', async (req, res) => {  // Corrected path
  try {
    const project = new Project({ title: req.body.title, userId: req.user });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ msg: 'Error creating project', error });
  }
});

// List all projects for a user
router.get('/', async (req, res) => {
  try {
    console.log('Authenticated user ID:', req.user); // Log user ID for debugging

    // Fetch projects where the userId matches the logged-in user's ID
    const projects = await Project.find({ userId: req.user });

    console.log('Projects found:', projects); // Log projects returned from database

    // Check if any projects were found
    if (projects.length === 0) {
      return res.status(404).json({ msg: 'No projects found for this user' });
    }

    res.status(200).json(projects); // Return the projects
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching projects', error });
  }
});


// View a single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('todos');
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching project', error });
  }
});

// Edit a project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ msg: 'Error updating project', error });
  }
});

// Delete a project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(200).json({ msg: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting project', error });
  }
});

// Export project as gist
router.post('/:id/export', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('todos');
  
    // Create Markdown format
    const pendingTasks = project.todos.filter(todo => todo.status === 'pending')
      .map(todo => `- [ ] ${todo.description}`);
    const completedTasks = project.todos.filter(todo => todo.status === 'completed')
      .map(todo => `- [x] ${todo.description}`);
  
    const gistContent = `# ${project.title}\n\n` +
      `## Summary: ${completedTasks.length} / ${project.todos.length} completed\n\n` +
      `### Pending Tasks\n${pendingTasks.join('\n')}\n\n` +
      `### Completed Tasks\n${completedTasks.join('\n')}`;

    // Export logic here (GitHub API request using a token in `.env`)
    res.json({ msg: 'Gist exported successfully!' });
  } catch (error) {
    res.status(500).json({ msg: 'Error exporting gist', error });
  }
});

module.exports = router;
