import fs from "node:fs";
import os from "node:os";
import path from "path";
export type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(username: string) {
    const oldConfig = readConfig();
    const newConfig = {
        dbUrl: oldConfig.dbUrl,
        currentUserName: username
    };
    writeConfig(newConfig);
}

export function readConfig() {
    const filePath = getConfigFilePath();
    const configText = fs.readFileSync(filePath, "utf-8");
    return validateConfig(JSON.parse(configText));
}

// helper functions
function writeConfig(cfg: Config) {
    const filePath = getConfigFilePath();
    const rawConfig = {
        "db_url": cfg.dbUrl,
        "current_user_name": cfg.currentUserName
    };
    fs.writeFileSync(filePath, JSON.stringify(rawConfig, null, 2), "utf-8");
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}
function validateConfig(rawConfig: any): Config {

    if (
        rawConfig !== null && typeof rawConfig === "object"
        && typeof rawConfig.db_url === 'string'
    ) {
        return {
            dbUrl: rawConfig.db_url,
            currentUserName: rawConfig.current_user_name
        };
    }
    throw new Error("Can not fetch Config!\n");
}