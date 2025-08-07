import { contextBridge, ipcRenderer } from "electron";
import { RecordOptions } from "./lib/types";

contextBridge.exposeInMainWorld("electronAPI", {
  record: (options: RecordOptions) => ipcRenderer.invoke("record", options),
  saveFile: () => ipcRenderer.invoke("save-file"),
  saveFolder: () => ipcRenderer.invoke("save-folder"),
  selectFile: () => ipcRenderer.invoke("select-file"),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
});
