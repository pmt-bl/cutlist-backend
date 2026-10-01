import { PrismaClient } from '@prisma/client';

// A single shared instance — avoids opening a new database connection
// pool every time a file imports this module.
export const prisma = new PrismaClient();
