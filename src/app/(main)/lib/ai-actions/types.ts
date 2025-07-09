export type ClientEffect = {
  type: "client_effect";
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  params: Record<string, any>;
  state: "sent" | "applied" | "error";
  error_message?: string;
};

export type ClientEffectHandler = (effect: ClientEffect) => Promise<boolean>;
