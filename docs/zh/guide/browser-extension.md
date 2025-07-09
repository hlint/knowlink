# 浏览器插件

![Web Clipper Demo](/clliper_demo.png)

## 概述

Knowlink Web Clipper 是一款功能强大的浏览器插件，让您能够轻松地将网页内容保存到 Knowlink 中，快速创建书签和笔记。

## 主要功能

- **一键保存网页** - 快速保存当前页面到 Knowlink
- **智能内容提取** - 自动提取网页标题、描述和关键内容
- **快速笔记创建** - 基于网页内容快速创建结构化笔记
- **书签自动分类** - 根据内容智能分类

## 支持的浏览器

- ✅ Chrome (推荐)
- ✅ Firefox
- ✅ Edge
- ✅ Safari（未测试）

## 安装指南

### 1. 下载插件

访问 [Knowlink Web Clipper 发布页面](https://github.com/hlint/knowlink-web-clipper/releases) 下载最新版本的插件。

### 2. 安装到浏览器

#### Chrome/Edge 安装步骤：

1. 下载插件压缩包并解压到本地文件夹
2. 打开浏览器，访问 `chrome://extensions/` (Chrome) 或 `edge://extensions/` (Edge)
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择解压后的插件文件夹

#### Firefox 安装步骤：

1. 下载 `.xpi` 文件
2. 打开 Firefox，访问 `about:addons`
3. 点击齿轮图标，选择"从文件安装附加组件"
4. 选择下载的 `.xpi` 文件
5. 确认安装

#### Safari 安装步骤：

1. 下载 Safari 专用版本
2. 双击安装包进行安装
3. 在 Safari 偏好设置中启用扩展

### 3. 初始配置

![Web Clipper Settings](/clliper_settings.png)

安装完成后，需要进行初始配置：

1. **App Origin**: 填写您的 Knowlink 网站地址

   - 示例：`https://my.knowlink.com`
   - 本地开发：`http://localhost:3000`

2. **App Access Key**: 填写 Web Clipper 访问密钥
   - 在 Knowlink 设置页面 → 浏览器插件 → 生成访问密钥
   - 请妥善保管，不要泄露给他人

## 常见问题

### Q: 插件无法安装？

A: 请确保浏览器版本支持，并检查是否开启了开发者模式。

### Q: 无法连接到 Knowlink？

A: 检查 App Origin 和 Access Key 是否正确配置，确保网络连接正常。
