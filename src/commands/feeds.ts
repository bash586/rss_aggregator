import { fetchFeed } from "../rss";
import { feedFollows, feeds, users } from "../lib/db/schema";
import { getUserById, getUserByName } from "src/lib/db/queries/users";
import { readConfig } from "src/config";
import { addFeed, getFeedByUrl, getFeeds } from "src/lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowById, getFeedFollowsForUser } from "src/lib/db/queries/feedFollows";

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;
export type FeedFollow = {
    id: string;
    updatedAt: Date | null;
    createdAt: Date | null;
    userName: string;
    feedName: string | null;
}
export async function handlerPrintFeed() {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(feed);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`Invalid Usage: ${cmdName} <name> <url>`);
    }

    const feedName = args[0];
    const feedUrl = args[1];
    const user = await getUserByName(
        readConfig().currentUserName
    );

    const feed: Feed = await addFeed(feedName, feedUrl, user.id);
    await createFeedFollow(user.id, feed.id);
    printFeed(feed, user.name);
}

// export async function handlerListFeeds(cmdName: string, ...args: string[]) {
//     const feeds = await getFeeds();
//     if (feeds.length === 0) {
//         console.log("you have no feeds to be viewed");
//         return;
//     }
//     for (const feed of feeds) {
//         printFeed(feed);
//         console.log("-----------------------");
//     }
// }

export async function handlerAddFollow(cmdName: string, ...args: string[]) {
    if (args.length < 1) throw new Error(`Invalid Usage: ${cmdName} <feed url>`);
    const feedUrl = args[0];
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) throw new Error("feed is NOT found");

    const userName = readConfig().currentUserName;
    const user = await getUserByName(userName);
    if (!user) throw new Error("user is NOT found");

    const newFollowId = await createFeedFollow(user.id, feed.id);
    const followDetails = await getFeedFollowById(newFollowId);
    console.log(followDetails);
}

export async function handlerGetUserFollows() {
    const userName = readConfig().currentUserName;
    const user = await getUserByName(userName);
    if (!user) throw new Error("user is NOT found");

    const userFollows = await getFeedFollowsForUser(user.id);
    console.log(userFollows);
    console.log(`* user:           ${userName}`);
    for (const follow of userFollows) {
        printFeedFollow(follow);
        console.log("-----------------------");
    }
}

function printFeed(feed: Feed, userName: string) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* user:          ${userName}`);
}

function printFeedFollow(follow: FeedFollow) {
    console.log(`* feed:             ${follow.feedName}`);
    console.log(`* Created At:       ${follow.createdAt}`);
    console.log(`* Updated At:       ${follow.updatedAt}`);
    console.log(`* Follow ID:        ${follow.id}`);
}