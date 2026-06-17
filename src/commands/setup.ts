import { Command } from "commander";
import { registry } from "../agents/registry.js";
import { OpenCodeAgent } from "../agents/opencode.js";
import { getConfigDir } from "../utils/config-dir.js";
import { setEnvVar } from "../shell/env-writer.js";
import { validateShellType, VALID_SHELL_TYPES, type ShellType } from "../shell/profile.js";
import { cloneRepo, cleanupDir } from "../utils/git.js";

registry.register(new OpenCodeAgent());

interface SetupOptions {
  repo: string;
  agent?: string;
  configDir?: string;
  shell?: string;
}

export const setupCommand = new Command("setup")
  .description("Setup team-shared coding agent configuration")
  .requiredOption("--repo <url>", "Git repository URL for team config (GitLab, GitHub, or any git server)")
  .option("-a, --agent <name>", "Target a specific agent (e.g., opencode)")
  .option("--config-dir <path>", "Custom config installation directory path")
  .option("--shell <type>", `Explicitly specify shell type (${VALID_SHELL_TYPES.join(", ")})`)
  .action(async (options: SetupOptions) => {
    const { repo: repoUrl, agent: agentName, configDir: customDir, shell: shellFlag } = options;

    if (customDir && !agentName) {
      console.error("Error: --config-dir requires -a to specify which agent. Different agents need different directories.");
      process.exitCode = 1;
      return;
    }

    if (agentName && !registry.has(agentName)) {
      console.error(`Error: Unknown agent '${agentName}'. Available agents: ${registry.list().map((a) => a.name).join(", ")}`);
      process.exitCode = 1;
      return;
    }

    let explicitShell: ShellType | undefined;
    if (shellFlag) {
      try {
        explicitShell = validateShellType(shellFlag);
      } catch (err: any) {
        console.error(`Error: ${err.message}`);
        process.exitCode = 1;
        return;
      }
    }

    const agents = agentName
      ? [registry.get(agentName)!]
      : registry.list();

    let tmpDir: string | undefined;

    try {
      console.log(`Cloning config from ${repoUrl}...`);
      tmpDir = await cloneRepo(repoUrl);
      console.log("Clone successful.");

      for (const agent of agents) {
        const configDirPath = agentName
          ? getConfigDir(agent.name, customDir)
          : getConfigDir(agent.name);
        await agent.install(configDirPath, tmpDir);
        await setEnvVar(agent.envVarName, configDirPath, agent.name, explicitShell);
      }

      console.log("Setup complete. Restart your shell or source your profile to apply changes.");
    } catch (err: any) {
      console.error(`Error: ${err.message || err}`);
      process.exitCode = 1;
    } finally {
      if (tmpDir) {
        await cleanupDir(tmpDir);
      }
    }
  });
