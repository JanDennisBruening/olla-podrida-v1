import fs from 'fs';

const html = fs.readFileSync('live.html', 'utf-8');

const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
console.log('Total style tags found:', styles.length);

styles.forEach((s, i) => {
  console.log(`\n================ STYLE ${i} (length: ${s.length}) ================`);
  console.log(s.substring(0, 500));
});
