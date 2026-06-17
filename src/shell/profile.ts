import path from "node:path";
import os from "node:os";
import fsSync from "node:fs";

export type ShellType = "bash" | "zsh" | "fish";

const VALID_SHELL_TYPES: ShellType[] = ["bash", "zsh", "fish"];

export function detectShellFromParentProcess(): ShellType | null {
  const ppid = process.ppid;
  if (ppid <= 0) return null;

  try {
    const comm = fsSync.readFileSync(`/proc/${ppid}/comm`, "utf-8").trim();
    if (comm.includes("zsh")) return "zsh";
    if (comm.includes("bash")) return "bash";
    if (comm.includes("fish")) return "fish";
    return null;
  } catch {
    return null;
  }
}

export function detectShell(explicitShell?: ShellType): ShellType[] {
  if (explicitShell) {
    return [explicitShell];
  }

  const parentShell = detectShellFromParentProcess();
  if (parentShell) {
    return [parentShell];
  }

  const shellPath = process.env.SHELL || "";
  if (shellPath.includes("fish")) return ["fish"];
  if (shellPath.includes("zsh")) return ["zsh"];
  if (shellPath.includes("bash")) return ["bash", "zsh"];
  return ["bash", "zsh"];
}

export function validateShellType(value: string): ShellType {
  if (!VALID_SHELL_TYPES.includes(value as ShellType)) {
    throw new Error(`Invalid shell type '${value}'. Valid types: ${VALID_SHELL_TYPES.join(", ")}`);
  }
  return value as ShellType;
}

export function getProfilePath(shellType: ShellType): string {
  switch (shellType) {
    case "fish":
      return path.join(os.homedir(), ".config", "fish", "config.fish");
    case "zsh":
      return path.join(os.homedir(), ".zshrc");
    case "bash":
      return path.join(os.homedir(), ".bashrc");
  }
}

export function formatEnvExport(shellType: ShellType, varName: string, value: string): string {
  switch (shellType) {
    case "fish":
      return `set -gx ${varName} "${value}"`;
    case "zsh":
    case "bash":
      return `export ${varName}="${value}"`;
  }
}

export function getMarkerStart(agentName?: string): string {
  if (agentName) {
    return `# >>> agent-config-cli:${agentName} >>>`;
  }
  return "# >>> agent-config-cli >>>";
}

export function getMarkerEnd(agentName?: string): string {
  if (agentName) {
    return `# <<< agent-config-cli:${agentName} <<<`;
  }
  return "# <<< agent-config-cli <<<";
}

export const MARKER_START = "# >>> agent-config-cli >>>";
export const MARKER_END = "# <<< agent-config-cli <<<";
export { VALID_SHELL_TYPES };
