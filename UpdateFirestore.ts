import {Timestamp} from "firebase/firestore"
import {article} from "./article"
import {db} from "./Firebase"


export async function updateFirestore(articles: article[]) {

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i]

        await db.collection("articles").doc(article.id).set({
            timestamp: Timestamp.now().toDate(),
            url: article.url,
            image: article.image,
            headline: article.headline,
            source: article.source,
        })
    }
}
