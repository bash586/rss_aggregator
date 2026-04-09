
type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = {
    [name: string]: CommandHandler;
};

export function registerCommand(
    registry: CommandsRegistry, cmdName: string, handler: CommandHandler
) {
    registry[cmdName] = handler;
}

export async function runCommand(
    registry: CommandsRegistry, cmdName: string, ...args: string[]
) {
    const handler = registry[cmdName];
    await handler(cmdName, ...args);
}
