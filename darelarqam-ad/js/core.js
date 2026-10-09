// Core engine: one paused GSAP master timeline for DOM/SVG, plus canvas
// "drawers" that are pure functions of time. renderAt(t) is deterministic, so
// the offline renderer can seek to any frame in any order.
(() => {
  const W = 1920, H = 1080;
  const SVGNS = 'http://www.w3.org/2000/svg';
  gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, CustomEase);
  CustomEase.create('silk', 'M0,0 C0.22,0.6 0.18,1 1,1');
  CustomEase.create('glide', 'M0,0 C0.65,0 0.35,1 1,1');
  CustomEase.create('snap', 'M0,0 C0.1,0.9 0.2,1 1,1');

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'silk' } });
  const drawers = { bg: [], fx: [] };
  const ctx = {};

  // ---------- math ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const ease = {
    out: p => 1 - Math.pow(1 - p, 3),
    out5: p => 1 - Math.pow(1 - p, 5),
    in: p => p * p * p,
    io: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    sine: p => -(Math.cos(Math.PI * p) - 1) / 2,
    back: p => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
  };
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // smooth value noise (deterministic)
  const perm = new Uint8Array(512);
  { const r = rng(1337); const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) perm[i] = p[i & 255]; }
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const grad = (h, x, y) => { const u = h & 1 ? x : y, v = h & 1 ? y : x; return (h & 2 ? -u : u) + (h & 4 ? -v : v) * 0.5; };
  function noise2(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y), A = perm[X] + Y, B = perm[X + 1] + Y;
    return lerp(lerp(grad(perm[A], x, y), grad(perm[B], x - 1, y), u), lerp(grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1), u), v);
  }

  // ---------- svg helpers ----------
  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function div(cls, parent, html) {
    const n = document.createElement('div');
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    if (parent) parent.appendChild(n);
    return n;
  }
  function svg(parent, vb = `0 0 ${W} ${H}`, cls = 'full') {
    const s = el('svg', { viewBox: vb, class: cls, preserveAspectRatio: 'xMidYMid meet' });
    parent.appendChild(s);
    return s;
  }
  function starPts(cx, cy, R, r, n = 8, rot = -Math.PI / 2) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = rot + (i * Math.PI) / n, rr = i % 2 ? r : R;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    return pts;
  }
  const ptsToPath = pts => 'M' + pts.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join('L') + 'Z';
  // Two overlapping squares — the 8-point khatam star
  function khatam(cx, cy, R, rot = 0) {
    const sq = o => [0, 1, 2, 3].map(i => { const a = rot + o + (i * Math.PI) / 2; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; });
    return [ptsToPath(sq(0)), ptsToPath(sq(Math.PI / 4))];
  }
  // Pointed (Persian) arch, base centred at (cx, by)
  function archPath(cx, by, w, h, peak = 0.32) {
    const hw = w / 2, sy = by - h, ph = w * peak;
    return `M${cx - hw},${by} L${cx - hw},${sy} C${cx - hw},${sy - ph * 0.85} ${cx - hw * 0.35},${sy - ph * 0.9} ${cx},${sy - ph} ` +
      `C${cx + hw * 0.35},${sy - ph * 0.9} ${cx + hw},${sy - ph * 0.85} ${cx + hw},${sy} L${cx + hw},${by}`;
  }

  // ---------- canvas ----------
  function setupCanvas(id) {
    const c = document.getElementById(id);
    c.width = W; c.height = H;
    ctx[id] = c.getContext('2d');
    return ctx[id];
  }
  function sprite(r, stops) {
    const c = document.createElement('canvas'); c.width = c.height = r * 2;
    const g = c.getContext('2d'), gr = g.createRadialGradient(r, r, 0, r, r, r);
    stops.forEach(([o, col]) => gr.addColorStop(o, col));
    g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2);
    return c;
  }
  const SPR = {};
  function initSprites() {
    SPR.gold = sprite(64, [[0, 'rgba(255,236,190,1)'], [0.18, 'rgba(242,205,130,0.85)'], [0.5, 'rgba(217,170,87,0.25)'], [1, 'rgba(217,170,87,0)']]);
    SPR.warm = sprite(128, [[0, 'rgba(255,214,150,0.9)'], [0.35, 'rgba(232,150,70,0.35)'], [1, 'rgba(200,100,40,0)']]);
    SPR.white = sprite(64, [[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(255,255,255,0.6)'], [1, 'rgba(255,255,255,0)']]);
    SPR.smoke = sprite(128, [[0, 'rgba(40,62,66,0.55)'], [0.5, 'rgba(26,42,46,0.25)'], [1, 'rgba(10,20,24,0)']]);
    SPR.smokeLight = sprite(128, [[0, 'rgba(120,140,140,0.22)'], [0.6, 'rgba(80,100,100,0.08)'], [1, 'rgba(60,80,80,0)']]);
    SPR.ember = sprite(64, [[0, 'rgba(255,160,90,1)'], [0.3, 'rgba(220,90,40,0.5)'], [1, 'rgba(160,40,20,0)']]);
    SPR.teal = sprite(128, [[0, 'rgba(60,170,150,0.5)'], [0.5, 'rgba(30,110,100,0.18)'], [1, 'rgba(20,80,70,0)']]);
  }
  function glow(g, spr, x, y, size, alpha = 1) {
    if (alpha <= 0.002) return;
    g.globalAlpha = Math.min(1, alpha);
    g.drawImage(spr, x - size / 2, y - size / 2, size, size);
    g.globalAlpha = 1;
  }

  // film grain: pre-baked tiles cycled per frame
  const grainTiles = [];
  function initGrain() {
    const r = rng(99);
    for (let k = 0; k < 10; k++) {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const g = c.getContext('2d'), im = g.createImageData(256, 256);
      for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r() - 0.5) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      g.putImageData(im, 0, 0);
      grainTiles.push(c);
    }
  }
  function drawGrain(t) {
    const g = ctx.grain; g.clearRect(0, 0, W, H);
    const tile = grainTiles[Math.floor(t * 30) % grainTiles.length];
    const pat = g.createPattern(tile, 'repeat');
    g.fillStyle = pat; g.fillRect(0, 0, W, H);
  }

  // ---------- registration ----------
  function draw(layer, t0, t1, fn) { drawers[layer].push({ t0, t1, fn }); }
  // scene container visibility window with crossfades
  function show(node, t0, t1, fin = 0.5, fout = 0.5) {
    tl.set(node, { autoAlpha: 0 }, 0);
    tl.to(node, { autoAlpha: 1, duration: fin, ease: 'none' }, Math.max(0, t0));
    tl.to(node, { autoAlpha: 0, duration: fout, ease: 'none' }, t1);
  }

  function renderAt(t) {
    tl.seek(t, false);
    for (const layer of ['bg', 'fx']) {
      const g = ctx[layer];
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, W, H);
      for (const d of drawers[layer]) {
        if (t >= d.t0 && t <= d.t1) {
          g.save(); d.fn(g, t, (t - d.t0) / (d.t1 - d.t0)); g.restore();
        }
      }
    }
    drawGrain(t);
  }

  window.E = { W, H, tl, draw, show, renderAt, el, div, svg, starPts, ptsToPath, khatam, archPath,
    clamp, lerp, prog, ease, rng, noise2, glow, SPR, ctx, setupCanvas, initSprites, initGrain };
})();
