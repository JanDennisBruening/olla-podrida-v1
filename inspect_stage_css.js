import fs from 'fs';

const css = fs.readFileSync('post-2412.css', 'utf-8');

function getRules(selectorPart) {
  let idx = 0;
  const rules = [];
  while ((idx = css.indexOf(selectorPart, idx)) !== -1) {
    const start = css.lastIndexOf('}', idx);
    const end = css.indexOf('}', idx);
    rules.push(css.substring(start === -1 ? 0 : start + 1, end + 1).trim());
    idx = end + 1;
  }
  return rules;
}

['44f5ce37', '2cf1fbc7', '5035c8af', '26804e5b', '54faf8e6'].forEach(id => {
  console.log(`\n=== RULES FOR ${id} ===`);
  getRules(id).forEach(r => console.log(r));
});
