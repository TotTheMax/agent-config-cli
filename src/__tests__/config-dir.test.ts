import { describe, it, expect } from "vitest";
import { getConfigDir } from "../utils/config-dir.js";
import path from "node:path";
import os from "node:os";

describe("getConfigDir", () => {
  it("should return default path without customDir", () => {
    const result = getConfigDir("opencode");
    expect(result).toBe(path.join(os.homedir(), ".config", "team-agent-config", "opencode"));
  });

  it("should return custom path directly when customDir is provided", () => {
    const result = getConfigDir("opencode", "~/my-configs");
    expect(result).toBe(path.resolve("~/my-configs"));
  });

  it("should resolve relative path to absolute", () => {
    const result = getConfigDir("opencode", "./local-configs");
    expect(result).toBe(path.resolve("./local-configs"));
  });

  it("should not append agent name to custom path", () => {
    const result = getConfigDir("opencode", "/custom/dir");
    expect(result).toBe("/custom/dir");
    expect(result).not.toContain("opencode");
  });

  it("should append agent name to default path", () => {
    const result = getConfigDir("opencode");
    expect(result).toContain("opencode");
  });
});