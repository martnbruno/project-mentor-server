const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
  // Express validator result evaluation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Extract project and validate it exists
    const { project } = req.body;
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Check if authenticated user owns actual project
    if (projectExists.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Create task
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).send("There was an error");
  }
};

// Get every task from actual project
exports.getTasks = async (req, res) => {
  try {
    // Extract project and validate it exists. Is req.query because frontend is passing project as params.
    const { project } = req.query;
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Check if authenticated user owns actual project
    if (projectExists.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    // Get tasks for selected project
    const tasks = await Task.find({ project });
    res.json({ tasks });
  } catch (error) {
    res.status(500).send("There was an error");
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    // Extract project, task name and task status from request.
    const { project, name, status } = req.body;
    //Check that task exists. If task exists, project exists.
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check if authenticated user owns actual project
    const projectExists = await Project.findById(project);
    if (projectExists.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Create an object with new data after user updates it
    const newTask = {};
    newTask.name = name;
    newTask.status = status;

    // Udpate task
    task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true,
    });
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};

// Delete task via id
exports.deleteTask = async (req, res) => {
  try {
    // Extract project from request. Is req.query because frontend is passing project as params.
    const { project } = req.query;

    //Check that task exists. If task exists, project exists.
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check if authenticated user owns actual project
    const projectExists = await Project.findById(project);
    if (projectExists.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete project
    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Task deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};
