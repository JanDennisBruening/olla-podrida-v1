import fs from 'fs';

const html = fs.readFileSync('live.html', 'utf-8');

const mainStart = html.indexOf('<main data-id="44f5ce37"');
const mainEnd = html.indexOf('</main>');
const mainHtml = html.substring(mainStart, mainEnd);

console.log('Main length:', mainHtml.length);

// Let's find all direct or major containers inside main
const re = /<(div|footer|section)[^>]+data-id="([^"]+)"[^>]*>/gi;
let m;
while ((m = re.exec(mainHtml)) !== null) {
  const full = m[0];
  const tag = m[1];
  const dataId = m[2];
  const id = (full.match(/id="([^"]+)"/) || [])[1] || '';
  const classes = (full.match(/class="([^"]+)"/) || [])[1] || '';
  const widgetType = (full.match(/data-widget_type="([^"]+)"/) || [])[1] || '';
  const isParent = classes.includes('e-parent');
  const isChild = classes.includes('e-child');
  console.log(`<${tag}> data-id="${dataId}" id="${id}" isParent=${isParent} isChild=${isChild} widget="${widgetType}"`);
}
