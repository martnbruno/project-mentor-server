const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

// api/projects

// Create projects
router.post(
  "/",
  auth,
  [check("name", "Project's name is required").not().isEmpty()],
  projectController.createProject
);

// Get every project from user
router.get("/", auth, projectController.getProjects);

// Update project via id
router.put(
  "/:id",
  auth,
  [check("name", "Project's name is required").not().isEmpty()],
  projectController.updateProject
);

// Delete project via id
router.delete("/:id", auth, projectController.deleteProject);
module.exports = router;
