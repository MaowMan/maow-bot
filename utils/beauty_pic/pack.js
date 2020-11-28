const fs = require("fs");


const sources = {
    "dcard": ["dcard"],
    //"japen": ["yoimachii","gravure46"]
}



function read(source) {
    const raw = fs.readFileSync(`./images/${source}.json`, "utf8");
    const json = JSON.parse(raw)
    return json.data;
}

function pack(result) {
    const data = Object.assign({}, result);
    const collection = {
        data: data,
        datasize: result.length
    }
    return collection;
}

function main(source) {
    const results = [];
    for(const element of source){
        const  cache = read(element);
        for (const memory of cache){
            results.push(memory)
        }
    };
    return pack(results);
}

function manager(sources) {
    for (const [name, collection] of Object.entries(sources)) {
        const db = main(collection);
        fs.writeFileSync(`${name}.json`, JSON.stringify(db), "utf8");
    }
    console.log("packing completed");
    return 0;
}

manager(sources);

