import { PrismaClient } from "@/generated/prisma";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let createPrismaClient: () => PrismaClient;

if (isPostgres) {
  createPrismaClient = () => new PrismaClient();
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  createPrismaClient = () => new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
