#!/bin/bash

# Get local IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)

echo "🚀 Starting CrossPaths Development Environment"
echo "📍 Local IP: $LOCAL_IP"
echo ""

# Start backend in background
echo "🐍 Starting Python backend..."
source .venv/bin/activate  # Activate virtual environment
uvicorn main:app --host $LOCAL_IP --port 8000 --reload &
BACKEND_PID=$!
