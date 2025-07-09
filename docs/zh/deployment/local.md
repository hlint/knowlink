---
outline: deep
---

# 本地部署

本地部署适合开发环境或需要完全控制部署过程的用户。这种方式直接在本地机器上编译和运行应用，无需 Docker 容器。

## 系统要求

### 硬件要求

- **CPU**: 1 核心以上
- **内存**: 最低 2G，推荐 4GB
- **存储**: 至少 10GB 可用空间
- **网络**: 稳定的网络连接

### 软件要求

- **Bun**: 版本 2.0 或更高（推荐）
- **Git**: 版本控制工具
- **操作系统**: Linux、macOS 或 Windows

## 快速部署

### 1. 克隆项目

```bash
git clone https://github.com/hlint/knowlink.git
cd knowlink
```

### 2. 安装依赖

```bash
bun ci
```

### 3. 构建并启动

```bash
# 构建应用
bun run build:default

# 启动应用
bun start
```

### 4. 访问应用

打开浏览器访问：`http://localhost:3000`
