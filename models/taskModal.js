const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: [true, "A task description is required"],
    },

    description: {
      type: String,
      required: [true, "A task description is required"],
    },

    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
      required: [true, "A status is required"],
    },

    dueDate: {
      type: Date,
      default: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      required: [true, "A date is required"],
    },

    completedAt: {
      type: Date,
      default: undefined,
    },

    isArchive: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
