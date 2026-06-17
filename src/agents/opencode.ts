import path from "node:path";
import fs from "node:fs/promises";
import fse from "fs-extra";
import type { Agent } from "./types.js";

export class OpenCodeAgent implements Agent {
  name = "opencode";
  envVarName = "OPENCODE_CONFIG_DIR";

  detect(): boolean {
    return !!process.env.OPENCODE_CONFIG_DIR || true;
  }

  async install(configDir: string, repoDir: string): Promise<void> {
    const sourceDir = path.join(repoDir, "opencode");
    try {
      await fs.access(sourceDir);
    } catch {
      console.warn("Warning: No opencode/ directory found in config repo. Skipping opencode installation.");
      return;
    }
    await fse.copy(sourceDir, configDir, { overwrite: true });
    console.log(`Installed opencode config to ${configDir}`);

    await this.installSkills(configDir, repoDir);
  }

  async update(configDir: string, repoDir: string): Promise<void> {
    const sourceDir = path.join(repoDir, "opencode");
    try {
      await fs.access(sourceDir);
    } catch {
      console.warn("Warning: No opencode/ directory found in config repo. Skipping opencode update.");
      return;
    }
    await fse.copy(sourceDir, configDir, { overwrite: true });
    console.log(`Updated opencode config at ${configDir}`);

    await this.installSkills(configDir, repoDir);
  }

  private async installSkills(configDir: string, repoDir: string): Promise<void> {
    const skillsSourceDir = path.join(repoDir, "skills");
    try {
      await fs.access(skillsSourceDir);
    } catch {
      return;
    }

    const skillsTargetDir = path.join(configDir, "skills");
    await fse.copy(skillsSourceDir, skillsTargetDir, { overwrite: true });
    console.log(`Installed shared skills to ${skillsTargetDir}`);
  }
}
