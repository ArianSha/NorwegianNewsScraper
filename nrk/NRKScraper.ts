import {Page} from "puppeteer"
import {NRKArticle} from "./NRKArticle"
import {article} from "../article"

export class NRKScraper {

    page: Page

    constructor(page: Page) {
        this.page = page
    }

    public async getDescription(): Promise<article[]> {
        await this.pageConfig()

        const articlesDescription: article[] = []
        const frontPage = await this.page.$("section.kur-floor:nth-child(3) a")

        if (frontPage == undefined || frontPage == null) {
            console.log("error")
            return articlesDescription
        }

        if ((await(await frontPage?.getProperty("hidden"))?.jsonValue() as string) != "false") {

            try {
                const description = await new NRKArticle(frontPage).getDescription()

                if (description != null) {
                    articlesDescription.push(description)
                }
            }
            catch (e: any) {
                console.log(e)
                console.log("error reading article")
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
        await this.page.goto("https://www.nrk.no/"), {
        waitUntil: "networkidle0",
        }
    }
}
