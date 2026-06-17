import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { setEnvVar, findExistingBlock } from "../shell/env-writer.js";
import { getMarkerStart, getMarkerEnd, MARKER_START, MARKER_END } from "../shell/profile.js";

describe("Agent-specific marker format", () => {
  let tmpHome: string;
  let originalHome: string;
  let originalShell: string;

  beforeEach(async () => {
    tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), "test-home-"));
    originalHome = process.env.HOME!;
    originalShell = process.env.SHELL!;
    process.env.HOME = tmpHome;
    process.env.SHELL = "/bin/bash";
  });

  afterEach(async () => {
    process.env.HOME = originalHome;
    process.env.SHELL = originalShell;
    await fs.rm(tmpHome, { recursive: true, force: true });
  });

  it("should write agent-specific marker for opencode", async () => {
    await setEnvVar("OPENCODE_CONFIG_DIR", "/test/path", "opencode");
    const profilePath = path.join(tmpHome, ".bashrc");
    const content = await fs.readFile(profilePath, "utf-8");
    expect(content).toContain("# >>> agent-config-cli:opencode >>>");
    expect(content).toContain("# <<< agent-config-cli:opencode <<<");
    expect(content).toContain('export OPENCODE_CONFIG_DIR="/test/path"');
  });

  it("should independently manage markers for different agents", async () => {
    await setEnvVar("OPENCODE_CONFIG_DIR", "/path/opencode", "opencode");
    await setEnvVar("TRAE_CONFIG_DIR", "/path/trae", "trae");

    const profilePath = path.join(tmpHome, ".bashrc");
    const content = await fs.readFile(profilePath, "utf-8");

    expect(content).toContain("# >>> agent-config-cli:opencode >>>");
    expect(content).toContain("# <<< agent-config-cli:opencode <<<");
    expect(content).toContain("# >>> agent-config-cli:trae >>>");
    expect(content).toContain("# <<< agent-config-cli:trae <<<");
    expect(content).toContain('export OPENCODE_CONFIG_DIR="/path/opencode"');
    expect(content).toContain('export TRAE_CONFIG_DIR="/path/trae"');
  });

  it("should replace only the target agent's block", async () => {
    await setEnvVar("OPENCODE_CONFIG_DIR", "/old/path", "opencode");
    await setEnvVar("TRAE_CONFIG_DIR", "/old/trae", "trae");

    await setEnvVar("OPENCODE_CONFIG_DIR", "/new/path", "opencode");

    const profilePath = path.join(tmpHome, ".bashrc");
    const content = await fs.readFile(profilePath, "utf-8");

    expect(content).toContain('export OPENCODE_CONFIG_DIR="/new/path"');
    expect(content).not.toContain("/old/path");
    expect(content).toContain('export TRAE_CONFIG_DIR="/old/trae"');
  });

  it("should migrate old format marker to new agent-specific format", async () => {
    const profilePath = path.join(tmpHome, ".bashrc");
    await fs.mkdir(path.dirname(profilePath), { recursive: true });
    const oldContent = `# some stuff\n${MARKER_START}\nexport OPENCODE_CONFIG_DIR="/old/default"\n${MARKER_END}\n# more stuff\n`;
    await fs.writeFile(profilePath, oldContent);

    await setEnvVar("OPENCODE_CONFIG_DIR", "/new/path", "opencode");

    const content = await fs.readFile(profilePath, "utf-8");
    expect(content).toContain("# >>> agent-config-cli:opencode >>>");
    expect(content).toContain("# <<< agent-config-cli:opencode <<<");
    expect(content).not.toContain(MARKER_START);
    expect(content).not.toContain(MARKER_END);
    expect(content).toContain("# some stuff");
    expect(content).toContain("# more stuff");
  });

  it("should write old format marker when agentName is not provided", async () => {
    await setEnvVar("OPENCODE_CONFIG_DIR", "/default/path");
    const profilePath = path.join(tmpHome, ".bashrc");
    const content = await fs.readFile(profilePath, "utf-8");
    expect(content).toContain(MARKER_START);
    expect(content).toContain(MARKER_END);
  });
});

describe("findExistingBlock", () => {
  it("should find agent-specific marker", () => {
    const content = `# >>> agent-config-cli:opencode >>>\nexport X="1"\n# <<< agent-config-cli:opencode <<<`;
    const block = findExistingBlock(content, "opencode");
    expect(block).not.toBeNull();
    expect(block!.oldMarkerStart).toBe("# >>> agent-config-cli:opencode >>>");
  });

  it("should find old format marker as fallback for agent-specific search", () => {
    const content = `# >>> agent-config-cli >>>\nexport X="1"\n# <<< agent-config-cli <<<`;
    const block = findExistingBlock(content, "opencode");
    expect(block).not.toBeNull();
    expect(block!.oldMarkerStart).toBe(MARKER_START);
  });

  it("should return null when no marker found", () => {
    const content = "# just some content\n";
    const block = findExistingBlock(content, "opencode");
    expect(block).toBeNull();
  });
});