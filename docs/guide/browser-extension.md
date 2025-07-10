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

- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari (partial supported)

## Installation Guide

### 1. Download Extension

Visit the [Knowlink Web Clipper Releases Page](https://github.com/hlint/knowlink-web-clipper/releases) to download the latest version of the extension.

### 2. Install to Browser

- [Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)
- [Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading)
- [Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
- [Safari](https://wxt.dev/guide/essentials/publishing.html#safari)

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
