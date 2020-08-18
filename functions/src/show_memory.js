const fetch = require("node-fetch");
const db = require("./db");
const config = require("./config");

const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.messaging.access_token}`
}

const show_memory = async function (reply_token, source) {
    const memory = await db.ref(`reply/private/${source.groupId}`).once("value").then(snapshot => { return snapshot.val() });
    let message = "";
    if (memory === null) {
        message = "記憶體裡面沒有任何記憶"
    }
    else {
        message = JSON.stringify(memory, null, 2);
    }
    await fetch(`${config.messaging.reply_api}`, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: "text",
                text: message
            }]
        })
    }
    );
    return 0;

}


module.exports = show_memory;
