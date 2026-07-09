const API_BASE_URL = 'https://easydownload-ggqd.onrender.com';
async function processVideo() {
    const url = document.getElementById('videoUrl').value.trim();
    const statusMsg = document.getElementById('statusMessage');
    const btn = document.querySelector('button');
    
    if (!url) return showStatus('⚠️ Ingiza link kwanza', 'error');
    
    btn.disabled = true;
    showStatus('Inachakata...', 'loading');

    try {
        const response = await fetch(`${API_BASE_URL}/api/video/info`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url})
        });
        const data = await response.json();
        
        document.getElementById('videoTitle').textContent = data.title;
        document.getElementById('videoInfo').style.display = 'block';
        document.getElementById('downloadBtn').classList.add('show');
        statusMsg.style.display = 'none';
    } catch (e) {
        showStatus('❌ Kosa: ' + e.message, 'error');
    } finally {
        btn.disabled = false;
    }
}

async function startDownload() {
    const url = document.getElementById('videoUrl').value.trim();
    const format = document.querySelector('input[name="format"]:checked').value;
    const btn = document.getElementById('downloadBtn');

    btn.disabled = true;
    btn.textContent = "Inapakua...";

    try {
        const response = await fetch(`${API_BASE_URL}/api/video/download`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url, format})
        });

        if (!response.ok) throw new Error("Download imeshindwa");

        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "video.mp4";
        a.click();
    } catch (e) {
        alert("Kosa: " + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "Download Sasa ⬇️";
    }
}

function showStatus(msg, type) {
    const s = document.getElementById('statusMessage');
    s.innerHTML = msg;
    s.className = `status ${type}`;
    s.style.display = 'block';
}
