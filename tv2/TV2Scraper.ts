import {Page} from "puppeteer"
import {TV2Article} from "./TV2Article"
import {article} from "../article"

export class TV2Scraper {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    public async getDescription(): Promise<article[]> {
        await this.pageConfig()

        const articlesDescription: article[] = []
        const articles = await this.page.$$(".two-columns__main > div:nth-child(1) article")

        if (articles == undefined || articles == null) {
            console.log("error")
            return articlesDescription
        }

        for (let i = 0; i < articles.length; i++) {
            if ((await(await articles[i]?.getProperty("hidden"))?.jsonValue() as string) != "false") {

                try {
                    const description = await new TV2Article(articles[i]).getDescription()
                    if (description != null) {
                        articlesDescription.push(description)
                    }
                }
                catch (e: any) {
                    console.log(e)
                    console.log("error reading article")
                }
            }
        }
        return articlesDescription
    }


    private async pageConfig() {
        await this.page.setRequestInterception(true)
        this.page.on("request", (req: any) => {

            if (req.resourceType() === "image" || req.resourceType() == "stylesheet" || req.resourceType() == "font") {
                req.abort()
            }
            else {
                req.continue()
            }
          })
        await this.page.goto("https://www.tv2.no/"), {
        waitUntil: "networkidle2",
        }
    }
}
