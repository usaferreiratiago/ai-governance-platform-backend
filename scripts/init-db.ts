/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing AI Governance Platform database...');

  await prisma.$connect();

  console.log('Database connection successful');

  const settings = await prisma.systemSetting.findFirst({
    where: {
      key: 'platform_initialized',
    },
  });

  if (!settings) {
    await prisma.systemSetting.create({
      data: {
        key: 'platform_initialized',
        value: 'true',
        description:
          'Indicates that AI Governance Platform database was initialized',
      },
    });
  }

  console.log('Database initialization completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
