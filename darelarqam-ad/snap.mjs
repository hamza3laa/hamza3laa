// Render individual frames to PNG for review: node snap.mjs outdir t1 t2 ...
import { createRequire } from 'module'; import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const here = path.dirname(fileURLToPath(import.meta.url));
const [out, ...times] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.error('pageerror', e.message)); p.on('console', m => m.type() === 'error' && console.error('console', m.text()));
await p.goto('file://' + path.join(here, 'index.html') + '?render=1');
await p.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
for (const t of times) { const t0 = Date.now(); await p.evaluate(t => window.renderAt(t), +t); await p.screenshot({ path: `${out}/t${(+t).toFixed(2).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 80 }); console.log(t, Date.now() - t0, 'ms'); }
await b.close();
