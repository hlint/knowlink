---
outline: deep
---

# Local Deployment

Local deployment is suitable for development environments or users who need complete control over the deployment process. This method compiles and runs the application directly on the local machine without Docker containers.

## System Requirements

### Hardware Requirements

- **CPU**: 1 core or more
- **Memory**: Minimum 2GB, recommended 4GB
- **Storage**: At least 10GB available space
- **Network**: Stable network connection

### Software Requirements

- **Bun**: Version 2.0 or higher (recommended)
- **Git**: Version control tool
- **Operating System**: Linux, macOS, or Windows

## Quick Deployment

### 1. Clone Project

```bash
git clone https://github.com/hlint/knowlink.git
cd knowlink
```

### 2. Install Dependencies

```bash
bun ci
```

### 3. Build and Start

```bash
# Build application
bun run build:default

# Start application
bun start
```

### 4. Access Application

Open browser and visit: `http://localhost:3000`
