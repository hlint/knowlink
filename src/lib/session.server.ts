import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { env } from "./env.server";
import { type SessionPayload, SessionPayloadSchema } from "./session.define";

const COOKIE_NAME = "app_session";
const getExpiresAt = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

function getEncodedKey() {
  const secretKey = env().SESSION_SECRET;
  const encodedKey = new TextEncoder().encode(secretKey);
  return encodedKey;
}

async function encrypt(payload: SessionPayload) {
  return new SignJWT(SessionPayloadSchema.parse(payload))
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(getExpiresAt())
    .sign(getEncodedKey());
}

async function decrypt(session = "") {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return SessionPayloadSchema.parse(payload);
  } catch (_error) {
    return SessionPayloadSchema.parse({});
  }
}

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value ?? "";
  return decrypt(session);
});

export async function updateSession(payload: Partial<SessionPayload> = {}) {
  const prevSession = await getSession();
  const session = await encrypt({ ...prevSession, ...payload });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    // secure: true,
    expires: getExpiresAt(),
    sameSite: "lax",
    path: "/",
  });
}
