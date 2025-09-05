@echo off
echo 🔧 Fixing PHP Extensions...

set PHP_DIR=C:\Users\Ryzen\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.1_Microsoft.Winget.Source_8wekyb3d8bbwe
set PHP_INI=%PHP_DIR%\php.ini

if not exist "%PHP_INI%" (
    echo ❌ php.ini not found at %PHP_INI%
    echo Trying to find php.ini...
    for /f "tokens=*" %%i in ('php --ini ^| findstr "Loaded Configuration File"') do echo %%i
    pause
    exit /b 1
)

echo 💾 Backing up php.ini...
copy "%PHP_INI%" "%PHP_INI%.backup"

echo 🔨 Enabling extensions...
powershell -Command "(gc '%PHP_INI%') -replace ';extension=pdo_sqlite', 'extension=pdo_sqlite' | Out-File -encoding ASCII '%PHP_INI%'"
powershell -Command "(gc '%PHP_INI%') -replace ';extension=sqlite3', 'extension=sqlite3' | Out-File -encoding ASCII '%PHP_INI%'"
powershell -Command "(gc '%PHP_INI%') -replace ';extension=pdo_mysql', 'extension=pdo_mysql' | Out-File -encoding ASCII '%PHP_INI%'"
powershell -Command "(gc '%PHP_INI%') -replace ';extension=mysqli', 'extension=mysqli' | Out-File -encoding ASCII '%PHP_INI%'"
powershell -Command "(gc '%PHP_INI%') -replace ';extension=curl', 'extension=curl' | Out-File -encoding ASCII '%PHP_INI%'"
powershell -Command "(gc '%PHP_INI%') -replace ';extension=fileinfo', 'extension=fileinfo' | Out-File -encoding ASCII '%PHP_INI%'"
powershell -Command "(gc '%PHP_INI%') -replace ';extension=mbstring', 'extension=mbstring' | Out-File -encoding ASCII '%PHP_INI%'"
powershell -Command "(gc '%PHP_INI%') -replace ';extension=openssl', 'extension=openssl' | Out-File -encoding ASCII '%PHP_INI%'"
powershell -Command "(gc '%PHP_INI%') -replace ';extension=zip', 'extension=zip' | Out-File -encoding ASCII '%PHP_INI%'"

echo 🧪 Testing extensions...
php -m | findstr /i "pdo sqlite mysql curl"

echo ✅ Done! Extensions should now be available.
echo 🔄 You may need to restart your terminal or IDE.
pause
