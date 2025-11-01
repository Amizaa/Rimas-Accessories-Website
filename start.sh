#!/bin/bash

echo "Starting Django backend..."
cd backend
python manage.py runserver &

echo "Starting Nuxt frontend..."
cd ../frontend
npm run dev
