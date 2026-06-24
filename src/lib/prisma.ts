import { PrismaClient } from "@/generated/prisma";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  if (isPostgres) {
    return new PrismaClient();
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  return new PrismaClient({ adapter });
}

// Lazy singleton proxy: PrismaClient is NOT created at import time.
// It's created on first property access (first DB query).
// This prevents build errors when DATABASE_URL isn't available at build time.
function createProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_target, prop) {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
      }
      const value = (globalForPrisma.prisma as unknown as Record<string | symbol, unknown>)[prop];
      return typeof value === "function" ? value.bind(globalForPrisma.prisma) : value;
    },
  }) as PrismaClient;
}

/**
 * Singleton PrismaClient instance.
 * Uses lazy initialization via Proxy to avoid connecting to the database at module import time,
 * which would fail during Next.js build when DATABASE_URL isn't available.
 */
export const prisma: PrismaClient = globalForPrisma.prisma ?? createProxy();
