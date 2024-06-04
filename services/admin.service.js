const User = require("../models/user.model");

const giftCards = [
  {
    category: "Amazon",
    subcategory: [
      { name: "Amazon $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Amazon $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Amazon $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "iTunes",
    subcategory: [
      { name: "iTunes $15 Gift Card", value: { NGN: 11550, GHS: 165 } },
      { name: "iTunes $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "iTunes $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
    ],
  },
  {
    category: "Google Play",
    subcategory: [
      { name: "Google Play $10 Gift Card", value: { NGN: 7700, GHS: 110 } },
      { name: "Google Play $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Google Play $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
    ],
  },
  {
    category: "Steam",
    subcategory: [
      { name: "Steam $20 Gift Card", value: { NGN: 15400, GHS: 220 } },
      { name: "Steam $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Steam $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Visa",
    subcategory: [
      { name: "Visa $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Visa $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Visa $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Sephora",
    subcategory: [
      { name: "Sephora $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Sephora $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Sephora $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Nike",
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
    subcategory: [
      { name: "eBay $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "eBay $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "eBay $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Best Buy",
    subcategory: [
      { name: "Best Buy $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Best Buy $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Best Buy $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Home Depot",
    subcategory: [
      { name: "Home Depot $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Home Depot $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Home Depot $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Apple Store",
    subcategory: [
      { name: "Apple Store $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Apple Store $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Apple Store $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Macy's",
    subcategory: [
      { name: "Macy's $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Macy's $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Macy's $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Vanilla",
    subcategory: [
      { name: "Vanilla $25 Gift Card", value: { NGN: 19250, GHS: 275 } },
      { name: "Vanilla $50 Gift Card", value: { NGN: 38500, GHS: 550 } },
      { name: "Vanilla $100 Gift Card", value: { NGN: 77000, GHS: 1100 } },
    ],
  },
  {
    category: "Target",
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

module.exports = {
  saveGiftCard,
  findAllGiftCards,
};
