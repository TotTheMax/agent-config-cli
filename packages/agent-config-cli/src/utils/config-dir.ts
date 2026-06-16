import path from "node:path";
import os from "node:os";

export function getConfigDir(agentName: string, customDir?: string): string {
  if (customDir) {
    return path.resolve(customDir);
  }
  return path.join(os.homedir(), ".config", "team-agent-config", agentName);
}