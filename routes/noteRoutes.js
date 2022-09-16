const express = require("express");
const noteController = require("../controllers/notesController");
const authMiddleware = require("../middlewares/authMiddleware");

const noteRoutes = express.Router();

noteRoutes
  .route("/:id")
  .get(authMiddleware, noteController.fetchSessionNotes)
  .post(authMiddleware, noteController.createNote)
  .put(authMiddleware, noteController.editNote)
  .delete(authMiddleware, noteController.deleteNote);

module.exports = noteRoutes;
