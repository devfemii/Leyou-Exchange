const admin = require("firebase-admin");
const serviceWorker = require("../leyou-exchange-firebase-adminsdk-2b35t-b5f25ca574.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceWorker),
});

module.exports = admin;
