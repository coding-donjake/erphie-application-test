import { execSync } from "child_process";

export const isK6Installed = (): boolean => {
  try {
    execSync("k6 version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
};

export const isNodeJSInstalled = (): boolean => {
  try {
    execSync("node -v", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
};
