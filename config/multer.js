const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { UnprocessableEntityError } = require("../errors");
const MAX_GIFT_CARD_IMAGES = 12;

const giftCardFileFilter = (req, file, cb) => {
  if (req.files.length <= MAX_GIFT_CARD_IMAGES) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Please upload an image file with either jpg, jpeg, png or gif extension"));
    }
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new UnprocessableEntityError(`Please upload ${MAX_GIFT_CARD_IMAGES} images or less `));
  }
};
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Please upload an image file with either jpg, jpeg, png or gif extension"));
  }
  cb(null, true);
};

const tempDir = path.resolve("data", "temp");
//<---------- check if the temp folder exist or create another -------->
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFileName =
      file.originalname.split(".")[0] + "-" + uniqueSuffix + "." + file.originalname.split(".")[1];

    cb(null, newFileName);
  },
});

module.exports = { storage, fileFilter, giftCardFileFilter };
