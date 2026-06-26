@echo off
echo ===================================================
echo Memulai Proses Update Website ke Hostinger...
echo ===================================================
echo.
echo 1. Melakukan Build Frontend (Biar aman dari OOM)...
call npm run build

echo.
echo 2. Mengupload File UI/Frontend (dist)...
scp -r dist/* u192460899@145.223.108.160:/home/u192460899/domains/ranggamukti.my.id/public_html/

echo.
echo 3. Mengupload File Backend (api) ^& .htaccess...
scp -r api u192460899@145.223.108.160:/home/u192460899/domains/ranggamukti.my.id/public_html/
scp .htaccess u192460899@145.223.108.160:/home/u192460899/domains/ranggamukti.my.id/public_html/

echo.
echo 4. Memperbaiki Bug Hak Akses Folder Server...
ssh 145.223.108.160 "find /home/u192460899/domains/ranggamukti.my.id/public_html -type d -exec chmod 755 {} +"

echo.
echo ====================================================
echo UPDATE 100%% BERHASIL! Silakan Refresh (Ctrl+F5) Web.
echo ====================================================
pause
