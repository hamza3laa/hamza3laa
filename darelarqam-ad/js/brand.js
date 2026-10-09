// Dar Al-Arqam logomark: a pointed arch (the "house"), the 8-point khatam star
// at its crown, and an open book at its threshold, light rising between them.
(() => {
  const { el, khatam, archPath } = E;

  function logo(parent, { x = 960, y = 540, scale = 1, id = 'lg' } = {}) {
    const s = el('svg', { viewBox: '0 0 600 700', width: 600 * scale, height: 700 * scale, class: 'abs',
      style: `left:${x - 300 * scale}px;top:${y - 350 * scale}px;overflow:visible` }, parent);
    const defs = el('defs', {}, s);
    const lg = el('linearGradient', { id: id + 'g', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el('stop', { offset: 0, 'stop-color': '#fff1cf' }, lg); el('stop', { offset: 0.45, 'stop-color': '#f2d28b' }, lg); el('stop', { offset: 1, 'stop-color': '#c99a45' }, lg);
    const rg = el('radialGradient', { id: id + 'r', cx: 0.5, cy: 0.62, r: 0.5 }, defs);
    el('stop', { offset: 0, 'stop-color': 'rgba(255,226,160,0.55)' }, rg); el('stop', { offset: 1, 'stop-color': 'rgba(255,226,160,0)' }, rg);
    const stroke = `url(#${id}g)`;
    const g = el('g', {}, s);
    const halo = el('ellipse', { cx: 300, cy: 420, rx: 230, ry: 260, fill: `url(#${id}r)`, opacity: 0 }, g);
    const arch = el('path', { d: archPath(300, 640, 380, 360, 0.42), fill: 'none', stroke, 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const archIn = el('path', { d: archPath(300, 640, 330, 340, 0.42), fill: 'rgba(5,20,22,0.55)', 'fill-opacity': 0, stroke, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    const base = el('path', { d: 'M60,640 L540,640', stroke, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    const [k1, k2] = khatam(300, 268, 64);
    const star = [el('path', { d: k1, fill: 'none', stroke, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g),
      el('path', { d: k2, fill: 'none', stroke, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g)];
    const circle = el('circle', { cx: 300, cy: 268, r: 24, fill: stroke, stroke: 'none', 'transform-origin': '300 268' }, g);
    const rays = [-36, -18, 0, 18, 36].map(dx => el('path', { d: `M${300 + dx * 0.4},${452} L${300 + dx},${358}`, stroke, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.85 }, g));
    const bookL = el('path', { d: 'M300,568 C262,546 206,544 166,558 L166,470 C206,456 262,458 300,480 Z', fill: 'rgba(5,20,22,0.85)', stroke, 'stroke-width': 7, 'stroke-linejoin': 'round' }, g);
    const bookR = el('path', { d: 'M300,568 C338,546 394,544 434,558 L434,470 C394,456 338,458 300,480 Z', fill: 'rgba(5,20,22,0.85)', stroke, 'stroke-width': 7, 'stroke-linejoin': 'round' }, g);
    return { svg: s, g, halo, arch, archIn, base, star, circle, rays, book: [bookL, bookR] };
  }

  // Draw-on reveal. `t` is the absolute start time, `d` scales durations.
  function reveal(tl, L, t, d = 1) {
    tl.fromTo([L.arch, L.archIn], { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.1 * d, ease: 'glide' }, t);
    tl.fromTo(L.base, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.8 * d, ease: 'glide' }, t + 0.1 * d);
    tl.fromTo(L.star, { drawSVG: 0, rotation: -45, transformOrigin: '300px 268px', svgOrigin: '300 268' }, { drawSVG: '100%', rotation: 0, duration: 1.0 * d, ease: 'silk', stagger: 0.12 * d }, t + 0.25 * d);
    tl.fromTo(L.circle, { scale: 0, svgOrigin: '300 268' }, { scale: 1, duration: 0.6 * d, ease: 'back.out(2.5)' }, t + 0.7 * d);
    tl.fromTo(L.book, { drawSVG: 0, fillOpacity: 0 }, { drawSVG: '100%', fillOpacity: 1, duration: 0.9 * d, ease: 'silk', stagger: 0.08 * d }, t + 0.35 * d);
    tl.fromTo(L.rays, { drawSVG: 0 }, { drawSVG: '100%', duration: 0.6 * d, ease: 'silk', stagger: 0.05 * d }, t + 0.8 * d);
    tl.fromTo(L.archIn, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.8 * d }, t + 0.6 * d);
    tl.fromTo(L.halo, { opacity: 0 }, { opacity: 1, duration: 1.2 * d }, t + 0.6 * d);
  }

  window.Brand = { logo, reveal };
})();
