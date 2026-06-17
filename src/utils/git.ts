import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { simpleGit } from "simple-git";

export async function cloneRepo(repoUrl: string): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "agent-config-"));
  const git = simpleGit();
  await git.clone(repoUrl, tmpDir);
  return tmpDir;
}

export async function cleanupDir(dir: string): Promise<void> {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    console.warn(`Warning: Failed to clean up temporary directory ${dir}`);
  }
}