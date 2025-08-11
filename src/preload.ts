import { contextBridge, ipcRenderer } from "electron";
import { RecordOptions } from "./lib/types";

contextBridge.exposeInMainWorld("electronAPI", {
  installPlaywrightBrowser: (browser: "chromium" | "firefox" | "webkit") =>
    ipcRenderer.invoke("install-playwright-browser", browser),
  isK6Installed: () => ipcRenderer.invoke("is-k6-installed"),
  isNodeJSInstalled: () => ipcRenderer.invoke("is-nodejs-installed"),
  isPlaywrightBrowserInstalled: (browser: "chromium" | "firefox" | "webkit") =>
    ipcRenderer.invoke("is-playwright-browser-installed", browser),
  record: (options: RecordOptions) => ipcRenderer.invoke("record", options),
  saveFile: () => ipcRenderer.invoke("save-file"),
  saveFolder: () => ipcRenderer.invoke("save-folder"),
  selectFile: () => ipcRenderer.invoke("select-file"),
  selectFolder: () => ipcRenderer.invoke("select-folder"),

  onLogMessage: (callback: (message: string) => void) => {
    const listener = (_: unknown, message: string) => callback(message);
    ipcRenderer.on("log-message", listener);
    return () => {
      ipcRenderer.removeListener("log-message", listener);
    };
  },
});
