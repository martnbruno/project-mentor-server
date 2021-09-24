const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

// api/tasks

// Create tasks
router.post(
  "/",
  auth,
  [check("name", "Task's name is required").not().isEmpty()],
  [check("project", "Project's name is required").not().isEmpty()],
  taskController.createTask
);

// Get every task of actual project
router.get("/", auth, taskController.getTasks);

// Update task via id
router.put(
  "/:id",
  auth,
  [check("name", "Task's name is required").not().isEmpty()],
  taskController.updateTask
);

// Delete task via id
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
