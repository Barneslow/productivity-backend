const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First name is required"],
      type: String,
    },
    lastName: {
      required: [true, "Last name is required"],
      type: String,
    },
    userName: {
      type: String,
      required: [true, "A username is required"],
    },

    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },

    bio: {
      type: String,
      default: "Tell us about yourself",
    },

    password: {
      type: String,
      required: [true, "Hei buddy Password is required"],
    },

    country: {
      type: String,
      default:
        "https://res.cloudinary.com/barneslow/image/upload/v1660661933/BarneslowProductivity/flag.svg_n6ucee.png",
    },

    sessions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Session",
      },
    ],

    notes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Note",
        },
      ],
    },

    tasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    weeklyGoal: {
      type: Number,
      default: 7200,
    },

    weeklySessionTime: {
      type: Number,
      default: 0,
    },

    sessionGoal: {
      type: Number,
      default: 3600,
    },

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    active: {
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

userSchema.virtual("tasks", {
  ref: "Task",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createAccountVerificationToken = async function () {
  const verification = crypto.randomBytes(32).toString("hex");

  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verification)
    .digest("hex");

  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;

  return verification;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

userSchema.methods.forgetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
