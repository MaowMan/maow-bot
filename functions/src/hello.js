const fetch = require("node-fetch");
const config = require("./config");
const db = require("./db");
const { logger } = require("firebase-functions");

function generate_message(reply) {
    return {
        type: "text",
        text: `${reply}`
    };
}

const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.messaging.access_token}`
}


const hello = async function (text, reply_token, source) {
    //functions.logger.log(text);
    let reply = "";
    let public_reply = null;
    let private_reply = null;
    const public = db.ref(`reply/public/${text}`).once("value").then(snapshot => { return public_reply = snapshot.val() });
    const private = db.ref(`reply/private/${source.groupId}/${text}`).once("value").then(snapshot => { return private_reply = snapshot.val() });
    await Promise.all([public, private]).catch(error => { logger.log(error) });
    if (public_reply !== null) {
        reply = public_reply;
    }
    else {
        if (private_reply !== null) {
            reply = private_reply;
        }
    }
    //functions.logger.log(reply)
    if (reply !== "") {
        await fetch(`${config.messaging.reply_api}`, {
            method: "POST",
            headers: header,
            body: JSON.stringify({
                replyToken: reply_token,
                messages: [generate_message(reply)]
            })
        }
        );
    }
    return 0;
}

module.exports = hello;