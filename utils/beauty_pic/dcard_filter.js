const fs = require("fs");

const raw = fs.readFileSync("./images/dcard.json" , "utf8");
const json = JSON.parse(raw);
const db = {};
const data = json.data;
for(const element of data){
    db[element] = true;
}
const result = Object.keys(db);
fs.writeFileSync("./images/dcard.json" , JSON.stringify({data:result}) , "utf8");
console.log("dcard completed");