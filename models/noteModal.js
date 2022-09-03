const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    session: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Session",
        },
      ],
    },

    description: {
      type: String,
      required: [true, "A note description is required"],
    },

    user: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
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

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
