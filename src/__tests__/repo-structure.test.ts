import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "../..");

describe("repo structure", () => {
  it("should have skills/setup-team-config/SKILL.md at repo root", async () => {
    const skillMd = path.join(REPO_ROOT, "skills", "setup-team-config", "SKILL.md");
    const content = await fs.readFile(skillMd, "utf-8");
    expect(content).toContain("name: setup-team-config");
    expect(content).toContain("description:");
  });

  it("should not have packages directory", async () => {
    const packagesDir = path.join(REPO_ROOT, "packages");
    try {
      await fs.access(packagesDir);
      expect(true).toBe(false);
    } catch {
      expect(true).toBe(true);
    }
  });

  it("should have metadata.internal: true in all openspec skills", async () => {
    const openspecSkills = [
      "openspec-apply-change",
      "openspec-archive-change",
      "openspec-explore",
      "openspec-propose",
    ];
    for (const skillName of openspecSkills) {
      const skillMd = path.join(
        REPO_ROOT,
        ".opencode",
        "skills",
        skillName,
        "SKILL.md"
      );
      const content = await fs.readFile(skillMd, "utf-8");
      expect(content).toContain("internal: true");
    }
  });
});
