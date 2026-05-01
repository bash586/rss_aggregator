import { UserCommandHandler, CommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
        // check if user is logged in
        const userName = readConfig().currentUserName;
        if (!userName) {
            throw new Error(`No users found! please register to proceed...`);
        }
        const user = await getUserByName(userName);
        if (!user) {
            throw new Error(`User ${userName} not found`);
        }
        //execute handler
        await handler(cmdName, user, ...args);
    };
}