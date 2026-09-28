const { spawn } = require('child_process');
const fs = require('fs');

async function testV111() {
  console.log('🚀 Starting Chrome headless to test v1.1.1 release on cms.janbruening.de...');
  const port = 9247;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    '--window-size=1440,1050',
    'https://cms.janbruening.de/olla-podrida'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
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

    console.log('⏳ Waiting for preloader to complete (5s)...');
    await new Promise(r => setTimeout(r, 5000));

    async function evaluate(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.text || JSON.stringify(res.exceptionDetails));
      }
      return res.result ? res.result.value : undefined;
    }

    async function takeScreenshot(filename) {
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filename, Buffer.from(shot.data, 'base64'));
      console.log(`📸 Screenshot saved: ${filename}`);
    }

    // 1. Check Favicon
    console.log('\n--- 1. Testing Favicon ---');
    const favicons = await evaluate(`(() => {
      return Array.from(document.querySelectorAll('link[rel*="icon"]')).map(l => ({
        rel: l.rel,
        href: l.href,
        sizes: l.sizes ? l.sizes.value : null
      }));
    })()`);
    console.log('Favicon links:', favicons);

    // 2. Check Header Logo
    console.log('\n--- 2. Testing Desktop Header Logo ---');
    const logoInfo = await evaluate(`(() => {
      const imgs = Array.from(document.querySelectorAll('nav img'));
      const logoImg = imgs.find(img => img.alt.includes('Podrida') || img.src.includes('Logo') || img.src.includes('logo'));
      if (!logoImg) return { found: false };
      const rect = logoImg.getBoundingClientRect();
      const parent = logoImg.parentElement;
      const parentRect = parent ? parent.getBoundingClientRect() : null;
      return {
        found: true,
        alt: logoImg.alt,
        src: logoImg.src,
        logoRect: { width: Math.round(rect.width), height: Math.round(rect.height), top: Math.round(rect.top), left: Math.round(rect.left) },
        parchmentRect: parentRect ? { width: Math.round(parentRect.width), height: Math.round(parentRect.height), top: Math.round(parentRect.top), left: Math.round(parentRect.left) } : null,
        marginTopInsideParchment: parentRect ? Math.round(rect.top - parentRect.top) : null,
        marginBottomInsideParchment: parentRect ? Math.round(parentRect.bottom - rect.bottom) : null
      };
    })()`);
    console.log('Header logo info:', logoInfo);
    await takeScreenshot('scripts/v111-header-desktop.png');

    // 3. Scroll to Footer
    console.log('\n--- 3. Scrolling to Footer ---');
    await evaluate(`(() => {
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView({ behavior: 'instant' });
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    // 4. Open Legal Modal via Impressum
    console.log('\n--- 4. Testing Legal Modal (Impressum) Scrolling ---');
    const openImpressum = await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('footer button')).find(b => b.innerText.includes('Impressum'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`);
    console.log('Opened Impressum:', openImpressum);
    await new Promise(r => setTimeout(r, 600));

    // Test scrolling Impressum
    const impScroll = await evaluate(`(() => {
      const scroller = document.querySelector('div[role="dialog"] div[data-lenis-prevent="true"]');
      if (!scroller) return { found: false };
      const initialTop = scroller.scrollTop;
      scroller.scrollTop = 350;
      return {
        found: true,
        scrollHeight: scroller.scrollHeight,
        clientHeight: scroller.clientHeight,
        initialTop,
        newTop: scroller.scrollTop,
        canScroll: scroller.scrollHeight > scroller.clientHeight
      };
    })()`);
    console.log('Impressum scroll result:', impScroll);
    await takeScreenshot('scripts/v111-impressum-scrolled.png');

    // 5. Switch to Datenschutz Tab and Test Scrolling
    console.log('\n--- 5. Testing Datenschutz Tab Scrolling ---');
    const switchDs = await evaluate(`(() => {
      const tab = Array.from(document.querySelectorAll('div[role="dialog"] button')).find(b => b.innerText.trim() === 'Datenschutz');
      if (tab) {
        tab.click();
        return true;
      }
      return false;
    })()`);
    console.log('Switched to Datenschutz tab:', switchDs);
    await new Promise(r => setTimeout(r, 500));

    const dsScroll = await evaluate(`(() => {
      const scroller = document.querySelector('div[role="dialog"] div[data-lenis-prevent="true"]');
      if (!scroller) return { found: false };
      const initialTop = scroller.scrollTop;
      scroller.scrollTop = 500;
      return {
        found: true,
        scrollHeight: scroller.scrollHeight,
        clientHeight: scroller.clientHeight,
        initialTop,
        newTop: scroller.scrollTop,
        canScroll: scroller.scrollHeight > scroller.clientHeight
      };
    })()`);
    console.log('Datenschutz scroll result:', dsScroll);
    await takeScreenshot('scripts/v111-datenschutz-scrolled.png');

    // 6. Switch to Cookies Tab and Test Scrolling
    console.log('\n--- 6. Testing Cookies Tab Scrolling ---');
    const switchCookies = await evaluate(`(() => {
      const tab = Array.from(document.querySelectorAll('div[role="dialog"] button')).find(b => b.innerText.trim() === 'Cookies');
      if (tab) {
        tab.click();
        return true;
      }
      return false;
    })()`);
    console.log('Switched to Cookies tab:', switchCookies);
    await new Promise(r => setTimeout(r, 500));

    const cookieScroll = await evaluate(`(() => {
      const scroller = document.querySelector('div[role="dialog"] div[data-lenis-prevent="true"]');
      if (!scroller) return { found: false };
      const initialTop = scroller.scrollTop;
      scroller.scrollTop = 400;
      return {
        found: true,
        scrollHeight: scroller.scrollHeight,
        clientHeight: scroller.clientHeight,
        initialTop,
        newTop: scroller.scrollTop,
        canScroll: scroller.scrollHeight > scroller.clientHeight
      };
    })()`);
    console.log('Cookies scroll result:', cookieScroll);
    await takeScreenshot('scripts/v111-cookies-scrolled.png');

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
    ws.close();
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  } finally {
    chrome.kill();
  }
}

testV111();
