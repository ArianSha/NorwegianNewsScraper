/* eslint-disable @typescript-eslint/no-unused-vars */
import functions = require("firebase-functions")
import puppeteer = require("puppeteer")
import {E24Scraper} from "./e24/E24Scraper"
import {VgScraper} from "./vg/VgScraper"
import {TV2Scraper} from "./tv2/TV2Scraper"
import {NRKScraper} from "./nrk/NRKScraper"
import {updateFirestore} from "./UpdateFirestore"


exports.scrape = functions

.region("europe-west1")
.runWith({memory: "2GB"})
.pubsub.schedule("*/20 * * * *").onRun(async (context) => {

    const browser = await puppeteer.launch({
        args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        ],
        headless: true,
    })

    const vg = await browser.newPage()
    const e24 = await browser.newPage()
    const tv2 = await browser.newPage()
    const nrk = await browser.newPage()

    const vgArticles = await new VgScraper(vg).getDescription()
    const e24Articles = await new E24Scraper(e24).getDescription()
    const tv2Articles = await new TV2Scraper(tv2).getDescription()
    const nrkArticles = await new NRKScraper(nrk).getDescription()
    await browser.close()

    const mergeArticles:any = (a = [], ...b: any) =>
        b.length ? a.length ? [a[0], ...mergeArticles(...b, a.slice(1))] : mergeArticles(...b) : a

    const articles = mergeArticles(...[vgArticles, e24Articles, tv2Articles, nrkArticles])

    await updateFirestore(articles)
    return null
})

