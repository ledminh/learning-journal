import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClient: PrismaClient | undefined;
}

const prismaClient = globalThis.prismaClient || new PrismaClient();

if (process.env.NODE_ENV === "development")
  globalThis.prismaClient = prismaClient;

export default prismaClient;
