import { setUser, readConfig } from "src/config";
import { getUserByName, createUser, getUsers } from "../lib/db/queries/users";


export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Invalid Usage: login <userName>");
    }
    const userName = args[0];
    const dbUser = await getUserByName(userName);
    if (!dbUser) { throw new Error(`User with name: ${userName} does NOT EXIST`); };
    setUser(userName);
    console.log("login completed successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`Invalid Usage: ${cmdName} <first name>`);
    }
    const fName = args[0];
    const dbUser = await getUserByName(fName);
    if (dbUser) {
        throw new Error(`User with name ${fName} already Exists`);
    }
    const newUser = await createUser(fName);
    setUser(fName);
    console.log("user registered successfully!");
    console.log(newUser);
}
export async function handlerListUsers(cmdName: string, ...args: string[]) {
    const registeredUsers = await getUsers();
    const currentUser = readConfig().currentUserName;
    for (const user of registeredUsers.keys()) {
        if (currentUser === registeredUsers[user].name) {
            registeredUsers[user].name += " (current)";
        }
        console.log(registeredUsers[user].name);
    }
}
