import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

    console.log(process.env.ADMIN_EMAIL, process.env.ADMIN_PHONE, process.env.ADMIN_PASSWORD);
  const email = process.env.ADMIN_EMAIL?.trim();
  const pwd   = process.env.ADMIN_PASSWORD;

  if (!email  || !pwd) {
    console.log('Seed skipped: ADMIN_EMAIL / ADMIN_PHONE / ADMIN_PASSWORD missing.');
    return;
  }

  const existing = await prisma.user.findFirst({
    where: { role: 'ADMIN', OR: { email } },
  });

  if (existing) {
    console.log('Admin already exists. Skipping.');
    return;
  }

  const hash = await bcrypt.hash(pwd, 12);

  await prisma.user.create({
    data: {
      name:   'Administrator',
      email,
        phone:  process.env.ADMIN_PHONE?.trim() || '0000000000',
      role:   'ADMIN',
      password: hash,
      status:  true,
    },
  });

  console.log('Admin user seeded from .env.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
