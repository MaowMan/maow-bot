const db = require("./db");
const config = require("./config");
const fetch = require("node-fetch");

const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.messaging.access_token}`
}

const learn = async function (word, reply, reply_token, source) {
    const regex = config.regex;
    const clean_word = word.match(regex).join("");
    const clean_reply = reply.match(regex).join("");
    let reply_text = "";
    if (clean_reply.length !== 0 && clean_word.length !== 0){
        await db.ref(`reply/private/${source.groupId}/${clean_word}`).set(clean_reply);
        reply_text = `成功學習關鍵字：${clean_word}`
    }
    else{
        reply_text = "學習失敗"
    }
    await fetch(`${config.messaging.reply_api}`, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type:"text",
                text:reply_text
            }]
        })
    }
    );
    return 0;
}

module.exports = learn;