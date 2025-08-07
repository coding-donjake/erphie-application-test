"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const dialog_1 = require("./lib/dialog");
const recording_1 = require("./lib/recording");
const isDev = !electron_1.app.isPackaged && process.env.NODE_ENV !== "production";
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.maximize();
    if (isDev) {
        win.loadURL("http://localhost:5173");
    }
    else {
        const indexPath = (0, path_1.join)(__dirname, "react/index.html");
        win.loadFile(indexPath);
    }
};
electron_1.ipcMain.handle("record", recording_1.record);
electron_1.ipcMain.handle("save-file", dialog_1.saveFileDialog);
electron_1.ipcMain.handle("save-folder", dialog_1.saveFolderDialog);
electron_1.ipcMain.handle("select-file", dialog_1.selectFileDialog);
electron_1.ipcMain.handle("select-folder", dialog_1.selectFolderDialog);
electron_1.app.whenReady().then(createWindow);
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
