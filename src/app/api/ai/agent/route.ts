import { defaultInstructions } from "@/app/(main)/(pages)/settings/default_instructions";
import { fetcherGetAiInstructions } from "@/app/(main)/fetchers/configs";
import { appTools } from "@/app/(main)/lib/ai-actions/tools";
import { AiAgent } from "@/lib/ai-agent/ai-agent";
import { ContextManager } from "@/lib/ai-agent/context-manager";
import { getDefaultTools } from "@/lib/ai-agent/tools/default-tools";
import { type Context, ContextSchema } from "@/lib/ai-agent/types/context";
import { prisma } from "@/lib/prisma";
import { shortId } from "@/lib/string";
import { generateSseResponse } from "@/lib/utils.server";
import fs from "fs-extra";
import type { NextRequest } from "next/server";
import { throttle } from "radashi";
import { z } from "zod";

export async function POST(request: NextRequest) {
  // request.signal.onabort = () => {  console.log("abort"); }; // this is not working :(
  const { id, context, configs } = z
    .object({
      id: z.string().optional(),
      configs: z.object({
        type: z.string().default("default"),
      }),
      context: ContextSchema,
    })
    .parse(await request.json());

  try {
    const { markStart, markStop, refShouldAbort } =
      createAgentRequestController(id);
    const handleContextUpdate = throttle(
      { interval: 500, trailing: true },
      (context: Context, textWriter: (text: string) => void) => {
        contextLogWriter(context);
        textWriter(JSON.stringify(context));
      },
    );
    return generateSseResponse(async (textWriter) => {
      await markStart();
      const contextManager = new ContextManager(context, (context) => {
        handleContextUpdate(context, textWriter);
        if (refShouldAbort.current) {
          aiAgent.abort();
        }
      });
      const savedInstructions = await fetcherGetAiInstructions();
      const aiAgent = new AiAgent({
        contextManager,
        tools: [
          ...(await getDefaultTools()),
          ...(configs?.type === "app" ? appTools : []),
        ],
        additionalThinkingInstructions:
          configs?.type === "app"
            ? savedInstructions.trim() || defaultInstructions
            : "",
      });
      await aiAgent.process();
      await markStop();
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = z.object({ id: z.string() }).parse(await request.json());
  await prisma.entry.deleteMany({
    where: { name: id, type: "temp" },
  });
  return new Response("OK");
}
async function contextLogWriter(context: Context) {
  const logFile = `./runtime/logs/ai-agent/${new Date().getTime()}.json`;
  await fs.ensureFile(logFile);
  fs.writeFile(logFile, JSON.stringify(context, null, 2));
}

function createAgentRequestController(requestId = shortId()) {
  let intervalId: NodeJS.Timeout;
  const refShouldAbort = { current: false };
  return {
    markStart: async () => {
      await prisma.entry.create({
        data: {
          name: requestId,
          type: "temp",
        },
      });
      intervalId = setInterval(async () => {
        const entry = await prisma.entry.findFirst({
          where: {
            name: requestId,
            type: "temp",
          },
        });
        if (!entry) {
          refShouldAbort.current = true;
          clearInterval(intervalId);
        }
      }, 1000);
    },
    markStop: async () => {
      clearInterval(intervalId);
      await prisma.entry.deleteMany({
        where: {
          name: requestId,
          type: "temp",
        },
      });
    },
    refShouldAbort,
  };
}
