// server action data access layer

import { redirect } from "next/navigation";
import { getSession } from "./lib/session.server";

export async function checkUserAdmin() {
  const session = await getSession();
  if (session.userRole !== "admin") {
    redirect("/auth/login");
  }
  return session;
}
