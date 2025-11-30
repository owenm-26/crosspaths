LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)

# update .env
ENV_FILE="./.env"

# Create .env if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
fi

# Remove old API_URL line if it exists, then append new one
grep -v "EXPO_PUBLIC_API_URL" "$ENV_FILE" > "$ENV_FILE.tmp" && mv "$ENV_FILE.tmp" "$ENV_FILE"
echo "EXPO_PUBLIC_API_URL=http://$LOCAL_IP:8000" >> "$ENV_FILE"


# Start frontend
echo "📱 Starting Expo frontend..."
npx expo start -c &
FRONTEND_PID=$!

echo ""
echo "✅ Services started!"
echo "🌐 Backend: http://$LOCAL_IP:8000"
echo "📱 Frontend: Check Expo DevTools"
echo ""