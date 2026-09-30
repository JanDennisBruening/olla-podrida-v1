const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testResponsive() {
  const widths = [1200, 1024, 900, 768, 390];
  console.log('🚀 Testing responsive viewports:', widths);

  for (const w of widths) {
    const port = 9260 + (w % 100);
    const h = 1000;
    const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
      '--headless',
      '--disable-gpu',
      `--remote-debugging-port=${port}`,
      '--remote-allow-origins=*',
      `--window-size=${w},${h}`,
      'https://cms.janbruening.de/?olla_canvas=1'
    ]);

    await new Promise(r => setTimeout(r, 2500));

    try {
      const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
      const tabs = await listRes.json();
      const tab = tabs.find(t => t.type === 'page' && (t.url.includes('janbruening') || t.url.includes('http'))) || tabs[0];
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

      await new Promise(resolve => ws.addEventListener('open', resolve));
      await send('Page.enable');
      await send('Runtime.enable');

      await new Promise(r => setTimeout(r, 2000));

      // Accept cookie banner if present
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const acceptBtn = btns.find(el => el.textContent && el.textContent.includes('Alles klar, verstanden!'));
            if (acceptBtn) acceptBtn.click();
          })()
        `
      });

      await new Promise(r => setTimeout(r, 3500));

      // Scroll to Kontakt
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.getElementById('kontakt');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
          })()
        `
      });

      await new Promise(r => setTimeout(r, 1500));

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(__dirname, `responsive-kontakt-${w}.png`), Buffer.from(shot.data, 'base64'));
      console.log(`✅ Saved responsive-kontakt-${w}.png`);

      ws.close();
    } catch (e) {
      console.error(`Error at width ${w}:`, e.message);
    } finally {
      chrome.kill();
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.log('🎉 Responsive testing complete!');
}

testResponsive().catch(console.error);
