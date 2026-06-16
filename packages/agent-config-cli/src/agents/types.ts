export interface Agent {
  name: string;
  envVarName: string;
  detect(): boolean;
  install(configDir: string, repoDir: string): Promise<void>;
  update(configDir: string, repoDir: string): Promise<void>;
}