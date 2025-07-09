# AI Assistant Usage Guide

## Overview

The AI Assistant is one of Knowlink's core features, providing you with an intelligent note management and content creation experience. Through natural language interaction, the AI Assistant can help you complete various tasks, from simple queries to complex multi-step operations.

![AI Chat Interface](/ai_chat.png)

## Core Features

### 🤔 Thinking Capability

The AI Assistant has deep thinking capabilities, able to analyze complex tasks and develop execution plans, ensuring accuracy and completeness in task completion.

### 💬 Multi-turn Dialogue

Supports multi-turn editable conversations. You can adjust instructions at any time or ask AI to re-execute specific steps.

### 🛠️ Smart Tool Calling

The AI Assistant can automatically call various tools, including:

- Web search and information queries
- Image generation and editing
- Application function control

### 🎯 Application Environment Awareness

The AI Assistant can perceive your current application state, including the note you're editing, current category, etc., providing more precise assistance.

## Supported LLM Providers

Knowlink supports all LLM providers that use the OpenAI API format, including but not limited to:

- OpenAI GPT series
- Google Gemini
- Locally deployed compatible models

## Detailed Usage Scenarios

### 🔍 Information Queries

**Example:**

```text
Help me check what the weather is like in Beijing today
```

**Applicable Scenarios:**

- Real-time information retrieval
- Data statistics queries
- Knowledge encyclopedia searches

### 🎨 Content Creation

**Example:**

```text
Draw a picture of a kitten
```

**Applicable Scenarios:**

- Illustration generation
- Creative design
- Visual content creation

### 📝 Note Optimization

**Example:**

```text
Optimize the body of the note I'm currently editing to make the tone more formal.
```

**Applicable Scenarios:**

- Text polishing
- Format adjustment
- Content restructuring
- Language translation

### ⚙️ Application Control

**Example:**

```text
Switch to dark mode
```

```text
Add appropriate emojis to all my category entries
```

```text
Create a schedule for me, tomorrow at 10 AM, to meet a friend
```

### 🎯 Complex Task Processing

The AI Assistant's most powerful feature is handling complex tasks that require multiple steps and multiple tools.

**Example Task:**

```text
I'm practicing English writing. Help me create a suitable category, then create three English fable story templates under it.
The stories should follow Aesop's fable style, with at least one illustration.
```

**AI Execution Process:**

```text
Thinking (Round 1)
- Analyze task requirements
- Create category structure
- Generate first fable story
- Generate second fable story
- Generate third fable story

Thinking (Round 2)
- Generate illustration for first story
- Generate illustration for second story
- Generate illustration for third story

Task completed: Created "English Writing Practice" category and "Fables" subcategory,
containing three Aesop-style fable stories, each with corresponding illustrations
```

![Complex Task Execution Example](/ai_chat_task.png)

## Usage Tips

### 💡 Prompt Optimization

1. **Clear Objectives**: Clearly describe the results you want to achieve
2. **Provide Context**: Explain the background and constraints of the task
3. **Step-by-step Description**: For complex tasks, you can explain step by step
4. **Specify Format**: If you need a specific format, please specify in the prompt

### 🔄 Iterative Optimization

- If the results are unsatisfactory, you can ask AI to re-execute or adjust
- You can modify specific parts
- Supports multi-turn dialogue to perfect results

### 🎛️ Advanced Features

- **Batch Operations**: Process multiple items at once
- **Conditional Execution**: Execute different operations based on specific conditions
- **Template Application**: Use preset templates to quickly create content

## Notes

1. **Data Security**: The AI Assistant will protect your privacy and data security
2. **Network Dependency**: Some features require network connection
3. **Model Limitations**: Different LLM providers may have different capability limitations
4. **Content Review**: Generated content will undergo appropriate content review

## Troubleshooting

### Common Issues

**Q: What if the AI Assistant doesn't respond?**
A: Check network connection and ensure LLM service is running normally.

**Q: Generated content doesn't meet expectations?**
A: Try re-describing requirements, or ask AI to re-execute specific steps.

**Q: Tool calling failed?**
A: Confirm related services are available and check permission settings.
