const express = require("express");
const taskController = require("../controllers/tasksController");
const authMiddleware = require("../middlewares/authMiddleware");

const taskRoutes = express.Router();

taskRoutes
  .route("/")
  .get(authMiddleware, taskController.fetchUserTasks)
  .post(authMiddleware, taskController.createTask)
  .put(authMiddleware, taskController.updateTask);

taskRoutes
  .route("/:id")
  .get(authMiddleware, taskController.fetchTask)
  .delete(authMiddleware, taskController.deleteTask);

module.exports = taskRoutes;
