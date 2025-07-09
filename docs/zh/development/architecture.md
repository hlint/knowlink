---
outline: deep
---

# 技术架构

本文档介绍 Knowlink 的核心技术架构。

## 主要技术栈

### 前端

- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - CSS 框架
- **Zustand** - 状态管理
- **Radix UI** - UI 组件库

### 后端

- **Bun** - 高性能 JavaScript 运行时
- **Prisma ORM** - 数据库 ORM
- **SQLite** - 默认数据库
- **Next.js API Routes** - 服务端 API

### AI 技术

- **Pollinations.ai** - 默认 AI 提供商
- **OpenAI** - GPT 系列模型
- **自定义 API** - 兼容 OpenAI 格式

### 部署

- **Docker** - 容器化部署
- **Docker Compose** - 多服务编排

## 主要功能模块

### 核心功能

- **笔记管理** - 创建、编辑、分类笔记
- **书签管理** - 网页书签收藏
- **AI 助手** - 智能对话和内容生成
- **文件管理** - 文件上传和存储
- **用户系统** - 账户管理和认证

### 扩展功能

- **浏览器扩展** - 网页内容剪辑
- **日历集成** - 事件管理
- **主题系统** - 界面主题切换
- **数据导入导出** - 数据迁移

## 目录结构

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # 主要页面
│   │   ├── (pages)/       # 页面组件
│   │   ├── account/       # 账户管理
│   │   ├── note/          # 笔记编辑
│   │   ├── settings/      # 设置页面
│   │   └── tools/         # 工具页面
│   ├── api/               # API 路由
│   │   ├── ai/            # AI 相关 API
│   │   ├── upload/        # 文件上传
│   │   └── web-clipper/   # 网页剪辑
│   └── actions/           # 服务端操作
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── advance/          # 高级组件
│   └── app/              # 应用组件
├── lib/                  # 工具库
│   ├── ai-agent/         # AI 代理
│   ├── llm/              # LLM 集成
│   ├── prisma.ts         # 数据库连接
│   └── utils/            # 工具函数
├── hooks/                # 自定义 Hooks
├── integrations/         # 第三方集成
│   ├── file-storage/     # 文件存储
│   ├── i18n/             # 国际化
│   └── markdown/         # Markdown 编辑器
└── store/                # 状态管理
```

## 开发、构建过程

### 开发环境

1. **环境准备**

   ```bash
   # 安装依赖
   bun ci

   # 设置环境变量
   cp .env.example .env.local
   ```

2. **数据库设置**

   ```bash
   # 生成 Prisma 客户端
   bun prisma:generate

   # 运行数据库迁移
   bun prisma:push
   ```

3. **启动开发服务器**
   ```bash
   bun dev
   ```

### 构建过程

1. **代码检查**

   ```bash
   # 类型检查
   bun tsc

   # 代码格式化
   bun lint

   # 代码检查
   bun lint:fix
   ```

2. **构建应用**

   ```bash
   # 生产构建
   bun build:default

   # 启动生产服务器
   bun start
   ```

### 部署流程

1. **Docker 构建**

   ```bash
   # 构建镜像
   docker build -t knowlink .

   # 使用 Docker Compose
   docker-compose up -d
   ```

2. **环境配置**

   - 设置生产环境变量
   - 配置数据库连接
   - 设置 AI API 密钥

3. **数据迁移**
   ```bash
   # 生产环境数据库迁移
   bun prisma:deploy
   ```
