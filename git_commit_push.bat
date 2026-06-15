@echo off
echo "Committing docs and scripts..."
git add *.md *.bat *.sh .env.example
git commit -m "docs: add setup instructions and scripts"
git push origin main

echo "Committing backend and DB setup..."
git add server/ src/services/ setup-database.js test-db.js add-company-logo.js add-logo-column.js
git commit -m "feat: add backend server and database setup"
git push origin main

echo "Committing components and pages..."
git add src/components/ src/pages/ src/App.jsx src/ThemeProvider.jsx
git commit -m "feat: update components and pages"
git push origin main

echo "Committing config and assets..."
git add public/ src/App.css src/index.css tailwind.config.js vite.config.js package.json package-lock.json index.html .gitignore
git commit -m "chore: update configuration and assets"
git push origin main

echo "Committing remaining files..."
git add -A
git commit -m "chore: final cleanup and delete unused files"
git push origin main

echo "All done!"
