const functions = require('firebase-functions');
const config = require("./config");
const auth = require("./auth");
const router = require("./router");


const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.messaging.access_token}`
}

const main = functions.region("asia-east2").https.onRequest((request, response) => {
    //functions.logger.log(request);
    //functions.logger.log(request.get("X-Line-Signature"));
    if (request.method === "POST" && auth(request.body, request.get("X-Line-Signature"))) {
        response.status(200).send("sucess");
        if (request.body.events[0].type === "message") {
            return router(request.body.events[0].message, request.body.events[0].replyToken, request.body.events[0].source);
        }
        else {
            return 0;
        }
    }
    else {
        response.status(403).send("forbidden");
        return 0;
    }
})

module.exports = main;