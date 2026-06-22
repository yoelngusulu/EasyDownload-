<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Video Saver</title>
  
  <style>
    :root {
      --bg-app: #0f172a;
      --bg-surface: #1e293b;
      --bg-surface-hover: #334155;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent: #38bdf8;
      --accent-hover: #7dd3fc;
      --border-color: #334155;
      --radius-lg: 16px;
      --radius-md: 12px;
      --radius-sm: 8px;
      --font-sans: system-ui, -apple-system, sans-serif;
      --transition: all 0.2s ease;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-app);
      color: var(--text-primary);
      font-family: var(--font-sans);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .app-shell {
      width: 100%;
      max-width: 1100px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 968px) {
      .app-shell { grid-template-columns: 1.2fr 0.8fr; align-items: start; }
    }

    .hero-copy { margin-bottom: 1.5rem; }
    .eyebrow { color: var(--accent); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem; }
    #page-title { font-size: 2.25rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.75rem; }
    .intro { color: var(--text-secondary); font-size: 1rem; }

    .download-panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
    }

    .download-panel label { display: block; font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-secondary); }

    .url-row { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }
    .url-row input[type="url"] {
      flex: 1; background: var(--bg-app); border: 1px solid var(--border-color);
      border-radius: var(--radius-md); color: var(--text-primary); padding: 0.75rem 1rem; font-size: 1rem;
    }
    .url-row input[type="url"]:focus { outline: none; border-color: var(--accent); }

    .url-row button {
      background: var(--accent); color: var(--bg-app); border: none;
      border-radius: var(--radius-md); padding: 0 1.25rem; font-weight: 600; cursor: pointer; transition: var(--transition);
    }
    .url-row button:hover { background: var(--accent-hover); }

    fieldset { border: none; margin-bottom: 1.25rem; }
    legend { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
    .platform-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.5rem; }

    .platform-card {
      position: relative; background: var(--bg-app); border: 1px solid var(--border-color);
      border-radius: var(--radius-md); padding: 0.75rem 0.25rem; display: flex; flex-direction: column;
      align-items: center; gap: 0.35rem; cursor: pointer; font-size: 0.8rem; transition: var(--transition);
    }
    .platform-card input { position: absolute; opacity: 0; }
    .platform-mark { width: 30px; height: 30px; border-radius: 50%; background: var(--bg-surface); display: flex; align-items: center; justify-content: center; font-weight: bold; }

    .instagram .platform-mark { color: #fccc63; }
    .facebook .platform-mark { color: #1877f2; }
    .tiktok .platform-mark { color: #00f2fe; }
    .x .platform-mark { color: #ffffff; }

    .platform-card:hover { background: var(--bg-surface-hover); }
    .platform-card:has(input:checked) { border-color: var(--accent); background: rgba(56, 189, 248, 0.1); }

    .settings select {
      width: 100%; background: var(--bg-app); border: 1px solid var(--border-color);
      border-radius: var(--radius-md); color: var(--text-primary); padding: 0.75rem 1rem; font-size: 1rem; margin-bottom: 1.25rem;
    }

    .note { font-size: 0.75rem; color: var(--text-muted); }

    .status-section { display: flex; flex-direction: column; gap: 1.25rem; }
    .result-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; }
    .preview { background: #020617; aspect-ratio: 16 / 9; display: flex; align-items: center; justify-content: center; }
    .play-button { width: 45px; height: 45px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; }

    .result-copy { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; }
    .result-label { color: var(--accent); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    #resultTitle { font-size: 1.15rem; }
    #resultText { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.75rem; }

    .download-link {
      display: block; background: var(--accent); color: var(--bg-app); text-decoration: none;
      font-weight: 600; padding: 0.75rem; border-radius: var(--radius-md); text-align: center; transition: var(--transition);
    }
    .download-link.disabled { background: var(--border-color); color: var(--text-muted); pointer-events: none; cursor: not-allowed; }

    .steps { display: flex; flex-direction: column; gap: 0.75rem; background: rgba(30, 41, 59, 0.3); padding: 1rem; border-radius: var(--radius-lg); }
    .steps div { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; color: var(--text-secondary); }
    .steps strong { width: 20px; height: 20px; background: var(--border-color); display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.7rem; }
  </style>
</head>
<body>
  <main class="app-shell">
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">Video download assistant</p>
        <h1 id="page-title">Save social videos from one simple page.</h1>
        <p class="intro">
          Paste a public video link from Instagram, Facebook, TikTok, or X and prepare a downloadable file for content you own or have permission to save.
        </p>
      </div>

      <form class="download-panel" id="downloadForm">
        <label for="videoUrl">Video URL</label>
        <div class="url-row">
          <input id="videoUrl" name="videoUrl" type="url" placeholder="https://www.tiktok.com/@user/video/..." autocomplete="off" required>
          <button type="submit">Check Link</button>
        </div>

        <fieldset>
          <legend>Choose platform</legend>
          <div class="platform-grid" role="radiogroup" aria-label="Social platform">
            <label class="platform-card selected">
              <input type="radio" name="platform" value="auto" checked>
              <span class="platform-mark">A</span>
              <span>Auto</span>
            </label>
            <label class="platform-card instagram">
              <input type="radio" name="platform" value="instagram">
              <span class="platform-mark">IG</span>
              <span>Instagram</span>
            </label>
            <label class="platform-card facebook">
              <input type="radio" name="platform" value="facebook">
              <span class="platform-mark">f</span>
              <span>Facebook</span>
            </label>
            <label class="platform-card tiktok">
              <input type="radio" name="platform" value="tiktok">
              <span class="platform-mark">TT</span>
              <span>TikTok</span>
            </label>
            <label class="platform-card x">
              <input type="radio" name="platform" value="x">
              <span class="platform-mark">X</span>
              <span>X</span>
            </label>
          </div>
        </fieldset>

        <div class="settings">
          <label for="quality">Quality</label>
          <select id="quality" name="quality">
            <option value="hd">HD video</option>
            <option value="standard">Standard video</option>
            <option value="audio">Audio only</option>
          </select>
        </div>

        <p class="note">This demo does not bypass login, privacy, copyright, or platform restrictions.</p>
      </form>
    </section>

    <section class="status-section" aria-live="polite">
      <div class="result-card" id="resultCard">
        <div class="preview">
          <div class="play-button" aria-hidden="true"></div>
        </div>
        <div class="result-copy">
          <p class="result-label" id="resultLabel">Ready when you are</p>
          <h2 id="resultTitle">Paste a video link to begin.</h2>
          <p id="resultText">The page will detect the platform, validate the URL, and show the next step for your download service.</p>
          <a class="download-link disabled" id="downloadLink" href="#" aria-disabled="true">Download Video</a>
        </div>
      </div>

      <div class="steps">
        <div>
          <strong>1</strong>
          <span>Paste a public video URL</span>
        </div>
        <div>
          <strong>2</strong>
          <span>Confirm the detected platform</span>
        </div>
        <div>
          <strong>3</strong>
          <span>Connect your backend downloader</span>
        </div>
      </div>
    </section>
  </main>

  <script>
    document.getElementById('downloadForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const videoUrl = document.getElementById('videoUrl').value;
        const platform = document.querySelector('input[name=\"platform\"]:checked').value;
        const quality = document.getElementById('quality').value;

        const resultTitle = document.getElementById('resultTitle');
        const resultText = document.getElementById('resultText');
        const resultLabel = document.getElementById('resultLabel');
        const downloadLink = document.getElementById('downloadLink');

        resultLabel.innerText = "Inachakata...";
        resultTitle.innerText = "Tafadhali subiri...";
        resultText.innerText = "Tunatafuta faili la video kutoka kwenye link uliyoweka.";

        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ videoUrl, platform, quality })
            });

            const data = await response.json();

            if (data.success) {
                resultLabel.innerText = `Tayari (${data.platform.toUpperCase()})`;
                resultTitle.innerText = data.title;
                resultText.innerText = `Video yako ya ubora wa ${data.qualityUsed.toUpperCase()} imepokelewa kwa ufanisi. Bonyeza kitufe hapo chini kudownload.`;
                
                downloadLink.href = data.downloadUrl;
                downloadLink.removeAttribute('aria-disabled');
                downloadLink.classList.remove('disabled');
                downloadLink.innerText = "Download Sasa";
                downloadLink.setAttribute('target', '_blank'); 
            } else {
                alert("Hitilafu: " + data.message);
                rudishaHaliYaMwanzo();
            }

        } catch (error) {
            console.error("Error imetokea:", error);
            alert("Imeshindikana kuunganisha kwenye server.");
            rudishaHaliYaMwanzo();
        }
    });

    function rudishaHaliYaMwanzo() {
        document.getElementById('resultLabel').innerText = "Ready when you are";
        document.getElementById('resultTitle').innerText = "Paste a video link to begin.";
        document.getElementById('resultText').innerText = "The page will detect the platform, validate the URL, and show the next step.";
        const dl = document.getElementById('downloadLink');
        dl.classList.add('disabled');
        dl.setAttribute('aria-disabled', 'true');
        dl.innerText = "Download Video";
    }
  </script>
</body>
</html>