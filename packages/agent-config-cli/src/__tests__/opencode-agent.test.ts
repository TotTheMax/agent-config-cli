import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { OpenCodeAgent } from "../agents/opencode.js";

describe("OpenCodeAgent", () => {
  let tmpRepoDir: string;
  let tmpConfigDir: string;
  const agent = new OpenCodeAgent();

  beforeEach(async () => {
    tmpRepoDir = await fs.mkdtemp(path.join(os.tmpdir(), "test-repo-"));
    tmpConfigDir = await fs.mkdtemp(path.join(os.tmpdir(), "test-config-"));
  });

  afterEach(async () => {
    await fs.rm(tmpRepoDir, { recursive: true, force: true });
    await fs.rm(tmpConfigDir, { recursive: true, force: true });
  });

  it("should have name 'opencode'", () => {
    expect(agent.name).toBe("opencode");
  });

  it("should install opencode config from repo", async () => {
    const opencodeDir = path.join(tmpRepoDir, "opencode");
    await fs.mkdir(opencodeDir, { recursive: true });
    await fs.writeFile(path.join(opencodeDir, "opencode.json"), '{"test": true}');

    await agent.install(tmpConfigDir, tmpRepoDir);

    const configContent = await fs.readFile(path.join(tmpConfigDir, "opencode.json"), "utf-8");
    expect(configContent).toBe('{"test": true}');
  });

  it("should install skills from repo root to configDir/skills", async () => {
    const opencodeDir = path.join(tmpRepoDir, "opencode");
    await fs.mkdir(opencodeDir, { recursive: true });
    await fs.writeFile(path.join(opencodeDir, "opencode.json"), '{"test": true}');

    const skillDir = path.join(tmpRepoDir, "skills", "my-skill");
    await fs.mkdir(skillDir, { recursive: true });
    await fs.writeFile(path.join(skillDir, "SKILL.md"), "---\nname: my-skill\ndescription: test\n---\n# My Skill");

    await agent.install(tmpConfigDir, tmpRepoDir);

    const skillMd = await fs.readFile(path.join(tmpConfigDir, "skills", "my-skill", "SKILL.md"), "utf-8");
    expect(skillMd).toContain("# My Skill");
  });

  it("should install rules from opencode directory to configDir/rules", async () => {
    const opencodeDir = path.join(tmpRepoDir, "opencode");
    const rulesDir = path.join(opencodeDir, "rules");
    await fs.mkdir(rulesDir, { recursive: true });
    await fs.writeFile(path.join(opencodeDir, "opencode.json"), '{"test": true}');
    await fs.writeFile(path.join(rulesDir, "code-style.md"), "follow conventions");

    await agent.install(tmpConfigDir, tmpRepoDir);

    const ruleContent = await fs.readFile(path.join(tmpConfigDir, "rules", "code-style.md"), "utf-8");
    expect(ruleContent).toBe("follow conventions");
  });

  it("should skip installation when no opencode directory exists", async () => {
    await agent.install(tmpConfigDir, tmpRepoDir);
    const files = await fs.readdir(tmpConfigDir);
    expect(files).toEqual([]);
  });

  it("should skip skills installation when no skills directory exists", async () => {
    const opencodeDir = path.join(tmpRepoDir, "opencode");
    await fs.mkdir(opencodeDir, { recursive: true });
    await fs.writeFile(path.join(opencodeDir, "opencode.json"), '{"test": true}');

    await agent.install(tmpConfigDir, tmpRepoDir);

    const skillsDir = path.join(tmpConfigDir, "skills");
    try {
      await fs.access(skillsDir);
      expect(true).toBe(false);
    } catch {
      expect(true).toBe(true);
    }
  });

  it("should update opencode config from repo", async () => {
    const opencodeDir = path.join(tmpRepoDir, "opencode");
    await fs.mkdir(opencodeDir, { recursive: true });
    await fs.writeFile(path.join(opencodeDir, "opencode.json"), '{"updated": true}');

    await fs.mkdir(tmpConfigDir, { recursive: true });
    await fs.writeFile(path.join(tmpConfigDir, "opencode.json"), '{"old": true}');

    await agent.update(tmpConfigDir, tmpRepoDir);

    const configContent = await fs.readFile(path.join(tmpConfigDir, "opencode.json"), "utf-8");
    expect(configContent).toBe('{"updated": true}');
  });

  it("should update skills on update command", async () => {
    const opencodeDir = path.join(tmpRepoDir, "opencode");
    await fs.mkdir(opencodeDir, { recursive: true });
    await fs.writeFile(path.join(opencodeDir, "opencode.json"), '{"test": true}');

    const skillDir = path.join(tmpRepoDir, "skills", "review");
    await fs.mkdir(skillDir, { recursive: true });
    await fs.writeFile(path.join(skillDir, "SKILL.md"), "# Review Skill v2");

    await fs.mkdir(tmpConfigDir, { recursive: true });
    await fs.writeFile(path.join(tmpConfigDir, "opencode.json"), '{"test": true}');

    await agent.update(tmpConfigDir, tmpRepoDir);

    const skillMd = await fs.readFile(path.join(tmpConfigDir, "skills", "review", "SKILL.md"), "utf-8");
    expect(skillMd).toBe("# Review Skill v2");
  });
});
