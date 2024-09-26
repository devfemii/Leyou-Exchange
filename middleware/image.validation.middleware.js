const multer = require("multer");

const validateImage = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Please upload an image file with either jpg, jpeg, png or gif extension"));
    }
    cb(null, true);
  },
});

module.exports = validateImage;
