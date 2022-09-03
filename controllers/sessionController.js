const User = require("../models/userModal");
const Session = require("../models/sessionModal");
const expressAsyncHandler = require("express-async-handler");
const validMongoId = require("../utils/validMongoId");

exports.createSession = expressAsyncHandler(async (req, res) => {
  console.log(req.user);
  const { _id } = req.user;

  validMongoId(_id);

  try {
    const session = await Session.create({
      ...req.body,
      user: _id,
    });

    const sessionTime = session.time;

    await User.findByIdAndUpdate(
      _id,
      { $push: { sessions: session } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      _id,
      { $inc: { weeklySessionTime: sessionTime } },
      { new: true }
    );

    res.json(session);
  } catch (error) {
    res.json(error);
  }
});

exports.fetchUserSessions = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const { sessions } = await User.findById(_id).populate({
      path: "sessions",
      model: "Session",
    });

    res.json(sessions);
  } catch (error) {
    res.json(error);
  }
});

exports.fetchSession = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const session = await Session.findById(id);

    res.json(session);
  } catch (error) {
    res.json(error);
  }
});

exports.updateSession = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log(req.body);
  try {
    const session = await Session.findByIdAndUpdate(
      id,
      {
        rating: req?.body?.rating,
        time: req?.body?.completedAt,
      },
      {
        new: true,
      }
    );

    res.json(session);
  } catch (error) {
    res.json(error);
  }
});

exports.deleteSession = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const session = await Session.findByIdAndDelete(id);

    await User.findByIdAndUpdate(
      user._id,
      { $pull: { tasks: session?._id } },
      { new: true }
    );

    res.json(session);
  } catch (error) {
    res.json(error);
  }
});
