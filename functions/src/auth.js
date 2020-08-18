const crypto = require("crypto");
const config = require("./config");

module.exports = function (request_body , line_signature ){
    const channel_secret = config.channel.secret ;
    const body_string = Buffer.from( JSON.stringify(request_body) , "utf8" ) ;
    const signature = crypto.createHmac('SHA256' ,channel_secret).update(body_string).digest("base64");
    //functions.logger.log(signature);
    //functions.logger.log(line_signature);
    if (signature === line_signature){
        return true;    
    }
    else{
        return false;
    }
}
