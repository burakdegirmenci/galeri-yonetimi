# 🚗 Galeri Yönetim Sistemi

Modern araç galerisi yönetim sistemi. Next.js 14, TypeScript, Tailwind CSS, Prisma ORM ve PostgreSQL ile geliştirilmiştir.

## ✨ Özellikler

- 🚗 Araç yönetimi (Ekleme, düzenleme, silme, plaka bazlı)
- 💰 Alım-satım işlem takibi
- 💸 Gider yönetimi
- 👥 Müşteri yönetimi
- 📊 Analitik ve raporlama
- 📸 Araç fotoğraf galerisi
- 📄 Ekspertiz PDF yükleme
- 🔐 JWT tabanlı kimlik doğrulama
- 🎨 Modern ve responsive UI

## 🛠 Teknoloji Stack

- **Framework:** Next.js 14 (App Router)
- **Dil:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT with HTTP-only cookies
- **Charts:** Chart.js

---

## 🚀 One-Click Deployment (Coolify)

### **Otomatik Kurulum - Hiçbir Manuel Ayar Gerekmez!**

Bu proje **tek tıkla** deploy edilebilir şekilde hazırlanmıştır:

✅ Database migration otomatik çalışır
✅ Admin kullanıcı otomatik oluşturulur
✅ JWT secret yoksa otomatik generate edilir
✅ Hiçbir manuel komut veya ayar gerekmez

---

### 📋 Deploy Adımları

#### **1. PostgreSQL Database Ekle**

Coolify dashboard'da:
1. "New Resource" → "Database" → "PostgreSQL"
2. İsim ver ve "Create" butonuna bas
3. DATABASE_URL otomatik atanacak ✅

#### **2. GitHub Repository Bağla**

1. "New Resource" → "GitHub App"
2. Repository: `burakdegirmenci/galeri-yonetimi`
3. Branch: `main`
4. Service type: "Application"

#### **3. Deploy!**

**Hiçbir environment variable eklemeniz gerekmez!**

- `DATABASE_URL` → Coolify otomatik sağlar (PostgreSQL service'ten)
- `JWT_SECRET` → Yoksa otomatik generate edilir
- `NODE_ENV` → Otomatik `production`

Sadece **"Deploy"** butonuna basın! 🎉

---

### 🎯 Deploy Sonrası

Deploy tamamlandığında sistem **tamamen kullanıma hazır** olacak:

**Default Admin Girişi:**
- **Email:** `admin@galeri.com`
- **Şifre:** `admin123`

⚠️ **ÖNEMLİ:** İlk girişten sonra admin şifresini mutlaka değiştirin!

---

### 🔧 İsteğe Bağlı Ayarlar

#### Persistent JWT Secret (Önerilen)

Server yeniden başladığında kullanıcı oturumlarının devam etmesini istiyorsanız:

```bash
# Coolify Environment Variables'a ekleyin:
JWT_SECRET=your-secure-random-32-char-string
```

Oluşturmak için: `openssl rand -base64 32`

#### File Upload Storage (Persistent Volume)

Dosya yüklemeleri için kalıcı depolama:

1. Coolify → Volumes → "Add Volume"
2. Mount path: `/app/public/uploads`
3. Kaydet

---

## 💻 Local Development

### Gereksinimler

- Node.js 18+
- PostgreSQL veya SQLite

### Kurulum

```bash
# Clone repository
git clone https://github.com/burakdegirmenci/galeri-yonetimi.git
cd galeri-yonetimi

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# .env dosyasını düzenleyin

# Run migrations
npx prisma migrate dev

# Seed admin user
npm run prisma:seed

# Start dev server
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

---

## 📁 Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── panel/             # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions & config
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # Migration files
│   └── seed.ts           # Seed script
├── scripts/              # Deployment scripts
│   └── setup-and-start.js  # Auto-setup on deploy
├── public/               # Static files
│   └── uploads/         # User uploads (gitignored)
└── .env.example         # Environment template
```

---

## 📜 Scripts

```bash
# Development
npm run dev                      # Geliştirme sunucusu
npm run build                    # Production build
npm start                        # Production sunucu (auto-setup dahil)
npm run start:next              # Direct Next.js start (no setup)

# Database
npm run prisma:generate          # Prisma client oluştur
npm run prisma:migrate          # Development migrate
npm run prisma:migrate:deploy   # Production migrate
npm run prisma:seed             # Seed data oluştur

# Code Quality
npm run lint                     # ESLint çalıştır
```

---

## 🔐 Güvenlik

- JWT authentication with HTTP-only cookies
- Bcrypt password hashing
- CSRF protection via sameSite cookies
- Environment-based secrets
- Auto-generated JWT secret if not provided

---

## 📝 Lisans

MIT

---

## 🆘 Destek

Sorular veya sorunlar için: [GitHub Issues](https://github.com/burakdegirmenci/galeri-yonetimi/issues)

---

## 🙏 Teşekkürler

Modern araç galerisi yönetimi için tasarlandı. Katkılarınızı bekliyoruz!
