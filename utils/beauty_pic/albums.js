const puppeteer = require("puppeteer");
const scroll = require("puppeteer-autoscroll-down");
const fs = require("fs");

const sources = {
    gravure46: "https://www.facebook.com/pg/Gravure46/photos/?tab=albums&ref=page_internal",
    yoimachii: "https://www.facebook.com/pg/yoimachii/photos/?tab=albums&ref=page_internal",
    gravure48: "https://www.facebook.com/pg/48Gravure/photos/?tab=albums&ref=page_internal",
    idolempire: "https://www.facebook.com/pg/IdolEmpire/photos/?tab=albums&ref=page_internal",
    holygravure: "https://www.facebook.com/pg/HolyGravureEmpire/photos/?tab=albums&ref=page_internal"
}

const url = "";
const scroll_step = 100;
const scroll_delay = 250;

async function main(name, url) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    await scroll(page, scroll_step, scroll_delay);
    const content_container = await page.$("#content_container");
    const main_list = await content_container.$$("[role='presentation']");
    let link_list = [];
    let worker_list = [];
    main_list.forEach(element => {
        const worker = element.$eval("a", node => node.href)
            .then(result => {
                link_list.push(result);
            })
            .catch(error => {
                console.log(error);
            })
        worker_list.push(worker);
    })
    await Promise.all(worker_list);
    const json_obj = {
        data: link_list
    }
    const json = JSON.stringify(json_obj);
    fs.writeFileSync(`./albums/${name}.json`, json, "utf8");
    console.log(`${name} done!`);
    browser.close();

}

for (const [name, url] of Object.entries(sources)) {
    console.log(`${name} ${url}`);
    main(name, url);
}