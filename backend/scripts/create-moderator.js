const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const email = process.argv[2] || 'moderator@example.com';
const password = process.argv[3] || 'Moderator@123';

async function main() {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User already exists with email ${email}. Role: ${existing.role}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'Moderator',
    },
  });

  console.log('Moderator account created successfully:');
  console.log(`  Email: ${user.email}`);
  console.log(`  Password: ${password}`);
  console.log('Use this account to manage announcements and moderation tasks.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
