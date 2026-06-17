import { describe, it, expect } from "vitest";
import { OpenCodeAgent } from "../agents/opencode.js";

describe("OpenCodeAgent envVarName", () => {
  it("should return OPENCODE_CONFIG_DIR", () => {
    const agent = new OpenCodeAgent();
    expect(agent.envVarName).toBe("OPENCODE_CONFIG_DIR");
  });

  it("should have name opencode", () => {
    const agent = new OpenCodeAgent();
    expect(agent.name).toBe("opencode");
  });
});