from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import json
from datetime import datetime
import threading
from pathlib import Path
import traceback

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
DOWNLOAD_FOLDER = 'downloads'
TEMP_FOLDER = 'temp'
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB

# Create folders if they don't exist
for folder in [DOWNLOAD_FOLDER, TEMP_FOLDER]:
    Path(folder).mkdir(exist_ok=True)

# Video sources mapping
VIDEO_SOURCES = {
    'youtube': 'YouTube',
    'youtu': 'YouTube',
    'tiktok': 'TikTok',
    'instagram': 'Instagram',
    'facebook': 'Facebook',
    'fb.watch': 'Facebook',
}

def detect_source(url):
    """Detect video source from URL"""
    for key, source in VIDEO_SOURCES.items():
        if key in url.lower():
            return source
    return 'Other'

def get_video_info(url):
    """Extract video information using yt-dlp"""
    try:
        ydl_opts = {
            'quiet': False,
            'no_warnings': False,
            'format': 'best',
            'socket_timeout': 30,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            return {
                'title': info.get('title', 'Unknown'),
                'duration': format_duration(info.get('duration', 0)),
                'uploader': info.get('uploader', 'Unknown'),
                'size': format_size(info.get('filesize', 0)),
                'source': detect_source(url),
            }
    except Exception as e:
        print(f"Error getting video info: {str(e)}")
        print(traceback.format_exc())
        raise

def format_duration(seconds):
    """Convert seconds to HH:MM:SS format"""
    if not seconds:
        return 'N/A'
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    if h > 0:
        return f'{h}:{m:02d}:{s:02d}'
    return f'{m}:{s:02d}'

def format_size(bytes_size):
    """Convert bytes to human readable format"""
    if not bytes_size:
        return 'N/A'
    bytes_size = float(bytes_size)
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024:
            return f'{bytes_size:.1f} {unit}'
        bytes_size /= 1024
    return 'N/A'

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK', 
        'timestamp': datetime.now().isoformat(),
        'message': 'Easy Saver API is running'
    }), 200

@app.route('/api/video/info', methods=['POST', 'OPTIONS'])
def video_info():
    """Get video information"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON'}), 400
            
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'error': 'URL required'}), 400
        
        # Validate URL
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        print(f"Processing URL: {url}")
        info = get_video_info(url)
        
        return jsonify(info), 200
    
    except Exception as e:
        error_msg = str(e)
        print(f"Error in video_info: {error_msg}")
        return jsonify({'error': error_msg}), 400

@app.route('/api/video/download', methods=['POST', 'OPTIONS'])
def download_video():
    """Download video"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON'}), 400
            
        url = data.get('url', '').strip()
        format_type = data.get('format', 'mp4')  # mp4, mp3, 360p
        
        if not url:
            return jsonify({'error': 'URL required'}), 400
        
        # Validate URL
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        print(f"Downloading: {url} as {format_type}")
        
        # Configure download options based on format
        if format_type == 'mp3':
            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'outtmpl': os.path.join(TEMP_FOLDER, '%(title)s.%(ext)s'),
                'quiet': False,
                'no_warnings': False,
            }
        elif format_type == '360p':
            ydl_opts = {
                'format': 'best[height<=360]/best',
                'outtmpl': os.path.join(TEMP_FOLDER, '%(title)s.%(ext)s'),
                'quiet': False,
                'no_warnings': False,
            }
        else:  # mp4 (default)
            ydl_opts = {
                'format': 'best[ext=mp4]/best',
                'outtmpl': os.path.join(TEMP_FOLDER, '%(title)s.%(ext)s'),
                'quiet': False,
                'no_warnings': False,
            }
        
        # Download video
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
        
        print(f"Downloaded to: {filename}")
        
        # Send file
        if os.path.exists(filename):
            return send_file(
                filename,
                as_attachment=True,
                download_name=os.path.basename(filename)
            )
        else:
            return jsonify({'error': 'File not found after download'}), 500
    
    except Exception as e:
        error_msg = str(e)
        print(f"Error in download_video: {error_msg}")
        print(traceback.format_exc())
        return jsonify({'error': error_msg}), 400

@app.route('/api/formats', methods=['GET'])
def get_formats():
    """Get available download formats"""
    return jsonify({
        'formats': [
            {'value': 'mp4', 'label': 'Video (MP4) - Ubora wa juu'},
            {'value': 'mp3', 'label': 'Audio (MP3) - Sauti tu'},
            {'value': '360p', 'label': 'Video (360p) - Ubora wa chini'},
        ]
    }), 200

def cleanup_temp_files():
    """Clean up temporary files"""
    try:
        for file in os.listdir(TEMP_FOLDER):
            file_path = os.path.join(TEMP_FOLDER, file)
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f"Cleaned up: {file_path}")
    except Exception as e:
        print(f'Cleanup error: {e}')

@app.route('/cleanup', methods=['POST'])
def cleanup():
    """Clean up temporary files"""
    cleanup_temp_files()
    return jsonify({'message': 'Cleanup completed'}), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Run cleanup on startup
    cleanup_temp_files()
    
    print("Starting Easy Saver API...")
    print("API running at http://0.0.0.0:5000")
    
    # Start Flask app
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        threaded=True
    )
