# AiAgent Design Document(need to be updated)

## 1. Module Purpose and Goals

AiAgent is a framework for building intelligent agents capable of multi-turn dialogue, task planning, tool invocation, and content output. It is suitable for intelligent assistants, automated task execution, and similar scenarios. The core goals are:

- Understand user input and automatically plan task execution flows
- Support flexible invocation of various external tools
- Maintain both short-term and long-term memory to continuously optimize interactions
- Provide a plugin-based, extensible architecture for integration into larger systems

## 2. Overall Architecture

AiAgent consists of the following core components:

- **AiAgent**: The main process controller, responsible for state transitions, task scheduling, LLM and tool invocation.
- **ContextManager**: Manages context and memory, maintaining dialogue, tasks, and memory state.
- **Tool System**: A set of extensible external tools, each registered with a unified interface.
- **Prompt System**: Parameterized prompt templates for each stage, driving LLM-based planning, reasoning, and content generation.
- **Type Definitions**: Type constraints for core data structures such as context, tasks, and tools.

## 3. Core Workflow

### 3.1 State Machine

AiAgent operates as a state machine with the following states:

- `idle`: Waiting for user input
- `thinking`: Analyzing user input and current context, generating/updating execution plans and deciding the next action
- `tool_calling`: Executing all pending tool call tasks in parallel
- `outputting`: Generating and outputting content to the user
- `completed`: Conversation ended, waiting for new input
- `error`: An error occurred during processing

After each state transition, the agent recursively proceeds to the next step until the conversation ends.

### 3.2 Planning and Decision (thinking)

- User input is appended to the dialogue history.
- Using the `thinkPrompt`, the agent combines the current dialogue, memory, and available tools to generate or update an execution plan and decide the next action (create tool call tasks or output content).
- If the action is `create_call_tool_tasks`, a task queue is generated and the agent enters the tool calling phase. If the action is `output_content`, the agent proceeds to output content and end the conversation.
- If the maximum number of thinking rounds is exceeded, the agent forcibly ends the conversation and outputs content based on available information.

### 3.3 Task Execution (tool_calling)

- All tool call tasks are executed in parallel:
  - For each task, the agent uses the LLM to generate tool input parameters, invokes the tool, and writes the result to the dialogue history.
- After all tasks are completed, the agent returns to the thinking phase.

### 3.4 Content Output (outputting)

- The agent uses the `outputContentPrompt` to generate content for the user, updates long-term memory, and provides suggested next inputs.
- The conversation is then marked as completed.

### 3.5 Error Handling

- If an error occurs at any stage, the agent transitions to the `error` state, logs the error in the dialogue, and halts further processing.

## 4. Context and Memory Management

- **Dialogue History (`dialog`)**: Records every interaction from user, assistant, and tools.
- **Task Queue (`tasks`)**: The current list of pending tool call tasks, including type, content, and status.
- **Short-term Memory (`short_term`)**: Temporary state and execution plan for the current session.
- **Long-term Memory (`long_term`)**: Persistent knowledge and preferences across sessions.
- **Extra State (`extra`)**: Includes suggested next inputs, task summary, and current state.

The `ContextManager` provides `select` and `updateContext` methods to ensure consistency and traceability of context.

## 5. Tool System

- Each tool must implement the following interface:
  - `name`: Tool name
  - `description`: Tool description
  - `schema`: Zod schema for input validation
  - `execute`: Function to execute the tool with validated input
- The agent uses the LLM to automatically generate tool input parameters (as JSON), validates them, executes the tool, and records the result.
- Built-in tools include:
  - `web_search`: Web search with topic and time range support
  - `web_extract`: Web content extraction
  - `image_generation`: Image generation
  - `image_search`: Image search
  - `random_numbers`: Random number generation
- The tool system is easily extensible for integrating additional external capabilities.

## 6. Prompt System

- `thinkPrompt`: Analyzes the current situation, generates/updates the execution plan, and decides the next action
- `outputContentPrompt`: Generates content for the user based on context and instructions
- `callToolInputsPrompt`: Generates input parameters for tool calls based on tool descriptions and instructions
- All prompts are parameterized for multi-language and scenario adaptation

## 7. Type Structures

- **Message**: `{ id, role: "user" | "assistant" | "tool", content, data }`
- **Task**: `{ id, type: "call_tool", status, tool_name, tool_instruction, input, output }`
- **Memory**: `{ short_term, long_term }`
- **Context**: `{ dialog, tasks, memory, extra }`
- **Tool**: `{ name, description, schema, execute }`

## 8. Typical Use Case

1. User inputs a request (e.g., "Check Beijing weather and give clothing advice")
2. AiAgent analyzes the situation, generates/updates an execution plan, and decomposes the request into tasks (e.g., query weather, output advice)
3. The agent automatically invokes the `web_search` tool to get the weather, then generates advice using the output content phase
4. Results are written to the dialogue history; the user can continue the conversation or end it

## 9. Extensibility and Customization

- Supports custom tools, prompts, and memory management strategies
- Can integrate with various LLMs and external APIs
- Suitable for intelligent assistants, RPA, office automation, and more

---

For further extension or customization, please refer to the source code and type definitions of each submodule.
