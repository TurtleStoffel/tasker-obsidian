import { randomUUID } from "crypto";
import { TFile, Vault } from "obsidian";

const FILENAME = "test.json";

export async function createTodo(vault: Vault, details: string) {
    console.log("Creating a new to-do item.");

    const pluginFile = await getOrCreatePluginFile(vault);

    vault.process(pluginFile, (data) => {
        const parsedData = JSON.parse(data);
        parsedData[randomUUID()] = details;
        return JSON.stringify(parsedData);
    });
}

async function getOrCreatePluginFile(vault: Vault): Promise<TFile> {
    const file = vault.getFileByPath(FILENAME);

    console.log(file);

    if (file) {
        return file;
    } else {
        return vault.create(FILENAME, JSON.stringify({}));
    }
}
