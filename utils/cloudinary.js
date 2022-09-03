const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUploadImage = async (uploadFile) => {
  try {
    const data = await cloudinary.uploader.upload(uploadFile, {
      resource_type: "auto",
    });

    return data;
  } catch (error) {
    return error;
  }
};

module.exports = {
  cloudinaryUploadImage,
};
