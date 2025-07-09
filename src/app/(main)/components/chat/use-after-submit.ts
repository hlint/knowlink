import revalidatePathClient from "@/app/actions";
import type { AfterSubmit } from "@/components/advance/ai-agent-chat/store";
import { useProgressNavigate } from "@/components/advance/progress-bar";
import useTheme from "@/hooks/use-theme";
import { z } from "zod";
import type { ClientEffect } from "../../lib/ai-actions/types";
import { useNoteVersionStore } from "../version/store";

export function useAfterSubmit(): AfterSubmit {
  const { setTheme } = useTheme();
  const navigate = useProgressNavigate();
  return async (set, get) => {
    const unhandledEffects = get()
      .context.dialog.map((message) => {
        if (message.role !== "tool") {
          return false;
        }

        const clientEffect: ClientEffect | undefined =
          message.data?.output?.clientEffect;
        if (!clientEffect) {
          return false;
        }
        if (clientEffect.state !== "sent") {
          return false;
        }
        return { messageId: message.id, clientEffect };
      })
      .filter(Boolean);
    const clientEffectHandler = async (effect: ClientEffect) => {
      if (effect.type === "client_effect") {
        if (effect.name === "app_theme_switch") {
          setTheme(
            z.enum(["light", "dark", "system"]).parse(effect.params.theme),
          );
          return true;
        }
        if (effect.name === "app_client_redirect") {
          const { url } = z
            .object({
              url: z.string(),
            })
            .parse(effect.params);
          if (url.startsWith("http")) {
            window.open(url, "_blank");
          } else {
            navigate(url);
          }
          return true;
        }
        if (effect.name === "app_open_content_diff_viewer") {
          // const { id } = z.object({ id: z.string() }).parse(effect.params);
          useNoteVersionStore.setState({
            modalOpen: true,
            isCreateMode: true,
          });
          return true;
        }
      }
      return false;
    };
    await revalidatePathClient("/");
    for (const effect of unhandledEffects) {
      const appliedSuccess = await clientEffectHandler(
        effect.clientEffect,
      ).catch((error) => {
        console.error(error);
        return false;
      });
      set((d) => {
        d.context.dialog.find((m) => m.id === effect.messageId)!.data!.output!
          .clientEffect!.state = appliedSuccess ? "applied" : "error";
      });
    }
  };
}
