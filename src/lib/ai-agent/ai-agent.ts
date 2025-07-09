import { callLlm } from "../llm/llm";
import { shortId } from "../string";
import { retry } from "../time";
import type { ContextManager } from "./context-manager";
import { outputContentPrompt } from "./prompt/output_content";
import { thinkPrompt } from "./prompt/think";
import { ActionSchema, OutputExtraActionSchema } from "./types/action";
import type { ToolMessage } from "./types/message";
import type { Tool } from "./types/tool";
import {
  DIVIDER,
  getElementsAfter,
  getToolDetails,
  parseLlmResultWithDivider,
  parsePrompt,
} from "./utils";

const MAX_THINKING_TIMES = 9;
export class AiAgent {
  private cm: ContextManager;
  private state:
    | "idle"
    | "thinking"
    | "tool_calling"
    | "outputting"
    | "completed" = "idle";
  private tools: Tool[];
  private thinkingTimes = 0;
  private additionalThinkingInstructions = "";
  private shouldAbort = false;
  constructor({
    contextManager,
    tools = [],
    additionalThinkingInstructions = "None",
  }: {
    contextManager: ContextManager;
    additionalThinkingInstructions?: string;
    tools?: Tool[];
  }) {
    this.cm = contextManager;
    this.tools = tools;
    this.additionalThinkingInstructions = additionalThinkingInstructions;
  }

  public abort() {
    this.shouldAbort = true;
  }

  // Main process
  public async process(): Promise<void> {
    switch (this.state) {
      case "idle":
        await this.prepare();
        break;
      case "thinking":
        await this.think();
        break;
      case "tool_calling":
        await this.callTools();
        break;
      case "outputting":
        await this.outputContent();
        break;
      case "completed":
        return;
    }
    await this.process();
  }

  private setState(state: typeof this.state) {
    this.state = state;
    if (this.shouldAbort) {
      this.state = "completed";
    }
  }

  private getToolsInfo() {
    return this.tools.map(getToolDetails);
  }

  private async prepare() {
    this.setState("thinking");
  }

  // Decide the next action (create tasks, end conversation) based on the current situation
  private async think() {
    this.thinkingTimes++;
    if (this.thinkingTimes > MAX_THINKING_TIMES) {
      this.cm.updateContext((d) => {
        d.state = "outputting";
        d.dialog.push({
          id: shortId(),
          role: "thinking",
          content:
            "Thinking aborted due to exceeding the maximum number of consecutive thinking rounds.",
          status: "error",
          round: this.thinkingTimes,
          data: {
            type: "output_content",
            output_instruction:
              "Due to exceeding the maximum number of consecutive thinking rounds, the system will forcibly end the conversation. You must fulfill the user's needs as much as possible based on the existing information.",
          },
        });
      });
      this.setState("outputting");
      return;
    }
    // Clean up & prepare for thinking
    this.cm.updateContext((d) => {
      d.state = "thinking";
      d.dialog.push({
        id: shortId(),
        role: "thinking",
        content: "",
        status: "pending",
        round: this.thinkingTimes,
      });
    });
    // Get the thinking result
    const [thinking, action] = await retry(async () => {
      const res = await callLlm({
        dialog: [
          {
            role: "system",
            content: parsePrompt(thinkPrompt, {
              tools: this.getToolsInfo(),
              user_additional_instructions: this.additionalThinkingInstructions,
            }),
          },
          {
            role: "user",
            content: `[System Info]\nDialog: ${JSON.stringify(this.cm.select((c) => c.dialog))}\nThinking Round: ${this.thinkingTimes} / ${MAX_THINKING_TIMES}`,
          },
        ],
        onStream: (content) => {
          const contentFixed = content.split(DIVIDER)[0];
          this.cm.updateContext((d) => {
            const m = d.dialog.filter((m) => m.role === "thinking").at(-1)!;
            m.content = contentFixed;
          });
        },
      });
      return parseLlmResultWithDivider(res, ActionSchema);
    })().catch((e) => {
      this.cm.updateContext((d) => {
        const m = d.dialog.filter((m) => m.role === "thinking").at(-1)!;
        m.status = "error";
      });
      this.handleError(e, "Thinking stopped by an unexpected error.");
    });

    this.cm.updateContext((d) => {
      const m = d.dialog.filter((m) => m.role === "thinking").at(-1)!;
      m.content = thinking;
      m.status = "success";
      m.data = action;
    });
    // Create tasks
    if (action.type === "call_tools") {
      this.cm.updateContext((d) => {
        d.state = "executing";
        for (const a of action.actions) {
          d.dialog.push({
            id: shortId(),
            role: "tool",
            content: a.summary,
            status: "pending",
            data: {
              tool_name: a.tool_name,
              input: a.input,
              output: null,
            },
          });
        }
      });
      this.setState("tool_calling");
    } else if (action.type === "output_content") {
      this.cm.updateContext((d) => {
        d.dialog.push({
          id: shortId(),
          role: "assistant",
          content: "Outputting...",
          status: "pending",
          data: {
            type: "output_extra_action",
            suggested_inputs: [],
          },
        });
      });
      this.setState("outputting");
    }
  }

