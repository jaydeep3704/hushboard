import { PrismaClient } from "@/generated/prisma";

// Only create one Prisma client instance


// Global reference to ensure singleton pattern in serverless environments
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prisma=globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
