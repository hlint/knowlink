import { createStringAccessProxy } from "@/lib/create-obj-access-proxy";
import type { MapType } from "@/lib/type-tools";
import type { Messages } from "@/locales/en";

export function getTypedMessages() {
  const m1 = createStringAccessProxy();
  const m2 = m1 as unknown as MapType<Messages, string>;
  return m2;
}

export const typedMessages = getTypedMessages();
