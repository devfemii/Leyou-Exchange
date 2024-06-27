const { sendSuccessMessage, sendErrorMessage } = require("../utils");
const {
  listAvailableBank,
  getWalletBalance,
  resolveAccountNumber,
  addBankToDB,
  deleteBank,
  getUserWallet,
} = require("../services/wallet.services");

const balance = async (req, res) => {
  try {
    const wallet = await getWalletBalance(req.decoded.id);
    res.status(200).json(helpers.sendSuccess(wallet, 200));
  } catch (err) {
    console.log(err);
  }
};

// send a list of bank as response
const listBank = async (req, res) => {
  try {
    const response = await listAvailableBank();
    res.status(200).json(sendSuccessMessage(response.data, 200));
  } catch (error) {
    res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

// adding comments
const verifyCustomer = async (req, res) => {
  const { accountNumber, bankCode } = req.query;

  try {
    const response = await resolveAccountNumber(accountNumber, bankCode);
    res.status(200).json(sendSuccessMessage(response.data, 200));
  } catch (error) {
    res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const addBank = async (req, res) => {
  const { accountName, bankName, accountNumber } = req.body;

  try {
    await addBankToDB(req.decoded.id, accountName, bankName, accountNumber);
    res
      .status(200)
      .json(sendSuccessMessage("Bank account added successfully.", 200));
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json(sendErrorMessage(error.message, error.status));
    }

    res.json(error);
  }
};

const getWallet = async (req, res) => {
  try {
    const userWallet = await getUserWallet(req.decoded.id);
    console.log(userWallet, req.decoded.id);
    res.status(200).json(sendSuccessMessage(userWallet, 200));
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const deleteBankDetails = async (req, res) => {
  const { accountName, bankName, accountNumber } = req.body;

  try {
    await deleteBank(req.decoded.id, accountName, bankName, accountNumber);
    res
      .status(200)
      .json(sendSuccessMessage("Bank account deleted successfully.", 200));
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

module.exports = {
  balance,
  listBank,
  addBank,
  deleteBankDetails,
  verifyCustomer,
  getWallet,
};
