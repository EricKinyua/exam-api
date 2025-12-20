import { PrismaClient } from './../generated/prisma/client';
const prisma = new PrismaClient();

/*
 * Users
 */
const usersData = [
];

async function seedUsers() {
//   for (const userData of usersData) {
//     const { emailAddress } = userData;
//     await prisma.user.upsert({
//       where: { emailAddress },
//       update: {},
//       create: userData,
//     });
//   }
}

async function main() {
  console.log('🌱 Seeding database...');

  console.log('🌱 Attempting to seed users...');
  await seedUsers();
  console.log('🌱 Users seeding completed...');

  console.log('✅ Seeding completed!');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (error) => {
    console.error('❌ Seeding failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });