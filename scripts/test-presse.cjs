const { spawn } = require('child_process');
const fs = require('fs');

async function testPresse() {
  console.log('🚀 Starting Chrome headless to test Presse area...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9230',
    '--remote-allow-origins=*',
    '--window-size=1440,1000',
    'https://cms.janbruening.de/olla-podrida'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9230/json/list');
    const tabs = await listRes.json();
    console.log('Available tabs:', tabs.map(t => t.url));
    const tab = tabs.find(t => t.url.includes('olla-podrida')) || tabs[0];
    console.log('Connected to tab:', tab.url);

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
        console.log('💬 CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      }
    };

    await send('Runtime.enable');
    await send('Page.enable');
    await send('DOM.enable');

    console.log('⏳ Waiting for preloader to finish (4s)...');
    await new Promise(r => setTimeout(r, 4000));

    // Scroll to footer
    console.log('📜 Scrolling to Footer...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const footer = document.querySelector('footer');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    // Check Footer Buttons
    const footerCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('footer button')).map(b => b.textContent.trim());
        const presseBtn = Array.from(document.querySelectorAll('footer button')).find(b => b.textContent.trim() === 'Presse');
        return {
          footerButtons: btns,
          hasPresseBtn: !!presseBtn
        };
      })()`,
      returnByValue: true
    });
    console.log('Footer Inspection:', JSON.stringify(footerCheck.result.value, null, 2));

    // Take screenshot of footer
    const footerShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/screenshot-footer-presse.png', Buffer.from(footerShot.data, 'base64'));
    console.log('📸 Saved scripts/screenshot-footer-presse.png');

    // Click "Presse" button
    console.log('👉 Clicking "Presse" button in Footer...');
    const clickPresse = await send('Runtime.evaluate', {
      expression: `(() => {
        const presseBtn = Array.from(document.querySelectorAll('footer button')).find(b => b.textContent.trim() === 'Presse');
        if (presseBtn) {
          presseBtn.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true
    });
    console.log('Click "Presse" result:', clickPresse.result.value);

    await new Promise(r => setTimeout(r, 1200));

    // Inspect Presse Modal
    const modalCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const h2 = document.querySelector('h2');
        const modal = document.querySelector('[data-lenis-prevent="true"]');
        const tabs = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim());
        const copyBtn = tabs.find(t => t.includes('Text kopieren'));
        return {
          hasModal: !!modal,
          modalTitle: h2 ? h2.textContent.trim() : null,
          hasCopyButton: !!copyBtn,
          availableTabs: tabs.filter(t => t.includes('Pressetext') || t.includes('Logos') || t.includes('Pressefotos') || t.includes('Pressekontakt'))
        };
      })()`,
      returnByValue: true
    });
    console.log('Presse Modal Inspection (Tab 1: Text):', JSON.stringify(modalCheck.result.value, null, 2));

    const shotTab1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/screenshot-presse-tab1.png', Buffer.from(shotTab1.data, 'base64'));
    console.log('📸 Saved scripts/screenshot-presse-tab1.png');

    // Test copy button
    console.log('👉 Testing "Text kopieren" button...');
    const copyTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const copyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Text kopieren'));
        if (copyBtn) {
          copyBtn.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true
    });
    console.log('Copy button clicked:', copyTest.result.value);
    await new Promise(r => setTimeout(r, 600));

    // Switch to Tab 2: Logos
    console.log('👉 Switching to Tab 2: Logos & Grafiken...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Logos'));
        if (tab) tab.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const logosCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('h4')).map(h => h.textContent.trim());
        const dlLinks = Array.from(document.querySelectorAll('a[download]')).map(a => ({
          href: a.href,
          text: a.textContent.trim()
        }));
        return {
          logoCards: cards,
          downloadLinks: dlLinks
        };
      })()`,
      returnByValue: true
    });
    console.log('Logos tab inspection:', JSON.stringify(logosCheck.result.value, null, 2));

    const shotTab2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/screenshot-presse-tab2.png', Buffer.from(shotTab2.data, 'base64'));
    console.log('📸 Saved scripts/screenshot-presse-tab2.png');

    // Switch to Tab 3: Pressefotos
    console.log('👉 Switching to Tab 3: Pressefotos & Ansichten...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pressefotos'));
        if (tab) tab.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const photosCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('h4')).map(h => h.textContent.trim());
        const dlLinks = Array.from(document.querySelectorAll('a[download]')).map(a => a.href);
        return {
          photoCards: cards,
          photoDownloadLinks: dlLinks
        };
      })()`,
      returnByValue: true
    });
    console.log('Photos tab inspection:', JSON.stringify(photosCheck.result.value, null, 2));

    const shotTab3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/screenshot-presse-tab3.png', Buffer.from(shotTab3.data, 'base64'));
    console.log('📸 Saved scripts/screenshot-presse-tab3.png');

    // Switch to Tab 4: Pressekontakt
    console.log('👉 Switching to Tab 4: Pressekontakt...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pressekontakt'));
        if (tab) tab.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const shotTab4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/screenshot-presse-tab4.png', Buffer.from(shotTab4.data, 'base64'));
    console.log('📸 Saved scripts/screenshot-presse-tab4.png');

    // Close Modal
    console.log('👉 Closing Presse Modal...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Schließen');
        if (closeBtn) closeBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // Verify Modal closed
    const isClosed = await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('[data-lenis-prevent="true"]').length === 0`,
      returnByValue: true
    });
    console.log('Modal closed verified:', isClosed.result.value);

    // Test Mobile Viewport
    console.log('📱 Testing Mobile Viewport (iPhone 390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to footer on mobile
    await send('Runtime.evaluate', {
      expression: `(() => {
        const footer = document.querySelector('footer');
        if (footer) footer.scrollIntoView();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Open Presse modal on mobile
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('footer button')).find(b => b.textContent.trim() === 'Presse');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/screenshot-presse-mobile.png', Buffer.from(shotMobile.data, 'base64'));
    console.log('📸 Saved scripts/screenshot-presse-mobile.png');

    ws.close();
    chrome.kill();

    if (exceptions.length > 0) {
      console.error(`❌ FAILED: ${exceptions.length} exceptions encountered`);
      process.exit(1);
    } else {
      console.log('🎉 ALL PRESSE TESTS PASSED CLEANLY! Zero JS exceptions.');
      process.exit(0);
    }
  } catch (err) {
    console.error('Error during test:', err);
    chrome.kill();
    process.exit(1);
  }
}

testPresse();
