import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { setEnvVar } from "../shell/env-writer.js";
import {
  detectShell,
  detectShellFromParentProcess,
  validateShellType,
  getProfilePath,
  formatEnvExport,
  MARKER_START,
  MARKER_END,
  type ShellType,
} from "../shell/profile.js";

describe("Shell profile env var writing", () => {
  let tmpHome: string;
  let originalHome: string;
  let originalShell: string;

  beforeEach(async () => {
    tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), "test-home-"));
    originalHome = process.env.HOME!;
    originalShell = process.env.SHELL!;
    process.env.HOME = tmpHome;
  });

  afterEach(async () => {
    process.env.HOME = originalHome;
    process.env.SHELL = originalShell;
    await fs.rm(tmpHome, { recursive: true, force: true });
  });

  it("should write env var to .bashrc when bash explicitly specified", async () => {
    process.env.SHELL = "/bin/bash";
    const profilePath = getProfilePath("bash");
    await fs.mkdir(path.dirname(profilePath), { recursive: true });
    await fs.writeFile(profilePath, "# existing content\n");

    await setEnvVar("OPENCODE_CONFIG_DIR", "/test/path", "opencode", "bash");

    const content = await fs.readFile(profilePath, "utf-8");
    expect(content).toContain("# >>> agent-config-cli:opencode >>>");
    expect(content).toContain('export OPENCODE_CONFIG_DIR="/test/path"');
    expect(content).toContain("# <<< agent-config-cli:opencode <<<");
  });

  it("should write env var to .zshrc when zsh explicitly specified", async () => {
    process.env.SHELL = "/bin/bash";
    const profilePath = getProfilePath("zsh");
    await fs.mkdir(path.dirname(profilePath), { recursive: true });
    await fs.writeFile(profilePath, "# existing content\n");

    await setEnvVar("OPENCODE_CONFIG_DIR", "/test/path", "opencode", "zsh");

    const content = await fs.readFile(profilePath, "utf-8");
    expect(content).toContain("# >>> agent-config-cli:opencode >>>");
    expect(content).toContain('export OPENCODE_CONFIG_DIR="/test/path"');
    expect(content).toContain("# <<< agent-config-cli:opencode <<<");
  });

  it("should write env var to fish config when fish explicitly specified", async () => {
    process.env.SHELL = "/bin/bash";
    const profilePath = getProfilePath("fish");
    await fs.mkdir(path.dirname(profilePath), { recursive: true });
    await fs.writeFile(profilePath, "# existing content\n");

    await setEnvVar("OPENCODE_CONFIG_DIR", "/test/path", "opencode", "fish");

    const content = await fs.readFile(profilePath, "utf-8");
    expect(content).toContain("# >>> agent-config-cli:opencode >>>");
    expect(content).toContain('set -gx OPENCODE_CONFIG_DIR "/test/path"');
    expect(content).toContain("# <<< agent-config-cli:opencode <<<");
  });

  it("should write env var to both .bashrc and .zshrc when detection is ambiguous (SHELL=bash, no parent process)", async () => {
    process.env.SHELL = "/bin/bash";
    const bashrcPath = getProfilePath("bash");
    const zshrcPath = getProfilePath("zsh");
    await fs.mkdir(path.dirname(bashrcPath), { recursive: true });
    await fs.mkdir(path.dirname(zshrcPath), { recursive: true });
    await fs.writeFile(bashrcPath, "# existing bash content\n");
    await fs.writeFile(zshrcPath, "# existing zsh content\n");

    await setEnvVar("OPENCODE_CONFIG_DIR", "/test/path", "opencode");

    const bashContent = await fs.readFile(bashrcPath, "utf-8");
    const zshContent = await fs.readFile(zshrcPath, "utf-8");
    expect(bashContent).toContain("# >>> agent-config-cli:opencode >>>");
    expect(bashContent).toContain('export OPENCODE_CONFIG_DIR="/test/path"');
    expect(zshContent).toContain("# >>> agent-config-cli:opencode >>>");
    expect(zshContent).toContain('export OPENCODE_CONFIG_DIR="/test/path"');
  });
});

describe("Shell profile env var replacement", () => {
  let tmpHome: string;
  let originalHome: string;
  let originalShell: string;

  beforeEach(async () => {
    tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), "test-home-"));
    originalHome = process.env.HOME!;
    originalShell = process.env.SHELL!;
    process.env.HOME = tmpHome;
    process.env.SHELL = "/bin/zsh";
  });

  afterEach(async () => {
    process.env.HOME = originalHome;
    process.env.SHELL = originalShell;
    await fs.rm(tmpHome, { recursive: true, force: true });
  });

  it("should replace existing marker block instead of appending", async () => {
    const profilePath = getProfilePath("zsh");
    await fs.mkdir(path.dirname(profilePath), { recursive: true });
    const existingContent = `# existing content\n# >>> agent-config-cli:opencode >>>\nexport OPENCODE_CONFIG_DIR="/old/path"\n# <<< agent-config-cli:opencode <<<\n# more content\n`;
    await fs.writeFile(profilePath, existingContent);

    await setEnvVar("OPENCODE_CONFIG_DIR", "/new/path", "opencode", "zsh");

    const content = await fs.readFile(profilePath, "utf-8");
    expect(content).toContain('export OPENCODE_CONFIG_DIR="/new/path"');
    expect(content).not.toContain("/old/path");
    expect(content).toContain("# existing content");
    expect(content).toContain("# more content");
    const markerCount = (content.match(new RegExp("# >>> agent-config-cli:opencode >>>", "g")) || []).length;
    expect(markerCount).toBe(1);
  });
});

