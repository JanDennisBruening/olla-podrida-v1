const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

async function main() {
  const htmlPath = path.resolve(__dirname, 'handover-temp-v3.html');
  const fileUrl = pathToFileURL(htmlPath).href;

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    '--user-data-dir=/tmp/chrome-pdf-test-' + Date.now(),
    '--remote-debugging-port=9241',
    '--remote-allow-origins=*',
    '--window-size=1200,1600',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9241/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.type === 'page') || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const reqId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === reqId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await new Promise(r => { ws.onopen = r; });
    await send('Runtime.enable');
    await send('Page.enable');
    await send('DOM.enable');

    await new Promise(r => setTimeout(r, 1000));

    // Get all page-container rects
    const rectsRes = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll(".page-container")).map(el => {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height };
        })
      `,
      returnByValue: true
    });

    const rects = rectsRes.result.value;
    console.log('Found pages:', rects.length);

    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      const clip = {
        x: Math.max(0, r.x),
        y: Math.max(0, r.y),
        width: r.width,
        height: r.height,
        scale: 1.0
      };
      const ss = await send('Page.captureScreenshot', {
        format: 'png',
        clip: clip,
        captureBeyondViewport: true
      });
      const outPath = path.resolve(__dirname, `v3-page-${i + 1}.png`);
      fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
      console.log(`Saved screenshot: ${outPath}`);
    }

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

main();
