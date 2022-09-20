const User = require("../models/userModal");
const Session = require("../models/sessionModal");
const expressAsyncHandler = require("express-async-handler");
const validMongoId = require("../utils/validMongoId");

exports.createSession = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  validMongoId(_id);

  try {
    const user = await User.findById(_id).populate("sessions");

    const todaysSessions = user?.sessions.filter((session) => {
      const today = new Date().toDateString();

      const sessionDay = new Date(session.createdAt).toDateString();

      return today === sessionDay;
    });

    if (todaysSessions.length > 0) {
      const session = await Session.findByIdAndUpdate(
        todaysSessions[0]._id,
        {
          time: (todaysSessions[0].time += req?.body?.time),
          breakTime: (todaysSessions[0].breakTime += req?.body?.breakTime),
        },
        {
          new: true,
        }
      );
    } else {
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
    }

    res.json(user.sessions);
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

  try {
    const session = await Session.findByIdAndUpdate(
      id,
      {
        rating: req?.body?.rating,
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
