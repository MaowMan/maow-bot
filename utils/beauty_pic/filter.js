const fs = require("fs");

const source = [
    //"test",
    "yoimachii"
    //"others"
    //"gravure46"
]

async function main(source) {
    const raw = fs.readFileSync(`./images/${source}.json`, {
        encoding: "utf8"
    });
    const data = (JSON.parse(raw))["data"];
    const result = [];
    data.forEach(element => {
        if (!element.endsWith("gif")) {
            result.push(element);
        }
    })
    const json = {
        data: result
    };
    const json_str = JSON.stringify(json)
    fs.writeFileSync(`./images/${source}.json`, json_str, "utf8");
}

for (const element of source) {
    main(element)
}

