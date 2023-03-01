const User = require("../models/userModal");
const sgMail = require("@sendgrid/mail");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/token");
const crypto = require("crypto");

const validMongoId = require("../utils/validMongoId");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.registerUser = expressAsyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req?.body?.email });

  if (userExists) throw new Error("User already exists");

  try {
    await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
      userName: req?.body?.userName,
      country: req?.body?.country,
    });

    const user = await User.findOne({ email: req?.body?.email });

    res.json({
      token: generateToken(user?.id),
      id: user?.id,
    });
  } catch (error) {
    res.json(error);
  }
});

exports.loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  console.log(req);

  if (user && (await user.isPasswordMatched(password))) {
    res.json({
      _id: user._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      isAdmin: user?.isAdmin,
      token: generateToken(user?.id),
      id: user?.id,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Login Credentials");
  }
});

exports.forgetPasswordToken = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error("User Not Found");

  try {
    const token = await user.createPasswordResetToken();

    await user.save();

    const resetURL = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this message <a href="https://barneslow-productivity.netlify.app/reset-password/${token}">Click to Reset</a>`;
    const message = {
      to: email,
      from: "darrachb1991@gmail.com",
      subject: "Reset Password",
      html: resetURL,
    };

    try {
      await sgMail.send(message);
    } catch (err) {
      console.log(err);
    }

    res.json(message);
  } catch (error) {
    res.json(error);
  }
});

exports.updatePassword = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validMongoId(_id);

  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  }

  res.json(user);
});

exports.passwordReset = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  console.log(user);

  if (!user) throw new Error("Token Expired, try again later");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

exports.generateVerificationToken = expressAsyncHandler(async (req, res) => {
  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);

  try {
    const verificationToken = await user.createAccountVerificationToken();
    await user.save();

    const resetURL = `If you requested to verify your account, verify now within 10 minutes, otherwise ignore this message. <a href="https://barneslow-productivity.netlify.app/account-verification/${verificationToken}">Click to verify your account</a>`;
    const message = {
      to: user?.email,
      from: "darrachb1991@gmail.com",
      subject: "Verifiy Account",
      html: resetURL,
    };

    await sgMail.send(message);
    res.json(resetURL);
  } catch (error) {
    res.json(error);
  }
});

exports.accountVerifcation = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });

  if (!user) throw new Error("Token expired, try again later");

  user.isAccountVerified = true;
  user.accountVerificationToken = undefined;

  user.accountVerificationTokenExpires = undefined;
  await user.save();
  res.json(user);
});

exports.fetchAllUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

exports.fetchUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  validMongoId(id);

  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

exports.fetchViewUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  validMongoId(id);

  try {
    const user = await User.findById(id).populate("sessions").populate({
      path: "tasks",
      model: "Task",
    });

    const timeArr = [];
    const starArr = [];

    let totalSessionTime;
    let totalStars;
    let filteredTasks = [];

    if (user?.sessions.length !== 0) {
      user?.sessions.map((session) => {
        timeArr.push(session.time);
      });

      user?.sessions.map((session) => {
        starArr.push(session.rating);
      });

      totalSessionTime = timeArr.reduce((acc, cur) => acc + cur);
      totalStars = starArr.reduce((acc, cur) => acc + cur);
    } else {
      totalSessionTime = 0;
    }

    if (user?.tasks.length !== 0)
      filteredTasks = user?.tasks.filter((task) => task.status === "completed");

    const userData = {
      bio: user?.bio,
      firstName: user?.firstName,
      lastName: user?.lastName,
      userName: user?.userName,
      profilePhoto: user?.profilePhoto,
      country: user?.country,
      sessions: user?.sessions.length,
      totalSessionTime,
      totalStars,
      tasks: filteredTasks.length,
    };

    res.json(userData);
  } catch (error) {
    res.json(error);
  }
});

exports.updateUser = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { ...req.body },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.json(error);
  }
});

exports.profilePhotoUploader = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  const localPath = `public/images/profile/${req.file.filename}`;

  const imgUploaded = await cloudinaryUploadImage(localPath);

  const user = await User.findByIdAndUpdate(
    _id,
    {
      profilePhoto: imgUploaded?.url,
    },
    { new: true }
  );

  res.json(user);
});
