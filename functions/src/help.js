const fetch = require("node-fetch");
const config = require("./config");
const { logger } = require("firebase-functions");

const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.messaging.access_token}`
}

const flex = {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "貓貓機器人",
          "weight": "bold",
          "size": "xl"
        },
        {
          "type": "text",
          "text": "這些是可以使用的指令：",
          "size": "sm"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "學習",
                "text": "學習 範例關鍵字 範例回覆"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "記憶體",
                "text": "記憶體"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "忘記",
                "text": "忘記 範例關鍵字"
              }
            }
          ]
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "抽",
                "text": "抽"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "猜",
                "text": "猜 50"
              }
            },

          ]
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "version 0.1 2020/8/15",
          "size": "xs"
        }
      ]
    }
  }

const message = {
    "type": "flex",
    "altText": "貓貓機器人指令總覽",
    "contents": flex
}

const help = async function (reply_token) {
    await fetch(`${config.messaging.reply_api}`, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
            replyToken: reply_token,
            messages: [message]
        })
    });
    //logger.log("help sent");
    return 0;

}

module.exports = help;