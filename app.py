from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import os
import uuid
from pathlib import Path

app = Flask(__name__)
CORS(app)

TEMP_FOLDER = 'temp'
Path(TEMP_FOLDER).mkdir(exist_ok=True)

@app.route('/api/video/download', methods=['POST'])
def download_video():
    data = request.get_json()
    url = data.get('url')
    format_type = data.get('format', 'mp4')
    
    # Jina la kipekee kuzuia kugongana
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
                if os.path.exists(filename):
                    os.remove(filename)
            except: pass
            return response

        return send_file(filename, as_attachment=True, download_name=f"video_{unique_id}.mp4")
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
