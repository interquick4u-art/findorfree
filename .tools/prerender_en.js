// Вписывает английский текст прямо в index.html, чтобы страница была видна сразу
// (без "прыжка") и читалась поисковиками и ИИ-поисковиками без JavaScript.
// Запуск после любой правки текстов: node .tools/prerender_en.js  (нужен Playwright)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const root = path.resolve(__dirname, '..'), file = path.join(root, 'index.html');
const types = { '.html':'text/html', '.js':'text/javascript', '.png':'image/png', '.svg':'image/svg+xml' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); } }); });
srv.listen(0, async () => {
  const b = await chromium.launch(); const p = await b.newPage({ locale: 'en-US' });
  await p.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
  await p.goto(`http://127.0.0.1:${srv.address().port}/`, { waitUntil: 'load' });
  await p.waitForFunction(() => window.I18N_EXTRA && document.querySelector('#lang select'));
  const data = await p.evaluate(() => {
    const keys = {}; document.querySelectorAll('[data-i18n]').forEach(el => keys[el.dataset.i18n] = el.innerHTML);
    const ids = {}; ['lang', 'exlist', 'contact', 'year'].forEach(id => ids[id] = document.getElementById(id).innerHTML);
    ids.lang = ids.lang.replace(/ selected=""/g, '');
    return { keys, ids };
  });
  await b.close(); srv.close();
  let s = fs.readFileSync(file, 'utf8'); const head = s.indexOf('<body'), tail = s.indexOf('<script>', head);
  let body = s.slice(head, tail);
  const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let n = 0;
  for (const [k, v] of Object.entries(data.keys)) {
    const re = new RegExp(`(<(\\w+)\\b[^>]*\\bdata-i18n="${esc(k)}"[^>]*>)([\\s\\S]*?)(</\\2>)`, 'g');
    body = body.replace(re, (m, a, tag, inner, c) => { if (inner.includes('<' + tag)) throw new Error('nested ' + k); n++; return a + v + c; });
  }
  for (const [id, v] of Object.entries(data.ids)) {
    const re = new RegExp(`(<(\\w+)\\b[^>]*\\bid="${id}"[^>]*>)([\\s\\S]*?)(</\\2>)`);
    if (!re.test(body)) throw new Error('no id ' + id);
    body = body.replace(re, (m, a, tag, inner, c) => { if (id !== 'lang' && inner.includes('<' + tag)) throw new Error('nested ' + id); return a + v + c; });
  }
  fs.writeFileSync(file, s.slice(0, head) + body + s.slice(tail));
  console.log('filled', n, 'elements');
});
