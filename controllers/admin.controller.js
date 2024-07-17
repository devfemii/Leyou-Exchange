const {
  getSingleUser,
  getAllUsers,
  getSinglegiftCardTransaction,
  getAllGiftCardTransactions,
  getAllWalletTransactions,
  createAdminAccount,
  loginAdmin,
  decideGiftCardTransanction,
  decideWalletTransanction,
} = require("../services/admin.service");

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

const getUser = async (req, res) => {
  try {
    const user = await getSingleUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getGiftCardTransaction = async (req, res) => {
  try {
    const giftCardTransaction = await getSinglegiftCardTransaction(
      req.params.id
    );
    res.status(200).json(giftCardTransaction);
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getGiftcardTransactions = async (req, res) => {
  try {
    const giftCardTransactions = await getAllGiftCardTransactions();
    res.status(200).json(giftCardTransactions);
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getWalletTransaction = async (req, res) => {
  try {
    const walletTransaction = await get(req.params.id);
    res.status(200).json(walletTransaction);
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getWalletTransactions = async (req, res) => {
  try {
    const walletTransactions = await getAllWalletTransactions();
    res.status(200).json(walletTransactions);
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const registerAdmin = async (req, res) => {
  const { email, name, userName, phoneNumber, password } = req.body;

  try {
    const newAdmin = await createAdminAccount(
      email,
      password,
      name,
      userName,
      phoneNumber
    );

    return res.status(201).json(
      sendSuccessMessage(
        {
          AdminId: newAdmin._id,
          message: "Admin has been Added Successfully.",
        },
        201
      )
    );
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await loginAdmin(email, password);

    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

const giftCardTransanctionDecision = async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await decideGiftCardTransanction(req.params.id, status);

    return res.status(201).json(sendSuccessMessage(transaction.status, 201));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const walletTransanctionDecision = async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await decideWalletTransanction(req.params.id, status);

    return res.status(201).json(sendSuccessMessage(transaction.status, 201));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

module.exports = {
  uploadGiftCards,
  getUser,
  getUsers,
  getGiftCardTransaction,
  getGiftcardTransactions,
  getWalletTransaction,
  getWalletTransactions,
  adminLogin,
  registerAdmin,
  giftCardTransanctionDecision,
  walletTransanctionDecision,
};
