"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    record: (options) => electron_1.ipcRenderer.invoke("record", options),
    saveFile: () => electron_1.ipcRenderer.invoke("save-file"),
    saveFolder: () => electron_1.ipcRenderer.invoke("save-folder"),
    selectFile: () => electron_1.ipcRenderer.invoke("select-file"),
    selectFolder: () => electron_1.ipcRenderer.invoke("select-folder"),
});
