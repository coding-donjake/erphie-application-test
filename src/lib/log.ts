import { BrowserWindow } from "electron";
import { LogMessage } from "./types";

export const sendLogMessage = (win: BrowserWindow | null, log: LogMessage) => {
  if (win && !win.isDestroyed()) {
    win.webContents.send("log-message", log);
  }
};
