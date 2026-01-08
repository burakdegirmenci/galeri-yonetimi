#!/bin/bash

echo "🚀 Starting Galeri Yönetim Sistemi..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Check if admin user exists, if not run seed
echo "🌱 Checking for admin user..."
ADMIN_EXISTS=$(npx prisma db execute --stdin <<EOF
SELECT COUNT(*) as count FROM "User" WHERE email = 'admin@galeri.com';
EOF
)

if [[ "$ADMIN_EXISTS" == *"0"* ]]; then
  echo "👤 Creating admin user..."
  npm run prisma:seed
else
  echo "✅ Admin user already exists, skipping seed..."
fi

# Start the application
echo "🎉 Starting application..."
exec npm start
