const multer = require("multer");
const { fileFilter, storage } = require("../config/multer");

const validateImage = multer({
  fileFilter,
  storage,
});

module.exports = validateImage;
