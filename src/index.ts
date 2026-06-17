#!/usr/bin/env node
import { program } from "commander";
import { setupCommand } from "./commands/setup.js";
import { updateCommand } from "./commands/update.js";

program
  .name("agent-config-cli")
  .description("CLI tool for setting up team-shared coding agent configurations")
  .version("0.1.0");

program.addCommand(setupCommand);
program.addCommand(updateCommand);

program.parse();