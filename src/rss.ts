import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    const resp = await fetch(feedURL, {
        headers: { "User-Agent": "gator" }
    });
    const feedXML = await resp.text();
    const parser = new XMLParser();
    const feed: RSSFeed = (parser.parse(feedXML))?.rss;
    console.log(feed.channel.item);
    if (!Object.hasOwn(feed, "channel")) {
        throw new Error("feed does not have channel field");
    }
    const channel = feed.channel;
    if (!isValidChannel(channel)) {
        throw new Error("Invalid Channel Format");
    }
    channel.item ??= [];
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];
    const extractedItems = [];
    for (const item of items) {
        if (!isValidChannelItem(item)) continue;
        extractedItems.push(item);
    }
    channel.item = extractedItems;
    return feed;
}

function isValidChannel(channel: RSSFeed["channel"]) {
    return (
        channel.description && typeof channel.description == "string"
        && channel.link && typeof channel.link == "string"
        && channel.title && typeof channel.title == "string"
    );
}

function isValidChannelItem(item: RSSItem) {
    return (
        item.description && typeof item.description == "string"
        && item.link && typeof item.link == "string"
        && item.title && typeof item.title == "string"
        && item.pubDate && typeof item.pubDate == "string"
    );
}