  // Execute tasks
  private async callTools() {
    // await this.prepareCallToolTask();
    await Promise.all(
      this.cm
        .select((c) => {
          const lastThinkingMessage = c.dialog
            .filter((m) => m.role === "thinking")
            .at(-1)!;
          return getElementsAfter(c.dialog, lastThinkingMessage)
            .filter((t) => t.role === "tool")
            .map((t) => t.id);
        })
        .map((toolMessageId) => this.executeCallToolTask(toolMessageId)),
    );
    this.setState("thinking");
  }

  // Execute the call tool task
  private async executeCallToolTask(toolMessageId: string) {
    await retry(async () => {
      const toolMessage = this.cm.select((c) =>
        c.dialog.find((m) => m.role === "tool" && m.id === toolMessageId),
      ) as ToolMessage;
      const tool = this.tools.find(
        (t) => t.name === toolMessage.data.tool_name,
      )!;
      const output = await tool.execute(toolMessage.data.input);
      this.cm.updateContext((d) => {
        const t = d.dialog.find(
          (m) => m.role === "tool" && m.id === toolMessageId,
        ) as ToolMessage;
        t.data.output = output;
        t.status = "success";
      });
    })().catch((e) => {
      this.cm.updateContext((d) => {
        const t = d.dialog.find(
          (m) => m.role === "tool" && m.id === toolMessageId,
        ) as ToolMessage;
        t.status = "error";
        t.data.output = e instanceof Error ? e.message : "Unknown error";
      });
    });
  }

  // Execute the output content task
  private async outputContent() {
    this.cm.updateContext((d) => {
      d.state = "outputting";
    });
    await retry(async () => {
      const res = await callLlm({
        dialog: [
          {
            role: "system",
            content: parsePrompt(outputContentPrompt, {
              tools: this.getToolsInfo(),
            }),
          },
          {
            role: "user",
            content: `[System Info]\nDialog: ${JSON.stringify(this.cm.select((c) => c.dialog))}`,
          },
        ],
        onStream: (content) => {
          const contentFixed = content.split(DIVIDER)[0];
          this.cm.updateContext((d) => {
            const m = d.dialog.filter((m) => m.role === "assistant").at(-1)!;
            m.content = contentFixed;
          });
        },
      });
      return parseLlmResultWithDivider(res, OutputExtraActionSchema);
    })()
      .then(([content, extra_action]) => {
        this.cm.updateContext((d) => {
          d.state = "idle";
          const m = d.dialog.filter((m) => m.role === "assistant").at(-1)!;
          m.content = content;
          m.data = extra_action;
          m.status = "success";
        });
      })
      .catch((e) => {
        console.warn(e);
        this.cm.updateContext((d) => {
          d.state = "error";
          const m = d.dialog.filter((m) => m.role === "assistant").at(-1)!;
          m.content = "Error";
          m.status = "error";
          m.data = {
            type: "output_extra_action",
            suggested_inputs: [],
          };
        });
      });
    this.setState("completed");
  }

  private handleError(
    e: unknown,
    message = "Unexpected error occurred",
  ): never {
    this.cm.updateContext((d) => {
      d.state = "error";
      d.dialog.push({
        id: shortId(),
        role: "system",
        content: message,
        status: "error",
        data: e,
      });
    });
    throw e;
  }
}
