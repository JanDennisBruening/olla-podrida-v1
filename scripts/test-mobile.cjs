const { spawn } = require('child_process');
const fs = require('fs');

async function testMobileDirect() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9225',
    '--remote-allow-origins=*',
    '--window-size=390,844',
    'https://cms.janbruening.de/olla-podrida'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const listRes = await fetch('http://127.0.0.1:9225/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('olla-podrida')) || tabs[0];
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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true });

    // Reload so page initializes with mobile viewport
    await send('Page.reload');

    console.log('⏳ Waiting for preloader...');
    await new Promise(r => setTimeout(r, 4000));

    const dimRes = await send('Runtime.evaluate', {
      expression: 'JSON.stringify({ innerWidth: window.innerWidth, scrollWidth: document.body.scrollWidth, docScrollWidth: document.documentElement.scrollWidth })'
    });
    console.log('Mobile Dimensions:', dimRes.result.value);

    const overflowRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const over = [];
        document.querySelectorAll('*').forEach(el => {
          if (el.scrollWidth > window.innerWidth + 5) {
            over.push({ tag: el.tagName, id: el.id, class: el.className.toString().slice(0, 50), scrollWidth: el.scrollWidth });
          }
        });
        return JSON.stringify(over.slice(0, 10));
      })()`
    });
    console.log('Overflow elements:', overflowRes.result.value);

    // Screenshot of Mobile Hero
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('mobile-direct-hero.png', Buffer.from(shot.data, 'base64'));
    console.log('📸 Saved mobile-direct-hero.png');

    // Click mobile menu button
    console.log('👉 Clicking mobile menu...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[title*="Menü"], button[aria-label*="Menü"]');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    const menuShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('mobile-direct-menu.png', Buffer.from(menuShot.data, 'base64'));
    console.log('📸 Saved mobile-direct-menu.png');

    // Close menu & scroll to Ensemble
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label*="schließen"], button[title*="schließen"]');
        if (btn) btn.click();
        const el = document.getElementById('ensemble');
        if (el) el.scrollIntoView();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    const ensShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('mobile-direct-ensemble.png', Buffer.from(ensShot.data, 'base64'));
    console.log('📸 Saved mobile-direct-ensemble.png');

    // Scroll to Termine
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('termine');
        if (el) el.scrollIntoView();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    const termShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('mobile-direct-termine.png', Buffer.from(termShot.data, 'base64'));
    console.log('📸 Saved mobile-direct-termine.png');

    // Scroll to Kontakt
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('kontakt');
        if (el) el.scrollIntoView();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    const kontaktShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('mobile-direct-kontakt.png', Buffer.from(kontaktShot.data, 'base64'));
    console.log('📸 Saved mobile-direct-kontakt.png');

    ws.close();
    chrome.kill();
    console.log('✅ Mobile tests finished successfully!');
  } catch(e) {
    console.error('Test error:', e);
    chrome.kill();
  }
}
testMobileDirect();
