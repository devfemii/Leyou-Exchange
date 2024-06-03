const Notification = require("../models/notification.model");
const { newError } = require("../utils");

const getNotificationsByUserId = async (userId) => {
  try {
    const notifications = await Notification.findOne(userId);
    return notifications;
  } catch (error) {
    return newError(error.message, error.status);
  }
};

module.exports = {
  getNotificationsByUserId,
};
