import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Admin@123', 12);

  const user = await prisma.user.upsert({
    where: {
      email: 'admin@aigovernance.com',
    },
    update: {},
    create: {
      email: 'admin@aigovernance.com',
      name: 'Platform Administrator',
      password,
      role: 'ADMIN',
    },
  });

  console.log('Created user:', user.email);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
