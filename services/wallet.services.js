const Wallet = require("../models/wallet.model");

const axios = require("axios");
const { newError } = require("../utils");

const listAvailableBank = async () => {
  try {
    const response = await axios.get(`https://api.paystack.co/bank`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    return response;
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

const resolveAccountNumber = async (accountNumber, bankCode) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response;
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

const getWalletBalance = async (userId) => {
  try {
    const balance = await Wallet.findOne({ userId: userId });
    return balance;
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

const addBank = async (userId, accountName, bankName, accountNumber) => {
  try {
    await Wallet.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          banks: {
            accountName: accountName,
            bankName: bankName,
            accountNumber: accountNumber,
          },
        },
      }
    );
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

const addBankToDB = async (userId, accountName, bankName, accountNumber) => {
  const wallet = await getWalletBalance(userId);

  if (!wallet) {
    await Wallet.create({
      userId: userId,
      banks: [
        {
          accountName: accountName,
          bankName: bankName,
          accountNumber: accountNumber,
        },
      ],
    });
    return;
  }

  await addBank(userId, accountName, bankName, accountNumber);
};

const deleteBank = async (userId, accountName, bankName, accountNumber) => {
  try {
    await Wallet.findOneAndUpdate(
      { userId: userId },
      {
        $pull: {
          banks: {
            accountName: accountName,
            bankName: bankName,
            accountNumber: accountNumber,
          },
        },
      }
    );
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

module.exports = {
  listAvailableBank,
  resolveAccountNumber,
  getWalletBalance,
  deleteBank,
  addBankToDB,
};
