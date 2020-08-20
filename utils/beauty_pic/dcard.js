const puppeteer = require("puppeteer");
const scroll = require("puppeteer-autoscroll-down");
const select = require("puppeteer-select");
const fs = require("fs");


const scroll_step = 100;
const scroll_delay = 100;

async function main() {
    const url = "https://www.dcard.tw/f/beauty";
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    try {
        const button = await select(page).getElement('button:contains(是，我已滿十八歲。)');
        await button.click();
    }
    catch (e) { }
    function work() {
        const elements = window.document.querySelectorAll(".sc-2xcoxb-1.jJTVSy");
        for(element of elements){
            console.log(element.src);
        }
    }
    const results = [];
    await page.on("console", message => {
        const text = (message.text());
        try {
            new URL(text);
            console.log(text);
            results.push(text);
        } catch (error) { }
    })
    await page.evaluate(work);
    process.on("exit", code => {
        const obj = {
            data: results
        };
        fs.writeFileSync("./images/dcard.json", JSON.stringify(obj), "utf8");
        console.log("dcard done!");
    });
    await scroll(page, scroll_step, scroll_delay, work);

    console.log(results);
    await browser.close();
    return 0;



}
main()