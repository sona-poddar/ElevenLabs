import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY','change-me')
DEBUG = True
ALLOWED_HOSTS=['*']
INSTALLED_APPS=['django.contrib.staticfiles','corsheaders']
MIDDLEWARE=['corsheaders.middleware.CorsMiddleware','django.middleware.common.CommonMiddleware']
ROOT_URLCONF='eleven_clone.urls'
STATIC_URL='/static/'
CORS_ALLOWED_ORIGINS=os.environ.get('CORS_ALLOWED_ORIGINS','http://localhost:3000').split(',')