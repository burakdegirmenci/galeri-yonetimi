# Galeri Yönetim Sistemi

Modern araç galerisi yönetim sistemi. Next.js 14, TypeScript, Tailwind CSS, Prisma ORM ve PostgreSQL ile geliştirilmiştir.

## Özellikler

- 🚗 Araç yönetimi (Ekleme, düzenleme, silme)
- 💰 Alım-satım işlem takibi
- 💸 Gider yönetimi
- 👥 Müşteri yönetimi
- 📊 Analitik ve raporlama
- 📸 Araç fotoğraf galerisi
- 📄 Ekspertiz PDF yükleme
- 🔐 JWT tabanlı kimlik doğrulama
- 🎨 Modern ve responsive UI

## Teknoloji Stack

- **Framework:** Next.js 14 (App Router)
- **Dil:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **ORM:** Prisma
- **Auth:** JWT with HTTP-only cookies
- **Charts:** Chart.js

## Kurulum

### 1. Projeyi klonlayın

```bash
git clone https://github.com/burakdegirmenci/galeri-yonetimi.git
cd galeri-yonetimi
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Environment variables

`.env.example` dosyasını `.env` olarak kopyalayın ve düzenleyin:

```bash
cp .env.example .env
```

Gerekli environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/galeri"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
NODE_ENV="development"
```

### 4. Veritabanını oluşturun

```bash
# Prisma migrate çalıştır
npm run prisma:migrate:deploy

# Seed data oluştur (admin kullanıcı)
npm run prisma:seed
```

### 5. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Production Deployment (Coolify)

### 1. GitHub Repository

Projeyi GitHub'a pushlayın:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/burakdegirmenci/galeri-yonetimi.git
git push -u origin main
```

### 2. Coolify Kurulumu

1. Coolify dashboard'da yeni bir proje oluşturun
2. "New Resource" > "GitHub App" seçin
3. Repository'yi seçin: `burakdegirmenci/galeri-yonetimi`

### 3. Environment Variables (Coolify)

Coolify'da aşağıdaki environment variables'ı ekleyin:

```env
DATABASE_URL=postgresql://user:password@postgres:5432/galeri
JWT_SECRET=your-production-secret-min-32-chars
NODE_ENV=production
```

### 4. Build Settings

Coolify otomatik olarak aşağıdaki komutları çalıştıracaktır:

- **Install:** `npm install`
- **Build:** `npm run build` (Prisma generate dahil)
- **Start:** `npm start`

### 5. Database Setup

Coolify'da PostgreSQL veritabanı ekleyin ve migrate komutunu çalıştırın:

```bash
npm run prisma:migrate:deploy
npm run prisma:seed
```

### 6. Volume Mounts (Uploads)

Dosya yüklemeleri için volume mount ekleyin:

- **Source:** `/var/www/uploads`
- **Destination:** `/app/public/uploads`

## Default Admin Credentials

İlk giriş için:

- **Email:** admin@galeri.com
- **Şifre:** admin123

**ÖNEMLİ:** İlk girişten sonra admin şifresini mutlaka değiştirin!

## Scripts

```bash
# Development
npm run dev                      # Geliştirme sunucusu
npm run build                    # Production build
npm start                        # Production sunucu

# Database
npm run prisma:generate          # Prisma client oluştur
npm run prisma:migrate          # Development migrate
npm run prisma:migrate:deploy   # Production migrate
npm run prisma:seed             # Seed data oluştur

# Code Quality
npm run lint                     # ESLint çalıştır
```

## Folder Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── panel/             # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema & migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/               # Static files
│   └── uploads/         # User uploads (not in git)
└── .env.example         # Environment variables template
```

## Lisans

MIT

## Destek

Sorularınız için: [Issues](https://github.com/burakdegirmenci/galeri-yonetimi/issues)
