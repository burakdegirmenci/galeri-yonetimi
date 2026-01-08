# 🚗 Galeri Yönetim Sistemi

Modern araç galerisi yönetim sistemi. Next.js 14, TypeScript, Tailwind CSS, Prisma ORM ile geliştirilmiştir.

## ✨ Özellikler

- 🚗 Araç yönetimi (Plaka bazlı, ekleme, düzenleme, silme)
- 💰 Alım-satım işlem takibi
- 💸 Gider yönetimi
- 👥 Müşteri yönetimi
- 📊 Analitik ve raporlama
- 📸 Araç fotoğraf galerisi
- 📄 Ekspertiz PDF yükleme
- 🔐 JWT tabanlı kimlik doğrulama
- 🎨 Modern ve responsive Tailwind CSS UI

---

## 🚀 Tek Tık Deploy (Coolify)

### **SADECE 2 ADIM - Hiçbir Ayar Gerekmez!**

#### 1️⃣ GitHub Repository Bağla

Coolify dashboard'da:
- "New Resource" → "GitHub App"
- Repository: `burakdegirmenci/galeri-yonetimi`
- Branch: `main`

#### 2️⃣ Deploy Butonuna Bas

**Hiçbir environment variable eklemeyin!**

Otomatik olarak:
- ✅ SQLite database oluşur
- ✅ Migration çalışır
- ✅ Admin kullanıcı oluşur
- ✅ JWT secret generate edilir
- ✅ Sistem çalışır duruma gelir

**Hepsi bu kadar!** 🎉

---

## 🔑 İlk Giriş

Deploy tamamlandıktan sonra:

- **Email:** `admin@galeri.com`
- **Şifre:** `admin123`

⚠️ **ÖNEMLİ:** İlk girişten sonra şifreyi mutlaka değiştirin!

---

## 📦 Persistent Storage (Önerilen)

### Database ve Uploads için Volume

Coolify'da volume ekleyin:

```bash
# Database için
/app/prisma/prod.db

# Uploads için
/app/public/uploads
```

Bu sayede restart'larda verileriniz korunur.

---

## 🔧 İsteğe Bağlı: PostgreSQL

Daha fazla performans ve ölçeklenebilirlik için PostgreSQL kullanabilirsiniz:

1. Coolify'da PostgreSQL service ekleyin
2. Environment variable ekleyin:
   ```
   DATABASE_URL=postgresql://user:pass@postgres:5432/galeri
   ```
3. Schema'yı PostgreSQL için güncelleyin ve redeploy edin

---

## 💻 Local Development

```bash
# Clone
git clone https://github.com/burakdegirmenci/galeri-yonetimi.git
cd galeri-yonetimi

# Install
npm install

# Setup
cp .env.example .env

# Migrate
npx prisma migrate dev

# Seed
npm run prisma:seed

# Dev server
npm run dev
```

http://localhost:3000

---

## 📁 Proje Yapısı

```
├── app/                   # Next.js App Router
│   ├── api/              # API endpoints
│   ├── panel/            # Dashboard pages
│   └── giris/            # Login page
├── components/           # React components
├── lib/                  # Utils & config
├── prisma/              # Database schema & migrations
├── scripts/             # Deployment scripts
│   └── setup-and-start.js  # Auto-setup on start
└── public/uploads/      # File uploads
```

---

## 🛠 Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm start                # Production (auto-setup + start)
npm run start:next       # Direct Next.js start
npm run prisma:generate  # Generate Prisma client
npm run prisma:seed      # Create admin user
```

---

## 🔐 Güvenlik

- JWT authentication with HTTP-only cookies
- Bcrypt password hashing
- Auto-generated JWT secret
- CSRF protection
- Secure file uploads

---

## 📝 Lisans

MIT

---

## 🙏 Katkıda Bulunun

Pull request'ler memnuniyetle karşılanır!

Issues: [GitHub Issues](https://github.com/burakdegirmenci/galeri-yonetimi/issues)
