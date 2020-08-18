const puppeteer = require("puppeteer");
const fs = require("fs");

const worker_limit = 20;

async function read() {
    const raw = fs.readFileSync("./albums/ptt.json", "utf8");
    const json = JSON.parse(raw);
    return json.data;
}

async function main() {
    const data = await read();
    //const data = ["https://www.ptt.cc/bbs/Beauty/M.1597642051.A.96C.html","https://www.ptt.cc/bbs/Beauty/M.1597661507.A.344.html"];
    console.log(data.length);
    const pages = [];
    const workers = [];
    const results = [];
    const browser = await puppeteer.launch({
        headless: true
    })
    async function work(worker_id, clicker) {
        const url = data.pop();
        if (typeof url === "undefined") {
            return 0;
        }
        await pages[worker_id].goto(url);
        if (clicker) {
            await pages[worker_id].$eval("[name='yes']", node => node.click());
        }
        const cache = await pages[worker_id].$$eval("a[rel='nofollow']", anchors => [].map.call(anchors, link => link.href));
        const result = cache.filter(element => {
            const url = new URL(element);
            if (url.hostname === "imgur.com" || url.hostname === "i.imgur.com") {
                const filetype = url.pathname.split(".").pop();
                if (filetype === "jpg" || filetype === "png") {
                    return true;
                }
            }
            //console.log("nah");
            return false;
        });
        //console.log(result);
        results.push(...result);
        console.log(data.length);
        return work(worker_id, false);
    }
    process.on("exit", code => {
        console.log(results);
        const obj = {
            data: results
        };
        fs.writeFileSync("./images/ptt.json", JSON.stringify(obj), "utf8");
        console.log("ptt completed!");
    })
    for (const element of [...Array(worker_limit).keys()]) {
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                request.abort();
            }
            else request.continue();
        });
        pages.push(page);
        workers.push(work(element, true));
    }
    await Promise.all(workers);
    await browser.close();
    return 0;
}


main();
