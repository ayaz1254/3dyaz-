import { PrismaClient } from "@/generated/prisma";

function buildClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "";

  if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const { Pool } = require("@neondatabase/serverless");
    return new PrismaClient({ adapter: new PrismaNeon(new Pool({ connectionString: dbUrl })) });
  }

  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: dbUrl || "file:./dev.db" }) });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = buildClient();
  }
  return globalForPrisma.prisma;
}

// Lazy singleton: PrismaClient is created on first property access, not at module import time.
// This prevents build-time errors when DATABASE_URL isn't available during Next.js build.
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return getPrisma()[prop as keyof PrismaClient];
  },
});
