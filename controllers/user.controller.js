const {
  updateUserAccount,
  existingUser,
} = require("../services/user.services");
const { sendErrorMessage, sendSuccessMessage } = require("../utils");

const toggleBalanceVisibility = async (req, res) => {
  try {
    const user = await existingUser({ _id: req.decoded.id });

    const updatedBalanceVisibility = await updateUserAccount(
      { _id: req.decoded.id },
      { isBalanceVisible: !user.isBalanceVisible }
    );

    return res
      .status(201)
      .json(sendSuccessMessage(updatedBalanceVisibility.isBalanceVisible, 201));
  } catch (error) {
    console.log(error);
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

module.exports = {
  toggleBalanceVisibility,
};
