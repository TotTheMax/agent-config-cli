import { describe, it, expect } from "vitest";
import { AgentRegistry } from "../agents/registry.js";
import type { Agent } from "../agents/types.js";

function createMockAgent(name: string, envVarName?: string): Agent {
  return {
    name,
    envVarName: envVarName ?? `${name}_CONFIG_DIR`,
    detect: () => true,
    install: async () => {},
    update: async () => {},
  };
}

describe("AgentRegistry", () => {
  it("should register an agent", () => {
    const reg = new AgentRegistry();
    const agent = createMockAgent("test-agent");
    reg.register(agent);
    expect(reg.has("test-agent")).toBe(true);
  });

  it("should retrieve a registered agent", () => {
    const reg = new AgentRegistry();
    const agent = createMockAgent("test-agent");
    reg.register(agent);
    expect(reg.get("test-agent")).toBe(agent);
  });

  it("should return undefined for unregistered agent", () => {
    const reg = new AgentRegistry();
    expect(reg.get("nonexistent")).toBeUndefined();
  });

  it("should list all registered agents", () => {
    const reg = new AgentRegistry();
    reg.register(createMockAgent("a"));
    reg.register(createMockAgent("b"));
    expect(reg.list().map((a) => a.name)).toEqual(["a", "b"]);
  });
});