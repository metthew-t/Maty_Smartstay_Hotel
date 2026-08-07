#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Generate missing migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate
