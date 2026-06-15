#!/bin/bash

echo "========================================"
echo "   Database Setup Script"
echo "========================================"
echo ""
echo "STEP 1: Creating database..."
echo ""

mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo ""
echo "STEP 2: Importing schema..."
mysql -u root -p portfolio_db < server/schema.sql

echo ""
echo "STEP 3: Importing seed data..."
mysql -u root -p portfolio_db < server/seed.sql

echo ""
echo "========================================"
echo "   Database Setup Complete!"
echo "========================================"
echo ""
echo "Database: portfolio_db"
echo "Tables: 7 (users, projects, social_links, skills, reviews, chat_messages, faqs)"
echo "Default Admin: admin@portfolio.com / admin123"
echo ""
