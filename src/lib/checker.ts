import { execSync } from "child_process";
import fs from "fs";
import { sendLogMessage } from "./log";
import { mainWindow } from "../main";

export const isK6Installed = async (): Promise<boolean> => {
  try {
    execSync("k6 version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
};

export const isNodeJSInstalled = async (): Promise<boolean> => {
  try {
    execSync("node -v", { stdio: "pipe" });
    sendLogMessage(mainWindow, {
      type: "success",
      message: "Node JS is installed.",
    });
    return true;
  } catch {
    sendLogMessage(mainWindow, {
      type: "error",
      message: "Node JS is not installed.",
    });
    return false;
  }
};

export const isPlaywrightBrowserInstalled = async (
  _event: Electron.IpcMainInvokeEvent,
  browser: "chromium" | "firefox" | "webkit"
): Promise<boolean> => {
  try {
    const executablePath = require("playwright").executablePath(browser);
    if (fs.existsSync(executablePath)) return true;
    else return false;
  } catch (error) {
    return false;
  }
};
