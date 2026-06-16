import { describe, it, expect, vi } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";

vi.mock("../utils/git.js", () => ({
  cloneRepo: vi.fn().mockRejectedValue(new Error("Clone failed")),
  cleanupDir: vi.fn(),
}));

describe("Setup command integration", () => {
  it("should exit with error on clone failure", async () => {
    const { setupCommand } = await import("../commands/setup.js");
    const originalExit = process.exitCode;
    await setupCommand.parseAsync(["--repo", "https://invalid-url.git"], { from: "user" });
    expect(process.exitCode).toBe(1);
    process.exitCode = originalExit ?? 0;
  });
});

describe("Update command integration", () => {
  it("should exit with error when no previous installation exists", async () => {
    const originalHome = process.env.HOME;
    const tmpHome = await fs.mkdtemp(os.tmpdir() + "/test-home-");
    process.env.HOME = tmpHome;

    const { updateCommand } = await import("../commands/update.js");
    await updateCommand.parseAsync(["--repo", "https://some-repo.git"], { from: "user" });

    expect(process.exitCode).toBe(1);
    process.env.HOME = originalHome;
    await fs.rm(tmpHome, { recursive: true, force: true });
    process.exitCode = 0;
  });
});