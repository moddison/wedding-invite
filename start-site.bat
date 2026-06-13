@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  where winget >nul 2>nul
  if errorlevel 1 (
    echo Please install Node.js LTS from https://nodejs.org/
    start "" https://nodejs.org/
    pause
    exit /b 1
  )

  echo Installing Node.js LTS via winget...
  winget install OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
  if exist "%ProgramFiles%\nodejs" set "PATH=%ProgramFiles%\nodejs;%PATH%"
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not available. Please restart this file after Node.js installation.
  pause
  exit /b 1
)

echo Stopping old local site processes on port 5173...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
  taskkill /PID %%P /F >nul 2>nul
)

echo Installing or updating project dependencies...
call npm install
if errorlevel 1 (
  echo Failed to install project dependencies.
  pause
  exit /b 1
)

echo Starting wedding invite at http://127.0.0.1:5173
start "" http://127.0.0.1:5173
call npm run dev -- --port 5173

endlocal
