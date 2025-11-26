@echo off
echo 🚀 Starting CrossPaths Development Environment

:: Get local IP (Windows)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set ip=%%a
    goto :found
)

:found
set LOCAL_IP=%ip: =%

echo 📍 Local IP: %LOCAL_IP%

echo.
echo 🐍 Starting Python backend...

:: Activate venv
call .venv\Scripts\activate

:: Start backend
uvicorn main:app --host %LOCAL_IP% --port 8000 --reload
pause
