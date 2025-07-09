# Core Concepts

## Overview

Knowlink is a web-based AI-driven note and bookmark management system designed to help users efficiently collect, organize, and utilize knowledge. The system adopts a modern architectural design and integrates advanced AI technology to provide users with an intelligent content management experience.

## Content Organization

Knowlink uses a classic two-level directory structure to organize your content:

```
- 🌟 Work
  - 📁 Project A
  - 📁 Project B
  - 📝 Meeting Notes
- 🌿 Life
  - 🏥 Health
  - ✈️ Travel
  - 📚 Learning
- 💻 Technology
  - 💻 Programming
  - 🎨 Design
  - 🛠️ Tools
```

**Features:**

- **Flexible Management**: Supports drag-and-drop reordering and batch operations
- **Smart Classification**: AI can automatically recommend suitable categories for content
- **Quick Access**: Supports fast search and filtering

## Notes

Each note contains the following core elements:

- **Title**: The note's title
- **Content**: The note's body, supporting Markdown format
- **Version**: Content history versions, supporting version comparison and rollback
- **Icon**: Note icon
- **Illustration**: AI automatically generates illustrations for notes
- **Links**: Related external links
- **Category**: The secondary directory it belongs to
- **Privacy Settings**: Can be set to private, restricting AI access

## Bookmarks

Bookmarks are notes created by AI processing a link or webpage snapshot:

- **Automatic Extraction**: AI automatically extracts page title, icon, and content
- **Smart Summary**: Generates concise content summaries
- **Classification Suggestions**: Intelligently recommends suitable categories
