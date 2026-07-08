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
    statusMsg.innerHTML = message;
    statusMsg.className = `status ${type}`;
}

// Process Video Link
async function processVideo() {
    const url = document.getElementById('videoUrl').value.trim();
    const videoInfo = document.getElementById('videoInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const formatSelection = document.getElementById('formatSelection');

    // Reset
    videoInfo.style.display = 'none';
    downloadBtn.classList.remove('show');
    formatSelection.classList.remove('show');

    // Validate
    if (!url) {
        showStatus('⚠️ Tafadhali ingiza link ya video', 'error');
        return;
    }

    if (!isValidUrl(url)) {
        showStatus('❌ Link si halali. Tafadhali angalia URL.', 'error');
        return;
    }

    showStatus('<span class="spinner"></span> Inaprosesa link yako...', 'loading');

    try {
        // Call API to process video
        const response = await fetch('/api/video/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        if (!response.ok) {
            throw new Error('Kosa la API: ' + response.statusText);
        }

        const data = await response.json();

        // Display video info
        document.getElementById('videoTitle').textContent = data.title || 'Video';
        document.getElementById('videoSource').textContent = data.source || 'Unknown';
        document.getElementById('videoDuration').textContent = data.duration || 'N/A';
        document.getElementById('videoSize').textContent = data.size || 'N/A';

        videoInfo.style.display = 'block';
        downloadBtn.classList.add('show');
        formatSelection.classList.add('show');

        showStatus('✅ Video imejifunza! Chagua muundo na udownload.', 'success');
    } catch (error) {
        showStatus('❌ Kosa: ' + error.message, 'error');
    }
}

// Start Download
async function startDownload() {
    const url = document.getElementById('videoUrl').value.trim();
    const format = document.querySelector('input[name="format"]:checked').value;
    const downloadBtn = document.getElementById('downloadBtn');

    downloadBtn.disabled = true;
    showStatus('<span class="spinner"></span> Inadownload... Hii itachukua muda.', 'loading');

    try {
        const response = await fetch('/api/video/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                url: url,
                format: format 
            })
        });

        if (!response.ok) {
            throw new Error('Download error: ' + response.statusText);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `video_${Date.now()}.${format === 'mp3' ? 'mp3' : 'mp4'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);

        showStatus('✅ Download imekamilika! Angalia Downloads folder.', 'success');
    } catch (error) {
        showStatus('❌ Kosa la download: ' + error.message, 'error');
    } finally {
        downloadBtn.disabled = false;
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
});
