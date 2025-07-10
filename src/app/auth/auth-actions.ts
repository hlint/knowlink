"use server";
import path from "node:path";
import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";
import { updateSession } from "@/lib/session.server";
import fs from "fs-extra";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword } from "./utils";

export async function actionLogin(data: unknown) {
  const { username, passwordHash } = z
    .object({
      username: z.string(),
      passwordHash: z.string(),
    })
    .parse(data);
  const { success, error } = verifyAdmin(username, passwordHash);
  if (success) {
    await prisma.loginHistory.create({
      data: {
        username,
        action: "login",
        ip: await getClientIp(),
        ua: await getClientUserAgentInfo(),
      },
    });
    await updateSession({
      username,
      userId: "admin",
      userRole: "admin",
      loginTime: new Date().toISOString(),
    });
  }
  return { success, error };
}

export async function actionUpdatePassword(data: unknown) {
  const { username } = await checkUserAdmin();
  const { currentPasswordHash, newPasswordHash } = z
    .object({
      currentPasswordHash: z.string().min(1),
      newPasswordHash: z.string().min(1),
    })
    .parse(data);
  const { success, error } = verifyAdminPassword(currentPasswordHash);
  if (!success) {
    return { success: false, error };
  }
  await prisma.loginHistory.create({
    data: {
      username,
      action: "change-password",
      ip: await getClientIp(),
      ua: await getClientUserAgentInfo(),
    },
  });
  updateAdminAuth({
    passwordHash: newPasswordHash,
  });
  return { success: true, error: null };
}

export async function actionLogout() {
  const { username } = await checkUserAdmin();
  await prisma.loginHistory.create({
    data: {
      username,
      action: "logout",
      ip: await getClientIp(),
      ua: await getClientUserAgentInfo(),
    },
  });
  await updateSession({
    username: "",
    userId: "",
    userRole: "guest",
  });
  redirect("/auth/login");
}

export async function actionUpdateUsername(data: { username: string }) {
  await checkUserAdmin();
  const { username } = z.object({ username: z.string() }).parse(data);
  await prisma.loginHistory.create({
    data: {
      username,
      action: "update-username",
      ip: await getClientIp(),
      ua: await getClientUserAgentInfo(),
    },
  });
  updateAdminAuth({
    username,
  });
  await updateSession({ username });
  revalidatePath("/");
  return { success: true, error: null };
}

async function getClientUserAgentInfo() {
  const headersList = await headers();
  return headersList.get("user-agent") || "unknown";
}

async function getClientIp() {
  const headersList = await headers();
  const xForwardedFor = headersList.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return (
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") || // Cloudflare
    headersList.get("x-vercel-forwarded-for") || // Vercel
    "unknown"
  );
}

const authFilePath = path.join(process.cwd(), "runtime", "auth.json");

function getAdminAuth() {
  const adminAuth = {
    username: "admin",
    passwordHash: hashPassword("123456"),
    verifyTime: new Date().getTime() - 1000 * 4,
  };
  try {
    const data = z
      .object({
        username: z.string(),
        passwordHash: z.string(),
        verifyTime: z.number(),
      })
      .parse(fs.readJSONSync(authFilePath));
    Object.assign(adminAuth, data);
  } catch (_error) {
    console.log("auth.json cannot be read, creating new one");
    fs.writeJSONSync(authFilePath, adminAuth);
  }
  return adminAuth;
}

function verifyAdmin(username: string, passwordHash: string) {
  // default account is not limited by frequency for testing
  const isDefaultAccount =
    username === "admin" && passwordHash === hashPassword("123456");
  const adminAuth = getAdminAuth();
  updateAdminAuth({
    verifyTime: new Date().getTime(),
  });
  if (
    !isDefaultAccount &&
    adminAuth.verifyTime > new Date().getTime() - 1000 * 3
  ) {
    return {
      success: false,
      error: "Action too frequent, please try again later",
    };
  }
  if (
    username === adminAuth.username &&
    passwordHash === adminAuth.passwordHash
  ) {
    return {
      success: true,
      error: null,
    };
  }
  return {
    success: false,
    error: "Invalid username or password",
  };
}

function verifyAdminPassword(passwordHash: string) {
  const adminAuth = getAdminAuth();
  if (adminAuth.verifyTime > new Date().getTime() - 1000 * 3) {
    updateAdminAuth({
      verifyTime: new Date().getTime(),
    });
    return {
      success: false,
      error: "Action too frequent, please try again later",
    };
  }
  if (passwordHash === adminAuth.passwordHash) {
    return {
      success: true,
      error: null,
    };
  }
  return {
    success: false,
    error: "Invalid password",
  };
}

function updateAdminAuth(authData: {
  username?: string;
  passwordHash?: string;
  verifyTime?: number;
}) {
  const adminAuth = getAdminAuth();
  fs.writeJSONSync(authFilePath, {
    ...adminAuth,
    ...authData,
  });
}
