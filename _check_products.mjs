import { PrismaClient } from './src/generated/prisma/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
const p = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' }) });
const products = await p.product.findMany({ where: { isPublished: true }, select: { id: true, name: true, slug: true, fileUrl: true, isDigital: true, images: true, colors: true } });
console.log(JSON.stringify(products, null, 2));
const dc = '$disconnect';
await p[dc]();
