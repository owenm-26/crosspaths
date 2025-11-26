@echo off

:: Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set ip=%%a
    goto :found
)

:found
set LOCAL_IP=%ip: =%

echo Updating .env with backend IP...
echo EXPO_PUBLIC_API_URL=http://%LOCAL_IP%:8000> .env

echo Starting Expo frontend...
npx expo start
pause
