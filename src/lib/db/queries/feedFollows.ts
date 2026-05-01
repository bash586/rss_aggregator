import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, users, feeds } from "../schema";
import { getFeedByUrl } from "./feeds";


export async function getFeedFollowsForUser(userId: string) {
    return await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userName: users.name,
            feedName: feeds.name
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userId));
}

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFollow] = await db.insert(feedFollows)
        .values({
            userId: userId, feedId: feedId
        })
        .returning({ id: feedFollows.id });
    return newFollow.id;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
    await db.delete(feedFollows)
        .where(and(
            eq(feedFollows.userId, userId),
            eq(feedFollows.feedId, feedId)
        ));
}

export async function getFeedFollowById(followId: string) {
    const [followDetails] = await db.select({
        feedFollowId: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userName: users.name,
        feedName: feeds.name
    }).from(feedFollows)
        .where(eq(feedFollows.id, followId))
        .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
        .innerJoin(users, eq(feedFollows.userId, users.id));

    return followDetails;
}
