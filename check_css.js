import fs from 'fs';

async function checkCSS() {
  const urls = [
    'https://olla-podrida.de/wp-content/themes/hello-elementor/assets/css/reset.css',
    'https://olla-podrida.de/wp-content/themes/hello-elementor/assets/css/theme.css',
    'https://olla-podrida.de/wp-content/plugins/elementor/assets/css/frontend.min.css',
    'https://olla-podrida.de/wp-content/uploads/elementor/css/post-51.css',
    'https://olla-podrida.de/wp-content/uploads/elementor/css/post-2412.css',
    'https://olla-podrida.de/wp-content/plugins/full-screen-menu-for-elementor/assets/css/frontend.min.css',
    'https://olla-podrida.de/wp-content/plugins/premium-addons-for-elementor/assets/frontend/min-css/tooltipster.min.css',
    'https://olla-podrida.de/wp-content/plugins/premium-addons-for-elementor/assets/frontend/min-css/premium-gtooltips.min.css'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const filename = url.split('/').pop().split('?')[0];
      console.log(`URL: ${filename} - Size: ${text.length} bytes`);
    } catch (e) {
      console.error(`Failed ${url}:`, e);
    }
  }
}

checkCSS();
