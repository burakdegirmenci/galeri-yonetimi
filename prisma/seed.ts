import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@galeri.com' },
    update: {},
    create: {
      email: 'admin@galeri.com',
      passwordHash,
      name: 'Admin Kullanıcı',
      role: 'ADMIN',
    },
  })

  console.log('✅ Seed tamamlandı!')
  console.log('📧 Email: admin@galeri.com')
  console.log('🔑 Şifre: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
