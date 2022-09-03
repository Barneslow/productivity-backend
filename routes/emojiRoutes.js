const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const emojiController = require("../controllers/emojiController");

const emojiRoutes = express.Router();

emojiRoutes.route("/").get(emojiController.fetchEmojis);

module.exports = emojiRoutes;
