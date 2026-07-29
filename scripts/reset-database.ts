/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting database');

  await prisma.auditLog.deleteMany();

  await prisma.benchmarkRun.deleteMany();

  await prisma.semanticTable.deleteMany();

  await prisma.dataDomain.deleteMany();

  await prisma.user.deleteMany();

  console.log('Database cleaned');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
