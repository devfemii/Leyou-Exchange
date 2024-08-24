const multer = require("multer");

// validate uploaded images
const validateImage = multer({
  fileFilter(req, file, cb) {
    // Check the file extension
    // if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    //   return cb(
    //     new Error(
    //       "Please upload an image file with either jpg, jpeg, png or gif extension"
    //     )
    //   );
    // }

    // accept the given upload
    cb(null, true);
  },
});

module.exports = validateImage;
