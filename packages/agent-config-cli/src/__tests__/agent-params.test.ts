import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

vi.mock("../utils/git.js", () => ({
  cloneRepo: vi.fn().mockResolvedValue("/tmp/mock-clone"),
  cleanupDir: vi.fn(),
}));

describe("Setup command with -a and --config-dir", () => {
  it("should reject --config-dir without -a", async () => {
    const { setupCommand } = await import("../commands/setup.js");
    await setupCommand.parseAsync(["--repo", "https://test.git", "--config-dir", "~/custom"], { from: "user" });
    expect(process.exitCode).toBe(1);
    process.exitCode = 0;
  });

  it("should reject invalid agent name", async () => {
    const { setupCommand } = await import("../commands/setup.js");
    await setupCommand.parseAsync(["--repo", "https://test.git", "-a", "nonexistent"], { from: "user" });
    expect(process.exitCode).toBe(1);
    process.exitCode = 0;
  });

  it("should accept -a opencode", async () => {
    const { setupCommand } = await import("../commands/setup.js");
    const originalHome = process.env.HOME;
    const tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), "test-home-"));
    process.env.HOME = tmpHome;

    await setupCommand.parseAsync(["--repo", "https://test.git", "-a", "opencode"], { from: "user" });

    process.env.HOME = originalHome;
    await fs.rm(tmpHome, { recursive: true, force: true });
  });
});

describe("Update command with -a and --config-dir", () => {
  it("should reject --config-dir without -a", async () => {
    const { updateCommand } = await import("../commands/update.js");
    await updateCommand.parseAsync(["--repo", "https://test.git", "--config-dir", "~/custom"], { from: "user" });
    expect(process.exitCode).toBe(1);
    process.exitCode = 0;
  });

  it("should reject invalid agent name", async () => {
    const { updateCommand } = await import("../commands/update.js");
    await updateCommand.parseAsync(["--repo", "https://test.git", "-a", "nonexistent"], { from: "user" });
    expect(process.exitCode).toBe(1);
    process.exitCode = 0;
  });
});