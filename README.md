# KnowledgeHub - AI Project Knowledge Assistant

KnowledgeHub 是一个基于 RAG (检索增强生成) 的 AI 知识库项目。它允许用户上传项目文档，通过 AI 对话快速获取精确信息。

本项目专为**中国大陆网络环境**优化：
*   **AI 模型**: 智谱 GLM-4 (国内直连)
*   **Workflow**: n8n (私有化部署)
*   **Database**: Supabase (Postgres + pgvector)

---

## 🚀 快速开始 (本地开发)

### 1. 环境准备
*   Node.js 18+
*   Supabase 账号 (或本地 Docker 实例)
*   智谱 AI API Key

### 2. 数据库初始化 (Super Critical)
请务必按顺序在 Supabase SQL Editor 中运行以下脚本：

| 顺序 | 文件路径 | 说明 |
| :--- | :--- | :--- |
| 1 | `src/01_setup_rls.sql` | 创建基础表 (Projects, Documents) 和 RLS 权限 |
| 2 | `src/02_setup_storage_rls.sql` | 配置存储桶权限 |
| 3 | `src/04_fix_schema.sql` | 修复早期表结构缺失 |
| 4 | `src/07_switch_to_zhipu.sql` | **关键**: 将向量维度改为 1024 适配 GLM，并创建 `user_settings` 表 |

*注意：`src/06_setup_ai_schema.sql` 已被 `07` 取代，无需执行。*

### 3. n8n 工作流配置
本项目依赖 n8n 处理 AI 逻辑。配置文件位于 `docs/n8n_workflows/`。

1.  **安装 n8n**: `docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n`
2.  **配置凭证**: 在 n8n 中添加 `Supabase API` 和 `OpenAI API` (BaseUrl: `https://open.bigmodel.cn/api/paas/v4`, Key: 智谱Key)。
3.  **导入工作流**:
    *   索引流: `docs/n8n_workflows/index_workflow.json`
    *   对话流: `docs/n8n_workflows/chat_workflow.json`
4.  **获取 Webhook URL**: 激活工作流，复制 Production URL。

### 4. 前端配置
复制 `.env.example` 到 `.env.local` 并填入：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的Supabase地址
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的AnonKey
NEXT_PUBLIC_N8N_WORKFLOW_INDEX=你的索引WorkflowID (或完整URL)
NEXT_PUBLIC_N8N_WORKFLOW_CHAT=你的对话WorkflowID (或完整URL)
```

### 5. 启动项目
```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

---

## 🐳 服务器部署 (Docker Compose)

本项目提供一键部署脚本，位于 `deployment/` 目录。

1.  将 `deployment/` 目录上传至服务器。
2.  创建 `.env` 文件 (参考 `.env.example`)。
3.  启动服务：
    ```bash
    docker-compose up -d --build
    ```
4.  Nginx 将自动反向代理：
    *   `http://your-server/` -> Next.js 应用
    *   `http://your-server/webhook/` -> n8n Webhook

---

## 📂 核心目录结构

*   `src/app`: Next.js App Router 源码
*   `src/services`: 业务逻辑 (AI, Project, Document)
*   `src/*.sql`: 数据库初始化脚本
*   `docs/n8n_workflows`: n8n 流程图 JSON
*   `deployment`: Docker 部署配置

## 🛠 技术栈
*   **Frontend**: Next.js 14, TailwindCSS, Shadcn UI
*   **Database**: Supabase (PostgreSQL 15 + pgvector)
*   **AI Engine**: n8n + LangChain + Zhipu GLM-4