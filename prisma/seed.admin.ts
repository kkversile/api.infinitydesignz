import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim() || 'admin@example.com';
  const pwd = 'admin123'; // 🔑 Hard-coded reset password

  const hash = await bcrypt.hash(pwd, 12);

  const existing = await prisma.user.findFirst({
    where: { role: 'ADMIN', email },
  });

  if (existing) {
    // ✅ Reset password if admin already exists
    await prisma.user.update({
      where: { id: existing.id },
      data: { password: hash },
    });
    console.log(`Admin password reset to '${pwd}' for email: ${email}`);
    return;
  }



  console.log(`Admin created with password '${pwd}' for email: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
