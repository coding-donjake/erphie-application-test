"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importStar(require("path"));
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
electron_1.ipcMain.handle("save-file", async (_event, defaultContent = "") => {
    const { canceled, filePath } = (await electron_1.dialog.showSaveDialog({
        title: "Save file",
        defaultPath: "untitled",
    }));
    if (canceled || !filePath) {
        return { success: false, canceled: true };
    }
    try {
        fs_1.default.writeFileSync(filePath, defaultContent);
        return { success: true, path: filePath };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle("save-folder", async (_event, folderName) => {
    try {
        const { canceled, filePaths } = (await electron_1.dialog.showOpenDialog({
            title: "Select location to create folder",
            properties: ["openDirectory", "createDirectory"],
        }));
        if (canceled || filePaths.length === 0) {
            return { success: false, cancelled: true };
        }
        const selectedPath = filePaths[0];
        const folderPath = path_1.default.join(selectedPath, folderName);
        if (fs_1.default.existsSync(folderPath))
            return { success: false, error: "Folder already exists." };
        fs_1.default.mkdirSync(folderPath, { recursive: true });
        return { success: true, path: folderPath };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle("select-file", async () => {
    const { canceled, filePaths } = (await electron_1.dialog.showOpenDialog({
        title: "Select file",
        properties: ["openFile"],
    }));
    return canceled ? undefined : filePaths;
});
electron_1.ipcMain.handle("select-folder", async () => {
    const { canceled, filePaths } = (await electron_1.dialog.showOpenDialog({
        title: "Select folder",
        properties: ["openDirectory"],
    }));
    return canceled ? undefined : filePaths;
});
electron_1.app.whenReady().then(createWindow);
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
