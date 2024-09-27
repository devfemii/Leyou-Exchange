const multer = require("multer");
const { storage, fileFilter, giftCardFileFilter } = require("../config/multer");

const uploadImage = multer({
  fileFilter,
  storage,
});

const uploadGiftCardImages = multer({
  storage,
  fileFilter: giftCardFileFilter,
}).array("giftCardImages");

module.exports = { uploadImage, uploadGiftCardImages };
