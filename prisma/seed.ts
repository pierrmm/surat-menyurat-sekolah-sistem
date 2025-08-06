import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@sekolah.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@sekolah.com',
      password: hashedPassword,
      role: 'admin',
      is_active: true,
    },
  });

  console.log('Created admin user:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
