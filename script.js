// API Base URL - adjust based on your deployment
const API_BASE_URL = window.location.origin === 'file://' ? 'http://localhost:5000' : window.location.origin;

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Detect Video Source
function detectVideoSource(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('tiktok.com') || url.includes('vt.tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com') || url.includes('instagr.am')) return 'instagram';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    return 'other';
}

// Show Status Message
function showStatus(message, type) {
    const statusMsg = document.getElementById('statusMessage');
    if (statusMsg) {
        statusMsg.innerHTML = message;
        statusMsg.className = `status ${type}`;
    }
}

// Process Video Link
async function processVideo() {
    const url = document.getElementById('videoUrl').value.trim();
    const videoInfo = document.getElementById('videoInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const formatSelection = document.getElementById('formatSelection');

    // Reset
    if (videoInfo) videoInfo.style.display = 'none';
    if (downloadBtn) downloadBtn.classList.remove('show');
    if (formatSelection) formatSelection.classList.remove('show');

    // Validate
    if (!url) {
        showStatus('⚠️ Tafadhali ingiza link ya video', 'error');
        return;
    }

    // FIXED: Badilisha && kuwa || - link ni halali kama inapatiana URL halali AU ina domain inayotumika
    if (!isValidUrl(url) || (!url.includes('youtu') && !url.includes('tiktok') && !url.includes('instagram') && !url.includes('facebook'))) {
        showStatus('❌ Link si halali. Tafadhali angalia URL.', 'error');
        return;
    }

    showStatus('<span class="spinner"></span> Inaprosesa link yako...', 'loading');

    try {
        // Call API to process video
        const response = await fetch(`${API_BASE_URL}/api/video/info`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API error: ' + response.statusText);
        }

        // Display video info
        const titleEl = document.getElementById('videoTitle');
        const sourceEl = document.getElementById('videoSource');
        const durationEl = document.getElementById('videoDuration');
        const sizeEl = document.getElementById('videoSize');

        if (titleEl) titleEl.textContent = data.title || 'Video';
        if (sourceEl) sourceEl.textContent = data.source || 'Unknown';
        if (durationEl) durationEl.textContent = data.duration || 'N/A';
        if (sizeEl) sizeEl.textContent = data.size || 'N/A';

        if (videoInfo) videoInfo.style.display = 'block';
        if (downloadBtn) downloadBtn.classList.add('show');
        if (formatSelection) formatSelection.classList.add('show');

        showStatus('✅ Video imejifunza! Chagua muundo na udownload.', 'success');
    } catch (error) {
        console.error('Error:', error);
        showStatus('❌ Kosa: ' + error.message, 'error');
    }
}

// Start Download
async function startDownload() {
    const url = document.getElementById('videoUrl').value.trim();
    const formatInput = document.querySelector('input[name="format"]:checked');
    const format = formatInput ? formatInput.value : 'mp4';
    const downloadBtn = document.getElementById('downloadBtn');

    if (downloadBtn) downloadBtn.disabled = true;
    showStatus('<span class="spinner"></span> Inadownload... Hii itachukua muda.', 'loading');

    try {
        const response = await fetch(`${API_BASE_URL}/api/video/download`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                url: url,
                format: format 
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Download error: ' + response.statusText);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `video_${Date.now()}.${format === 'mp3' ? 'mp3' : 'mp4'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        a.remove();

        showStatus('✅ Download imekamilika! Angalia Downloads folder.', 'success');
    } catch (error) {
        console.error('Error:', error);
        showStatus('❌ Kosa la download: ' + error.message, 'error');
    } finally {
        if (downloadBtn) downloadBtn.disabled = false;
    }
}

// Handle Enter Key
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        processVideo();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("Easy Saver loaded successfully");
    
    // Check if API is available
    fetch(`${API_BASE_URL}/api/health`)
        .then(r => r.json())
        .then(data => console.log("API Status:", data))
        .catch(e => console.warn("API not available at", API_BASE_URL));
});
