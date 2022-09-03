const Note = require("../models/noteModal");
const Session = require("../models/sessionModal");
const expressAsyncHandler = require("express-async-handler");
const validMongoId = require("../utils/validMongoId");

exports.createNote = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  console.log(id, userId);

  validMongoId(id);

  try {
    const note = await Note.create({ ...req.body, session: id, user: userId });

    await Session.findByIdAndUpdate(
      id,
      { $push: { notes: note } },
      { new: true }
    );

    res.json(note);
    console.log(note);
  } catch (error) {
    res.json(error);
  }
});

exports.fetchSessionNotes = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const { notes } = await Session.findById(id).populate({
      path: "notes",
      model: "Note",
    });

    res.json(notes);
  } catch (error) {
    res.json(error);
  }
});

exports.deleteNote = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    const note = await Note.findByIdAndDelete(id);

    res.json(note);
  } catch (error) {
    res.json(error);
  }
});
