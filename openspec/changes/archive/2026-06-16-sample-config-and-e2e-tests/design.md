## Context

GitHub 上的 `tothemax/coding-agent-configs` 仓库是空的，需要填充示例配置内容供团队使用和 CLI 测试。CLI 目前只有单元测试和 mock 集成测试，缺少使用真实 git 仓库 clone 的端到端测试，无法验证完整流程的正确性。

本地仓库（GitLab 版）已有 opencode/ 目录结构，GitHub 版需要对齐。

## Goals / Non-Goals

**Goals:**

- 在 GitHub 仓库创建完整的示例 opencode 配置（opencode.json、.opencode/rules 等）
- 在 CLI 项目中新增 e2e 测试脚本，使用 GitHub 仓库 clone 验证 setup/update 全流程
- e2e 测试验证：clone、配置安装、环境变量写入、目录结构正确性
- e2e 测试可本地运行，也可在 CI 中运行

**Non-Goals:**

- 不搭建 CI pipeline（本次只创建测试脚本，CI 配置后续单独处理）
- 不测试 SSH URL clone（e2e 只用 HTTPS）
- 不修改 CLI 核心代码（只新增测试）
- 不自动同步 GitLab 和 GitHub 仓库内容（手动保持一致）

## Decisions

### 1. 示例配置内容

**决策**: GitHub 仓库的 opencode/ 目录结构与本地 GitLab 版保持一致：
```
opencode/
├── opencode.json       # 主配置（模型、provider 等）
├── .opencode/
│   └── rules/
│       └── code-style.md  # 编码规范
└── README.md           # 配置说明（可选）
```

**理由**: 统一目录结构便于测试和维护

### 2. E2E 测试位置与方式

**决策**: 在 CLI 项目 `packages/agent-config-cli/` 中新增 `e2e/` 目录存放端到端测试。测试脚本使用 shell script（bash），调用 CLI 的 `dist/index.js`，验证文件系统和环境变量结果。

**理由**:
- shell script 直接调用 CLI 二进制，最接近真实使用场景
- 不需要额外测试框架，简单可靠
- vitest 单测覆盖内部逻辑，e2e 覆盖外部行为

**替代方案**: vitest 中写 e2e → 需要 mock git clone，不是真正的端到端测试

### 3. E2E 测试策略

**决策**: e2e 测试使用临时 HOME 目录，避免影响用户真实 shell profile。每次测试前创建临时环境，测试后清理。使用 GitHub HTTPS URL clone 真实仓库。

**理由**:
- 不污染用户环境
- 真实 clone 验证完整流程
- 可重复运行

### 4. GitHub 仓库 URL

**决策**: e2e 测试硬编码 `https://github.com/tothemax/coding-agent-configs.git` 作为测试仓库地址。

**理由**: 这是团队的公开 GitHub 仓库，地址不会频繁变动

## Risks / Trade-offs

- [网络依赖] → e2e 测试需要网络访问 GitHub，离线环境无法运行。缓解：单元测试不依赖网络，e2e 测试单独标记，可选运行
- [GitHub 仓库内容变更影响测试] → 如果配置仓库目录结构变化，e2e 测试可能失败。缓解：测试验证的是 CLI 与配置仓库的契约，失败说明两者不匹配，需要修复
- [测试速度] → git clone 耗时较长。缓解：e2e 测试只在关键变更时运行，不在每次 commit 时自动运行