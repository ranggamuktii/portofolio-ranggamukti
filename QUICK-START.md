# 🚀 Quick Start Guide

## Langkah-langkah Setup (Bahasa Indonesia)

### 1️⃣ Install Dependencies

```bash
npm install
```

✅ Sudah selesai!

### 2️⃣ Setup Database MySQL

**Buka MySQL:**

```bash
mysql -u root -p
```

**Buat database:**

```sql
CREATE DATABASE portfolio_db;
exit;
```

**Import schema dan data:**

```bash
mysql -u root -p portfolio_db < server/schema.sql
mysql -u root -p portfolio_db < server/seed.sql
```

### 3️⃣ Buat File .env

Copy file `.env.example` menjadi `.env`:

```bash
copy .env.example .env     # Windows
cp .env.example .env       # Mac/Linux
```

**Edit `.env` dan sesuaikan:**

```env
DB_PASSWORD=password_mysql_kamu
JWT_SECRET=ganti_dengan_string_random_yang_kuat
```

### 4️⃣ Jalankan Development Server

**Opsi A - Manual (2 Terminal):**

Terminal 1:

```bash
npm run server:dev
```

Terminal 2:

```bash
npm run dev
```

**Opsi B - Otomatis (Windows):**

```bash
start-dev.bat
```

**Opsi C - Otomatis (Mac/Linux):**

```bash
chmod +x start-dev.sh
./start-dev.sh
```

### 5️⃣ Akses Aplikasi

- **Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
  - Email: `admin@portfolio.com`
  - Password: `admin123`
- **API**: http://localhost:5000/api

## ✨ Fitur yang Sudah Tersedia

### Frontend

✅ Portfolio homepage dengan semua section
✅ Project detail pages
✅ Dark/Light theme toggle
✅ Smooth scroll & animations
✅ **Chatbot widget** (klik icon chat di kanan bawah)
✅ **Header baru** dengan tombol Download CV & Instagram

### Backend

✅ Express REST API
✅ MySQL database dengan 7 tables
✅ JWT authentication
✅ CRUD projects
✅ Social links management
✅ Chatbot FAQ system

### Admin Panel

✅ Login page dengan authentication
✅ Dashboard untuk manage projects
✅ Edit social media links
✅ Delete projects

## 🧪 Testing

### Test Chatbot

1. Buka website
2. Klik icon chat di kanan bawah
3. Coba tanya: "Apa saja layanan yang kamu tawarkan?"
4. Chatbot akan jawab dari FAQ database

### Test Admin

1. Buka http://localhost:5173/admin
2. Login dengan credentials di atas
3. Coba hapus atau edit project
4. Coba edit social links

### Test Projects

1. Homepage - lihat projects loading dari database
2. Klik salah satu project
3. Detail page loading dari database

## 📂 Struktur Project

```
portofolio-reactjs/
├── server/              ← Backend Express
│   ├── config/db.js    ← MySQL connection
│   ├── routes/         ← API endpoints
│   ├── middleware/     ← Auth middleware
│   ├── schema.sql      ← Database schema
│   └── seed.sql        ← Sample data
├── src/
│   ├── components/     ← React components
│   │   ├── ChatBot.jsx        ← Chatbot widget ✨
│   │   ├── AdminDashboard.jsx ← Admin UI ✨
│   │   └── Header.jsx         ← Updated header ✨
│   ├── pages/
│   │   └── AdminPage.jsx      ← Admin login ✨
│   ├── services/
│   │   └── api.js      ← API calls ✨
│   └── App.jsx         ← Main app + routes
├── .env                ← Environment vars (buat ini!)
├── SETUP.md           ← Detailed setup guide
├── IMPLEMENTATION.md  ← What's implemented
└── QUICK-START.md     ← This file
```

## 🎯 Fitur "Premium" yang Menonjol

### 1. Chatbot Interaktif 🤖

- Floating widget yang bisa di-expand
- Menjawab FAQ secara otomatis
- Session tracking
- Modern UI dengan animations

### 2. Admin Panel 👨‍💼

- Full CRUD untuk projects
- Manage social media links
- JWT authentication
- Professional dashboard UI

### 3. Header Modern 🎨

- Logo + Navigation + CTA buttons
- Download CV button
- Instagram button dengan gradient
- Responsive design

### 4. Full Stack Architecture 🏗️

- React frontend (SPA)
- Express backend (REST API)
- MySQL database (persistent data)
- JWT authentication (secure)

## 🔥 Next Steps (Opsional)

### Tambah Portfolio PDF

1. Buat PDF portfolio kamu
2. Save sebagai `public/portfolio.pdf`
3. Download button di header sudah siap!

### Customisasi Data

1. Login ke admin panel
2. Edit/hapus projects yang ada
3. Tambah projects baru
4. Update social media links

### Deploy ke Production

Lihat `SETUP.md` untuk deployment guide lengkap.

## ⚠️ Troubleshooting

### Database Connection Error

```bash
# Pastikan MySQL running
# Windows: check Services
# Mac: brew services list

# Test connection
mysql -u root -p
```

### Port Already in Use

```bash
# Ubah port di .env
PORT=5001  # ganti dari 5000
```

### Dependencies Error

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

Jika ada masalah atau pertanyaan:

1. Check `IMPLEMENTATION.md` untuk detail teknis
2. Check `SETUP.md` untuk setup lengkap
3. Lihat console browser untuk errors
4. Check terminal backend untuk server errors

---

**Happy Coding! 🚀**

_All core features implemented and ready to use!_
