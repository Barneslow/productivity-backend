const User = require("../models/userModal");
const Task = require("../models/taskModal");
const expressAsyncHandler = require("express-async-handler");
const validMongoId = require("../utils/validMongoId");

exports.createTask = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  validMongoId(_id);

  try {
    const task = await Task.create({ ...req.body, user: _id });

    await User.findByIdAndUpdate(
      _id,
      { $push: { tasks: task } },
      { new: true }
    );

    res.json(task);
  } catch (error) {
    res.json(error);
  }
});

exports.updateTask = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;

  validMongoId(id);

  console.log(req.body);

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      {
        status: req?.body?.status,
        completedAt: req?.body?.completedAt,
        isArchive: req?.body?.isArchive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(task);
  } catch (error) {
    res.json(error);
  }
});

exports.fetchUserTasks = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const { tasks } = await User.findById(_id).populate({
      path: "tasks",
      model: "Task",
    });

    res.json(tasks);
  } catch (error) {
    res.json(error);
  }
});

exports.fetchTask = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    res.json(task);
  } catch (error) {
    res.json(error);
  }
});

exports.deleteTask = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const task = await Task.findById(id);

    await User.findByIdAndUpdate(
      user._id,
      { $pull: { tasks: task?._id } },
      { new: true }
    );

    res.json(task);
  } catch (error) {
    res.json(error);
  }
});

exports.fetchAllTasks = expressAsyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("user");

    res.json(tasks);
  } catch (error) {
    res.json(error);
  }
});
