const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testV125() {
  console.log('🚀 Starting Chrome headless to test v1.2.5 on cms.janbruening.de...');
  const port = 9256;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    '--window-size=1440,1100',
    'https://cms.janbruening.de/?olla_canvas=1'
  ]);

  await new Promise(r => setTimeout(r, 3500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.type === 'page' && (t.url.includes('janbruening') || t.url.includes('http'))) || tabs.find(t => t.type === 'page') || tabs[0];
    console.log('Connected to tab:', tab.url);

    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const reqId = id++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === reqId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await new Promise((resolve) => {
      ws.addEventListener('open', resolve);
    });

    console.log('WebSocket connected. Initializing page...');
    await send('Page.enable');
    await send('Runtime.enable');

    // Wait for initial render
    await new Promise(r => setTimeout(r, 3000));

    // Accept cookies: button says 'Alles klar, verstanden!'
    console.log('Dismissing cookie banner to access main page...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const acceptBtn = btns.find(b => b.textContent && (b.textContent.includes('Alles klar') || b.textContent.includes('verstanden')));
          if (acceptBtn) acceptBtn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    // Scroll to bottom of Ensemble section to see torn parchment edge
    console.log('Scrolling to parchment bottom edge...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const ensemble = document.getElementById('ensemble');
          if (ensemble) {
            const nextSec = document.getElementById('termine');
            if (nextSec) {
              nextSec.scrollIntoView({ behavior: 'instant', block: 'start' });
              window.scrollBy(0, -350);
            }
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1500));

    console.log('📸 Capturing desktop parchment bottom edge...');
    const desktopParchment = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v125-desktop-parchment-bottom.png'), Buffer.from(desktopParchment.data, 'base64'));

    // Capture floating player + Nach oben button
    console.log('📸 Capturing audio player & back to top button...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const player = document.querySelector('[aria-label="Nach oben scrollen"]')?.parentElement;
          if (player) {
            player.style.border = '2px solid red';
          }
        })()
      `
    });
    const audioShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v125-audio-and-top-btn.png'), Buffer.from(audioShot.data, 'base64'));

    // Open Presse Modal
    console.log('Opening Presse Modal...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button, a'));
          const presseBtn = btns.find(b => b.textContent && b.textContent.includes('Presse'));
          if (presseBtn) presseBtn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1200));

    // Switch to Logos tab
    console.log('Switching to Logos tab...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const tabs = Array.from(document.querySelectorAll('button'));
          const logoTab = tabs.find(b => b.textContent && b.textContent.includes('Logos & Grafiken'));
          if (logoTab) logoTab.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    console.log('📸 Capturing Presse Logos tab...');
    const logosShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v125-presse-logos.png'), Buffer.from(logosShot.data, 'base64'));

    // Switch to Photos tab
    console.log('Switching to Pressefotos tab...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const tabs = Array.from(document.querySelectorAll('button'));
          const photoTab = tabs.find(b => b.textContent && b.textContent.includes('Pressefotos & Ansichten'));
          if (photoTab) photoTab.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    console.log('📸 Capturing Presse Photos tab...');
    const photosShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v125-presse-photos.png'), Buffer.from(photosShot.data, 'base64'));

    // Test Mobile Viewport for parchment bottom edge
    console.log('Switching to mobile viewport (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    // Close modal first
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtns = Array.from(document.querySelectorAll('button'));
          const closeBtn = closeBtns.find(b => b.getAttribute('aria-label') === 'Schließen');
          if (closeBtn) closeBtn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    // Scroll to mobile parchment bottom
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const nextSec = document.getElementById('termine');
          if (nextSec) {
            nextSec.scrollIntoView({ behavior: 'instant', block: 'start' });
            window.scrollBy(0, -220);
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1200));

    console.log('📸 Capturing mobile parchment bottom edge...');
    const mobileParchment = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v125-mobile-parchment-bottom.png'), Buffer.from(mobileParchment.data, 'base64'));

    console.log('✅ All screenshots captured successfully for v1.2.5!');
    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

testV125();
