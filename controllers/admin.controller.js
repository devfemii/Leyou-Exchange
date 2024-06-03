const {} = require("../services/admin.service");

const { sendErrorMessage, sendSuccessMessage } = require("../utils");

const uploadGiftCards = async (req, res) => {
  const { giftCardImages, email, name, userName, phoneNumber, password } =
    req.body;

  try {
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

module.exports = {
  uploadGiftCards,
};
