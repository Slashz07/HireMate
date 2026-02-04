import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });//it says Create and manage a group of open database connections for me.
// Whenever needed ,prisma instead of having to create a new connection each time , just borrows the connection from this pool and when its done,it returns the conneection back to the pool

const adapter = new PrismaPg(pool);//it tells prisma to use the pool instead of creating an individual connection

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Pass the adapter to the constructor
export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}