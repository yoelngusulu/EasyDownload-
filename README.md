# Easy Saver - Video Downloader 📥

Easy Saver ni zana ya bure inayokuruhusu kupakua video na audio kutoka YouTube, TikTok, Instagram, Facebook, na mitandao mingine kwa ubora wa juu.

## ✨ Mambo Mahusika

- 🎬 **Download Video & Audio** - Pakua video au sauti tu
- 🚀 **Kasi ya Juu** - Download haraka na bila matatizo
- ✅ **Bure Kabisa** - Hakuna bima au malipo
- 🎯 **Marekebisho Mbalimbali** - MP4, MP3, 360p
- 🌐 **Mtandao Mbalimbali** - YouTube, TikTok, Instagram, Facebook

## 📁 Project Structure

```
EasyDownload-/
├── index.html           # Frontend - HTML Structure
├── styles.css          # Frontend - CSS Styles
├── script.js           # Frontend - JavaScript
├── app.py              # Backend - Flask API
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variables template
├── README.md           # Documentation
├── downloads/          # Downloaded files folder
└── temp/               # Temporary files folder
```

## 📋 Requirements

- Python 3.8 or higher
- FFmpeg (kwa audio conversion)
- pip (Python package manager)

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yoelngusulu/EasyDownload-.git
cd EasyDownload-
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install FFmpeg

**Windows:**
```bash
choco install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install ffmpeg
```

### 5. Run Application
```bash
python app.py
```

Bukia `http://localhost:5000` kwenye browser yako

## 📖 Matumizi

1. Ingiza link ya video
2. Bonyeza "Jacheki" 
3. Chagua muundo (MP4, MP3, 360p)
4. Bonyeza "Download Video"
5. Video itakamatwa otomatiki

## API Endpoints

### Get Video Info
```
POST /api/video/info
```

### Download Video
```
POST /api/video/download
```

### Get Formats
```
GET /api/formats
```

### Health Check
```
GET /api/health
```

## 🎯 Supported Platforms

- ✅ YouTube
- ✅ TikTok
- ✅ Instagram
- ✅ Facebook
- ✅ And many more!

## 📝 License

Open source - MIT License

---

**Easy Saver © 2026**
