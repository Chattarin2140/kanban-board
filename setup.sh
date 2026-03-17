#!/bin/bash
echo "Building Kanban Board Application..."
echo ""

echo "Creating Docker containers..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for database to be ready..."
sleep 5

echo ""
echo "Running database migrations..."
docker-compose exec -T backend php artisan migrate

echo ""
echo "==================================="
echo "Kanban Board is ready!"
echo "==================================="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000/api"
echo ""
echo "Run 'docker-compose logs -f' to view logs"
echo "Run 'docker-compose down' to stop services"
