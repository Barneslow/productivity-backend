const mongoose = require("mongoose");

const emojiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A emoji name is required"],
    },

    price: {
      type: Number,
      required: [true, "A emoji price is required"],
    },

    source: {
      type: String,
      required: [true, "A emoji source is required"],
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

const Emoji = mongoose.model("Emoji", emojiSchema);

module.exports = Emoji;
