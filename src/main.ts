import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import {
  saveFileDialog,
  saveFolderDialog,
  selectFileDialog,
  selectFolderDialog,
} from "./lib/dialog";
import { record } from "./lib/recording";
import {
  isK6Installed,
  isNodeJSInstalled,
  isPlaywrightBrowserInstalled,
} from "./lib/checker";
import { installPlaywrightBrowser } from "./lib/install";

const isDev = !app.isPackaged && process.env.NODE_ENV !== "production";
export let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.maximize();

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    const indexPath = join(__dirname, "react/index.html");
    mainWindow.loadFile(indexPath);
  }
};

ipcMain.handle("install-playwright-browser", installPlaywrightBrowser);
ipcMain.handle("is-k6-installed", isK6Installed);
ipcMain.handle("is-nodejs-installed", isNodeJSInstalled);
ipcMain.handle("is-playwright-browser-installed", isPlaywrightBrowserInstalled);
ipcMain.handle("record", record);
ipcMain.handle("save-file", saveFileDialog);
ipcMain.handle("save-folder", saveFolderDialog);
ipcMain.handle("select-file", selectFileDialog);
ipcMain.handle("select-folder", selectFolderDialog);

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
