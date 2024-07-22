import { Vault } from "obsidian";

export async function createTodo(vault: Vault, details: string) {
    console.log("Creating a new to-do item.");

    const fileExists = await pluginFileExists(vault);
    console.log(`Plugin file exists ${fileExists}`);

    if (!fileExists) {
        console.log("Creating new state file");
        vault.create(getFilename(vault), "dummy");
    }
}

function getFilename(vault: Vault) {
    return `${vault.configDir}/test.json`;
}

async function pluginFileExists(vault: Vault) {
    const result = await vault.adapter.stat(getFilename(vault));
    return result != null;
}
