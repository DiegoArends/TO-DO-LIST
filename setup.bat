@echo off
echo ========================================
echo    Instalando Lista de Tareas
echo ========================================
echo.

echo 1. Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado.
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js encontrado ✓

echo.
echo 2. Instalando dependencias...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias.
    pause
    exit /b 1
)
echo Dependencias instaladas ✓

echo.
echo 3. Iniciando el servidor...
echo El servidor se iniciara en http://localhost:3000
echo Presiona Ctrl+C para detener el servidor
echo.
npm start

pause 