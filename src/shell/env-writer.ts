import fs from "node:fs/promises";
import path from "node:path";
import {
  detectShell,
  getProfilePath,
  formatEnvExport,
  getMarkerStart,
  getMarkerEnd,
  MARKER_START,
  MARKER_END,
  type ShellType,
} from "./profile.js";

export async function setEnvVar(varName: string, value: string, agentName?: string, explicitShell?: ShellType): Promise<void> {
  const shellTypes = detectShell(explicitShell);

  for (const shellType of shellTypes) {
    const profilePath = getProfilePath(shellType);
    const exportLine = formatEnvExport(shellType, varName, value);

    const markerStart = getMarkerStart(agentName);
    const markerEnd = getMarkerEnd(agentName);
    const block = `${markerStart}\n${exportLine}\n${markerEnd}`;

    let content = "";
    try {
      content = await fs.readFile(profilePath, "utf-8");
    } catch {
      content = "";
    }

    const existingBlock = findExistingBlock(content, agentName);

    if (existingBlock) {
      const updated = replaceExistingBlock(content, existingBlock, block);
      await fs.writeFile(profilePath, updated, "utf-8");
      console.log(`Updated ${varName} in ${profilePath}`);
    } else {
      const migrated = migrateOldMarkers(content, varName, agentName);
      const finalContent = migrated.includes(getMarkerStart(agentName))
        ? migrated
        : migrated.trimEnd() + "\n\n" + block + "\n";
      await ensureDir(profilePath);
      await fs.writeFile(profilePath, finalContent, "utf-8");
      console.log(`Added ${varName} to ${profilePath}`);
    }
  }
}

interface BlockPosition {
  startIdx: number;
  endIdx: number;
  oldMarkerStart: string;
  oldMarkerEnd: string;
}

function findExistingBlock(content: string, agentName?: string): BlockPosition | null {
  const markerStart = getMarkerStart(agentName);
  const markerEnd = getMarkerEnd(agentName);
  const startIdx = content.indexOf(markerStart);
  const endIdx = content.indexOf(markerEnd);

  if (startIdx !== -1 && endIdx !== -1) {
    return { startIdx, endIdx, oldMarkerStart: markerStart, oldMarkerEnd: markerEnd };
  }

  if (!agentName) {
    return null;
  }

  const oldStartIdx = content.indexOf(MARKER_START);
  const oldEndIdx = content.indexOf(MARKER_END);
  if (oldStartIdx !== -1 && oldEndIdx !== -1) {
    return { startIdx: oldStartIdx, endIdx: oldEndIdx, oldMarkerStart: MARKER_START, oldMarkerEnd: MARKER_END };
  }

  return null;
}

function replaceExistingBlock(content: string, block: BlockPosition, newBlock: string): string {
  const before = content.slice(0, block.startIdx);
  const after = content.slice(block.endIdx + block.oldMarkerEnd.length);
  return before + newBlock + after;
}

function migrateOldMarkers(content: string, varName: string, agentName?: string): string {
  if (!agentName) return content;

  const oldStartIdx = content.indexOf(MARKER_START);
  const oldEndIdx = content.indexOf(MARKER_END);
  if (oldStartIdx === -1 || oldEndIdx === -1) return content;

  const newMarkerStart = getMarkerStart(agentName);
  const newMarkerEnd = getMarkerEnd(agentName);

  const before = content.slice(0, oldStartIdx);
  const blockContent = content.slice(oldStartIdx + MARKER_START.length, oldEndIdx);
  const after = content.slice(oldEndIdx + MARKER_END.length);

  return before + newMarkerStart + blockContent + newMarkerEnd + after;
}

async function ensureDir(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

export { detectShell, getProfilePath, formatEnvExport, ShellType, findExistingBlock };
