import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
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
) => {
  const localPath = path.join(
    process.cwd(),
    "node_modules",
    ".cache",
    "ms-playwright",
    browser
  );
  const globalPath = path.join(
    os.homedir(),
    ".cache",
    "ms-playwright",
    browser
  );

  const browserName = browser.charAt(0).toUpperCase() + browser.slice(1);

  if (fs.existsSync(localPath) || fs.existsSync(globalPath)) {
    sendLogMessage(mainWindow, {
      type: "success",
      message: `${browserName} is installed.`,
    });
    return true;
  } else {
    sendLogMessage(mainWindow, {
      type: "warning",
      message: `${browserName} is not installed.`,
    });
    return false;
  }
};