describe("Shell detection from parent process", () => {
  it("should return null when /proc is unavailable (mocked)", () => {
    const result = detectShellFromParentProcess();
    expect(result).toBeNull();
  });
});

describe("Shell detection (array return)", () => {
  it("should return single element when explicit shell is provided", () => {
    expect(detectShell("zsh")).toEqual(["zsh"]);
    expect(detectShell("bash")).toEqual(["bash"]);
    expect(detectShell("fish")).toEqual(["fish"]);
  });

  it("should return ['bash', 'zsh'] when SHELL=/bin/bash and parent process unavailable", () => {
    process.env.SHELL = "/bin/bash";
    const result = detectShell();
    expect(result).toEqual(["bash", "zsh"]);
  });

  it("should return ['zsh'] when SHELL=/bin/zsh", () => {
    process.env.SHELL = "/bin/zsh";
    const result = detectShell();
    expect(result).toEqual(["zsh"]);
  });

  it("should return ['fish'] when SHELL contains fish", () => {
    process.env.SHELL = "/usr/bin/fish";
    const result = detectShell();
    expect(result).toEqual(["fish"]);
  });

  it("should return ['bash', 'zsh'] when SHELL is empty", () => {
    process.env.SHELL = "";
    const result = detectShell();
    expect(result).toEqual(["bash", "zsh"]);
  });
});

describe("Shell type validation", () => {
  it("should accept valid shell types", () => {
    expect(validateShellType("bash")).toBe("bash");
    expect(validateShellType("zsh")).toBe("zsh");
    expect(validateShellType("fish")).toBe("fish");
  });

  it("should reject invalid shell types with error listing valid types", () => {
    expect(() => validateShellType("powershell")).toThrow("Invalid shell type 'powershell'. Valid types: bash, zsh, fish");
    expect(() => validateShellType("ksh")).toThrow("Invalid shell type 'ksh'. Valid types: bash, zsh, fish");
  });
});

describe("--shell flag override behavior", () => {
  it("should only write to specified shell when --shell flag overrides detection", async () => {
    let tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), "test-home-"));
    const originalHome = process.env.HOME!;
    const originalShell = process.env.SHELL!;
    process.env.HOME = tmpHome;
    process.env.SHELL = "/bin/bash";

    const zshrcPath = getProfilePath("zsh");
    const bashrcPath = getProfilePath("bash");
    await fs.mkdir(path.dirname(zshrcPath), { recursive: true });
    await fs.mkdir(path.dirname(bashrcPath), { recursive: true });
    await fs.writeFile(zshrcPath, "# zsh content\n");
    await fs.writeFile(bashrcPath, "# bash content\n");

    await setEnvVar("OPENCODE_CONFIG_DIR", "/test/path", "opencode", "zsh");

    const zshContent = await fs.readFile(zshrcPath, "utf-8");
    const bashContent = await fs.readFile(bashrcPath, "utf-8");
    expect(zshContent).toContain("OPENCODE_CONFIG_DIR");
    expect(bashContent).not.toContain("OPENCODE_CONFIG_DIR");

    process.env.HOME = originalHome;
    process.env.SHELL = originalShell;
    await fs.rm(tmpHome, { recursive: true, force: true });
  });
});

describe("Dual-write scenario", () => {
  it("should write env vars to both .bashrc and .zshrc when detection returns both shells", async () => {
    let tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), "test-home-"));
    const originalHome = process.env.HOME!;
    const originalShell = process.env.SHELL!;
    process.env.HOME = tmpHome;
    process.env.SHELL = "/bin/bash";

    const bashrcPath = getProfilePath("bash");
    const zshrcPath = getProfilePath("zsh");
    await fs.mkdir(path.dirname(bashrcPath), { recursive: true });
    await fs.mkdir(path.dirname(zshrcPath), { recursive: true });
    await fs.writeFile(bashrcPath, "# bash\n");
    await fs.writeFile(zshrcPath, "# zsh\n");

    await setEnvVar("OPENCODE_CONFIG_DIR", "/dual/path", "opencode");

    const bashContent = await fs.readFile(bashrcPath, "utf-8");
    const zshContent = await fs.readFile(zshrcPath, "utf-8");
    expect(bashContent).toContain("# >>> agent-config-cli:opencode >>>");
    expect(bashContent).toContain('export OPENCODE_CONFIG_DIR="/dual/path"');
    expect(zshContent).toContain("# >>> agent-config-cli:opencode >>>");
    expect(zshContent).toContain('export OPENCODE_CONFIG_DIR="/dual/path"');

    process.env.HOME = originalHome;
    process.env.SHELL = originalShell;
    await fs.rm(tmpHome, { recursive: true, force: true });
  });
});

describe("Env export formatting", () => {
  it("should format export for bash", () => {
    expect(formatEnvExport("bash", "FOO", "bar")).toBe('export FOO="bar"');
  });

  it("should format export for zsh", () => {
    expect(formatEnvExport("zsh", "FOO", "bar")).toBe('export FOO="bar"');
  });

  it("should format set -gx for fish", () => {
    expect(formatEnvExport("fish", "FOO", "bar")).toBe('set -gx FOO "bar"');
  });
});
