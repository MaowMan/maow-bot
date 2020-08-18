const admin = require("firebase-admin");
const secret = require("./secret");

admin.initializeApp({
    credential: admin.credential.cert(secret),
    databaseURL: "https://maow-bot.firebaseio.com"
  });

module.exports = admin.database();