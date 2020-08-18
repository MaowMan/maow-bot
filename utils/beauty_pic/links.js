const puppeteer = require("puppeteer");
const scroll = require("puppeteer-autoscroll-down");
const fs = require("fs");

const sources = [
    //"yoimachii",
    //"gravure46"
    //"idolempire",
    //"holygravure",
    //"others"
    "extra"
]

const worker_per_browser = 5;
const scroll_step = 100;
const scroll_delay = 250;


async function read(source) {
    const data = fs.readFileSync(`./albums/${source}.json`, {
        encoding: "utf8"
    });
    const json = JSON.parse(data);
    return json.data;
}


async function main(source) {
    const data = await read(source);
    const browser = await puppeteer.launch({
        headless: true
    })
    const workers = [];
    const pages = [];
    const results = [];

    async function work(worker_id) {
        const url = data.pop();
        if (typeof url === "undefined") {
            return 0;
        }
        await pages[worker_id].goto(url);
        await scroll(pages[worker_id], scroll_step, scroll_delay);
        const subworks = [];
        const main = await pages[worker_id].$('[role="main"]');
        const images = await main.$$("[role='presentation']");
        images.forEach(element=>{
            const subwork = element.$eval("a" , node=>node.href)
            .then(result=>{
                //console.log(result);
                results.push(result);
            })
            .catch(error=>{
                console.log(error);
            })
            subworks.push(subwork);
        })
        await Promise.all(subworks);
        console.log(data.length);
        return work(worker_id);
    }


    for (let header = 0; header < worker_per_browser; header++) {
        pages.push(await browser.newPage())
        workers.push(work(header));
    }
    await Promise.all(workers);
    browser.close();
    const json_obj = {
        data:results
    }
    const json = JSON.stringify(json_obj);
    fs.writeFileSync(`./links/${source}.json`, json , "utf8");
    console.log(`${source} done!`)
    return 0;
}

for (const element of sources) {
    main(element);
}



