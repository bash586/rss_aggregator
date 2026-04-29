import { db } from "./src/lib/db";
import { getFeedFollowsForUser } from "./src/lib/db/queries/feedFollows";

async function main() {
    try {
        const res = await getFeedFollowsForUser("00000000-0000-0000-0000-000000000000");
        console.log("Success", res);
    } catch(e) {
        console.error("Error:", e);
    }
}
main();
