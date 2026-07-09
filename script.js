async function startDownload() {
    const url = document.getElementById('videoUrl').value.trim();
    const format = document.querySelector('input[name="format"]:checked').value;
    const downloadBtn = document.getElementById('downloadBtn');

    downloadBtn.disabled = true;
    downloadBtn.textContent = "Inapakua... Subiri...";
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/video/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, format })
        });

        if (!response.ok) throw new Error("Imeshindwa kupakua");

        // Njia bora ya kudownload file kutoka Flask
        const blob = await response.blob();
        const urlObj = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlObj;
        a.download = `EasySaver_Video.mp4`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        showStatus('✅ Imekamilika!', 'success');
    } catch (err) {
        showStatus('❌ Kosa: ' + err.message, 'error');
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.textContent = "Download Sasa ⬇️";
    }
}
