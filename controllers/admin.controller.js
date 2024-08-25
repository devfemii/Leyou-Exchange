const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const {
  GiftCardTransactionModel: GiftCardTransaction,
  WalletTransactionModel: WalletTransaction,
} = require("../models/transaction.model");
const {
  loginAdmin,
  getSingleUser,
  getAllUsers,
  getAllGiftCardTransactions,
  getAllWalletTransactions,
  createAdminAccount,
  decideGiftCardTransanction,
  decideWalletTransanction,
} = require("../services/admin.service");

const { sendErrorMessage, sendSuccessMessage } = require("../utils");
const { NotFoundError } = require("../errors");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await loginAdmin(email, password);
    return res.status(200).json(response);
  } catch (error) {
    throw new Error(error);
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

const getDashBoard = async (req, res) => {
  const result = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        totalReferrals: { $sum: { $size: "$referredUsers" } },
      },
    },
    {
      $lookup: {
        from: "wallet_transactions",
        localField: "_id",
        foreignField: "userId",
        as: "walletTransactions",
      },
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        totalReferrals: 1,
      },
    },
  ]);
  return res.status(StatusCodes.OK).json(result);
};
const getUser = async (req, res) => {
  const user = await getSingleUser(req.params.id);
  if (user) {
    res.status(StatusCodes.OK).json(user);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ users, ...(users.length > 0 && { totalNumberOfUsers: users.length }) });
  } catch (error) {
    throw new Error(error);
  }
};

const getTransactions = async (req, res) => {
  const { type, status } = req.query;
  if (type && type !== "giftcard" && type !== "wallet") {
    throw new Error("Transaction type must be giftcard or wallet");
  }
  if (status && status !== "processing" && status !== "completed") {
    throw new Error("Transaction status can either be processing or completed");
  }
  let transactionName = type ? `${[type]}Transactions` : "transactions";
  let transactions = [];

  if (!type || type === "giftcard") {
    const giftCardTransactions = await GiftCardTransaction.find(status ? { status } : {})
      .sort("-createdAt")
      .populate("user")
      .exec();
    transactions = transactions.concat(giftCardTransactions);
  }
  if (!type || type === "wallet") {
    const walletTransactions = await WalletTransaction.find(status ? { status } : {})
      .sort("-createdAt")
      .populate("user")
      .exec();
    transactions = transactions.concat(walletTransactions);
  }

  return res.status(200).json({
    ...(transactions.length > 0 && { totalNumberOfTransactions: transactions.length }),
    [transactionName]: transactions,
  });
};

const getTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { type } = req.query;
  if (!transactionId) {
    throw new Error("Please provide a transaction id");
  }
  if (type !== "giftcard" && type !== "wallet") {
    throw new Error("Transaction type must be giftcard or wallet");
  }
  let transaction;
  if (type === "giftcard") {
    transaction = await GiftCardTransaction.find({ _id: transactionId }).populate("user").exec();
  }
  if (type === "wallet") {
    transaction = await WalletTransaction.find({ _id: transactionId }).populate("user").exec();
  }

  if (transaction.length === 0) {
    throw new NotFoundError(`No ${type} transaction for ${transactionId} found`);
  }
  return res.status(200).json({
    transaction,
  });
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

const getAllUsersRefferals = async (req, res) => {
  let users = await User.find({ "referredUsers.0": { $exists: true } }).populate("referredUsers.user");
  let userReferrals = users.map((user) => ({
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
  const totalReferrals = userReferrals.reduce((acc, user) => {
    return acc + user.referrals.length;
  }, 0);
  return res.status(StatusCodes.OK).json({ totalReferrals, referrals: userReferrals });
};

module.exports = {
  adminLogin,
  registerAdmin,
  getDashBoard,
  getUser,
  getUsers,
  getTransactions,
  getTransaction,
  giftCardTransanctionDecision,
  walletTransanctionDecision,
  getAllUsersRefferals,
};
