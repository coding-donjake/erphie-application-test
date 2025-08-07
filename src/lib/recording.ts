import { chromium, firefox, webkit, Browser } from "playwright-core";
import * as path from "path";
import * as fs from "fs";
import { base64, utf8 } from "./content-type-encoding-list";
import { Entry, Group, RecordOptions, Script } from "./types";
import { transactionLabel } from "./global-variables";

const isPackaged = fs.existsSync(path.join(__dirname, "..", "browsers"));

export const getExecutablePath = (
  browser: "chromium" | "firefox" | "webkit"
): string | null => {
  const base = isPackaged
    ? path.join(__dirname, "..", "browsers")
    : path.join(__dirname, "..", "..", "src", "browsers");

  if (browser === "chromium")
    return path.join(base, "chromium-1181", "chrome-win", "chrome.exe");
  else if (browser === "firefox")
    return path.join(base, "firefox-1489", "firefox", "firefox.exe");
  else if (browser === "webkit")
    return path.join(base, "webkit-2191", "Playwright.exe");

  return null;
};

export const launchBrowser = async ({
  preferredBrowser = "chromium",
  headless = false,
  args = [],
}: RecordOptions): Promise<Browser> => {
  const executablePath = getExecutablePath(preferredBrowser);

  if (!executablePath || !fs.existsSync(executablePath)) {
    throw new Error(
      `Executable not found for ${preferredBrowser} at ${executablePath}`
    );
  }

  switch (preferredBrowser) {
    case "chromium":
      return await chromium.launch({ executablePath, headless, args });
    case "firefox":
      return await firefox.launch({ executablePath, headless, args });
    case "webkit":
      return await webkit.launch({ executablePath, headless, args });
    default:
      throw new Error(`Unsupported preferred browser: ${preferredBrowser}`);
  }
};

export const record = async (
  _event: Electron.IpcMainInvokeEvent,
  { preferredBrowser = "chromium", headless = false, args = [] }: RecordOptions
) => {
  const browser = await launchBrowser({ preferredBrowser, headless, args });
  const context = await browser.newContext({
    javaScriptEnabled: true,
    ignoreHTTPSErrors: true,
    viewport: null,
  });
  const page = await context.newPage();

  const groups: Group[] = [];
  let currentEntryID = 1;

  page.on("requestfinished", async (request) => {
    const requestHeaders = request.headers();
    const requestBody = request.postData();

    const response = await request.response();
    const responseHeaders = response?.headers();
    const responseBody = await response?.body();

    const contentType = responseHeaders
      ? responseHeaders["content-type"] || "unknown"
      : "unknown";

    const entry: Entry = {
      id: currentEntryID,
      url: request.url(),
      method: request.method(),
      request: {
        headers: requestHeaders,
        body: requestBody,
      },
      response: {
        headers: responseHeaders,
        body: null,
      },
      subEntries: [],
      extractions: [],
      thinkTime: 0,
    };

    if (utf8.includes(contentType)) {
      entry.response.body = responseBody?.toString("utf8") || null;
    } else if (base64.includes(contentType)) {
      entry.response.body = responseBody?.toString("base64") || null;
    }

    if (
      groups.length === 0 ||
      groups[groups.length - 1].name !== transactionLabel
    )
      groups.push({
        name: transactionLabel,
        entries: [entry],
      });
    else groups[groups.length - 1].entries.push(entry);

    currentEntryID++;
  });

  await new Promise<void>((resolve) => {
    page.on("close", () => {
      resolve();
    });
  });

  const script: Script = {
    nextID: currentEntryID,
    globalVariables: [],
    extractedValues: [],
    groups: groups,
    configuration: {
      stages: [],
      pacing: 0,
    },
  };

  return script;
};
