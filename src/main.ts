import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { join } from "path";

const isDev = !app.isPackaged && process.env.NODE_ENV !== "production";

const createWindow = () => {
  const win = new BrowserWindow({
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

  win.maximize();

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    const indexPath = join(__dirname, "react/index.html");
    win.loadFile(indexPath);
  }
};

ipcMain.handle("select-folder", () => {
  const result = dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  return result;
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
