const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testV126() {
  console.log('🚀 Starting Chrome headless to test v1.2.6 on cms.janbruening.de...');
  const port = 9260;
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
          const termine = document.getElementById('termine');
          if (termine) {
            termine.scrollIntoView({ behavior: 'instant', block: 'start' });
            window.scrollBy(0, -320);
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1500));

    console.log('📸 Capturing desktop parchment bottom edge & distance to Aktuelle Termine...');
    const desktopParchment = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v126-desktop-parchment-bottom.png'), Buffer.from(desktopParchment.data, 'base64'));

    // Switch to Mobile Viewport
    console.log('Emulating mobile viewport (390x844 iPhone 14)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await new Promise(r => setTimeout(r, 1500));

    // Scroll to bottom of parchment on mobile
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const termine = document.getElementById('termine');
          if (termine) {
            termine.scrollIntoView({ behavior: 'instant', block: 'start' });
            window.scrollBy(0, -220);
          }
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1500));

    console.log('📸 Capturing mobile parchment bottom edge & distance to Aktuelle Termine...');
    const mobileParchment = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v126-mobile-parchment-bottom.png'), Buffer.from(mobileParchment.data, 'base64'));

    console.log('✅ All tests completed successfully!');
    ws.close();
  } catch (err) {
    console.error('❌ Error during testing:', err);
  } finally {
    chrome.kill();
  }
}

testV126();
