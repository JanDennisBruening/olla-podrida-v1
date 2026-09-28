const { spawn } = require('child_process');
const fs = require('fs');

async function runTest() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9224',
    '--remote-allow-origins=*',
    '--window-size=1440,1000',
    'https://cms.janbruening.de/olla-podrida'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9224/json/list');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('olla-podrida')) || tabs[0];
    console.log('Opened tab:', tab.url);

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

    let exceptions = [];
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('🔴 JS EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
        exceptions.push(msg.params.exceptionDetails);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('💬 CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description));
      }
    };

    await send('Runtime.enable');
    await send('Page.enable');
    await send('DOM.enable');

    console.log('⏳ Waiting for preloader and page render...');
    await new Promise(r => setTimeout(r, 4000));

    // Desktop Screenshot - Hero
    const heroShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('test-desktop-hero.png', Buffer.from(heroShot.data, 'base64'));
    console.log('📸 Saved test-desktop-hero.png');

    // Scroll to Kontakt
    await send('Runtime.evaluate', {
      expression: 'document.getElementById("kontakt").scrollIntoView();'
    });
    await new Promise(r => setTimeout(r, 1500));

    const kontaktShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('test-desktop-kontakt.png', Buffer.from(kontaktShot.data, 'base64'));
    console.log('📸 Saved test-desktop-kontakt.png');

    // Switch to Mobile Emulation (iPhone 13 / 14: 390x844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true });

    // Scroll back to top
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 1200));

    const mobileHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('test-mobile-hero.png', Buffer.from(mobileHero.data, 'base64'));
    console.log('📸 Saved test-mobile-hero.png');

    // Click mobile menu button
    console.log('👉 Clicking mobile menu button...');
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[title*="Menü"], button[aria-label*="Menü"]');
        if (btn) {
          btn.click();
          return "CLICKED";
        }
        return "NOT_FOUND";
      })()`
    });
    console.log('Click result:', evalRes);

    await new Promise(r => setTimeout(r, 1200));

    const mobileMenuShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('test-mobile-menu.png', Buffer.from(mobileMenuShot.data, 'base64'));
    console.log('📸 Saved test-mobile-menu.png');

    // Scroll down to ensemble in mobile to check cutouts
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.querySelector('button[aria-label*="schließen"], button[title*="schließen"]');
        if (closeBtn) closeBtn.click();
        const ens = document.getElementById("ensemble");
        if (ens) ens.scrollIntoView();
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    const mobileEnsemble = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('test-mobile-ensemble.png', Buffer.from(mobileEnsemble.data, 'base64'));
    console.log('📸 Saved test-mobile-ensemble.png');

    ws.close();
    chrome.kill();

    if (exceptions.length > 0) {
      console.error(`❌ FAILED: ${exceptions.length} JS exceptions encountered!`);
      process.exit(1);
    } else {
      console.log('🎉 ALL TESTS PASSED! No JS exceptions.');
      process.exit(0);
    }
  } catch (err) {
    console.error('Test error:', err);
    chrome.kill();
    process.exit(1);
  }
}

runTest();
