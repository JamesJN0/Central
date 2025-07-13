@echo off
echo.
echo ========================================
echo   INSTALADOR - SISTEMA BALNEARIO CENTRAL
echo ========================================
echo.
echo Instalando seu sistema de controle...
echo.

REM Criar atalho na area de trabalho
set "desktop=%USERPROFILE%\Desktop"
set "shortcut=%desktop%\Sistema Balneario Central.url"

echo [InternetShortcut] > "%shortcut%"
echo URL=file:///%~dp0index.html >> "%shortcut%"
echo IconFile=%~dp0logo.jpeg >> "%shortcut%"

echo ✅ Atalho criado na area de trabalho!
echo.

REM Abrir o sistema automaticamente
echo 🚀 Abrindo sistema no navegador...
start "" "%~dp0index.html"

echo.
echo ========================================
echo   INSTALACAO CONCLUIDA! 
echo ========================================
echo.
echo ✅ Sistema instalado com sucesso!
echo ✅ Atalho criado na area de trabalho
echo ✅ Sistema aberto no navegador
echo.
echo 📱 Para instalar no celular:
echo    1. Abra este link no celular
echo    2. Clique em "Instalar App"
echo.
echo 📞 Duvidas? Entre em contato!
echo.
pause
