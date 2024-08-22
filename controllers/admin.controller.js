const { StatusCodes } = require("http-status-codes");
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
  allPendingGiftcardTransactions,
  allPendingWalletTransactions,
  allCompletedWalletTransactions,
  allCompletedGiftcardTransactions,
  allUsersReferrals,
} = require("../services/admin.service");

const { sendErrorMessage, sendSuccessMessage } = require("../utils");

const uploadGiftCards = async (req, res) => {
  const { giftCardImages, email, name, userName, phoneNumber, password } = req.body;

  try {
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getSingleUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ users, ...(users.length > 0 && { totalNumberOfUsers: users.length }) });
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getGiftCardTransaction = async (req, res) => {
  try {
    const giftCardTransaction = await getSinglegiftCardTransaction(req.params.id);
    res.status(200).json(giftCardTransaction);
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getGiftcardTransactions = async (req, res) => {
  try {
    const giftCardTransactions = await getAllGiftCardTransactions();
    res.status(200).json(giftCardTransactions);
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getWalletTransaction = async (req, res) => {
  try {
    const walletTransaction = await get(req.params.id);
    res.status(200).json(walletTransaction);
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getWalletTransactions = async (req, res) => {
  try {
    const walletTransactions = await getAllWalletTransactions();
    res.status(200).json(walletTransactions);
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const registerAdmin = async (req, res) => {
  const { email, name, userName, phoneNumber, password } = req.body;

  try {
    const newAdmin = await createAdminAccount(email, password, name, userName, phoneNumber);

    return res.status(StatusCodes.CREATED).json(
      sendSuccessMessage(
        {
          AdminId: newAdmin._id,
          // message: "Admin has been Added Successfully.",
          message: "Account has been created successfully",
        },
        StatusCodes.CREATED
      )
    );
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await loginAdmin(email, password);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status));
  }
};

const giftCardTransanctionDecision = async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await decideGiftCardTransanction(req.params.id, status);

    return res.status(201).json(sendSuccessMessage(transaction.status, 201));
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const walletTransanctionDecision = async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await decideWalletTransanction(req.params.id, status);

    return res.status(201).json(sendSuccessMessage(transaction.status, 201));
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getAllPendingGiftcardTransactions = async (req, res) => {
  try {
    const pendingTransactions = await allPendingGiftcardTransactions();
    res.status(200).json(pendingTransactions);
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getAllPendingWalletTransactions = async (req, res) => {
  try {
    const pendingTransactions = await allPendingWalletTransactions();
    res.status(200).json(pendingTransactions);
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getAllCompletedWalletTransactions = async (req, res) => {
  try {
    const completedTransactions = await allCompletedWalletTransactions();
    res.status(200).json(completedTransactions);
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getAllCompletedGiftcardTransactions = async (req, res) => {
  try {
    const completedTransactions = await allCompletedGiftcardTransactions();
    res.status(200).json(completedTransactions);
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getAllUsersRefferals = async (req, res) => {
  try {
    const users = await allUsersReferrals();

    const userReferrals = users.map((user) => ({
      userId: user._id,
      userName: user.userName,
      email: user.email,
      referrals: user.referredUsers.map((referral) => ({
        userId: referral.user ? referral.user._id : null,
        userName: referral.user ? referral.user.userName : null,
        email: referral.user ? referral.user.email : null,
        isRegisteredSuccessfully: referral.isRegisteredSuccessfully,
        hasMadeFirstTrade: referral.hasMadeFirstTrade,
      })),
    }));

    res.json(userReferrals.length);
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
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
  getAllPendingGiftcardTransactions,
  getAllPendingWalletTransactions,
  getAllCompletedGiftcardTransactions,
  getAllCompletedWalletTransactions,
  getAllUsersRefferals,
};
