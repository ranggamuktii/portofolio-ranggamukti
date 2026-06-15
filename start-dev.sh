#!/bin/bash

echo "========================================"
echo "   Portfolio Development Server"
echo "========================================"
echo ""
echo "Starting backend and frontend servers..."
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:5173"
echo "Admin panel: http://localhost:5173/admin"
echo ""

# Start backend in background
npm run server:dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
