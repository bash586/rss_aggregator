import { handlerAddFeed, handlerAddFollow, handlerGetUserFollows, handlerPrintFeed } from "./commands/feeds";
import { registerCommand, runCommand, type CommandsRegistry } from "./commands/commands";
import { handlerReset } from "./commands/reset";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users";
import { exit } from "node:process";

async function main() {
    const registry: CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerListUsers);
    registerCommand(registry, "agg", handlerPrintFeed);
    registerCommand(registry, "addfeed", handlerAddFeed);
    registerCommand(registry, "follow", handlerAddFollow);
    registerCommand(registry, "following", handlerGetUserFollows);
    // register new commands here...
    const inputParts = process.argv.slice(2);
    if (inputParts.length === 0 || !inputParts[0]) exit(1);
    const cmdName = inputParts[0];
    const args = inputParts.slice(1);
    try {
        await runCommand(registry, cmdName, ...args);
    } catch (e: any) {
        if (e instanceof Error) {
            console.log(e.message);
            process.exit(1);
        }
        console.log("somthing went WRONG... this is not OK!");
        process.exit(1);
    }
}


main().then(() => {
    process.exit(0);
}).catch((err) => {
    console.error(err);
    process.exit(1);
});