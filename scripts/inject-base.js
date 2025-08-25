const fs = require('fs');
const path = require('path');
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));

const dir = argv.dir || './';
let base = argv.base || process.env.BASE_PATH || '/';
if (!base.endsWith('/')) base += '/';

console.log('Injecting <base> and BASE_PATH:', base, 'into dir:', dir);

const htmlFiles = glob.sync(path.join(dir, '**/*.html'), { nodir: true });
htmlFiles.forEach(file => {
  let s = fs.readFileSync(file, 'utf8');
  
  if (/<base\s/i.test(s)) {
    s = s.replace(/<base[^>]*>/i, `<base href="${base}">`);
  } else {
    s = s.replace(/<head(\s*[^>]*)>/i, `<head$1>\n  <base href="${base}">\n  <script>window.__BASE_PATH__="${base.slice(0,-1)}";</script>`);
  }

  if (/<base\s/i.test(s) && !/window\.__BASE_PATH__/.test(s)) {
    s = s.replace(/<base[^>]*>/i, match => match + `\n  <script>window.__BASE_PATH__="${base.slice(0,-1)}";</script>`);
  }

  fs.writeFileSync(file, s, 'utf8');
  console.log('Updated HTML:', file);
});
