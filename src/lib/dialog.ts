import { dialog } from "electron";
import fs from "fs";
import path from "path";

export const saveFileDialog = async (
  _event: Electron.IpcMainInvokeEvent,
  defaultContent: string = ""
) => {
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
};

export const saveFolderDialog = async (
  _event: Electron.IpcMainInvokeEvent,
  folderName: string
) => {
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
};

export const selectFileDialog = async () => {
  const { canceled, filePaths } = (await dialog.showOpenDialog({
    title: "Select file",
    properties: ["openFile"],
  })) as any;

  return canceled ? undefined : filePaths;
};

export const selectFolderDialog = async () => {
  const { canceled, filePaths } = (await dialog.showOpenDialog({
    title: "Select folder",
    properties: ["openDirectory"],
  })) as any;

  return canceled ? undefined : filePaths;
};
