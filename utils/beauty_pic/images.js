const puppteer = require("puppeteer");
const fs = require("fs");

const sources = [
    //"test"
    //"yoimachii",
    //"others"
    //"gravure46"
    "extra"
]

const worker_limit = 5;




async function read(source) {
    const data = fs.readFileSync(`./links/${source}.json`, {
        encoding: "utf8"
    });
    const json = JSON.parse(data);
    return json.data;
}

async function main(source) {
    const data = await read(source);
    const browser = await puppteer.launch({
        headless:true
    });
    const workers = [];
    const pages = [];
    const results = [];

    process.on("exit", code => {
        const json_obj = {
            data: results
        }
        const json = JSON.stringify(json_obj);
        fs.writeFileSync(`./images/${source}.json`, json, "utf8");
        console.log(`${source} done!`);
    });


    async function work(worker_id) {
        const url = data.pop();
        if (typeof url === "undefined") {
            return 0;
        }
        try {
            await pages[worker_id].goto(url)
            await pages[worker_id].$eval("[rel='theater']", node => node.click())
            await pages[worker_id].waitForNavigation({
                waitUntil: 'networkidle0'
            });
            const gallery = await pages[worker_id].$("#photos_snowlift");
            await gallery.$eval("img.spotlight", node => node.src)
                .then(result => {
                    //console.log(result);
                    results.push(result);
                });
            console.log(`${data.length} process:${worker_id + 1}`);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            return work(worker_id);
        }
        //return 0;
    }

    for (let header = 0; header < worker_limit; header++) {
        pages.push(await browser.newPage());
        workers.push(work(header));
    }

    await Promise.all(workers);
    console.log(results);
    browser.close();
    return 0

}

for (const element of sources) {
    main(element)
}


