const db = require("./db");
const config = require("./config");
const fetch = require("node-fetch");

const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.messaging.access_token}`
}

const random_number = function () {
    return (Math.floor(Math.random() * 100) + 1);
}

const get_user_name = async function (groupid, userid) {
    const result = await fetch(`https://api.line.me/v2/bot/group/${groupid}/member/${userid}`, {
        method: "GET",
        headers: header
    }).then(result => result.json());
    return result.displayName;

}

const guess = async function (input, reply_token, source) {
    let num = 0;
    try {
        num = parseInt(input);
    }
    catch (error) {
        return 0;
    }
    let username = await get_user_name(source.groupId, source.userId);
    let secret = await db.ref(`guess/${source.groupId}`).once("value").then(snapshot => snapshot.val());
    if (secret === null) {
        secret = random_number();
        await db.ref(`guess/${source.groupId}`).set(secret);
    }
    let reply = `@${username}`;
    if (num > secret) {
        reply += " 葛格太大了";
    }
    else if (num < secret) {
        reply += " 太小了吧笑死";
    }
    else {
        reply += " 剛剛好的size，要壞掉了(´◓Д◔`)";
    }
    await fetch(`${config.messaging.reply_api}`, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: "text",
                text: `${reply}`
            }]
        })
    }
    );
    if (num === secret) {
        await db.ref(`guess/${source.groupId}`).set(random_number());
    }
    return 0;
}

module.exports = guess;