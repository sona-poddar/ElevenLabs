import os
from django.http import JsonResponse , HttpResponse
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from gtts import gTTS
import tempfile

MONGO_URI=os.environ.get('MONGO_URI')
DB_NAME=os.environ.get('MONGO_DB','elevendb')
client=None

def get_client():
 global client
 if client is None:
  if not MONGO_URI: raise Exception('MONGO_URI not set')
  client=MongoClient(MONGO_URI)
 return client

@csrf_exempt
@require_GET
def audio_urls(request):
 try:
  c=get_client()
  db=c[DB_NAME]
  doc=db['audios'].find_one({},sort=[('_id',-1)])
  if not doc:
   return JsonResponse({'error':'no audio docs found'},status=404)
  return JsonResponse({'english':doc.get('english'),'arabic':doc.get('arabic')})
 except Exception as e:
  return JsonResponse({'error':str(e)},status=500)


import json

@csrf_exempt
def generate_audio(request):
    if request.method == "POST":
        try:
            # Try parsing JSON
            data = json.loads(request.body.decode("utf-8"))
            text = data.get("text", "")
            lang = data.get("lang", "en")
        except Exception:
            # Fallback to form-encoded (in case frontend sends it like that)
            text = request.POST.get("text", "")
            lang = request.POST.get("lang", "en")

        if not text.strip():
            return JsonResponse({"error": "No text provided"}, status=400)

        try:
            from gtts import gTTS
            import tempfile, os

            # Generate speech using gTTS
            tts = gTTS(text=text, lang=lang)

           # Create a temporary file path, but don't keep it open
            fd, path = tempfile.mkstemp(suffix=".mp3")
            os.close(fd)  # close the file descriptor immediately

# Save speech into that path
            tts.save(path)

# Read the file
            with open(path, "rb") as f:
                audio_data = f.read()

            os.unlink(path)  # delete temp file

            response = HttpResponse(audio_data, content_type="audio/mpeg")
            response["Content-Disposition"] = 'inline; filename="speech.mp3"'
            return response
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "POST request required"}, status=405)


@csrf_exempt
@require_GET
def download_audio(request):
    text = request.GET.get('text', 'Hello World')  # Get text from query param
    tts = gTTS(text=text, lang='en')

    # Create a temporary file that persists until response is sent
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tmp_file_path = tmp_file.name
    tmp_file.close()

    # Save the audio to temporary file
    tts.save(tmp_file_path)

    # Send file as a downloadable response
    response = FileResponse(open(tmp_file_path, 'rb'), as_attachment=True, filename="audio.mp3")

    # Optionally, delete the temp file after sending
    def cleanup(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass

    response['Cleanup-File'] = tmp_file_path  # just to track in middleware if needed
    cleanup(tmp_file_path)
    
    return response