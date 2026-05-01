import { resetFeeds } from "src/lib/db/queries/feeds";
import { resetUsers } from "src/lib/db/queries/users";


export async function handlerReset(cmdName: string, ...args: string[]) {
    await resetUsers();
    await resetFeeds();
    console.log("users table has been reset successfully.");
}
