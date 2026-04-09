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
    // const rl = createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //     prompt: "RSS >"
    // });

    // rl.on("line", (input) => {
    //     const inputParts = input.trim().split(/\s+/);
    //     if (inputParts.length === 0 || !inputParts[0]) {
    //         rl.prompt();
    //     }

    //     const cmdName = inputParts[0];
    //     const args = inputParts.slice(1);

    //     try {
    //         runCommand(registry, cmdName, ...args);
    //     } catch (err: any) {
    //         console.error(err.message);
    //     }
    //     rl.prompt();
    // });
    // console.log("Type something. Press Ctrl+C to exit.");
    // rl.prompt();
}


main().then(() => {
    process.exit(0);
}).catch((err) => {
    console.error(err);
    process.exit(1);
});