const { sendErrorMessage, sendSuccessMessage } = require("../utils");

const sendMessages = async (req, res) => {
  const { message } = req.body;

  try {
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

module.exports = {
  sendMessages,
};
