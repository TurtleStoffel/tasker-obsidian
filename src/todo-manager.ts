import { randomUUID } from "crypto";
import { TFile, Vault } from "obsidian";

const FILENAME = "test.json";

export interface TodoItem {
    details: string;
    path: string;
}

export async function createTodo(vault: Vault, file: TFile, details: string) {
    console.log("Creating a new to-do item.");

    const pluginFile = await getOrCreatePluginFile(vault);

    vault.process(pluginFile, (data) => {
        const parsedData = JSON.parse(data);
        const todoItem: TodoItem = {
            details,
            path: file.path,
        };
        parsedData[randomUUID()] = todoItem;
        return JSON.stringify(parsedData);
    });
}

export async function getTodoItemsForFile(file: TFile): Promise<TodoItem[]> {
    const vault = file.vault;
    const pluginFile = await getOrCreatePluginFile(vault);

    const content = await vault.read(pluginFile);
    const parsedContent = JSON.parse(content) as Record<string, TodoItem>;

    const results: TodoItem[] = [];
    Object.keys(parsedContent).forEach((key) => {
        const value = parsedContent[key];
        if (value?.path === file.path) {
            results.push(value);
        }
    });

    return results;
}

async function getOrCreatePluginFile(vault: Vault): Promise<TFile> {
    const file = vault.getFileByPath(FILENAME);

    if (file) {
        return file;
    } else {
        return vault.create(FILENAME, JSON.stringify({}));
    }
}
