import { PrismaClient } from "@prisma/client";

// Én PrismaClient pr. proces — genbruges på tværs af hot reloads i dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
