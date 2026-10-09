// Frame-accurate renderer: seeks the page's timeline to each frame time,
// screenshots it, and pipes the frames into ffmpeg. Splits the frame range
// across several Chromium workers, then concatenates and muxes the voiceover.
//
// usage: node render.mjs [--fps 60] [--workers 4] [--from 0] [--to 142.4] [--out out/ad.mp4] [--audio audio/mix.wav]
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) =>
  (v.startsWith('--') ? a.concat([[v.slice(2), arr[i + 1]]]) : a), []));
const FPS = +(args.fps ?? 60);
const WORKERS = +(args.workers ?? 4);
const SCALE = +(args.scale ?? 1);
const W = 1920, H = 1080;
const OUT = path.resolve(here, args.out ?? 'out/darelarqam-ad.mp4');
const AUDIO = path.join(here, args.audio ?? 'audio/mix.wav');
const DURATION = +(args.to ?? 142.4);
const START = +(args.from ?? 0);
const tmp = path.join(here, 'out/.parts');
fs.mkdirSync(tmp, { recursive: true });

const first = Math.round(START * FPS), last = Math.round(DURATION * FPS);
const total = last - first;
const per = Math.ceil(total / WORKERS);

async function renderPart(idx, f0, f1) {
  const file = path.join(tmp, `part${idx}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS),
    '-c:v', 'mjpeg', '-i', '-', '-vf', `scale=${W}:${H}:flags=lanczos,format=yuv420p`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-tune', 'film', '-r', String(FPS), file],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--font-render-hinting=none', '--force-color-profile=srgb'] });
  const page = await browser.newPage({ viewport: { width: W * SCALE, height: H * SCALE }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error(`[w${idx}] pageerror`, e.message));
  await page.goto('file://' + path.join(here, 'index.html') + `?render=1&scale=${SCALE}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.renderAt(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % (FPS * 5) === 0) {
      const done = f - f0, el = (Date.now() - t0) / 1000;
      console.log(`[w${idx}] ${done}/${f1 - f0} frames  ${(done / Math.max(el, 1e-3)).toFixed(1)} fps`);
    }
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  return file;
}

const jobs = [];
for (let i = 0; i < WORKERS; i++) {
  const a = first + i * per, b = Math.min(last, a + per);
  if (a < b) jobs.push(renderPart(i, a, b));
}
const parts = await Promise.all(jobs);
const list = path.join(tmp, 'list.txt');
fs.writeFileSync(list, parts.map(p => `file '${p}'`).join('\n'));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
await new Promise((res, rej) => {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
    '-ss', String(START), '-t', String(DURATION - START), '-i', AUDIO,
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'apad', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000',
    '-movflags', '+faststart', '-t', String(DURATION - START), OUT], { stdio: 'inherit' });
  ff.on('close', c => (c === 0 ? res() : rej(new Error('mux failed ' + c))));
});
console.log('wrote', OUT);
