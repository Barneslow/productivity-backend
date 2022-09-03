const Emoji = require("../models/emojiModal");

const expressAsyncHandler = require("express-async-handler");

exports.fetchEmojis = expressAsyncHandler(async (req, res) => {
  try {
    const emojis = await Emoji.find({});

    res.json(emojis);
  } catch (error) {
    res.json(error);
  }
});
