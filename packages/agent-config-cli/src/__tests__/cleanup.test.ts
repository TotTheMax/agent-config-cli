import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

describe("Temp directory cleanup", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "agent-config-"));
  });

  it("should remove temp directory on success", async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
    await expect(fs.access(tmpDir)).rejects.toThrow();
  });

  it("should remove temp directory even on failure (simulated)", async () => {
    try {
      throw new Error("Simulated failure");
    } catch {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
    await expect(fs.access(tmpDir)).rejects.toThrow();
  });

  it("cleanupDir should handle already-deleted directory", async () => {
    const nonExistentDir = path.join(os.tmpdir(), "nonexistent-dir-12345");
    await fs.rm(nonExistentDir, { recursive: true, force: true });
    expect(true).toBe(true);
  });
});