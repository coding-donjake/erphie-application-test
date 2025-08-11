import { execSync } from "child_process";
import { sendLogMessage } from "./log";
import { mainWindow } from "../main";

export const installPlaywrightBrowser = async (
  _event: Electron.IpcMainInvokeEvent,
  browser: "chromium" | "firefox" | "webkit"
): Promise<undefined> => {
  try {
    console.log(`installing ${browser}`);
    execSync(`npx playwright install ${browser}`, { stdio: "inherit" });
  } catch (error) {
    throw new Error(`Failed to install Playwright browser "${browser}".`);
  }
};
