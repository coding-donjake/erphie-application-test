export type ScriptConfiguration = {
  stages: Stage[];
  pacing: number;
};

export type Entry = {
  id: number;
  url: string;
  method: string;
  request: EntryRequest;
  response: ResponseRequest;
  subEntries: Entry[];
  extractions: Extraction[];
  thinkTime: number;
};

export type EntryRequest = {
  headers: Record<string, string> | undefined;
  body: string | null;
};

export type GlobalVariable = {
  name: string;
  value: any;
};

export type ResponseRequest = {
  headers: Record<string, string> | undefined;
  body: string | null;
};

export type ExtractedValue = {
  name: string;
  value: any;
};

export type Extraction = {
  name: string;
  path: string[];
  leftBoundary: string | null;
  rightBoundary: string | null;
};

export type Group = {
  name: string;
  entries: Entry[];
};

export type LogMessage = {
  type: "info" | "success" | "warning" | "error" | "default";
  message: string;
};

export type RecordOptions = {
  preferredBrowser?: "chromium" | "firefox" | "webkit";
  headless?: boolean;
  args?: string[];
};

export type Script = {
  nextID: number;
  globalVariables: GlobalVariable[];
  extractedValues: ExtractedValue[];
  groups?: Group[];
  configuration: ScriptConfiguration;
};

export type Stage = {
  duration: number;
  target: number;
};
