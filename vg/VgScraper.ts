import {Page} from "puppeteer"
import {VgArticle} from "./VgArticle"
import {article} from "../article"

export class VgScraper {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    public async getDescription(): Promise<article[]> {
        await this.pageConfig()

        const articlesDescription: article[] = []
        const articles = await this.page.$$("#hovedlopet > div:nth-child(1) article")

        if (articles == undefined || articles == null) {
            console.log("error")
            return articlesDescription
        }

        for (let i = 0; i < articles.length; i++) {
            if ((await(await articles[i]?.getProperty("hidden"))?.jsonValue() as string) != "false") {

                try {
                    const description = await new VgArticle(articles[i]).getDescription()
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
        await this.page.goto("https://www.vg.no/"), {
        waitUntil: "networkidle0",
        }
    }
}
