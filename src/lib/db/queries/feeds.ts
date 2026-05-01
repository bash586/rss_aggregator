import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";

export async function addFeed(name: string, url: string, userId: string) {
    const [newFeed] = await db.insert(feeds)
        .values({ "name": name, "url": url })
        .returning();

    return newFeed;
}


export async function getFeedByUrl(url: string) {
    const [feed] = await db.select().from(feeds)
        .where(eq(feeds.url, url));
    return feed;
}

export async function getFeeds() {
    return await db.select().from(feeds);
}

export async function resetFeeds() {
    await db.delete(feeds);
}
