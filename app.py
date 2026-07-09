from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import os
import uuid
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Configuration
DOWNLOAD_FOLDER = 'downloads'
TEMP_FOLDER = 'temp'
for folder in [DOWNLOAD_FOLDER, TEMP_FOLDER]:
    Path(folder).mkdir(exist_ok=True)

def get_video_info(url):
    ydl_opts = {'quiet': True, 'no_warnings': True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return {
            'title': info.get('title', 'Video'),
            'duration': f"{info.get('duration', 0)//60}:{info.get('duration', 0)%60:02d}",
            'source': 'YouTube/Social'
        }

@app.route('/api/video/info', methods=['POST'])
def video_info():
    data = request.get_json()
    try:
        return jsonify(get_video_info(data.get('url')))
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/video/download', methods=['POST'])
def download_video():
    data = request.get_json()
    url = data.get('url')
    format_type = data.get('format', 'mp4')
    
    unique_id = str(uuid.uuid4())
    filename = os.path.join(TEMP_FOLDER, f"{unique_id}.mp4")

    ydl_opts = {
        'format': 'best[ext=mp4]/best' if format_type != 'mp3' else 'bestaudio/best',
        'outtmpl': filename,
        'quiet': True
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        @after_this_request
        def cleanup(response):
            try:
                if os.path.exists(filename): os.remove(filename)
            except: pass
            return response

        return send_file(filename, as_attachment=True, download_name=f"download_{unique_id}.mp4")
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
