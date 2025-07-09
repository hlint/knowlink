import { type Context, ContextSchema } from "@/lib/ai-agent/types/context";
import { createZustandStoreProvider } from "@/lib/create-store";
import fetchEventSource from "@/lib/fetch-event-source";
import { shortId } from "@/lib/string";

interface ChatStore {
  context: Context;
  input: string;
  loading: boolean;
  debugMode: boolean;
  showThinking: boolean;
  _handleAbort: () => void;
  type: string;
  afterSubmit: AfterSubmit;
}

export type AfterSubmit = (
  set: (fn: (state: ChatStore) => void) => void,
  get: () => ChatStore,
) => Promise<void>;

const initialState: ChatStore = {
  context: ContextSchema.parse({}),
  input: "",
  loading: false,
  debugMode: false,
  showThinking: true,
  type: "default",
  afterSubmit: async () => {},
  _handleAbort: () => {},
};

export const { StoreProvider, useStore: useChatStore } =
  createZustandStoreProvider(initialState, (set, get) => ({
    actions: {
      setInput: (input: string) => {
        set((d) => {
          d.input = input;
        });
      },
      stop: () => {
        get()._handleAbort();
      },
      submit: async () => {
        if (get().loading || !get().input) return;
        const id = shortId();
        const input = get().input;
        const abortController = new AbortController();
        set((d) => {
          d.loading = true;
          d.context.state = "thinking";
          d.context.dialog.push({
            id: shortId(),
            role: "user",
            content: input,
            status: "success",
            data: {
              user_real_time_data: {
                current_time: new Date().toString(),
                current_url: window.location.pathname,
              },
            },
          });
          d.input = "";
          d._handleAbort = () => {
            abortController.abort("stop by user");
            fetch("/api/ai/agent", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
              }),
            });
          };
        });
        await fetchEventSource("/api/ai/agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
          body: JSON.stringify({
            id,
            configs: {
              type: get().type,
            },
            userInput: input,
            context: get().context,
          }),
          onmessage(ev) {
            const data = ev.data;
            const results = ContextSchema.safeParse(data);
            if (results.success) {
              set((d) => {
                d.context = results.data;
              });
            }
          },
          onerror(_error) {
            set((d) => {
              d.context.dialog.push({
                id: shortId(),
                role: "system",
                content: "Chat aborted.",
                status: "error",
              });
              d.context.state = "idle";
            });
          },
          openWhenHidden: true,
        });
        await get().afterSubmit(set, get);
        set((d) => {
          d.loading = false;
        });
      },
      reset: () => {
        if (get().loading) return;
        set((d) => {
          d.context = ContextSchema.parse({});
          d.input = "";
          d.loading = false;
        });
      },
      toggleDebugMode: () => {
        set((d) => {
          d.debugMode = !d.debugMode;
        });
      },
      toggleShowThinking: () => {
        set((d) => {
          d.showThinking = !d.showThinking;
        });
      },
      editUserMessage: (id: string) => {
        set((d) => {
          const index = d.context.dialog.findIndex((m) => m.id === id);
          if (index !== -1) {
            d.input = d.context.dialog[index].content;
            d.context.dialog.splice(index, d.context.dialog.length - index);
          }
        });
      },
      deleteUserMessage: (id: string) => {
        set((d) => {
          const index = d.context.dialog.findIndex((m) => m.id === id);
          if (index !== -1) {
            d.context.dialog.splice(index, d.context.dialog.length - index);
          }
        });
      },
    },
  }));
