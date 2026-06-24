import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl?.startsWith("postgresql://") || dbUrl?.startsWith("postgres://")) {
    return new PrismaClient({ adapter: new PrismaNeon({ connectionString: dbUrl }) });
  }

  // SQLite fallback — used in local dev (DATABASE_URL="file:./dev.db")
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: dbUrl || "file:./dev.db" }) });
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = buildClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return getPrisma()[prop as keyof PrismaClient];
  },
});
