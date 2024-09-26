const { StreamChat } = require("stream-chat");
const fs = require("fs");
const {
  updateUserAccount,
  checkIfEmailAndUsernameExist,
  existingUser,
  getLeaderBoardFromDB,
  getUserReferral,
  deleteAccountFromDB,
} = require("../services/user.service");
const { findAllGiftCards, rankGiftCardFromAdminsRate } = require("../services/admin.service");
const { sendErrorMessage, sendSuccessMessage, newError } = require("../utils");
const { BadRequestError } = require("../errors");
const cloudinary = require("../config/cloudinary");
const { StatusCodes } = require("http-status-codes");

const getStreamToken = async (req, res) => {
  const { id: userId } = req.decoded;
  try {
    const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
    const token = serverClient.createToken(userId);
    return res.status(200).json({ token });
  } catch (error) {
    throw new Error(error);
  }
};
const toggleBalanceVisibility = async (req, res) => {
  try {
    const user = await existingUser({ _id: req.decoded.id });

    const updatedBalanceVisibility = await updateUserAccount(
      { _id: req.decoded.id },
      { isBalanceVisible: !user.isBalanceVisible }
    );

    return res.status(201).json(sendSuccessMessage(updatedBalanceVisibility.isBalanceVisible, 201));
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getGiftCards = (req, res) => {
  try {
    const giftCards = findAllGiftCards();
    return res.status(200).json(sendSuccessMessage(giftCards, 200));
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const rankGiftCards = (req, res) => {
  try {
    const rankedGiftCard = rankGiftCardFromAdminsRate();
    return res.status(200).json(sendSuccessMessage(rankedGiftCard, 200));
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getLeaderBoard = async (req, res) => {
  try {
    const usersFromLeaderBorad = await getLeaderBoardFromDB();
    return res.status(200).json(sendSuccessMessage(usersFromLeaderBorad, 200));
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

//<---------Refactored Controllers ------->
const deleteUserAccount = async (req, res) => {
  const { id: userId } = req.decoded;
  try {
    await deleteAccountFromDB(userId);
    return res.status(200).json(sendSuccessMessage("Your account has been successfully deleted", 200));
  } catch (error) {
    throw new Error(error);
  }
};
const getReferralDetails = async (req, res) => {
  const { id: userId } = req.decoded;
  try {
    const userReferral = await getUserReferral(userId);
    return res.status(200).json(
      sendSuccessMessage(
        {
          ...(userReferral.length > 0 && { numberOFReferrals: userReferral.length }),
          referredUsers: userReferral,
        },
        200
      )
    );
  } catch (error) {
    throw new Error(error);
  }
};

const verifyUserIdentity = async (req, res) => {
  const { dateOfBirth, bankVerificationNumber } = req.body;
  try {
    await updateUserAccount({ _id: req.decoded.id }, { dateOfBirth, bankVerificationNumber });
    return res
      .status(200)
      .json(
        sendSuccessMessage(
          "your BVN verification is processing, you will get feedback in 2 business days",
          200
        )
      );
  } catch (error) {
    throw new Error(error);
  }
};

const updateUserProfile = async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("Please provide a profile picture");
  }
  const imagePath = req.file.path;
  console.log(imagePath);
  try {
    const uploadFolder = "Leyou-Exchange/profilePicture";
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: uploadFolder,
      use_filename: true,
    });
    const user = await updateUserAccount(
      { _id: req.decoded.id },
      {
        profilePicture: result.secure_url,
      }
    );

    return res.status(StatusCodes.OK).json(
      sendSuccessMessage(
        {
          userDetails: {
            profilePicture: user.profilePicture,
            ...user._doc,
          },
        },
        StatusCodes.OK
      )
    );
  } catch (error) {
    // fs.unlinkSync(imagePath);
    throw new BadRequestError("Image Upload failed");
  } finally {
    fs.unlinkSync(imagePath);
  }
};
//<---------Refactored Controllers Ends here ------->

module.exports = {
  toggleBalanceVisibility,
  getGiftCards,
  rankGiftCards,
  getLeaderBoard,
  updateUserProfile,
  getReferralDetails,
  verifyUserIdentity,
  deleteUserAccount,
  getStreamToken,
};
