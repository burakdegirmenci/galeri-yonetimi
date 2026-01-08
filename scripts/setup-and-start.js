const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function setupAndStart() {
  console.log('🚀 Starting Galeri Yönetim Sistemi...\n');

  // Set default DATABASE_URL if not provided
  if (!process.env.DATABASE_URL) {
    console.log('📝 DATABASE_URL not set, using SQLite default...');
    process.env.DATABASE_URL = 'file:./prod.db';
  }

  try {
    // Step 1: Generate Prisma Client
    console.log('📦 Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client generated\n');

    // Step 2: Run migrations
    console.log('🔄 Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations completed\n');

    // Step 3: Check if admin user exists
    console.log('👤 Checking for admin user...');
    const prisma = new PrismaClient();

    try {
      const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@galeri.com' }
      });

      if (!adminUser) {
        console.log('🌱 Creating admin user...');
        execSync('npm run prisma:seed', { stdio: 'inherit' });
        console.log('✅ Admin user created\n');
      } else {
        console.log('✅ Admin user already exists, skipping seed\n');
      }
    } finally {
      await prisma.$disconnect();
    }

    // Step 4: Start the application
    console.log('🎉 Starting Next.js server...\n');
    execSync('npm run start:next', { stdio: 'inherit' });

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupAndStart();
