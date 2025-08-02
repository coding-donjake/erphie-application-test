import { app, BrowserWindow, ipcMain, dialog } from "electron";
import fs from "fs";
import path, { join } from "path";

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

ipcMain.handle("save-file", async (_event, defaultContent = "") => {
  const { canceled, filePath } = (await dialog.showSaveDialog({
    title: "Save file",
    defaultPath: "untitled",
  })) as any;

  if (canceled || !filePath) {
    return { success: false, canceled: true };
  }

  try {
    fs.writeFileSync(filePath, defaultContent);
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle("save-folder", async (_event, folderName: string) => {
  try {
    const { canceled, filePaths } = (await dialog.showOpenDialog({
      title: "Select location to create folder",
      properties: ["openDirectory", "createDirectory"],
    })) as any;

    if (canceled || filePaths.length === 0) {
      return { success: false, cancelled: true };
    }

    const selectedPath = filePaths[0];
    const folderPath = path.join(selectedPath, folderName);

    if (fs.existsSync(folderPath))
      return { success: false, error: "Folder already exists." };

    fs.mkdirSync(folderPath, { recursive: true });
    return { success: true, path: folderPath };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle("select-file", async () => {
  const { canceled, filePaths } = (await dialog.showOpenDialog({
    title: "Select file",
    properties: ["openFile"],
  })) as any;

  return canceled ? undefined : filePaths;
});

ipcMain.handle("select-folder", async () => {
  const { canceled, filePaths } = (await dialog.showOpenDialog({
    title: "Select folder",
    properties: ["openDirectory"],
  })) as any;

  return canceled ? undefined : filePaths;
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
