import {ElementHandle} from "puppeteer"
import {article} from "../article"
import crypto = require("crypto")


export class NRKArticle {

  article: ElementHandle

  constructor(article: ElementHandle) {
    this.article = article
  }


  public async getDescription(): Promise<article|null> {

    const url = await this.getUrl()
    const headline = await this.getHeadline()
    if (headline == undefined || url == undefined) {
      return null
    }
    const image = await this.getImage()
    const id = crypto.createHash("md5").update(url).digest("hex")

    const article = {
        "url": url,
        "headline": headline,
        "image": image,
        "id": id,
        "source": "nrk",
    }
    return article
  }


  private async getUrl(): Promise<string> {

    const urlElement = this.article
    return await (await urlElement?.getProperty("href"))?.jsonValue() as string
  }


  private async getHeadline(): Promise<string> {

    const headlineElement = await this.article.$(".kur-room__title")
    return (await (await headlineElement?.getProperty("textContent"))?.jsonValue() as string).replace(/\s+/g, " ")
  }


  private async getImage(): Promise<string|null> {

    const imageElement = await this.article.$("a img")
    const imagePath = await (await imageElement?.getProperty("src"))?.jsonValue() as string

    if (imagePath == undefined) {
      return null
    }
    return imagePath
  }
}

