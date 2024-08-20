const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URI, {
    autoIndex: true,
  });
};

module.exports = connectDB;
