const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const email = process.argv[2] || 'billingadmin@example.com';
const password = process.argv[3] || 'BillingAdmin@123';

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
      role: 'BillingPayrollAdmin',
    },
  });

  console.log('Billing admin account created successfully:');
  console.log(`  Email: ${user.email}`);
  console.log(`  Password: ${password}`);
  console.log('Use this account to log in at the admin portal.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
