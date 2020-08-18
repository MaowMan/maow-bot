const config = require("./config");
const db = require("./db");
const fetch = require("node-fetch");
const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.messaging.access_token}`
}

const forget = async function (word, reply_token, source) {
    const regex = config.regex;
    const clean_word = word.match(regex).join("");
    await db.ref(`reply/private/${source.groupId}/${clean_word}`).remove();
    const message = {
        type : "text",
        text : `成功遺忘關鍵字：${clean_word}`
    }
    await fetch(`${config.messaging.reply_api}`, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            replyToken: reply_token,
            messages:[message]
        })
    }
    );
    return 0;

}

module.exports = forget;