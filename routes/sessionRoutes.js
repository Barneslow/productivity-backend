const express = require("express");
const sessionController = require("../controllers/sessionController");
const authMiddleware = require("../middlewares/authMiddleware");

const sessionRoutes = express.Router();

sessionRoutes
  .route("/")
  .get(authMiddleware, sessionController.fetchUserSessions)
  .post(authMiddleware, sessionController.createSession);

sessionRoutes
  .route("/:id")
  .get(authMiddleware, sessionController.fetchSession)
  .post(authMiddleware, sessionController.updateSession)
  .delete(authMiddleware, sessionController.deleteSession);

module.exports = sessionRoutes;
