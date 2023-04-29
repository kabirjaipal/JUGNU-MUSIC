@echo off

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% equ 1 (
  echo Node.js not found. Installing...
  :: Download and install Node.js
  powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/latest/node.exe' -OutFile 'node.exe'"
  node.exe /verysilent /install
  del node.exe
  echo Node.js installed.
) else (
  echo Node.js found.
)

:: Install dependencies
echo Installing dependencies...
npm install
echo Dependencies installed.

:: Start the server
echo Starting server...
node server.js
echo Server started.

pause
