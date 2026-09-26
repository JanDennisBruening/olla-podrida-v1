import fs from 'fs';

const html = fs.readFileSync('live.html', 'utf-8');

const startIdx = html.indexOf('<div data-elementor-type="wp-page"');
const endIdx = html.indexOf('</main>');
const mainMarkup = html.substring(startIdx, endIdx + 7);
console.log('Main markup length:', mainMarkup.length);

// Also look at what is after </main>
const afterMain = html.substring(endIdx + 7, html.lastIndexOf('</body>'));
console.log('After main length:', afterMain.length);
console.log('After main content snippet:\n', afterMain.substring(0, 1500));
