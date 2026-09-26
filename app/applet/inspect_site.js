import fs from 'fs';

async function run() {
  const res = await fetch('https://www.olla-podrida.de', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  fs.writeFileSync('site.html', html);

  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
  console.log('TITLE:', title);

  const headings = [...html.matchAll(/<(h[1-6])[^>]*>(.*?)<\/\1>/gis)].map(m =>
    `${m[1]}: ${m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`
  );
  console.log('\n--- HEADINGS ---');
  headings.forEach(h => console.log(h));

  const links = [...html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gis)].map(m => {
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return `${text} -> ${m[1]}`;
  }).filter(l => !l.startsWith(' ->') && l.trim().length > 2);
  console.log('\n--- LINKS ---');
  [...new Set(links)].forEach(l => console.log(l));

  const images = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gis)].map(m => {
    const alt = (m[0].match(/alt=["']([^"']*)["']/) || ['', ''])[1];
    return `${m[1]} | ${alt}`;
  });
  console.log('\n--- IMAGES ---');
  [...new Set(images)].forEach(img => console.log(img));
}

run().catch(console.error);
