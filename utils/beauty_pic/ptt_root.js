const puppeteer = require("puppeteer");
const fs = require("fs");

const page_limit = 3393;





async function main(page_limit) {
    const results = [];
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    async function work(url) {
        const cache = [];
        try {
            await page.goto(url);
            await page.$eval("[name='yes']", node => node.click()).catch(error => error);
            const worker = [];
            const pool = await page.$$("div.r-ent");
            pool.forEach(element => {
                worker.push(element.$eval("a", node=>node.href).then(result=>{
                    cache.push(result);
                }))
            })
            await Promise.all(worker);
            //console.log(cache);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            return cache;;
        }

    }
    for (const element of [...Array(page_limit).keys()]) {
        results.push(...await work(`https://www.ptt.cc/bbs/Beauty/index${element+1}.html`));
    }
    console.log(results);
    await browser.close();
    const json = {
        data:results
    }
    fs.writeFileSync("./albums/ptt.json" , JSON.stringify(json) , "utf8");
    console.log("ptt completed");
    return 0;
}


main(page_limit);


