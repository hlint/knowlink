import { prisma } from "@/lib/prisma";

export async function fetcherLoginHistory() {
  return prisma.loginHistory.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
}
