---
outline: deep
---

# Docker Deployment

Docker is the simplest and recommended way to deploy Knowlink, providing good isolation and portability.

## System Requirements

### Hardware Requirements

- **CPU**: 1 core or more
- **Memory**: Minimum 512MB, recommended 1GB
- **Storage**: At least 1GB available space
- **Network**: Stable network connection

### Software Requirements

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher (optional)
- **Operating System**: Linux, macOS, or Windows

## Quick Deployment (Docker)

### 1. Create Data Directory

```bash
mkdir -p knowlink-data
```

### 2. Run Container

```bash
docker run -d \
  --name knowlink \
  -p 3000:3000 \
  -v $(pwd)/knowlink-data:/app/runtime \
  --restart unless-stopped \
  hlint/knowlink:latest
```

### 3. Access Application

Open browser and visit: `http://localhost:3000`

## Deploy Using Docker Compose

### 1. Create Project Directory

```bash
mkdir knowlink
cd knowlink
```

### 2. Create Docker Compose Configuration

Create `docker-compose.yml` file:

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

### 3. Create Data Directory

```bash
mkdir -p volumes/runtime
```

### 4. Start Application

```bash
docker-compose up -d
```

### 5. Access Application

Open browser and visit: `http://localhost:3000`

## Local Image Compilation

If you want to use a locally compiled image instead of the official image, follow these steps:

### 1. Clone Project

```bash
git clone https://github.com/hlint/knowlink.git
cd knowlink
```

### 2. Build Image

```bash
# Build image
docker build -t knowlink:local .

# Or specify tag
docker build -t knowlink:v1.0.0 .
```
