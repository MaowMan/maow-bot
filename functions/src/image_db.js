const admin = require("firebase-admin");
const secret = require("./secret");


const image = admin.initializeApp({
  credential: admin.credential.cert(secret),
  databaseURL: "https://maow-bot-image.firebaseio.com/"
},"image");

module.exports = image.database();