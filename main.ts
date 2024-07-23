import {
    App,
    Editor,
    MarkdownView,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting,
} from "obsidian";
import { CreateTodoItemModal } from "src/create-todo-item-modal";

import { createTodo, getTodoItemsForFile } from "src/todo-manager";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: "default",
};

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

    async onload() {
        await this.loadSettings();

        this.registerEvent(
            this.app.workspace.on("editor-menu", (menu, _, view) => {
                menu.addItem((item) => {
                    item.setTitle("Add to-do item").onClick(async () => {
                        new CreateTodoItemModal(this.app, (result) => {
                            if (!view.file) {
                                return;
                            }

                            createTodo(this.app.vault, view.file, result);

                            new Notice(
                                `Created a new item to-do item. ${result}`
                            );
                        }).open();
                    });
                });
            })
        );

        this.registerEvent(
            this.app.workspace.on("file-open", async (file) => {
                if (!file) {
                    return;
                }
                const items = await getTodoItemsForFile(file);

                console.log(items);
            })
        );

        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon(
            "dice",
            "Sample Plugin",
            (evt: MouseEvent) => {
                // Called when the user clicks the icon.
                new Notice("This is a notice!");
            }
        );
        // Perform additional things with the ribbon
        ribbonIconEl.addClass("my-plugin-ribbon-class");

        // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
        const statusBarItemEl = this.addStatusBarItem();
        statusBarItemEl.setText("Status Bar Text");

        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: "open-sample-modal-simple",
            name: "Open sample modal (simple)",
            callback: () => {
                new CreateTodoItemModal(this.app, () => {}).open();
            },
        });
        // This adds an editor command that can perform some operation on the current editor instance
        this.addCommand({
            id: "sample-editor-command",
            name: "Sample editor command",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                console.log(editor.getSelection());
                editor.replaceSelection("Sample Editor Command");
            },
        });
        // This adds a complex command that can check whether the current state of the app allows execution of the command
        this.addCommand({
            id: "open-sample-modal-complex",
            name: "Open sample modal (complex)",
            checkCallback: (checking: boolean) => {
                // Conditions to check
                const markdownView =
                    this.app.workspace.getActiveViewOfType(MarkdownView);
                if (markdownView) {
                    // If checking is true, we're simply "checking" if the command can be run.
                    // If checking is false, then we want to actually perform the operation.
                    if (!checking) {
                        new CreateTodoItemModal(this.app, () => {}).open();
                    }

                    // This command will only show up in Command Palette when the check function returns true
                    return true;
                }
            },
        });

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SampleSettingTab(this.app, this));
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class SampleSettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName("Setting #1")
            .setDesc("It's a secret")
            .addText((text) =>
                text
                    .setPlaceholder("Enter your secret")
                    .setValue(this.plugin.settings.mySetting)
                    .onChange(async (value) => {
                        this.plugin.settings.mySetting = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}
