import { z } from "zod";

export const SessionPayloadSchema = z.object({
  userRole: z.enum(["guest", "user", "admin"]).default("guest"),
  userId: z.string().default(""),
  username: z.string().default(""),
  loginTime: z.string().default(""),
});

export type SessionPayload = z.infer<typeof SessionPayloadSchema>;
export type SessionPayloadClient = Omit<SessionPayload, "userId">;
