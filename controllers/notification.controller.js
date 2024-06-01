const {
  getNotificationsByUserId,
} = require("../services/notification.services");
const { sendErrorMessage, sendSuccessMessage } = require("../utils");

const getNotifications = async (req, res) => {
  try {
    const notifications = await getNotificationsByUserId({
      userId: req.decoded.id,
    });

    return res.status(201).json(sendSuccessMessage(notifications, 201));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

module.exports = {
  getNotifications,
};
