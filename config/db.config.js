const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const dbConnect = mongoose
  .connect(process.env.DATABASE_URI, {
    autoIndex: true,
  })
  .then(() => {
    console.log("server is currently listening for requests");
  });

module.exports = dbConnect;
