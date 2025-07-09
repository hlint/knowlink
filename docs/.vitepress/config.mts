import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en",
  title: "Knowlink",
  base: "/knowlink",
  head: [["link", { rel: "icon", href: "logo.png" }]],
  ignoreDeadLinks: true,
  vite: {
    css: {
      postcss: {
        plugins: [],
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.png",
    siteTitle: "Knowlink",
    socialLinks: [
      { icon: "github", link: "https://github.com/hlint/knowlink" },
    ],
    footer: {
      message: "Published under MIT License.",
      copyright: "Copyright © 2025-present Yuri2peter",
    },
    search: {
      provider: "local",
    },
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
      link: "/",
      description: "Your personal AI-powered note and bookmark manager.",
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          { text: "Getting Started", link: "/guide/getting-started" },
        ],
        sidebar: [
          {
            text: "User Guide",
            items: [
              { text: "Getting Started", link: "/guide/getting-started" },
              { text: "Features Overview", link: "/guide/features" },
              { text: "Core Concepts", link: "/guide/core-concepts" },
              { text: "App Interface", link: "/guide/app-interface" },
            ],
          },
          {
            text: "Notes & Bookmarks",
            items: [
              { text: "Creating Notes", link: "/guide/notes" },
              { text: "Note Editor", link: "/guide/editor" },
              {
                text: "Browser Extension",
                link: "/guide/browser-extension",
              },
            ],
          },
          {
            text: "AI Assistant",
            items: [
              { text: "Usage Guide", link: "/guide/ai-instructions" },
              { text: "Service Configuration", link: "/guide/ai-configs" },
            ],
          },
          {
            text: "Other Features",
            items: [
              { text: "Event Calendar", link: "/guide/calendar" },
              { text: "Themes & Interface", link: "/guide/themes" },
              { text: "Account Management", link: "/guide/account" },
              { text: "Data Management", link: "/guide/data-management" },
            ],
          },
          {
            text: "Deployment Guide",
            items: [
              { text: "Docker Deployment", link: "/deployment/docker" },
              { text: "Local Deployment", link: "/deployment/local" },
              { text: "Data Security", link: "/deployment/data-security" },
            ],
          },
          {
            text: "Development",
            items: [
              {
                text: "Technical Architecture",
                link: "/development/architecture",
              },
              {
                text: "Contributing Guide",
                link: "/development/contributing",
              },
            ],
          },
          {
            text: "Support",
            items: [
              { text: "Changelog", link: "/changelog" },
              { text: "Contact Us", link: "/contact" },
            ],
          },
        ],
      },
    },
    zh: {
      label: "中文",
      lang: "zh",
      link: "/zh",
      description: "您的个人AI驱动笔记和书签管理器。",
      themeConfig: {
        nav: [
          { text: "首页", link: "/zh" },
          { text: "快速开始", link: "/zh/guide/getting-started" },
        ],
        sidebar: [
          {
            text: "用户指南",
            items: [
              { text: "快速开始", link: "/zh/guide/getting-started" },
              { text: "特性概览", link: "/zh/guide/features" },
              { text: "核心概念", link: "/zh/guide/core-concepts" },
              { text: "应用界面", link: "/zh/guide/app-interface" },
            ],
          },
          {
            text: "笔记 & 书签",
            items: [
              { text: "创建笔记", link: "/zh/guide/notes" },
              { text: "笔记编辑器", link: "/zh/guide/editor" },
              { text: "浏览器插件", link: "/zh/guide/browser-extension" },
            ],
          },
          {
            text: "AI助手",
            items: [
              { text: "使用指南", link: "/zh/guide/ai-instructions" },
              { text: "服务配置", link: "/zh/guide/ai-configs" },
            ],
          },
          {
            text: "其他功能",
            items: [
              { text: "事件日历", link: "/zh/guide/calendar" },
              { text: "主题和界面", link: "/zh/guide/themes" },
              { text: "账户管理", link: "/zh/guide/account" },
              { text: "数据管理", link: "/zh/guide/data-management" },
            ],
          },
          {
            text: "部署指南",
            items: [
              { text: "Docker部署", link: "/zh/deployment/docker" },
              { text: "本地部署", link: "/zh/deployment/local" },
              { text: "数据安全", link: "/zh/deployment/data-security" },
            ],
          },
          {
            text: "开发",
            items: [
              { text: "技术架构", link: "/zh/development/architecture" },
              { text: "贡献指南", link: "/zh/development/contributing" },
            ],
          },
          {
            text: "支持文档",
            items: [
              { text: "更新日志", link: "/zh/changelog" },
              { text: "联系我们", link: "/zh/contact" },
            ],
          },
        ],
      },
    },
  },
});
