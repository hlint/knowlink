---
outline: deep
---

# Docker 部署

Docker 是部署 Knowlink 最简单和推荐的方式，提供了良好的隔离性和可移植性。

## 系统要求

### 硬件要求

- **CPU**: 1 核心以上
- **内存**: 最低 512MB，推荐 1GB
- **存储**: 至少 1GB 可用空间
- **网络**: 稳定的网络连接

### 软件要求

- **Docker**: 版本 20.10 或更高
- **Docker Compose**: 版本 2.0 或更高（可选）
- **操作系统**: Linux、macOS 或 Windows

## 快速部署（Docker）

### 1. 创建数据目录

```bash
mkdir -p knowlink-data
```

### 2. 运行容器

```bash
docker run -d \
  --name knowlink \
  -p 3000:3000 \
  -v $(pwd)/knowlink-data:/app/runtime \
  --restart unless-stopped \
  hlint/knowlink:latest
```

### 3. 访问应用

打开浏览器访问：`http://localhost:3000`

## 使用 Docker Compose 部署

### 1. 创建项目目录

```bash
mkdir knowlink
cd knowlink
```

### 2. 创建 Docker Compose 配置

创建 `docker-compose.yml` 文件：

```yaml
version: "3.8"

services:
  knowlink:
    image: hlint/knowlink:latest
    container_name: knowlink-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./volumes/runtime:/app/runtime
    environment:
      - NODE_ENV=production
      - PORT=3000
```

### 3. 创建数据目录

```bash
mkdir -p volumes/runtime
```

### 4. 启动应用

```bash
docker-compose up -d
```

### 5. 访问应用

打开浏览器访问：`http://localhost:3000`

## 本地编译镜像

如果你想使用本地编译的镜像而不是官方镜像，可以按照以下步骤操作：

### 1. 克隆项目

```bash
git clone https://github.com/hlint/knowlink.git
cd knowlink
```

### 2. 构建镜像

```bash
# 构建镜像
docker build -t knowlink:local .

# 或者指定标签
docker build -t knowlink:v1.0.0 .
```
