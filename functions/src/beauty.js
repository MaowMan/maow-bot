const db = require("./image_db");
const config = require("./config");
const fetch = require("node-fetch");

function generate(url){
    return{
        "type": "image",
        "originalContentUrl": `${url}`,
        "previewImageUrl": `${url}`
    }
}

function random (limit){
    return Math.floor(Math.random() * limit);
}

const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.messaging.access_token}`
}

const beauty = async function(reply_token , collection){
    const datasize = await db.ref(`${collection}/datasize`).once("value").then(snapshot =>snapshot.val());
    const token = random(datasize);
    const url = await db.ref(`${collection}/data/${token}`).once("value").then(snapshot =>snapshot.val());
    const message = generate(url);
    await fetch(`${config.messaging.reply_api}`, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            replyToken: reply_token,
            messages: [message]
        })
    }
    );
    return 0;
}

module.exports = beauty;

