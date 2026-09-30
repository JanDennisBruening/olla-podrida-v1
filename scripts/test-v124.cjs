const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testV124() {
  console.log('🚀 Starting Chrome headless to test v1.2.4 on cms.janbruening.de...');
  const port = 9255;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    '--window-size=1440,1050',
    'https://cms.janbruening.de/?olla_canvas=1'
  ]);

  await new Promise(r => setTimeout(r, 3000));

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

    // Wait 3 seconds for initial render
    await new Promise(r => setTimeout(r, 3000));

    // Capture Screenshot 1: Cookie Banner
    console.log('📸 Capturing CookieBanner screenshot...');
    const bannerShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v124-cookie-banner.png'), Buffer.from(bannerShot.data, 'base64'));

    // Open Cookies und Consent Modal via script or click
    console.log('Opening Cookies & Consent modal...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const links = Array.from(document.querySelectorAll('button, a'));
          const cookieBtn = links.find(el => el.textContent && el.textContent.includes('Datenschutzerklärung'));
          if (cookieBtn) cookieBtn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1200));

    // Switch to Cookies und Consent tab
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const tabs = Array.from(document.querySelectorAll('button'));
          const cTab = tabs.find(el => el.textContent && el.textContent.includes('Cookies und Consent'));
          if (cTab) cTab.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    // Capture Screenshot 2: Cookie & Consent Modal
    console.log('📸 Capturing Cookies & Consent Modal screenshot...');
    const modalShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v124-modal-consent.png'), Buffer.from(modalShot.data, 'base64'));

    // Close modal and accept cookies
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtns = Array.from(document.querySelectorAll('button'));
          const closeBtn = closeBtns.find(el => el.getAttribute('aria-label') === 'Schließen' || el.textContent === 'Schließen');
          if (closeBtn) closeBtn.click();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 800));

    // Click "Alles klar, verstanden!" on CookieBanner
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const acceptBtn = btns.find(el => el.textContent && el.textContent.includes('Alles klar, verstanden!'));
          if (acceptBtn) acceptBtn.click();
        })()
      `
    });

    // Wait for preloader to finish (approx 3.5s)
    console.log('Waiting for preloader & main site reveal...');
    await new Promise(r => setTimeout(r, 4000));

    // Scroll down to Kontakt & Anfragen
    console.log('Scrolling to Kontakt & Anfragen...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const kontakt = document.getElementById('kontakt');
          if (kontakt) kontakt.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    // Capture Screenshot 3: Kontakt & Anfragen Section with Audio player and back to top
    console.log('📸 Capturing Kontakt section and audio button screenshot...');
    const kontaktShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v124-kontakt-section.png'), Buffer.from(kontaktShot.data, 'base64'));

    // Scroll to Footer
    console.log('Scrolling to Footer...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          window.scrollTo(0, document.body.scrollHeight);
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1500));

    // Capture Screenshot 4: Footer with credits and Cookies & Consent button
    console.log('📸 Capturing Footer screenshot...');
    const footerShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'v124-footer.png'), Buffer.from(footerShot.data, 'base64'));

    console.log('✅ All screenshots captured successfully in scripts/ !');
    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

testV124().catch(console.error);
