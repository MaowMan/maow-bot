const hello = require("./hello");
const learn = require("./learn");
const show_memory = require("./show_memory");
const forget = require("./forget");
const help = require("./help");
const beauty = require("./beauty");
const guess = require("./guess");
const router = async function (message, reply_token, source) {
    if (message.type === "text") {
        const command = (message.text).split(" ");
        switch (command[0]) {
            case "學習":
                if (typeof command[1] === "string" && typeof command[2] === "string" && source.type === "group") {
                    await learn(command[1], command[2], reply_token, source);
                }
                return 0;
            case "記憶體":
                if (source.type === "group") {
                    await show_memory(reply_token, source);
                }
                return 0;
            case "忘記":
                if (typeof command[1] === "string" && source.type === "group") {
                    await forget(command[1], reply_token, source);
                }
                return 0;
            case "指令":
                await help(reply_token);
                return 0;
            case "抽":
                await beauty(reply_token, "japen");
                return 0;
            case "猜":
                if (typeof command[1] === "string" && source.type === "group"){
                    await guess(command[1] , reply_token, source);
                }
                return 0;
            default:
                await hello(command[0], reply_token, source);
                return 0;
        }
    }
    else {
        return 0;
    }
}

module.exports = router;