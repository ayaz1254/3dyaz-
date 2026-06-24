import { PrismaClient } from "@/generated/prisma";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");

// SQLite (local dev) needs the better-sqlite3 adapter
// PostgreSQL (production) works with plain PrismaClient
let adapter: unknown = undefined;
if (!isPostgres) {
  const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
  adapter = new PrismaBetterSqlite3({ url: dbUrl });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient(adapter ? { adapter } : undefined);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
