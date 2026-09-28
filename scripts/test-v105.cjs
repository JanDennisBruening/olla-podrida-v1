const { spawn } = require('child_process');
const fs = require('fs');

async function testV105() {
  console.log('🚀 Starting Chrome headless to test v1.0.5 release...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9232',
    '--remote-allow-origins=*',
    '--window-size=1440,1050',
    'https://cms.janbruening.de/olla-podrida'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9232/json/list');
    const tabs = await listRes.json();
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
      }
    };

    await send('Runtime.enable');
    await send('Page.enable');
    await send('DOM.enable');

    console.log('⏳ Waiting for page to load & preloader to finish (4s)...');
    await new Promise(r => setTimeout(r, 4500));

    // 1. Check Footer Text & Credits
    console.log('\n--- 1. Testing Footer Elements ---');
    const footerData = await send('Runtime.evaluate', {
      expression: `(() => {
        const footer = document.querySelector('footer');
        if (!footer) return null;
        footer.scrollIntoView({ behavior: 'instant' });
        const text = footer.innerText;
        return {
          hasJanDennisCopyright: text.includes('Jan Dennis Brüning'),
          hasJanBrueningConcept: text.includes('Design, Konzept und Webentwicklung: Jan Brüning'),
          hasJanBrueningLink: text.includes('www.janbruening.de'),
          hasPresseBtn: !!Array.from(footer.querySelectorAll('button')).find(b => b.innerText.includes('Presse')),
          hasCookiesBtn: !!Array.from(footer.querySelectorAll('button')).find(b => b.innerText.includes('Cookies')),
          hasDatenschutzBtn: !!Array.from(footer.querySelectorAll('button')).find(b => b.innerText.includes('Datenschutz')),
          hasImpressumBtn: !!Array.from(footer.querySelectorAll('button')).find(b => b.innerText.includes('Impressum'))
        };
      })()`,
      returnByValue: true
    });
    console.log('Footer Results:', JSON.stringify(footerData.result.value, null, 2));

    const shotFooter = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/v105-footer.png', Buffer.from(shotFooter.data, 'base64'));

    // 2. Open Impressum Modal
    console.log('\n--- 2. Testing Impressum Modal ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('footer button')).find(b => b.innerText.includes('Impressum'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const impressumData = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('.animate-fadeIn');
        if (!modal) return null;
        const text = modal.innerText;
        return {
          hasDDG: text.includes('§ 5 DDG') && text.includes('Digitale-Dienste-Gesetz'),
          hasDDG7: text.includes('§ 7 Abs. 1 DDG'),
          hasSusanneHoffmann: text.includes('Susanne Hoffmann'),
          hasDiepholz: text.includes('49356 Diepholz'),
          hasJanBrueningDesign: text.includes('Design, Konzept & Webentwicklung') && text.includes('Jan Brüning'),
          hasJanDennisCopyright: text.includes('© Jan Dennis Brüning'),
          hasJanDennisPhoto: text.includes('Fotografie: © Jan Dennis Brüning'),
          hasNoTMG: !text.includes('TMG'),
          hasNoJeanMoineau: !text.includes('Jean Moineau')
        };
      })()`,
      returnByValue: true
    });
    console.log('Impressum Results:', JSON.stringify(impressumData.result.value, null, 2));
    const shotImpressum = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/v105-impressum.png', Buffer.from(shotImpressum.data, 'base64'));

    // 3. Switch to Datenschutz Tab
    console.log('\n--- 3. Testing Datenschutz Modal ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Datenschutz');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const datenschutzData = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('.animate-fadeIn');
        if (!modal) return null;
        const text = modal.innerText;
        return {
          hasSusanneHoffmann: text.includes('Susanne Hoffmann'),
          hasIONOS: text.includes('IONOS SE'),
          hasIONOSAddress: text.includes('Elgendorfer Str. 57') && text.includes('56410 Montabaur'),
          hasAVV: text.includes('Auftragsverarbeitung (AVV)') && text.includes('Art. 28 DSGVO'),
          hasIONOSLink: !!modal.querySelector('a[href*="ionos.de"]'),
          hasArt6: text.includes('Art. 6 Abs. 1'),
          hasLocalFontsNote: text.includes('Keine Drittanbieter-CDNs') && text.includes('100% lokal'),
          hasBetroffenenRechte: text.includes('Art. 15 DSGVO') && text.includes('Art. 77 DSGVO')
        };
      })()`,
      returnByValue: true
    });
    console.log('Datenschutz Results:', JSON.stringify(datenschutzData.result.value, null, 2));
    const shotDatenschutz = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/v105-datenschutz.png', Buffer.from(shotDatenschutz.data, 'base64'));

    // 4. Switch to Cookies Tab
    console.log('\n--- 4. Testing Cookies Modal ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Cookies');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const cookiesData = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('.animate-fadeIn');
        if (!modal) return null;
        const text = modal.innerText;
        return {
          hasWasSindCookies: text.includes('Was sind Cookies eigentlich?'),
          hasUnterschiede: text.includes('Welche Unterschiede gibt es bei Cookies?'),
          hasTrackingFrei: text.includes('100% Tracking-frei'),
          hasBrowserInfo: text.includes('Wie können Sie Cookies in Ihrem Browser verwalten?'),
          hasLocalStorage: text.includes('LocalStorage')
        };
      })()`,
      returnByValue: true
    });
    console.log('Cookies Results:', JSON.stringify(cookiesData.result.value, null, 2));
    const shotCookies = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/v105-cookies.png', Buffer.from(shotCookies.data, 'base64'));

    // Close Modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.querySelector('button[aria-label="Schließen"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Schließen');
        if (closeBtn) closeBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    // 5. Open Presse Modal
    console.log('\n--- 5. Testing Presse Modal ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('footer button')).find(b => b.innerText.includes('Presse'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const presseTab1Data = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('.animate-fadeIn');
        if (!modal) return null;
        const text = modal.innerText;
        return {
          hasSteckbriefSusanne: text.includes('Leitung:') && text.includes('Susanne Hoffmann'),
          hasPressNote: text.includes('Abdruck honorarfrei') || text.includes('honorarfrei verwendet werden')
        };
      })()`,
      returnByValue: true
    });
    console.log('Presse Tab 1 Results:', JSON.stringify(presseTab1Data.result.value, null, 2));

    // Switch to Photos Tab
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Pressefotos'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const pressePhotosData = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('.animate-fadeIn');
        if (!modal) return null;
        const text = modal.innerText;
        return {
          hasPhotoCreditJanDennis: text.includes('© Jan Dennis Brüning / Ensemble Olla Podrida')
        };
      })()`,
      returnByValue: true
    });
    console.log('Presse Photos Results:', JSON.stringify(pressePhotosData.result.value, null, 2));

    // Switch to Contact Tab
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Pressekontakt'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const presseContactData = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('.animate-fadeIn');
        if (!modal) return null;
        const text = modal.innerText;
        return {
          hasSusanneHoffmannContact: text.includes('Ansprechpartnerin:') && text.includes('Susanne Hoffmann'),
          hasNoSusanneBruening: !text.includes('Susanne Brüning')
        };
      })()`,
      returnByValue: true
    });
    console.log('Presse Contact Results:', JSON.stringify(presseContactData.result.value, null, 2));
    const shotPresse = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/v105-presse-contact.png', Buffer.from(shotPresse.data, 'base64'));

    // Close Modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.querySelector('button[aria-label="Schließen"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Schließen');
        if (closeBtn) closeBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    // 6. Mobile Viewport Test (375x812)
    console.log('\n--- 6. Testing Mobile Viewport (375x812) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 0);`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Test mobile menu open
    console.log('Testing mobile menu toggle...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const toggleBtn = document.querySelector('button[aria-label*="Menü"], button[aria-label*="Navigation"]') ||
          Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('MENÜ') || b.querySelector('svg'));
        if (toggleBtn) toggleBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const mobileMenuData = await send('Runtime.evaluate', {
      expression: `(() => {
        const nav = document.querySelector('nav') || document.querySelector('[role="dialog"]');
        return {
          menuOpen: !!document.querySelector('#mobile-menu, nav, [class*="mobile"]'),
          bodyOverflow: document.body.style.overflow
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile Menu Results:', JSON.stringify(mobileMenuData.result.value, null, 2));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scripts/v105-mobile.png', Buffer.from(shotMobile.data, 'base64'));

    console.log('\n========================================');
    console.log('✨ All v1.0.5 tests completed successfully!');
    console.log('Total JS Exceptions:', exceptions.length);
    console.log('========================================');

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill('SIGKILL');
  }
}

testV105();
