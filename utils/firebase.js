require("dotenv").config();
const admin = require("firebase-admin");
// const serviceAccount = require("../leyou-exchange-firebase-adminsdk-2b35t-b5f25ca574.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
