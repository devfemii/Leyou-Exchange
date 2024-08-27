const Admin = require("../models/admin.model");
const {
  GiftCardTransactionModel: GiftCardTransaction,
  WalletTransactionModel: WalletTransaction,
} = require("../models/transaction.model");
const User = require("../models/user.model");
const { newError, sendErrorMessage, validateEmail, capitalizeName } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { NotFoundError } = require("../errors");

const giftCards = [
  {
    category: "Amazon",
    image:
      "https://s3-alpha-sig.figma.com/img/90e9/4fcf/f625961620237fe0a604096e78ed3919?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hWecw6wliJ3ioe1Oq8RQrRMcWu-SEKNkHToCUQg3gm5LAvweq~6XmmXuwdEm0yf2zhvI7Tuf1-fdS8yB1LYVAn-h6LWiQTOGgDIs666EDRqyo5D1ehjB2P1SmyKtHppllKxKGRsNpbblrRKkNUK8-dDq-6G-EhdzWsRvmY4nZ83H2FBR-XQKLI99wBivn89wHD7kQpvznmyOv7W7ie053LGl3NZ4lWBEmtxcjLC~RzQl7kZB~PMIvQkhFGHXBndcVIxcQt9ZdqLEU5tuCuksZlUSJkAiz1fMFtWMwv3IgJy2BpiOYh6agJ77UCoPhJyEF0OfB0yEhZBB23ifm2RhCQ__",
    subcategory: [
      { name: "Amazon $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Amazon $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Amazon $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "iTunes",
    image:
      "https://s3-alpha-sig.figma.com/img/8028/030e/db66ffd194469588b044404bc4533c89?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Qucr3qI~vxm5xKw6MC8DCQ~Ut9o2pZ5F88ZCNwa1JQsSSp6QJ2ux0xAtgvNCsVE42ynFRBHuj~StLyrufIdPg0n~IDS7kFT-x72pSs3fkFoqkEcnAa-dzvxHLR9BtRkiE2razIOiJu1qCmKNQymAhnrMTn2Cp5A4YwEkgtH~E6L4XSiSCs2jXbiDNHUnUQTQAezWeqib4pucXfLu6jjyXuYOezE~u19Yt6geIjNTQAwFDYAdQy30SzjQfE87Bhvfj00xez2~J5gp1EjI11c~h5lsBv5a2nE4UEbcv25eJpkjgpmZMT4HuDIyaZkNEHCCipK35TjvbPx8KHznOK12jA__",
    subcategory: [
      { name: "iTunes $15 Gift Card", value: { NGN: 11550, GHS: 165 } },
      { name: "iTunes $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "iTunes $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
    ],
  },
  {
    category: "Google Play",
    image:
      "https://s3-alpha-sig.figma.com/img/a1fb/6e4e/7087eadc833f46d3c317f582e9d5666b?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oyQ9mLH7Ssw9nhColuh0G8BZqmxVNwEPasptV~ZiuuIJgJ-Ic86kVuaGjBDA7kMLvQkU5On5ysNLEl5P7qcureRIfETKSLJX8WmMCJbpHsDMxJoPp63Zhi-KaN7hXI4J3QK5LiHnw~RXrwB-rqKpmCctR2PZQuv126N97FKjGBJpL7kX0p-7hWvNen28~8HKzcPajjrMPVr2VdGgLB0piVJm4dhhtP813evqzRxGiQHGp9Uqw9APunRTlwhtSOAG7Z8NNQbP98gwR6itzG2l6wUG2-0T5EuNaDzxT2ss3Ejhs~rSQXN7nFj-e-Cl1MvVzTsoVrfHl8A0-enowlE5HQ__",
    subcategory: [
      { name: "Google Play $10 Gift Card", value: { NGN: 7700, GHS: 110 } },
      { name: "Google Play $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Google Play $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
    ],
  },
  {
    category: "Steam",
    image:
      "https://s3-alpha-sig.figma.com/img/919d/62e9/6d7fd0e27d47500457d6bce7ef0daec7?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GnGh5Z6~8nIMK1bPccUQFCErbIlQFx5f1DVC~PZHsDIDBkpSxdco0ZNTq7IEImVEyvrRANlxFAEmLNkLRcF2~L1pxl3FDFmE-Vn3FPcW5UBWc452ZSrTUH3FqBYLLGgJvf4Oob91n3EUxVOFdQCVFM3lqLxdihW~aHSSIvWwPNOE8FZccsa4xXjk9QP0eHR4Y43hxVRSUBoY6gqB9H--i8yA8TqlJ~NRwXAMRlRkNnPENWo3fpegPTR9~Wc-s2u9XmMqMSjEWNiue9Q23nRVh5W9ozSd6lc8Ji9uZlwpuOU1AnhFyedFwLUxSzmVEnB~tTO2fH4tgVGJ-VQACVKrjQ__",
    subcategory: [
      { name: "Steam $20 Gift Card", value: { NGN: 15400, GHS: 220 } },
      { name: "Steam $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Steam $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Visa",
    image:
      "https://s3-alpha-sig.figma.com/img/90e9/4fcf/f625961620237fe0a604096e78ed3919?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hWecw6wliJ3ioe1Oq8RQrRMcWu-SEKNkHToCUQg3gm5LAvweq~6XmmXuwdEm0yf2zhvI7Tuf1-fdS8yB1LYVAn-h6LWiQTOGgDIs666EDRqyo5D1ehjB2P1SmyKtHppllKxKGRsNpbblrRKkNUK8-dDq-6G-EhdzWsRvmY4nZ83H2FBR-XQKLI99wBivn89wHD7kQpvznmyOv7W7ie053LGl3NZ4lWBEmtxcjLC~RzQl7kZB~PMIvQkhFGHXBndcVIxcQt9ZdqLEU5tuCuksZlUSJkAiz1fMFtWMwv3IgJy2BpiOYh6agJ77UCoPhJyEF0OfB0yEhZBB23ifm2RhCQ__",
    subcategory: [
      { name: "Visa $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Visa $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Visa $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Sephora",
    image:
      "https://s3-alpha-sig.figma.com/img/90e9/4fcf/f625961620237fe0a604096e78ed3919?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hWecw6wliJ3ioe1Oq8RQrRMcWu-SEKNkHToCUQg3gm5LAvweq~6XmmXuwdEm0yf2zhvI7Tuf1-fdS8yB1LYVAn-h6LWiQTOGgDIs666EDRqyo5D1ehjB2P1SmyKtHppllKxKGRsNpbblrRKkNUK8-dDq-6G-EhdzWsRvmY4nZ83H2FBR-XQKLI99wBivn89wHD7kQpvznmyOv7W7ie053LGl3NZ4lWBEmtxcjLC~RzQl7kZB~PMIvQkhFGHXBndcVIxcQt9ZdqLEU5tuCuksZlUSJkAiz1fMFtWMwv3IgJy2BpiOYh6agJ77UCoPhJyEF0OfB0yEhZBB23ifm2RhCQ__",
    subcategory: [
      { name: "Sephora $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Sephora $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Sephora $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Nike",
    image:
      "https://s3-alpha-sig.figma.com/img/919d/62e9/6d7fd0e27d47500457d6bce7ef0daec7?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GnGh5Z6~8nIMK1bPccUQFCErbIlQFx5f1DVC~PZHsDIDBkpSxdco0ZNTq7IEImVEyvrRANlxFAEmLNkLRcF2~L1pxl3FDFmE-Vn3FPcW5UBWc452ZSrTUH3FqBYLLGgJvf4Oob91n3EUxVOFdQCVFM3lqLxdihW~aHSSIvWwPNOE8FZccsa4xXjk9QP0eHR4Y43hxVRSUBoY6gqB9H--i8yA8TqlJ~NRwXAMRlRkNnPENWo3fpegPTR9~Wc-s2u9XmMqMSjEWNiue9Q23nRVh5W9ozSd6lc8Ji9uZlwpuOU1AnhFyedFwLUxSzmVEnB~tTO2fH4tgVGJ-VQACVKrjQ__",
    subcategory: [
      { name: "Nike $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Nike $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Nike $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Walmart",
    subcategory: [
      { name: "Walmart $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Walmart $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Walmart $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Amex (American Express)",
    subcategory: [
      { name: "Amex $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Amex $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Amex $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "eBay",
    image:
      "https://s3-alpha-sig.figma.com/img/da2e/55bf/8e17536f508f25278518606c4cb33c4f?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LgKa28p9beahpphllHZyX1sTSZFYCxyj~ilKdSuABhm89HEI3u5tPnMSwmr2JrWhXR~NTca1GPyHk7wS2opVRWHfzH8ev0cERHgH4aznwhxqcq~ucBEIe40cL4~pD9duJqABZ0GjM611Vabc-rzLbuBq7pte8540RTNqTq6nbnHFTVaQjhz4x4VJjJnr5BzQDT5BEx29H5r5i5fsS8rowj5sj8adeXJu9PD33jdy5lKcf4ufK4U-Ilq9GB~DvNaXP38ibWsEq0bl9uO36OUVTHaGhLIiPT0M~11vLbYx075T~TB~eySCHjj7Lm51wwgwa8BIDkLGqvWOe-l6PM16xQ__",
    subcategory: [
      { name: "eBay $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "eBay $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "eBay $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Best Buy",
    image:
      "https://s3-alpha-sig.figma.com/img/90e9/4fcf/f625961620237fe0a604096e78ed3919?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hWecw6wliJ3ioe1Oq8RQrRMcWu-SEKNkHToCUQg3gm5LAvweq~6XmmXuwdEm0yf2zhvI7Tuf1-fdS8yB1LYVAn-h6LWiQTOGgDIs666EDRqyo5D1ehjB2P1SmyKtHppllKxKGRsNpbblrRKkNUK8-dDq-6G-EhdzWsRvmY4nZ83H2FBR-XQKLI99wBivn89wHD7kQpvznmyOv7W7ie053LGl3NZ4lWBEmtxcjLC~RzQl7kZB~PMIvQkhFGHXBndcVIxcQt9ZdqLEU5tuCuksZlUSJkAiz1fMFtWMwv3IgJy2BpiOYh6agJ77UCoPhJyEF0OfB0yEhZBB23ifm2RhCQ__,",
    subcategory: [
      { name: "Best Buy $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Best Buy $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Best Buy $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Home Depot",
    image:
      "https://s3-alpha-sig.figma.com/img/90e9/4fcf/f625961620237fe0a604096e78ed3919?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hWecw6wliJ3ioe1Oq8RQrRMcWu-SEKNkHToCUQg3gm5LAvweq~6XmmXuwdEm0yf2zhvI7Tuf1-fdS8yB1LYVAn-h6LWiQTOGgDIs666EDRqyo5D1ehjB2P1SmyKtHppllKxKGRsNpbblrRKkNUK8-dDq-6G-EhdzWsRvmY4nZ83H2FBR-XQKLI99wBivn89wHD7kQpvznmyOv7W7ie053LGl3NZ4lWBEmtxcjLC~RzQl7kZB~PMIvQkhFGHXBndcVIxcQt9ZdqLEU5tuCuksZlUSJkAiz1fMFtWMwv3IgJy2BpiOYh6agJ77UCoPhJyEF0OfB0yEhZBB23ifm2RhCQ__,",
    subcategory: [
      { name: "Home Depot $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Home Depot $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Home Depot $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Apple Store",
    image: "https://www.figma.com/file/1vuni4TRtw1rPRALINGNoJ/image/8028030edb66ffd194469588b044404bc4533c89",
    subcategory: [
      { name: "Apple Store $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Apple Store $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Apple Store $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Macy's",
    image:
      "https://s3-alpha-sig.figma.com/img/90e9/4fcf/f625961620237fe0a604096e78ed3919?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hWecw6wliJ3ioe1Oq8RQrRMcWu-SEKNkHToCUQg3gm5LAvweq~6XmmXuwdEm0yf2zhvI7Tuf1-fdS8yB1LYVAn-h6LWiQTOGgDIs666EDRqyo5D1ehjB2P1SmyKtHppllKxKGRsNpbblrRKkNUK8-dDq-6G-EhdzWsRvmY4nZ83H2FBR-XQKLI99wBivn89wHD7kQpvznmyOv7W7ie053LGl3NZ4lWBEmtxcjLC~RzQl7kZB~PMIvQkhFGHXBndcVIxcQt9ZdqLEU5tuCuksZlUSJkAiz1fMFtWMwv3IgJy2BpiOYh6agJ77UCoPhJyEF0OfB0yEhZBB23ifm2RhCQ__,",
    subcategory: [
      { name: "Macy's $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Macy's $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Macy's $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Vanilla",
    image:
      "https://s3-alpha-sig.figma.com/img/90e9/4fcf/f625961620237fe0a604096e78ed3919?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hWecw6wliJ3ioe1Oq8RQrRMcWu-SEKNkHToCUQg3gm5LAvweq~6XmmXuwdEm0yf2zhvI7Tuf1-fdS8yB1LYVAn-h6LWiQTOGgDIs666EDRqyo5D1ehjB2P1SmyKtHppllKxKGRsNpbblrRKkNUK8-dDq-6G-EhdzWsRvmY4nZ83H2FBR-XQKLI99wBivn89wHD7kQpvznmyOv7W7ie053LGl3NZ4lWBEmtxcjLC~RzQl7kZB~PMIvQkhFGHXBndcVIxcQt9ZdqLEU5tuCuksZlUSJkAiz1fMFtWMwv3IgJy2BpiOYh6agJ77UCoPhJyEF0OfB0yEhZBB23ifm2RhCQ__",
    subcategory: [
      { name: "Vanilla $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Vanilla $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Vanilla $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Target",
    image:
      "https://s3-alpha-sig.figma.com/img/90e9/4fcf/f625961620237fe0a604096e78ed3919?Expires=1718582400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hWecw6wliJ3ioe1Oq8RQrRMcWu-SEKNkHToCUQg3gm5LAvweq~6XmmXuwdEm0yf2zhvI7Tuf1-fdS8yB1LYVAn-h6LWiQTOGgDIs666EDRqyo5D1ehjB2P1SmyKtHppllKxKGRsNpbblrRKkNUK8-dDq-6G-EhdzWsRvmY4nZ83H2FBR-XQKLI99wBivn89wHD7kQpvznmyOv7W7ie053LGl3NZ4lWBEmtxcjLC~RzQl7kZB~PMIvQkhFGHXBndcVIxcQt9ZdqLEU5tuCuksZlUSJkAiz1fMFtWMwv3IgJy2BpiOYh6agJ77UCoPhJyEF0OfB0yEhZBB23ifm2RhCQ__",
    subcategory: [
      { name: "Target $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Target $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Target $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
];

const saveGiftCard = async () => {
  try {
  } catch {}
};

const findAllGiftCards = () => {
  return giftCards;
};

const rankGiftCardFromAdminsRate = () => {
  let giftCardArray = [];
  try {
    findAllGiftCards().forEach((giftCard) => {
      giftCard.subcategory.forEach((sub) => {
        giftCardArray.push({
          image: giftCard.image,
          name: sub.name,
          value: { NGN: sub.value.NGN, GHS: sub.value.GHS },
        });
      });
    });

    return giftCardArray.sort((a, b) => b.value - a.value);
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

const getSingleUser = async (id) => {
  const user = await User.findById(id)
    .select("-password")
    .populate("giftCardTransactionHistory")
    .populate("walletTransactionHistory")
    .exec();
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

const getAllUsers = async (query) => {
  const { limit, skip = 0, sortBy = "createdAt", sortOrder = "desc" } = query;
  const sortCriteria = {};
  if (sortBy) {
    sortCriteria[sortBy] = sortOrder === "desc" ? -1 : 1;
  }
  try {
    return await User.find({})
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .select("-password")
      .populate("referredUsers.user")
      .populate("giftCardTransactionHistory")
      .populate("walletTransactionHistory")
      .exec();
  } catch (error) {
    throw new Error(error);
  }
};

const getAllGiftCardTransactions = async (query) => {
  try {
    return await GiftCardTransaction.find(query).sort("-createdAt").populate("user").exec();
  } catch (error) {
    throw new Error(error);
  }
};

const getAllWalletTransactions = async (query) => {
  try {
    return await WalletTransaction.find(query).sort("-createdAt").populate("user").exec();
  } catch (error) {
    throw new Error(error);
  }
};

const loginAdmin = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return newError("Invalid credentials", 404);
    }
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return newError("Invalid credentials", 400);
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN, {
      expiresIn: process.env.JWT_TOKEN_EXPIRES,
    });

    return { admin, token };
  } catch (error) {
    return newError(error.message, error.status);
  }
};

const createAdminAccount = async (email, password, name, userName, phoneNumber) => {
  try {
    const isEmailExisting = await Admin.findOne({ email });
    if (isEmailExisting) {
      return newError("Email already exist", StatusCodes.BAD_REQUEST);
    }
    const isUsernameExisting = await Admin.findOne({ userName });
    if (isUsernameExisting) {
      return newError("Username already exist", StatusCodes.BAD_REQUEST);
    }
    const validatedMail = validateEmail(email);
    if (!validatedMail) {
      return newError("Invalid email, try again", 400);
    }

    const user = await Admin.create({
      email: email,
      password: password,
      name: name && capitalizeName(name),
      userName: userName,
      phoneNumber: phoneNumber,
    });

    return user;
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

module.exports = {
  saveGiftCard,
  findAllGiftCards,
  rankGiftCardFromAdminsRate,
  getSingleUser,
  getAllUsers,
  getAllGiftCardTransactions,
  getAllWalletTransactions,
  createAdminAccount,
  loginAdmin,
};
