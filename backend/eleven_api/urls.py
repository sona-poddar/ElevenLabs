from django.urls import path
from .views import audio_urls
from .views import generate_audio
urlpatterns=[
     path("generate-audio/", generate_audio, name="generate-audio"),
     path('audio-urls/',audio_urls)]