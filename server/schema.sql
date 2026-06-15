-- Portfolio Database Schema
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Users table (for admin authentication)
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  img_src VARCHAR(500),
  tags TEXT, -- JSON array of tags
  demo_link VARCHAR(500),
  github_link VARCHAR(500),
  description TEXT,
  role VARCHAR(255),
  problem TEXT,
  solution TEXT,
  technologies TEXT, -- JSON array of technologies
  features TEXT, -- JSON array of features
  screenshots TEXT, -- JSON array of screenshot URLs
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  label VARCHAR(100) NOT NULL,
  href VARCHAR(500) NOT NULL,
  icon VARCHAR(100), -- icon name/class
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  img_src VARCHAR(500) NOT NULL,
  label VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- frontend, backend, tools, etc.
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews/Testimonials table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  img_src VARCHAR(500),
  company VARCHAR(255),
  rating INT DEFAULT 5,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages (for logging/FAQ)
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(255),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  is_faq BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (username: rangz, password: rangzadmin05 - hashed with bcrypt)
-- Password hash for 'rangzadmin05'
INSERT IGNORE INTO users (username, password, name) VALUES 
('rangz', '$2a$10$rI5nOB.yHzXXBEvnW5mrm.EnIU7eyg9RSlGQHOOXskNjaGjs3r3v6', 'Admin');

-- Insert default social links
INSERT IGNORE INTO social_links (platform, label, href, icon, order_index) VALUES
('GitHub', 'GitHub', 'https://github.com/ranggamuktii', 'logo-github', 1),
('LinkedIn', 'LinkedIn', 'https://www.linkedin.com/in/rangga-mukti', 'logo-linkedin', 2),
('Instagram', 'Instagram', 'https://www.instagram.com/ranggamuktii', 'logo-instagram', 3),
('Twitter', 'Twitter', 'https://x.com/ranggamuktii', 'logo-twitter', 4);

-- Insert default FAQs for chatbot
INSERT IGNORE INTO faqs (question, answer, category, order_index) VALUES
('Apa saja layanan yang kamu tawarkan?', 'Saya menawarkan layanan pengembangan web fullstack, termasuk frontend (React, Vue), backend (Node.js, Express), dan database (MySQL, MongoDB). Saya juga bisa membantu dengan deployment dan maintenance.', 'services', 1),
('Berapa lama waktu pengerjaan project?', 'Waktu pengerjaan bergantung pada kompleksitas project. Website sederhana bisa selesai 1-2 minggu, sementara aplikasi kompleks bisa memakan waktu 1-3 bulan. Saya akan berikan timeline yang jelas setelah diskusi kebutuhan.', 'timeline', 2),
('Bagaimana cara menghubungi kamu?', 'Kamu bisa menghubungi saya melalui email di contact section, atau langsung chat via social media yang tertera di footer website ini.', 'contact', 3),
('Apakah menerima project freelance?', 'Ya, saya terbuka untuk project freelance. Silakan hubungi saya untuk diskusi lebih lanjut tentang kebutuhan project kamu.', 'services', 4);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date VARCHAR(50),
  end_date VARCHAR(50),
  description TEXT,
  logo_icon VARCHAR(100) DEFAULT 'work',
  is_education BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table (Key-Value pairs for global site data)
CREATE TABLE IF NOT EXISTS settings (
  key_name VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings if they don't exist
INSERT IGNORE INTO settings (key_name, value) VALUES 
('hero_title', 'Hi, I''m Rangga Mukti'),
('hero_subtitle', 'Fullstack Web Developer crafting seamless digital experiences.'),
('about_text', 'I am an enthusiastic Fullstack Developer with a passion for building scalable web applications. I love solving complex problems and turning ideas into reality.'),
('cv_link', '#'),
('contact_email', 'hello@ranggamukti.com');

-- Messages table (Inbox)
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Page views table (Analytics)
CREATE TABLE IF NOT EXISTS page_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_path VARCHAR(255) UNIQUE NOT NULL,
  view_count INT DEFAULT 0,
  last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


