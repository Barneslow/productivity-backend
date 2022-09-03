const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  profilePhotoUploadMulter,
  profilePhotoResize,
} = require("../middlewares/profilePhotoUpload");

const userRoutes = express.Router();

userRoutes.route("/register").post(userController.registerUser);
userRoutes.route("/login").post(userController.loginUser);
userRoutes
  .route("/forget-password-token")
  .post(userController.forgetPasswordToken);

userRoutes.route("/reset-password").post(userController.passwordReset);
userRoutes.route("/view-user/:id").get(userController.fetchViewUser);

userRoutes
  .route("/update-password")
  .post(authMiddleware, userController.updatePassword);

userRoutes
  .route("/upload-profile-photo")
  .post(
    authMiddleware,
    profilePhotoUploadMulter.single("image"),
    profilePhotoResize,
    userController.profilePhotoUploader
  );

userRoutes.route("/").get(userController.fetchAllUsers);

userRoutes
  .route("/:id")
  .get(userController.fetchUser)
  .post(authMiddleware, userController.updateUser);

module.exports = userRoutes;
