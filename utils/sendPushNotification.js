const FCMAdmin = require("../config/firebase");
const { BadRequestError } = require("../errors");
const sendPushNotification = async (user, notification) => {
  try {
    if (!user.FCMToken) {
      throw new BadRequestError("Please supply FCM token");
    }
    const message = {
      token: user.FCMToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
    };
    const response = await FCMAdmin.messaging().send(message);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendPushNotification;
