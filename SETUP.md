# Portfolio Website with Admin Panel & Chatbot

Modern portfolio website built with React, Express, and MySQL featuring an admin panel for content management and an intelligent chatbot.

## Features

### Frontend

- ✨ Modern, responsive design with TailwindCSS
- 🎨 Smooth animations with GSAP
- 🚀 Fast performance with Vite
- 📱 Mobile-first approach
- 🌓 Dark/Light theme support

### Premium Features

- 🤖 **AI Chatbot**: FAQ-based chatbot for visitor engagement
- 👨‍💼 **Admin Panel**: Full CRUD operations for projects and content
- 🔒 **Authentication**: JWT-based secure authentication
- 📊 **Database**: MySQL for persistent data storage
- 🔗 **Social Links Management**: Dynamic social media links

## Tech Stack

### Frontend

- React 19
- Vite 6
- TailwindCSS
- GSAP (animations)
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MySQL 2
- JWT (authentication)
- bcryptjs (password hashing)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create MySQL database and import schema:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE portfolio_db;
```

Import schema and seed data:

```bash
mysql -u root -p portfolio_db < server/schema.sql
mysql -u root -p portfolio_db < server/seed.sql
```

### 3. Environment Configuration

Create `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 4. Run Development Servers

**Terminal 1 - Frontend (Vite):**

```bash
npm run dev
```

**Terminal 2 - Backend (Express):**

```bash
npm run server:dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000

### 5. Admin Access

Navigate to: http://localhost:5173/admin

**Default credentials:**

- Email: `admin@portfolio.com`
- Password: `admin123`

⚠️ **Change default password in production!**

## Project Structure

```
portofolio-reactjs/
├── public/              # Static assets
├── server/              # Backend Express server
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API routes
│   ├── index.js         # Server entry point
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Seed data
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── .env                 # Environment variables (create this)
├── .env.example         # Example env file
├── package.json
└── vite.config.js       # Vite configuration with proxy
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Verify token

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:slug` - Get single project
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

### Social Links

- `GET /api/social` - Get all social links
- `PUT /api/social` - Update social links (auth required)

### Chat

- `POST /api/chat` - Send chat message
- `GET /api/chat/faqs` - Get FAQs

## Features in Detail

### Admin Panel

- **Projects Management**: Add, edit, delete portfolio projects
- **Social Links**: Update Instagram, LinkedIn, GitHub, etc.
- **Secure Authentication**: JWT-based session management

### Chatbot

- FAQ-based responses
- Session tracking
- Expandable to AI integration (OpenAI, etc.)

### Modern UI/UX

- Smooth scroll with Lenis
- GSAP scroll animations
- Responsive design
- Theme toggle

## Production Deployment

### Update Password

Before deploying, update the admin password:

```sql
UPDATE users SET password = '$2a$10$NEW_HASHED_PASSWORD' WHERE email = 'admin@portfolio.com';
```

### Environment Variables

Set production environment variables on your hosting platform.

### Build

```bash
npm run build
```

### Deploy Options

- **Frontend**: Vercel, Netlify (with serverless functions)
- **Backend**: Render, Railway, Fly.io
- **Database**: PlanetScale, AWS RDS, DigitalOcean

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start Express server
- `npm run server:dev` - Start Express server with nodemon

## License

MIT

## Author

Rangga Mukti

- GitHub: [@ranggamuktii](https://github.com/ranggamuktii)
- Instagram: [@ranggamuktii](https://www.instagram.com/ranggamuktii)
