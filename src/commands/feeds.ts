import { fetchFeed } from "../rss";
import { feedFollows, feeds, users } from "../lib/db/schema";
import { getUserById, getUserByName } from "src/lib/db/queries/users";
import { readConfig } from "src/config";
import { addFeed, getFeedByUrl, getFeeds } from "src/lib/db/queries/feeds";
import { createFeedFollow, deleteFeedFollow, getFeedFollowById, getFeedFollowsForUser } from "src/lib/db/queries/feedFollows";
import { User } from "./users";

export type Feed = typeof feeds.$inferSelect;
export type FeedFollow = {
    id: string;
    updatedAt: Date | null;
    createdAt: Date | null;
    userName: string;
    feedName: string | null;
};

export async function handlerPrintFeed() {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(feed);
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`Invalid Usage: ${cmdName} <name> <url>`);
    }

    const feedName = args[0];
    const feedUrl = args[1];

    const feed: Feed = await addFeed(feedName, feedUrl, user.id);
    await createFeedFollow(user.id, feed.id);
    printFeed(feed, user.name);
}

export async function handlerAddFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1) throw new Error(`Invalid Usage: ${cmdName} <feed url>`);
    const feedUrl = args[0];
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) throw new Error("feed is NOT found");

    const newFollowId = await createFeedFollow(user.id, feed.id);
    const followDetails = await getFeedFollowById(newFollowId);
    console.log(followDetails);
}

export async function handlerDeleteFollow(cmdName: string, user: User, feedUrl: string) {
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) {
        throw new Error("no feeds found with url: " + feedUrl);
    }
    await deleteFeedFollow(user.id, feed.id);
    console.log("unfollowed feed: " + feed.name);
}

export async function handlerGetUserFollows(cmdName: string, user: User, ...args: string[]) {

    const userFollows = await getFeedFollowsForUser(user.id);
    console.log(`Follows for user: ${user.name}`);
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