const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {
  //Express validator result evaluation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    //Create new project
    const project = new Project(req.body);
    // Save author which is the req.user from auth.js after token validation and with the id of the JWT payload at userController.
    project.author = req.user.id;
    // Save project
    project.save();
    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};

// Get every project from actual user and sort them by their dates of creation
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ author: req.user.id }).sort({
      date: -1,
    });
    res.json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  //Express validator result evaluation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructuring of project's info
  const { name } = req.body;

  // Updated project's name is the one that user provides.
  const updatedProject = {};
  if (name) {
    updatedProject.name = name;
  }

  try {
    // Check project's id when put request
    let project = await Project.findById(req.params.id);
    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    // Check if the author of the modification is the same than the authenticated one
    if (project.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    // Udpate project
    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updatedProject },
      { new: true }
    );
    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};

// Delete project via id
exports.deleteProject = async (req, res) => {
  try {
    // Check project's id when delete request
    let project = await Project.findById(req.params.id);
    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    // Check if the author of the modification is the same than the authenticated one
    if (project.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    // Delete project
    await Project.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Project deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};
