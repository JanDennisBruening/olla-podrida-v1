import fs from 'fs';

const html = fs.readFileSync('original_site.html', 'utf-8');

// Find all elements with data-id
const re = /<([a-z0-9]+)[^>]*data-id="([^"]+)"[^>]*>/gi;
let match;
const elements = [];
while ((match = re.exec(html)) !== null) {
  const fullTag = match[0];
  const tag = match[1];
  const dataId = match[2];
  const idAttr = (fullTag.match(/\sid="([^"]+)"/) || [])[1] || '';
  const classAttr = (fullTag.match(/\sclass="([^"]+)"/) || [])[1] || '';
  const widgetType = (fullTag.match(/data-widget_type="([^"]+)"/) || [])[1] || '';
  const elementType = (fullTag.match(/data-element_type="([^"]+)"/) || [])[1] || '';
  elements.push({ tag, dataId, idAttr, classAttr, widgetType, elementType });
}

console.log('Total elements found:', elements.length);
elements.forEach(e => {
  if (e.elementType === 'container' || e.idAttr) {
    console.log(`${e.tag} data-id=${e.dataId} id=${e.idAttr} type=${e.elementType} widget=${e.widgetType}`);
  }
});
