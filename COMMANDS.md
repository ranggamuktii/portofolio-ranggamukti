# 📋 Command Reference - Portfolio Project

## Quick Commands

### 🚀 Start Development

```bash
# Otomatis (Windows)
start-dev.bat

# Manual - Terminal 1 (Backend)
npm run server:dev

# Manual - Terminal 2 (Frontend)
npm run dev
```

### 📦 Setup Database

```bash
# Create database
mysql -u root -p
CREATE DATABASE portfolio_db;
exit;

# Import schema & data
mysql -u root -p portfolio_db < server/schema.sql
mysql -u root -p portfolio_db < server/seed.sql
```

### 🔧 Useful Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Start backend only
npm run server

# Start backend with auto-reload
npm run server:dev
```

### 🗄️ MySQL Commands

```bash
# Login to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use portfolio database
USE portfolio_db;

# Show tables
SHOW TABLES;

# View projects
SELECT * FROM projects;

# View admin user
SELECT * FROM users;

# Update admin password
UPDATE users SET password = 'NEW_HASH' WHERE email = 'admin@portfolio.com';
```

### 🔐 Access Points

- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5173/admin
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

### 📝 Default Credentials

```
Email: admin@portfolio.com
Password: admin123
```

⚠️ Change in production!

### 🧪 Test API with curl

```bash
# Health check
curl http://localhost:5000/api/health

# Get projects
curl http://localhost:5000/api/projects

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"admin123"}'

# Get FAQs
curl http://localhost:5000/api/chat/faqs
```

### 🛠️ Troubleshooting

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check ports
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process on port (Windows)
taskkill /F /PID <PID>

# MySQL status (Windows)
sc query MySQL80

# Restart MySQL (Windows)
net stop MySQL80
net start MySQL80
```

### 📁 Important Files

```
.env                    # Environment variables (create this!)
.env.example            # Template
server/schema.sql       # Database schema
server/seed.sql         # Sample data
QUICK-START.md          # Setup guide (ID)
README-FINAL.md         # Complete docs
```

### 🎯 npm Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "server": "node server/index.js",
  "server:dev": "nodemon server/index.js"
}
```

### 🔥 Common Tasks

**Add new project via MySQL:**

```sql
INSERT INTO projects (slug, title, img_src, tags, demo_link)
VALUES ('my-project', 'My Project', '/img.jpg', '["React"]', 'https://...');
```

**Update social link:**

```sql
UPDATE social_links
SET href = 'https://instagram.com/your_username'
WHERE platform = 'Instagram';
```

**View chat messages:**

```sql
SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 10;
```

**Backup database:**

```bash
mysqldump -u root -p portfolio_db > backup.sql
```

**Restore database:**

```bash
mysql -u root -p portfolio_db < backup.sql
```

### 🚀 Production Deploy

**Build:**

```bash
npm run build
```

**Environment variables to set:**

```
NODE_ENV=production
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=portfolio_db
JWT_SECRET=strong_random_secret
PORT=5000
```

### 📊 Project Stats

- Total Files: 25+ created/modified
- Backend Routes: 4 (auth, projects, social, chat)
- Database Tables: 7
- React Components: 15+
- API Endpoints: 10+

### 🎨 Customization Quick Links

**Change colors:**

- Edit: `tailwind.config.js`

**Update branding:**

- Edit: `src/components/Header.jsx`
- Edit: `src/components/Footer.jsx`

**Add new page:**

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`

**Add new API endpoint:**

1. Create route file in `server/routes/`
2. Import in `server/index.js`

---

**Quick Help:**

- Setup: `QUICK-START.md`
- Details: `README-FINAL.md`
- Tech: `IMPLEMENTATION.md`
