# Browser Extension

![Web Clipper Demo](/clliper_demo.png)

## Overview

Knowlink Web Clipper is a powerful browser extension that allows you to easily save web content to Knowlink, quickly creating bookmarks and notes.

## Main Features

- **One-Click Web Page Saving** - Quickly save current pages to Knowlink
- **Smart Content Extraction** - Automatically extract webpage titles, descriptions, and key content
- **Quick Note Creation** - Quickly create structured notes based on webpage content
- **Automatic Bookmark Classification** - Intelligently classify based on content

## Supported Browsers

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari (Untested)

## Installation Guide

### 1. Download Extension

Visit the [Knowlink Web Clipper Releases Page](https://github.com/hlint/knowlink-web-clipper/releases) to download the latest version of the extension.

### 2. Install to Browser

#### Chrome/Edge Installation Steps:

1. Download the extension package and extract to a local folder
2. Open browser, visit `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked extension"
5. Select the extracted extension folder

#### Firefox Installation Steps:

1. Download the `.xpi` file
2. Open Firefox, visit `about:addons`
3. Click the gear icon, select "Install Add-on From File"
4. Select the downloaded `.xpi` file
5. Confirm installation

#### Safari Installation Steps:

1. Download the Safari-specific version
2. Double-click the installer package to install
3. Enable the extension in Safari preferences

### 3. Initial Configuration

![Web Clipper Settings](/clliper_settings.png)

After installation, initial configuration is required:

1. **App Origin**: Fill in your Knowlink website address

   - Example: `https://my.knowlink.com`
   - Local development: `http://localhost:3000`

2. **App Access Key**: Fill in the Web Clipper access key
   - In Knowlink settings page → Browser Extension → Generate access key
   - Please keep it safe and don't share it with others

## Common Issues

### Q: Can't install the extension?

A: Please ensure your browser version is supported and check if developer mode is enabled.

### Q: Can't connect to Knowlink?

A: Check if App Origin and Access Key are configured correctly, and ensure network connection is normal.
