import { contextBridge, ipcRenderer } from "electron";
import { RecordOptions } from "./lib/types";

contextBridge.exposeInMainWorld("electronAPI", {
  isK6Installed: () => ipcRenderer.invoke("is-k6-installed"),
  isNodeJSInstalled: () => ipcRenderer.invoke("is-nodejs-installed"),
  record: (options: RecordOptions) => ipcRenderer.invoke("record", options),
  saveFile: () => ipcRenderer.invoke("save-file"),
  saveFolder: () => ipcRenderer.invoke("save-folder"),
  selectFile: () => ipcRenderer.invoke("select-file"),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
});
