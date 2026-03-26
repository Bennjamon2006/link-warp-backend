import { PrismaClient, User, Space, Link } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import config from './config';

const adapter = new PrismaPg({
  connectionString: config.database.url,
});

export const prisma = new PrismaClient({
  adapter,
});

let isConnected = false;

export async function connect() {
  if (isConnected) return;

  await prisma.$connect();

  isConnected = true;

  console.log('Connected to the database');
}

export async function disconnect() {
  if (!isConnected) return;

  await prisma.$disconnect();

  isConnected = false;

  console.log('Disconnected from the database');
}

export { User, Space, Link };
