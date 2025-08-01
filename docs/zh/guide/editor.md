# 笔记编辑器

本章详细介绍 Knowlink 笔记编辑器的各项功能，包括标题设置、内容编辑、格式操作、分类管理等核心功能。

![editor](/editor.png)

## 标题与插图管理

### 标题编辑

笔记标题支持实时编辑，点击标题区域即可直接修改。标题将自动保存，无需额外操作。

### 智能插图生成

系统会根据笔记标题自动生成相关插图，提升笔记的视觉表现力。

**操作步骤：**

1. 修改笔记标题
2. 系统自动生成对应插图
3. 点击插图区域的"更新"按钮可重新生成

![title_illustration](/title_illustration.png)

## WYSIWYG 编辑模式

### Markdown 语法支持

编辑器完全支持标准 Markdown 语法，提供所见即所得的编辑体验。

**常用语法示例：**

| 语法                   | 效果            | 说明         |
| ---------------------- | --------------- | ------------ |
| `# 一级标题`           | # 一级标题      | 页面主标题   |
| `## 二级标题`          | ## 二级标题     | 章节标题     |
| `**粗体文本**`         | **粗体文本**    | 强调重要内容 |
| `*斜体文本*`           | _斜体文本_      | 轻微强调     |
| `[链接文本](URL)`      | [链接文本](URL) | 超链接       |
| `![图片描述](图片URL)` | 图片显示        | 插入图片     |
| `- 列表项`             | • 列表项        | 无序列表     |
| `1. 列表项`            | 1. 列表项       | 有序列表     |
| `` `代码` ``           | `代码`          | 行内代码     |
| ` ```代码块``` `       | 代码块          | 多行代码     |

### 格式菜单

点击格式菜单按钮或输入 `/` 快捷键可快速访问格式菜单，提供常用格式操作和图片、文件上传功能。

![editor_menu](/editor_menu.png)

## 笔记管理功能

### 笔记菜单操作

![editor_more](/editor_more.png)

通过笔记右上角的菜单按钮可访问以下管理功能：

#### 克隆笔记

创建当前笔记的完整副本，包括所有内容和设置。

**使用场景：**

- 创建模板笔记
- 备份重要内容
- 基于现有笔记创建变体

#### 拉取内容

从书签链接获取最新内容并更新当前笔记。

**操作步骤：**

1. 确保笔记包含有效的网页链接
2. 点击"拉取"选项
3. 系统自动获取并更新内容

**注意事项：**

- 仅对书签类型笔记有效
- 需要网络连接
- 可能覆盖现有内容

#### 删除笔记

- 删除的笔记将移至回收站
- 可在回收站中恢复或永久删除

## 代码编辑模式

### 切换方式

点击编辑器右上角的"代码"按钮可切换到 Markdown 源码编辑模式，提供更精确的内容控制。

### 语法高亮

代码模式支持 Markdown 语法高亮，提升编辑体验。

![editor_code](/editor_code.png)

## AI 智能编辑

### 快捷键操作

编辑器集成了强大的 AI 辅助功能，通过快捷键快速访问：

#### Ctrl+J：智能续写

根据当前上下文，在光标位置自动续写内容。

**使用示例：**

```
当前内容：今天学习了 React 的基础概念，包括组件、状态和生命周期...
按 Ctrl+J 后，AI 可能续写：其中组件是 React 应用的基本构建块，分为函数组件和类组件...
```

#### Ctrl+K：内容改写

选中文本后按 Ctrl+K，输入改写要求，AI 将按要求改写选中内容。

**使用示例：**

```
选中文本：这个功能很好用
按 Ctrl+K，输入要求：改为更正式的表达
AI 改写结果：此功能具有出色的实用性和易用性
```

#### Ctrl+L：智能问答

输入问题，AI 将基于当前笔记内容提供相关回答。

**使用示例：**

```
问题：如何优化这段代码的性能？
AI 回答：基于您当前的代码，建议采用以下优化策略...
```

#### Tab

应用 AI 生成的内容。

## 版本管理

![note_version](/note_version.png)

### 版本保存

系统自动保存笔记的修改历史，也可手动创建版本快照。

**手动创建版本：**

1. 点击版本管理按钮
2. 选择"创建新版本"
3. 输入版本描述（可选）
4. 确认创建

### 版本恢复

选择任意历史版本进行恢复，支持预览和对比功能。

**恢复步骤：**

1. 打开版本管理面板
2. 浏览历史版本列表
3. 选择目标版本
4. 点击"恢复到此版本"

### 版本对比

使用对照功能查看不同版本间的差异，支持逐行对比。

### 版本管理最佳实践

- 定期创建重要里程碑的版本
- 使用描述性的版本名称
- 在重大修改前创建备份版本
- 定期清理过期的历史版本
