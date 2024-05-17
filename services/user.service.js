const User = require("../models/user.model");
const { newError } = require("../utils");

const existingUser = async (id) => {
  try {
    const existingUser = await User.findOne(id);
    return existingUser;
  } catch (error) {
    return newError("Connection timed out", 500);
  }
};

const updateUserAccount = async (id, payload) => {
  try {
    await User.findOneAndUpdate(id, payload, { new: true });
  } catch (error) {
    console.log(error);
    return newError("Connection timed out", 500);
  }
};

module.exports = {
  existingUser,
  updateUserAccount,
};
