// ACT I (0 – 60 s): the age of trials → the need for trusted knowledge.
(() => {
  const { W, H, tl, draw, show, el, div, svg, starPts, khatam, clamp, lerp, prog, ease, rng, noise2, glow, SPR } = E;
  const C = CUE;
  const SC = window.SCENES = window.SCENES || [];

  // shared: rosette broken into individual segments (so it can shatter & reassemble)
  function rosetteSegments(cx, cy, R) {
    const segs = [];
    const poly = (pts, closed = true) => { for (let i = 0; i < pts.length - (closed ? 0 : 1); i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; segs.push([a, b]); } };
    const sq = (r, o) => [0, 1, 2, 3].map(i => { const a = o + (i * Math.PI) / 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
    poly(sq(R, 0)); poly(sq(R, Math.PI / 4));
    poly(starPts(cx, cy, R * 0.62, R * 0.42, 8, Math.PI / 8));
    const oct = r => [...Array(8)].map((_, i) => { const a = Math.PI / 8 + (i * Math.PI) / 4; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
    poly(oct(R * 1.18));
    for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8; segs.push([[cx + Math.cos(a) * R * 0.2, cy + Math.sin(a) * R * 0.2], [cx + Math.cos(a) * R * 0.36, cy + Math.sin(a) * R * 0.36]]); }
    for (let i = 0; i < 24; i++) { const a0 = (i * Math.PI * 2) / 24, a1 = a0 + (Math.PI * 2) / 24 * 0.8, r = R * 1.42;
      segs.push({ arc: true, d: `M${cx + Math.cos(a0) * r},${cy + Math.sin(a0) * r} A${r},${r} 0 0 1 ${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r}`, mid: [cx + Math.cos((a0 + a1) / 2) * r, cy + Math.sin((a0 + a1) / 2) * r] }); }
    return segs;
  }
  function buildRosette(parent, cx, cy, R, stroke, width) {
    const g = el('g', {}, parent);
    const r = rng(7);
    return rosetteSegments(cx, cy, R).map(s => {
      const d = s.arc ? s.d : `M${s[0][0]},${s[0][1]} L${s[1][0]},${s[1][1]}`;
      const mid = s.arc ? s.mid : [(s[0][0] + s[1][0]) / 2, (s[0][1] + s[1][1]) / 2];
      const p = el('path', { d, stroke, 'stroke-width': width, 'stroke-linecap': 'round', fill: 'none' }, g);
      const ang = Math.atan2(mid[1] - cy, mid[0] - cx), dist = 160 + r() * 520;
      return { p, mid, dx: Math.cos(ang) * dist + (r() - 0.5) * 200, dy: Math.sin(ang) * dist + (r() - 0.5) * 200, rot: (r() - 0.5) * 300, g };
    });
  }
  window.buildRosette = buildRosette;

  function shake(node, t, dur, amp, seed = 1) {
    const r = rng(seed), n = Math.round(dur / 0.045), kf = [];
    for (let i = 0; i < n; i++) { const k = 1 - i / n; kf.push({ x: (r() - 0.5) * amp * 2 * k, y: (r() - 0.5) * amp * 2 * k, duration: 0.045, ease: 'none' }); }
    kf.push({ x: 0, y: 0, duration: 0.05 });
    tl.to(node, { keyframes: kf }, t);
  }
  window.shake = shake;
  const flash = (t, a = 0.5, d = 0.6) => tl.fromTo('#flash', { opacity: a }, { opacity: 0, duration: d, ease: 'power2.out', immediateRender: false }, t);
  window.flash = flash;

  // ======================================================================
  // 1 · FITAN — a perfect rosette crowded, shattered, doubled; a lamp in the storm
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 0, 10.4, 0.01, 0.9);
    const cam = div('layer', s);
    const sv = svg(cam);
    const grp = el('g', { style: 'filter: drop-shadow(0 0 10px rgba(242,210,139,.55))' }, sv);
    const segs = buildRosette(grp, 960, 540, 240, '#e8c47a', 4);
    const ghostA = el('g', { opacity: 0, style: 'mix-blend-mode:screen' }, sv), ghostB = el('g', { opacity: 0, style: 'mix-blend-mode:screen' }, sv);
    const gA = buildRosette(ghostA, 960, 540, 240, '#3fb3a0', 3), gB = buildRosette(ghostB, 960, 540, 240, '#e07a3b', 3);
    const st = { swirl: 0, storm: 0.15, ember: 0, flame: 0, lampY: -700, swing: 0 };

    // assemble on "في زمن"
    tl.fromTo(segs.map(x => x.p), { drawSVG: '50% 50%', opacity: 0 }, { drawSVG: '0% 100%', opacity: 1, duration: 0.8, stagger: { each: 0.008, from: 'random' }, ease: 'glide' }, C.fitan);
    tl.fromTo(grp, { scale: 0.85, rotation: -20, svgOrigin: '960 540' }, { scale: 1, rotation: 0, duration: 1.4, ease: 'silk' }, C.fitan);
    // "تزاحمت" — crowding: everything jostles inward
    segs.forEach((x, i) => {
      const r = rng(i + 50);
      tl.to(x.p, { x: (r() - 0.5) * 26, y: (r() - 0.5) * 26, duration: 0.25, ease: 'power1.inOut', repeat: 3, yoyo: true }, C.fitan_w_tazahamat + r() * 0.15);
    });
    tl.to(grp, { rotation: 8, scale: 0.94, svgOrigin: '960 540', duration: 1.1, ease: 'power2.in' }, C.fitan_w_tazahamat);
    tl.to(st, { storm: 0.6, swirl: 1, duration: 1.4, ease: 'power2.in' }, C.fitan_w_tazahamat);
    // "الفتن" — shatter
    flash(C.fitan_w_fitan, 0.55, 0.7); shake(cam, C.fitan_w_fitan, 0.7, 22, 3);
    segs.forEach(x => tl.to(x.p, { x: x.dx, y: x.dy, rotation: x.rot, svgOrigin: `${x.mid[0]} ${x.mid[1]}`, stroke: '#a89a86', duration: 2.4, ease: 'expo.out' }, C.fitan_w_fitan));
    tl.to(st, { storm: 1, ember: 1, duration: 0.3 }, C.fitan_w_fitan);
    tl.to(grp, { rotation: 30, duration: 8, ease: 'none' }, C.fitan_w_fitan);
    // "واشتبهت فيه الحقائق" — truths doubled & confused
    [gA, gB].forEach((G, k) => G.forEach((x, i) => tl.set(x.p, { x: segs[i].dx, y: segs[i].dy, rotation: segs[i].rot, svgOrigin: `${x.mid[0]} ${x.mid[1]}` }, C.haqaiq)));
    tl.set([ghostA, ghostB], { svgOrigin: '960 540', rotation: 30 + (C.haqaiq - C.fitan_w_fitan) * 3.75 }, C.haqaiq);
    tl.to(ghostA, { opacity: 0.9, x: -18, y: 6, duration: 0.5 }, C.haqaiq);
    tl.to(ghostB, { opacity: 0.9, x: 18, y: -6, duration: 0.5 }, C.haqaiq);
    tl.to([ghostA, ghostB], { rotation: '+=9', duration: 2.6, ease: 'none' }, C.haqaiq);
    tl.to(ghostA, { x: -60, y: 26, scale: 1.05, svgOrigin: '960 540', duration: 1.6, ease: 'sine.inOut' }, C.haqaiq_w);
    tl.to(ghostB, { x: 64, y: -22, scale: 0.95, svgOrigin: '960 540', duration: 1.6, ease: 'sine.inOut' }, C.haqaiq_w);
    tl.to(grp, { opacity: 0.55, duration: 1.2 }, C.haqaiq_w);
    shake(cam, C.haqaiq_w, 0.4, 8, 5);
    // "لم يسلم من الابتلاء" — fragments blown away; a lamp descends into the storm
    tl.to([grp, ghostA, ghostB], { opacity: 0.12, x: '-=220', duration: 3.2, ease: 'power2.in' }, C.ibtila);
    tl.to(st, { lampY: 0, duration: 1.6, ease: 'power3.out' }, C.ibtila - 0.2);
    tl.to(st, { flame: 1, duration: 0.8 }, C.ibtila + 0.4);
    tl.to(st, { swing: 1, duration: 0.5, ease: 'power2.out' }, C.ibtila_w_ammi);
    tl.to(st, { swing: -1, duration: 0.6, ease: 'sine.inOut' }, C.ibtila_w_ammi + 0.5);
    tl.to(st, { swing: 0.6, duration: 0.5, ease: 'sine.inOut' }, C.ibtila_w_alim);
    tl.to(st, { flame: 0.12, duration: 0.35, ease: 'power3.out' }, C.ibtila_w_alim);
    tl.to(st, { flame: 0.45, duration: 1.2, ease: 'sine.inOut' }, C.ibtila_end + 0.1);
    tl.to(st, { swing: 0, storm: 0.4, duration: 2 }, C.ibtila_end);

    // lamp (qandil) in SVG
    const lampG = el('g', {}, sv);
    const lamp = el('g', {}, lampG);
    el('path', { d: 'M960,-40 L960,388', stroke: '#8f7a52', 'stroke-width': 3 }, lamp);
    [0, 1, 2].forEach(i => el('path', { d: `M960,388 L${910 + i * 50},430`, stroke: '#8f7a52', 'stroke-width': 2 }, lamp));
    el('path', { d: 'M925,428 L995,428 L1008,448 L912,448 Z', fill: '#2b2418', stroke: '#c9a25a', 'stroke-width': 2.5 }, lamp);
    el('path', { d: 'M905,452 C878,486 866,526 878,568 C892,616 928,648 960,652 C992,648 1028,616 1042,568 C1054,526 1042,486 1015,452 Z', fill: 'rgba(255,190,110,0.12)', stroke: '#d9ae57', 'stroke-width': 3 }, lamp);
    el('path', { d: 'M880,520 C930,540 990,540 1040,520 M884,580 C935,598 985,598 1036,580', stroke: 'rgba(217,174,87,.6)', 'stroke-width': 2, fill: 'none' }, lamp);
    el('path', { d: 'M938,652 L982,652 L992,676 L928,676 Z', fill: '#2b2418', stroke: '#c9a25a', 'stroke-width': 2.5 }, lamp);
    const lampState = { get rot() { return st.swing * 7; } };

    draw('bg', 0, 11.2, (g, t) => {
      const gr = g.createRadialGradient(960, 560, 50, 960, 540, 1200);
      gr.addColorStop(0, `rgb(${16 + st.ember * 22},${30 + st.ember * 2},${34})`); gr.addColorStop(1, '#03080a');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // churning smoke
      g.globalCompositeOperation = 'lighter';
      const r = rng(11);
      for (let i = 0; i < 46; i++) {
        const a0 = r() * Math.PI * 2, rad = 150 + r() * 820, sp = (0.05 + r() * 0.12) * (r() < 0.5 ? -1 : 1);
        const a = a0 + t * sp * (0.6 + st.swirl * 1.6) + noise2(i, t * 0.15) * 0.8;
        const x = 960 + Math.cos(a) * rad * 1.3, y = 540 + Math.sin(a) * rad * 0.7;
        glow(g, i % 7 === 0 ? SPR.teal : SPR.smokeLight, x, y, 500 + r() * 700, (0.35 + st.storm * 0.65) * (0.6 + 0.4 * noise2(i * 3, t * 0.4)));
      }
      // lightning glow on the shatter
      const lf = Math.exp(-Math.max(0, t - C.fitan_w_fitan) * 3) * (t > C.fitan_w_fitan ? 1 : 0);
      glow(g, SPR.ember, 960, 540, 1800, lf * 0.6);
      g.globalCompositeOperation = 'source-over';
    });
    draw('fx', 0, 11.2, (g, t) => {
      // embers / dust in the gale
      g.globalCompositeOperation = 'lighter';
      const r = rng(21);
      for (let i = 0; i < 160; i++) {
        const sx = r() * W, sy = r() * H, sp = 40 + r() * 160, ph = r() * 10;
        const wind = 1 + st.storm * 4;
        const x = ((sx + (t + ph) * sp * wind) % (W + 200)) - 100;
        const y = sy + Math.sin(t * 1.3 + ph) * 40 + noise2(i, t * 0.5) * 120;
        const isEmber = i % 4 === 0;
        glow(g, isEmber ? SPR.ember : SPR.gold, x, y, isEmber ? 10 + r() * 14 : 4 + r() * 8, (0.25 + st.storm * 0.5) * (isEmber ? st.ember * 0.9 + 0.1 : 0.6));
      }
      // lamp flame
      if (st.flame > 0.001 && st.lampY > -690) {
        const rot = lampState.rot * Math.PI / 180;
        const px = 960 + Math.sin(-rot) * 545, py = st.lampY + Math.cos(rot) * 545;
        const fl = st.flame * (0.82 + 0.18 * noise2(t * 9, 3)) * (0.9 + 0.1 * Math.sin(t * 31));
        glow(g, SPR.warm, px, py, 900 * fl, 0.9 * fl);
        glow(g, SPR.gold, px, py, 180 * fl, 1);
        glow(g, SPR.white, px, py - 6, 46 * fl, 0.9);
      }
      g.globalCompositeOperation = 'source-over';
    });
    // tie lamp transform to state each frame (timeline-driven)
    tl.to({}, { duration: 11.2, onUpdate: () => {
      lampG.setAttribute('transform', `translate(0,${st.lampY}) rotate(${lampState.rot} 960 -40)`);
    } }, 0);
  });

  // ======================================================================
  // 2 · VOICES from every direction; everyone claims the truth
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 10.75, 17.75, 0.5, 0.45);
    const sv = svg(s);
    const r0 = rng(31);
    const emitters = [];
    const edge = [[120, 140], [1800, 120], [80, 940], [1840, 960], [960, 40], [960, 1050], [40, 540], [1880, 540], [480, 60], [1440, 1020], [1460, 70], [470, 1020], [300, 420], [1640, 660], [700, 300], [1240, 800]];
    edge.forEach(([x, y], i) => {
      const at = i < 8 ? lerp(C.aswat + 0.1, C.aswat_w_kull, i / 8) + r0() * 0.15 : C.aswat_w_kull + (i - 8) * 0.06;
      emitters.push({ x, y, at, per: 0.42 + r0() * 0.35, hue: i % 5 === 0 ? 'gold' : i % 3 === 0 ? 'ember' : 'teal' });
    });
    const st = { claim: 0, conv: 0, fade: 1 };
    draw('bg', 10.75, 17.8, (g, t) => {
      g.fillStyle = '#04090b'; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'lighter';
      for (const e of emitters) {
        if (t < e.at) continue;
        const life = t - e.at;
        glow(g, e.hue === 'gold' ? SPR.gold : e.hue === 'ember' ? SPR.ember : SPR.teal, e.x, e.y, 120 + Math.sin(t * 8 + e.x) * 20, Math.min(1, life * 4) * st.fade);
        const col = e.hue === 'gold' ? '242,210,139' : e.hue === 'ember' ? '224,122,59' : '80,190,170';
        for (let k = 0; k < 14; k++) {
          const born = e.at + k * e.per; if (born > t) break;
          const rad = (t - born) * 330;
          const a = Math.max(0, 1 - rad / 1500) * 0.55 * st.fade;
          if (a <= 0) continue;
          g.strokeStyle = `rgba(${col},${a})`; g.lineWidth = 2.2 - rad / 1500 * 1.6;
          g.beginPath(); g.arc(e.x, e.y, rad, 0, Math.PI * 2); g.stroke();
        }
        // beam toward centre when claiming
        if (st.conv > 0) {
          const p = st.conv;
          g.strokeStyle = `rgba(${col},${0.5 * p * st.fade})`; g.lineWidth = 2;
          g.beginPath(); g.moveTo(e.x, e.y); g.lineTo(lerp(e.x, 960, p * 0.78), lerp(e.y, 540, p * 0.78)); g.stroke();
        }
      }
      g.globalCompositeOperation = 'source-over';
    });
    // ring of claimants: arrows that cannot agree, then each points to itself
    const ring = el('g', { opacity: 0 }, sv);
    const arrows = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, x = 960 + Math.cos(a) * 250, y = 540 + Math.sin(a) * 250;
      const g = el('g', { transform: `translate(${x},${y})` }, ring);
      const p = el('path', { d: 'M-34,-11 L8,-11 L8,-25 L40,0 L8,25 L8,11 L-34,11 Z', fill: i % 4 === 0 ? '#f2d28b' : 'rgba(241,230,207,.85)', stroke: 'none' }, g);
      arrows.push({ p, a });
    }
    const core = el('circle', { cx: 960, cy: 540, r: 34, fill: 'none', stroke: '#f2d28b', 'stroke-width': 3, opacity: 0 }, sv);
    tl.to(ring, { opacity: 1, duration: 0.3 }, C.yaddai);
    tl.fromTo(ring, { scale: 0.6, svgOrigin: '960 540' }, { scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, C.yaddai);
    arrows.forEach((A, i) => {
      const r = rng(i + 400), kf = [];
      let cur = r() * 360;
      tl.set(A.p, { rotation: cur, svgOrigin: '0 0' }, C.yaddai);
      for (let k = 0; k < 4; k++) { cur += (r() - 0.5) * 300; kf.push({ rotation: cur, duration: 0.32, ease: 'back.out(3)' }); }
      tl.to(A.p, { keyframes: kf }, C.yaddai + 0.1 + r() * 0.1);
      // "الحق" all snap inward — fighting over the centre
      tl.to(A.p, { rotation: (A.a * 180) / Math.PI + 180, duration: 0.25, ease: 'snap' }, C.yaddai_w_haqq);
      // "معه" — each turns away, truth "with me"
      tl.to(A.p, { rotation: (A.a * 180) / Math.PI, duration: 0.3, ease: 'back.out(2.4)' }, C.yaddai_w_maahu);
    });
    tl.to(core, { opacity: 1, duration: 0.1 }, C.yaddai_w_haqq);
    tl.fromTo(core, { attr: { r: 20 } }, { attr: { r: 140 }, opacity: 0, duration: 0.8, ease: 'expo.out', immediateRender: false }, C.yaddai_w_maahu);
    tl.to(st, { conv: 1, duration: 0.5 }, C.yaddai_w_haqq - 0.1);
    tl.to(st, { conv: 0, duration: 0.3 }, C.yaddai_w_maahu);
    tl.to(ring, { scale: 1.25, svgOrigin: '960 540', duration: 0.7, ease: 'power3.out' }, C.yaddai_w_maahu);
    tl.to(st, { fade: 0.2, duration: 0.5 }, C.yaddai_end);
  });

  // ======================================================================
  // 3 · RELIGION AS A COMMODITY — the scale tips toward coins; trustworthy lamps go out
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 17.75, 27.3, 0.45, 0.7);
    const st = { draw: 0, book: 0, tag: 0, tagSpin: 0, tilt: 0, coins: 0, scaleA: 1, lamps: 0, out: 0, zoom: 1 };
    tl.to(st, { draw: 1, duration: 1.3, ease: 'glide' }, C.din - 0.1);
    tl.to(st, { book: 1, duration: 0.8, ease: 'bounce.out' }, C.din_w_din - 0.2);
    tl.to(st, { tilt: 0.16, duration: 0.9, ease: 'back.out(2)' }, C.din_w_din + 0.3);
    tl.to(st, { tag: 1, duration: 0.7, ease: 'back.out(1.6)' }, C.sila);
    tl.to(st, { tagSpin: 1, duration: 1.0, ease: 'elastic.out(1,0.4)' }, C.sila_w_tuba);
    tl.to(st, { coins: 1, duration: 1.3, ease: 'none' }, C.sila_w_aswaq);
    tl.to(st, { tilt: -0.34, duration: 1.0, ease: 'bounce.out' }, C.sila_w_dunya);
    tl.to(st, { scaleA: 0, zoom: 0.7, duration: 0.8, ease: 'power2.in' }, C.thiqat - 0.25);
    tl.to(st, { lamps: 1, duration: 0.6 }, C.thiqat - 0.05);
    tl.to(st, { out: 1, duration: 1.8, ease: 'power1.in' }, C.thiqat_w);

    const coinsR = rng(77), coins = [...Array(26)].map((_, i) => ({ d: i / 26 * 0.85, x: (coinsR() - 0.5) * 120, rot: coinsR() * 6, h: coinsR() }));
    const lampsR = rng(88), lamps = [];
    for (let j = 0; j < 7; j++) for (let i = 0; i < 15; i++) lamps.push({ x: 150 + i * 117 + (j % 2) * 58, y: 190 + j * 112, off: lampsR(), keep: false, ph: lampsR() * 6 });
    [17, 50, 63, 86, 38].forEach(k => (lamps[k].keep = true));

    function dash(g, len, p) { g.setLineDash([len * p, len]); }
    draw('bg', 17.7, 27.35, (g, t) => {
      const gr = g.createRadialGradient(960, 600, 40, 960, 540, 1100);
      gr.addColorStop(0, '#1c1a12'); gr.addColorStop(0.6, '#0b0d0c'); gr.addColorStop(1, '#030505');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      if (st.scaleA > 0.001) {
        g.save();
        g.globalAlpha = st.scaleA;
        g.translate(960, 560); g.scale(st.zoom, st.zoom); g.translate(-960, -560);
        const P = st.draw, gold = '#e2bb6a';
        g.strokeStyle = gold; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round';
        g.shadowColor = 'rgba(242,210,139,.5)'; g.shadowBlur = 18;
        // post & base
        dash(g, 520, P); g.beginPath(); g.moveTo(960, 860); g.lineTo(960, 340); g.stroke();
        dash(g, 520, P); g.beginPath(); g.moveTo(840, 880); g.lineTo(1080, 880); g.moveTo(880, 860); g.lineTo(1040, 860); g.stroke();
        g.setLineDash([]);
        g.fillStyle = gold; g.beginPath(); g.arc(960, 318, 14 * P, 0, 7); g.fill();
        // beam
        const a = st.tilt, L = 290;
        const lx = 960 - Math.cos(a) * L, ly = 345 - Math.sin(a) * L, rx = 960 + Math.cos(a) * L, ry = 345 + Math.sin(a) * L;
        dash(g, 600, P); g.beginPath(); g.moveTo(lx, ly); g.lineTo(rx, ry); g.stroke(); g.setLineDash([]);
        const pan = (x, y) => {
          g.lineWidth = 2.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 95, y + 230); g.moveTo(x, y); g.lineTo(x + 95, y + 230); g.stroke();
          g.lineWidth = 5; g.beginPath(); g.moveTo(x - 115, y + 230); g.quadraticCurveTo(x, y + 300, x + 115, y + 230); g.closePath();
          g.fillStyle = 'rgba(40,32,18,.9)'; g.fill(); g.stroke();
        };
        g.globalAlpha = st.scaleA * clamp(P * 2 - 1);
        pan(lx, ly); pan(rx, ry);
        g.shadowBlur = 0;
        // book on the left pan
        if (st.book > 0) {
          const bx = lx, by = lerp(ly - 300, ly + 200, st.book);
          glow(g, SPR.gold, bx, by - 20, 220, 0.6 * st.book * st.scaleA);
          g.fillStyle = '#123a35'; g.strokeStyle = '#f2d28b'; g.lineWidth = 3;
          g.beginPath(); g.moveTo(bx, by + 26); g.quadraticCurveTo(bx - 40, by + 12, bx - 70, by + 22); g.lineTo(bx - 70, by - 24); g.quadraticCurveTo(bx - 40, by - 34, bx, by - 20); g.closePath(); g.fill(); g.stroke();
          g.beginPath(); g.moveTo(bx, by + 26); g.quadraticCurveTo(bx + 40, by + 12, bx + 70, by + 22); g.lineTo(bx + 70, by - 24); g.quadraticCurveTo(bx + 40, by - 34, bx, by - 20); g.closePath(); g.fill(); g.stroke();
          // price tag
          if (st.tag > 0) {
            g.save(); g.translate(bx + 40, by - 20); g.rotate(-0.4 + Math.sin(st.tagSpin * 9) * 0.35 * (1 - st.tagSpin) + 0.2);
            g.globalAlpha = st.scaleA * st.tag;
            g.strokeStyle = '#d58a4a'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(34, 40); g.stroke();
            g.translate(34, 40); g.rotate(0.5);
            g.fillStyle = '#e07a3b'; g.beginPath(); g.moveTo(0, -18); g.lineTo(70, -18); g.lineTo(70, 18); g.lineTo(0, 18); g.lineTo(-18, 0); g.closePath(); g.fill();
            g.fillStyle = '#1b0f08'; g.beginPath(); g.arc(-4, 0, 5, 0, 7); g.fill();
            g.fillStyle = '#1b0f08'; g.font = '600 26px Plex'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', 38, 2);
            g.restore();
          }
        }
        // coins rain into the right pan
        if (st.coins > 0) {
          coins.forEach((c, i) => {
            const p = clamp((st.coins - c.d) / 0.15); if (p <= 0) return;
            const tx = rx + c.x * 0.7, ty = ry + 215 - Math.floor(i / 6) * 9 - (i % 2) * 4;
            const y = lerp(-80, ty, ease.in(p)), x = lerp(tx + (c.h - 0.5) * 300, tx, p);
            g.save(); g.translate(x, y); g.scale(1, 0.45 + 0.55 * Math.abs(Math.cos(c.rot + p * 9)));
            g.fillStyle = '#f2c55f'; g.strokeStyle = '#8a5f1d'; g.lineWidth = 2;
            g.beginPath(); g.arc(0, 0, 17, 0, 7); g.fill(); g.stroke(); g.restore();
            if (p > 0.97) glow(g, SPR.gold, x, y, 60, 0.4);
          });
        }
        g.restore();
      }
      // field of lamps — the trustworthy, dwindling
      if (st.lamps > 0) {
        g.globalCompositeOperation = 'lighter';
        lamps.forEach((L, i) => {
          const off = L.keep ? 0 : clamp((st.out - L.off * 0.85) / 0.15);
          const fl = 0.85 + 0.15 * noise2(i, t * 3);
          const a = st.lamps * (1 - off) * fl, ap = clamp(st.lamps * 3 - (i % 15) / 15 * 2);
          glow(g, SPR.warm, L.x, L.y, 150 * (L.keep ? 1 + st.out * 0.6 : 1), a * ap * (L.keep ? 1 : 0.8));
          glow(g, SPR.white, L.x, L.y, 14, a * ap);
          if (off > 0 && off < 1) glow(g, SPR.smokeLight, L.x, L.y - off * 60, 90, (1 - off) * 0.6);
        });
        g.globalCompositeOperation = 'source-over';
      }
    });
  });

  // ======================================================================
  // 4 · CONFUSION — a maze full of wanderers; the white & black threads entangle
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 27.4, 35.95, 0.5, 0.45);
    const CW = 48, NX = 38, NY = 21, OX = (W - NX * CW) / 2, OY = (H - NY * CW) / 2;
    const r = rng(404);
    const vis = new Uint8Array(NX * NY), open = [...Array(NX * NY)].map(() => ({ n: 0, e: 0, s: 0, w: 0 }));
    const stack = [[Math.floor(NX / 2), Math.floor(NY / 2)]]; vis[stack[0][1] * NX + stack[0][0]] = 1;
    while (stack.length) {
      const [x, y] = stack[stack.length - 1];
      const nb = [[0, -1, 'n', 's'], [1, 0, 'e', 'w'], [0, 1, 's', 'n'], [-1, 0, 'w', 'e']].filter(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < NX && ny < NY && !vis[ny * NX + nx]; });
      if (!nb.length) { stack.pop(); continue; }
      const [dx, dy, a, b] = nb[Math.floor(r() * nb.length)];
      open[y * NX + x][a] = 1; open[(y + dy) * NX + x + dx][b] = 1; vis[(y + dy) * NX + x + dx] = 1; stack.push([x + dx, y + dy]);
    }
    const walls = [];
    for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
      const o = open[y * NX + x], X = OX + x * CW, Y = OY + y * CW;
      if (!o.n) walls.push([X, Y, X + CW, Y]); if (!o.w) walls.push([X, Y, X, Y + CW]);
      if (x === NX - 1 && !o.e) walls.push([X + CW, Y, X + CW, Y + CW]); if (y === NY - 1 && !o.s) walls.push([X, Y + CW, X + CW, Y + CW]);
    }
    walls.forEach(w => (w.d = Math.hypot((w[0] + w[2]) / 2 - 960, (w[1] + w[3]) / 2 - 540)));
    const walkers = [...Array(90)].map((_, i) => {
      const rr = rng(i * 13 + 5); let x = Math.floor(rr() * NX), y = Math.floor(rr() * NY); const path = [[x, y]]; let px = -1, py = -1;
      for (let k = 0; k < 60; k++) {
        const o = open[y * NX + x], opts = [];
        if (o.n) opts.push([x, y - 1]); if (o.s) opts.push([x, y + 1]); if (o.e) opts.push([x + 1, y]); if (o.w) opts.push([x - 1, y]);
        let c = opts.filter(([a, b]) => a !== px || b !== py); if (!c.length) c = opts;
        const [nx, ny] = c[Math.floor(rr() * c.length)]; px = x; py = y; x = nx; y = ny; path.push([x, y]);
      }
      return { path, born: C.iltabas + 0.4 + (i < 30 ? rr() * 1.0 : 1.4 + rr() * 0.6), speed: 2.2 + rr() * 2.2 };
    });
    const st = { reveal: 0, rot: 0, zoom: 1.08, mazeA: 1, th: 0, amp: 70, tangle: 0, grey: 0, white: 0, black: 0 };
    tl.to(st, { reveal: 1, duration: 1.6, ease: 'power2.out' }, C.iltabas - 0.15);
    tl.to(st, { rot: -0.06, zoom: 1.22, duration: 8.5, ease: 'none' }, C.iltabas - 0.15);
    tl.to(st, { mazeA: 0.25, duration: 0.8 }, C.tamyiz - 0.2);
    tl.to(st, { th: 1, duration: 1.1, ease: 'glide' }, C.tamyiz - 0.1);
    tl.to(st, { white: 1, duration: 0.4 }, C.tamyiz_w_haqq);
    tl.to(st, { black: 1, duration: 0.4 }, C.tamyiz_w_batil);
    tl.to(st, { grey: 1, duration: 0.7 }, C.tamyiz_end - 0.25);
    tl.to(st, { tangle: 1, amp: 150, duration: 0.8, ease: 'power3.in' }, C.suuba - 0.15);
    tl.to(st, { mazeA: 0, duration: 0.6 }, C.suuba_end);
    const wrap = div('layer', s); shake(wrap, C.suuba + 0.55, 0.5, 10, 9);

    draw('bg', 27.35, 36.0, (g, t) => {
      g.fillStyle = '#060c0e'; g.fillRect(0, 0, W, H);
      const gr = g.createRadialGradient(960, 540, 0, 960, 540, 1000); gr.addColorStop(0, 'rgba(30,70,66,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.save();
      const sx = gsap.getProperty(wrap, 'x'), sy = gsap.getProperty(wrap, 'y');
      g.translate(960 + sx, 540 + sy); g.rotate(st.rot); g.scale(st.zoom, st.zoom); g.translate(-960, -540);
      g.globalAlpha = st.mazeA;
      g.strokeStyle = 'rgba(150,190,182,.42)'; g.lineWidth = 3; g.lineCap = 'round';
      const R = st.reveal * 1150;
      g.beginPath();
      for (const w of walls) if (w.d < R) { g.moveTo(w[0], w[1]); g.lineTo(w[2], w[3]); }
      g.stroke();
      g.globalCompositeOperation = 'lighter';
      for (const wk of walkers) {
        if (t < wk.born) continue;
        const pos = (t - wk.born) * wk.speed, i = Math.floor(pos), f = ease.io(pos - i);
        const a = wk.path[Math.min(i, wk.path.length - 1)], b = wk.path[Math.min(i + 1, wk.path.length - 1)];
        const x = OX + (lerp(a[0], b[0], f) + 0.5) * CW, y = OY + (lerp(a[1], b[1], f) + 0.5) * CW;
        const ap = Math.min(1, (t - wk.born) * 3);
        glow(g, SPR.white, x, y, 30, 0.75 * ap); glow(g, SPR.teal, x, y, 90, 0.5 * ap);
      }
      g.restore();
    });
    draw('fx', 31.2, 36.0, (g, t) => {
      if (st.th <= 0) return;
      const thread = (phase, colA, w, glowCol) => {
        g.beginPath();
        for (let x = -40; x <= W + 40; x += 8) {
          if (x > -40 + (W + 80) * st.th) break;
          const k = x / W;
          const knot = st.tangle * (Math.sin(k * 40 + t * 7 + phase * 3) * 60 + noise2(k * 6 + phase, t * 1.5) * 200) * Math.sin(k * Math.PI);
          const y = 540 + Math.sin(k * Math.PI * 5 + t * 1.6 + phase) * st.amp * Math.sin(k * Math.PI) + knot;
          x === -40 ? g.moveTo(x, y) : g.lineTo(x, y);
        }
        g.strokeStyle = colA; g.lineWidth = w; g.lineCap = 'round'; g.shadowColor = glowCol; g.shadowBlur = 20; g.stroke(); g.shadowBlur = 0;
      };
      const gw = lerp(255, 150, st.grey), gb = lerp(18, 120, st.grey);
      thread(Math.PI, `rgb(${gb},${gb},${gb + 4})`, 9, `rgba(224,122,59,${0.35 + 0.4 * st.black})`);
      thread(0, `rgb(${gw},${gw - 8 * (1 - st.grey)},${gw - 28 * (1 - st.grey)})`, 7, `rgba(255,240,200,${0.3 + 0.6 * st.white * (1 - st.grey * 0.7)})`);
    });
  });

  // ======================================================================
  // 5 · WHOM TO ASK? — a seeker at the crossroads
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 35.95, 41.95, 0.5, 0.5);
    const q = div('center', s, '؟');
    Object.assign(q.style, { fontFamily: 'Kufi', fontWeight: 700, fontSize: '760px', color: 'transparent', WebkitTextStroke: '3px rgba(217,174,87,.55)', lineHeight: 1, top: '46%' });
    tl.fromTo(q, { opacity: 0, scale: 1.25 }, { opacity: 0.55, scale: 1, duration: 1.6, ease: 'silk' }, C.sail_w_sail - 0.35);
    tl.to(q, { opacity: 0.12, scale: 0.92, duration: 1.4 }, C.talib);
    const R = rng(55);
    const paths = [...Array(11)].map((_, i) => {
      const a = Math.PI + (i / 10) * Math.PI + (R() - 0.5) * 0.15, len = 520 + R() * 380;
      const ex = 960 + Math.cos(a) * len * 1.45, ey = 760 + Math.sin(a) * len * 0.75;
      return { ex, ey, c1x: 960 + Math.cos(a + 0.6 * (R() - 0.5)) * len * 0.6, c1y: 760 + Math.sin(a) * len * 0.2, lit: C.sail + 0.25 + i * 0.13, dead: R() < 0.55 };
    });
    const st = { open: 0, book: 0, rise: 0, dawn: 0 };
    tl.to(st, { open: 1, duration: 1.2, ease: 'glide' }, C.sail - 0.1);
    tl.to(st, { book: 1, duration: 0.6, ease: 'back.out(2)' }, C.talib_w_din - 0.1);
    tl.to(st, { rise: 1, duration: 1.4, ease: 'power2.inOut' }, C.talib_w_talib - 0.1);
    tl.to(st, { dawn: 1, duration: 1.2 }, C.talib_w_talib + 0.3);
    draw('bg', 35.9, 42.0, (g, t) => {
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, `rgb(${8 + st.dawn * 30},${16 + st.dawn * 22},${20 + st.dawn * 8})`); gr.addColorStop(1, '#030607');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      const sx = 960, sy = 760 - st.rise * 40;
      paths.forEach((p, i) => {
        const L = st.open, lit = clamp((t - p.lit) / 0.35) * (1 - clamp((t - p.lit - 0.6) / 0.6) * (p.dead ? 0.85 : 0.5));
        g.beginPath(); g.moveTo(sx, sy);
        const N = 40;
        for (let k = 1; k <= N * L; k++) { const u = k / N; const x = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * p.c1x + u * u * p.ex, y = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * p.c1y + u * u * p.ey; g.lineTo(x, y); }
        g.strokeStyle = `rgba(${lerp(90, 242, lit)},${lerp(120, 210, lit)},${lerp(118, 139, lit)},${0.25 + lit * 0.6})`; g.lineWidth = 2 + lit * 2; g.setLineDash([2, 12]); g.lineCap = 'round'; g.stroke(); g.setLineDash([]);
        if (L > 0.98) { glow(g, p.dead ? SPR.smokeLight : SPR.teal, p.ex, p.ey, 90 + lit * 60, 0.5 + lit * 0.5); }
      });
      g.globalCompositeOperation = 'lighter';
      glow(g, SPR.warm, sx, sy, 300, 0.7); glow(g, SPR.white, sx, sy, 34, 1);
      if (st.book > 0) {
        glow(g, SPR.gold, sx, sy - 70, 160 * st.book, 0.7);
        g.globalCompositeOperation = 'source-over';
        g.save(); g.translate(sx, sy - 70); g.scale(st.book, st.book); g.strokeStyle = '#f2d28b'; g.lineWidth = 3; g.fillStyle = 'rgba(10,30,30,.9)';
        for (const d of [-1, 1]) { g.beginPath(); g.moveTo(0, 14); g.quadraticCurveTo(d * 22, 6, d * 40, 12); g.lineTo(d * 40, -14); g.quadraticCurveTo(d * 22, -20, 0, -12); g.closePath(); g.fill(); g.stroke(); }
        g.restore();
      }
      g.globalCompositeOperation = 'source-over';
      if (st.dawn > 0) { const dg = g.createLinearGradient(0, 0, 0, 380); dg.addColorStop(0, `rgba(242,210,139,${0.18 * st.dawn})`); dg.addColorStop(1, 'rgba(242,210,139,0)'); g.fillStyle = dg; g.fillRect(0, 0, W, 380); }
    });
  });

  // ======================================================================
  // 6 · TRUSTED KNOWLEDGE — dawn; the rosette re-forms; a road of light; roots to the sources
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 41.9, 52.75, 0.45, 0.55);
    const st = { line: 0, sky: 0, camY: 0, road: 0, roots: 0, src: 0, pulse: 0, ros: 0 };
    const world = div('layer', s);
    const sv = svg(world);
    const rg = el('g', { style: 'filter: drop-shadow(0 0 14px rgba(255,214,140,.7))' }, sv);
    const segs = buildRosette(rg, 960, 390, 170, '#f6dc9c', 4.5);
    segs.forEach(x => tl.set(x.p, { x: x.dx * 1.6, y: x.dy * 1.6 - 300, rotation: x.rot * 2, svgOrigin: `${x.mid[0]} ${x.mid[1]}`, opacity: 0 }, 0));
    // "العلم الموثوق" — every fragment returns to its exact place
    segs.forEach((x, i) => tl.to(x.p, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.15, ease: 'expo.inOut' }, C.haja + 0.15 + (i % 9) * 0.03));
    tl.fromTo(rg, { rotation: -90, svgOrigin: '960 390' }, { rotation: 0, duration: 1.7, ease: 'expo.out' }, C.haja + 0.1);
    const ringA = el('circle', { cx: 960, cy: 390, r: 10, fill: 'none', stroke: '#fff1cf', 'stroke-width': 3, opacity: 0 }, sv);
    tl.fromTo(ringA, { attr: { r: 200 }, opacity: 0.9 }, { attr: { r: 900 }, opacity: 0, duration: 1.4, ease: 'expo.out', immediateRender: false }, C.haja_w_mawthuq);
    tl.fromTo(rg, { scale: 1.08, svgOrigin: '960 390' }, { scale: 1, duration: 0.6, ease: 'back.out(3)', immediateRender: false }, C.haja_w_mawthuq);
    window.flash(C.haja_w_mawthuq, 0.35, 0.8);
    tl.to(rg, { rotation: 22.5, svgOrigin: '960 390', duration: 6, ease: 'none' }, C.haja_end + 0.3);
    tl.to(st, { line: 1, duration: 1.2, ease: 'expo.inOut' }, C.zaman - 0.05);
    tl.to(st, { sky: 1, duration: 2.2 }, C.haja - 0.1);
    tl.to(st, { road: 1, duration: 1.4, ease: 'glide' }, C.yadull);
    tl.to(st, { pulse: 1, duration: 0.6 }, C.yadull_w_haqq);
    tl.to(st, { camY: -560, duration: 1.6, ease: 'expo.inOut' }, C.usul - 0.15);
    tl.to(world, { y: -560, duration: 1.6, ease: 'expo.inOut' }, C.usul - 0.15);
    tl.to(st, { roots: 1, duration: 2.4, ease: 'power2.out' }, C.usul + 0.2);
    tl.to(st, { src: 1, duration: 0.7, ease: 'back.out(2)' }, C.usul_w_masadir);

    // root system grown from a seeded random tree
    const roots = [], RR = rng(606);
    (function grow(x, y, ang, len, w, depth, t0) {
      if (depth > 6 || len < 14) return;
      const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      roots.push({ x, y, x2, y2, w, t0, t1: t0 + 0.14 });
      const n = depth < 2 ? 3 : 2;
      for (let i = 0; i < n; i++) grow(x2, y2, ang + (RR() - 0.5) * 1.0 + (i - (n - 1) / 2) * 0.35, len * (0.72 + RR() * 0.18), w * 0.68, depth + 1, t0 + 0.14);
    })(960, 560, Math.PI / 2, 150, 9, 0, 0);
    const maxT = Math.max(...roots.map(r => r.t1));
    const sources = [[640, 1450], [1280, 1450]];
    draw('bg', 41.85, 52.8, (g, t) => {
      g.fillStyle = '#04090a'; g.fillRect(0, 0, W, H);
      g.save(); g.translate(0, st.camY);
      // sky glow above horizon (y = 560)
      const sk = g.createLinearGradient(0, 0, 0, 560);
      sk.addColorStop(0, `rgba(10,40,44,${st.sky})`); sk.addColorStop(1, `rgba(214,160,80,${0.55 * st.sky})`);
      g.fillStyle = sk; g.fillRect(0, 0, W, 560);
      const gd = g.createLinearGradient(0, 560, 0, 1700); gd.addColorStop(0, '#0b1414'); gd.addColorStop(1, '#030606');
      g.fillStyle = gd; g.fillRect(0, 560, W, 1200);
      // horizon line
      const hw = st.line * 960;
      g.globalCompositeOperation = 'lighter';
      const hl = g.createLinearGradient(960 - hw, 0, 960 + hw, 0);
      hl.addColorStop(0, 'rgba(255,220,150,0)'); hl.addColorStop(0.5, 'rgba(255,236,190,1)'); hl.addColorStop(1, 'rgba(255,220,150,0)');
      g.fillStyle = hl; g.fillRect(960 - hw, 558, hw * 2, 4);
      glow(g, SPR.warm, 960, 560, 1400 * st.line, 0.5 * st.line + 0.3 * st.sky);
      glow(g, SPR.gold, 960, 390, 700 * st.sky, 0.55 * st.sky);
      // road of light toward the viewer
      if (st.road > 0) {
        const p = st.road;
        const ra = clamp(1 + st.camY / 300); g.globalAlpha = ra;
        const rd = g.createLinearGradient(0, 560, 0, 1080); rd.addColorStop(0, 'rgba(255,226,160,.85)'); rd.addColorStop(1, 'rgba(255,226,160,0.05)');
        g.fillStyle = rd; g.beginPath(); g.moveTo(950, 560); g.lineTo(970, 560); g.lineTo(lerp(970, 1500, p), lerp(560, 1080, p)); g.lineTo(lerp(950, 420, p), lerp(560, 1080, p)); g.closePath(); g.fill();
        for (let i = 0; i < 26; i++) { // travellers walking to the light
          const R2 = rng(i + 900), lane = R2() * 2 - 1, sp = 0.12 + R2() * 0.08;
          const u = 1 - ((t * sp + R2()) % 1);
          const y = 560 + u * u * 520 * p, x = 960 + lane * (10 + u * u * 520) * p;
          glow(g, SPR.white, x, y, 8 + u * 22, 0.9 * clamp((1 - u) * 4) * clamp(p * 2 - 0.5) * ra);
        }
        g.globalAlpha = 1;
      }
      // roots
      if (st.roots > 0) {
        const T = st.roots * maxT;
        g.lineCap = 'round';
        for (const r of roots) {
          if (T < r.t0) continue;
          const f = clamp((T - r.t0) / (r.t1 - r.t0));
          g.strokeStyle = `rgba(242,205,130,${0.55 + 0.35 * st.src})`; g.lineWidth = r.w;
          g.beginPath(); g.moveTo(r.x, r.y); g.lineTo(lerp(r.x, r.x2, f), lerp(r.y, r.y2, f)); g.stroke();
        }
        glow(g, SPR.gold, 960, 600, 300, st.roots * 0.5);
      }
      if (st.src > 0) {
        sources.forEach(([x, y], i) => {
          const pul = 1 + 0.08 * Math.sin(t * 5 + i);
          glow(g, SPR.warm, x, y, 620 * st.src * pul, 0.9); glow(g, SPR.white, x, y, 70 * st.src, 1);
          // light travelling up from the sources toward the rosette
          const kp = clamp((t - C.usul_w_asila) / 0.9);
          for (let k = 0; k < 5; k++) {
            const u = ((t * 0.9 + k / 5 + i * 0.1) % 1) * kp;
            const px = lerp(x, 960, u) + Math.sin(u * 9 + k) * 40 * (1 - u), py = lerp(y, 560, u);
            glow(g, SPR.gold, px, py, 50, 0.9 * kp);
          }
        });
        g.strokeStyle = `rgba(242,205,130,${0.5 * st.src})`; g.lineWidth = 5;
        sources.forEach(([x, y]) => { g.beginPath(); g.moveTo(960, 700); g.bezierCurveTo(960, 1000, x, 1100, x, y); g.stroke(); });
      }
      g.globalCompositeOperation = 'source-over';
      g.restore();
    });
  });

  // ======================================================================
  // 7 · THE MANUSCRIPT — the scholars of old; an isnād chain from the seeker to the source
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 52.65, 60.35, 0.55, 0.65);
    // parchment texture (baked once)
    const tex = document.createElement('canvas'); tex.width = W; tex.height = H;
    { const g = tex.getContext('2d'); const gr = g.createRadialGradient(960, 520, 100, 960, 540, 1150);
      gr.addColorStop(0, '#efe2c4'); gr.addColorStop(0.65, '#dcc596'); gr.addColorStop(1, '#8c6a3a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      const r = rng(5); for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${90 + r() * 60},${60 + r() * 40},${20},${r() * 0.05})`; const s2 = r() * 90; g.beginPath(); g.arc(r() * W, r() * H, s2, 0, 7); g.fill(); }
      const im = g.getImageData(0, 0, W, H); for (let i = 0; i < im.data.length; i += 4) { const n = (r() - 0.5) * 18; im.data[i] += n; im.data[i + 1] += n; im.data[i + 2] += n; } g.putImageData(im, 0, 0); }
    const bg = div('layer', s); bg.style.background = `url(${tex.toDataURL('image/jpeg', 0.9)})`;
    const cam = div('layer', s);
    const sv = svg(cam);
    const ink = '#3a2614', gold = '#b8862e', lapis = '#1d4a66';
    // illuminated frame
    const frame = [];
    frame.push(el('rect', { x: 250, y: 90, width: 1420, height: 900, rx: 6, fill: 'none', stroke: gold, 'stroke-width': 6 }, sv));
    frame.push(el('rect', { x: 272, y: 112, width: 1376, height: 856, rx: 4, fill: 'none', stroke: lapis, 'stroke-width': 3 }, sv));
    frame.push(el('rect', { x: 286, y: 126, width: 1348, height: 828, fill: 'none', stroke: gold, 'stroke-width': 1.5 }, sv));
    const corners = [[272, 112], [1648, 112], [272, 968], [1648, 968]].map(([x, y]) => {
      const g = el('g', {}, sv); const [a, b] = khatam(x, y, 34);
      el('path', { d: a, fill: '#e9d29a', stroke: gold, 'stroke-width': 3 }, g); el('path', { d: b, fill: '#e9d29a', stroke: gold, 'stroke-width': 3 }, g);
      el('circle', { cx: x, cy: y, r: 10, fill: lapis }, g); return g;
    });
    // header medallion
    const med = el('g', {}, sv);
    el('ellipse', { cx: 960, cy: 250, rx: 300, ry: 70, fill: 'rgba(29,74,102,.12)', stroke: gold, 'stroke-width': 4 }, med);
    el('ellipse', { cx: 960, cy: 250, rx: 280, ry: 56, fill: 'none', stroke: lapis, 'stroke-width': 2 }, med);
    const medFill = el('ellipse', { cx: 960, cy: 250, rx: 280, ry: 56, fill: '#d6a944', opacity: 0 }, med);
    const medTxt = div('abs', cam, 'باب فضل العلم');
    Object.assign(medTxt.style, { left: '0', width: '1920px', top: '208px', textAlign: 'center', fontFamily: 'Ruqaa', fontSize: '58px', color: lapis, direction: 'rtl' });
    // text block — a classical hadith on seeking knowledge (Sahih Muslim 2699)
    const lines = ['قَالَ رَسُولُ اللَّهِ ﷺ: مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا،', 'سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ'];
    const lineEls = lines.map((t, i) => {
      const d = div('abs', cam, t);
      Object.assign(d.style, { left: '0', width: '1920px', top: `${380 + i * 104}px`, textAlign: 'center', fontFamily: 'Amiri', fontWeight: 700, fontSize: '64px', color: ink, direction: 'rtl', whiteSpace: 'nowrap' });
      return d;
    });
    // isnad chain
    const chain = el('g', {}, sv);
    const nodes = [], links = [];
    const npos = [[960, 930], [760, 860], [1160, 800], [760, 740], [1160, 680], [960, 610]];
    npos.forEach((p, i) => {
      if (i) links.push(el('path', { d: `M${npos[i - 1][0]},${npos[i - 1][1]} L${p[0]},${p[1]}`, stroke: gold, 'stroke-width': 4, fill: 'none' }, chain));
    });
    npos.forEach((p, i) => {
      const g = el('g', {}, chain);
      const c = el('circle', { cx: p[0], cy: p[1], r: i === npos.length - 1 ? 30 : 20, fill: '#efe2c4', stroke: ink, 'stroke-width': 3 }, g);
      nodes.push({ g, c, p });
    });

    tl.from(frame, { drawSVG: 0, duration: 1.4, stagger: 0.12, ease: 'glide' }, C.qadiman - 0.35);
    tl.from(corners, { scale: 0, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.08, ease: 'back.out(2)' }, C.qadiman + 0.3);
    tl.from(med.children, { drawSVG: 0, duration: 1.0, ease: 'glide' }, C.qadiman);
    tl.fromTo(medTxt, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'power2.out' }, C.qadiman + 0.5);
    lineEls.forEach((d, i) => tl.fromTo(d, { clipPath: 'inset(0 0 0 100%)', opacity: 1 }, { clipPath: 'inset(0 0 0 0%)', duration: 1.3, ease: 'power1.inOut' }, C.qadiman + 0.6 + i * 1.05));
    // "إن هذا العلم دين" — the medallion is gilded
    tl.to(medFill, { opacity: 0.85, duration: 0.6 }, C.dinun + 0.1);
    tl.to(medTxt, { color: '#2b1a08', duration: 0.6 }, C.dinun + 0.1);
    tl.fromTo(cam, { scale: 1 }, { scale: 1.06, duration: 7.5, ease: 'none', transformOrigin: '50% 40%' }, C.qadiman - 0.3);
    // "فانظروا عمّن تأخذون دينكم" — trace the chain upward, link by link
    tl.to(lineEls, { opacity: 0.18, duration: 0.5 }, C.unzuru - 0.1);
    tl.from(nodes.map(n => n.g), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.07, ease: 'back.out(3)' }, C.unzuru - 0.1);
    const lightAt = [C.unzuru + 0.05, C.unzuru_w_amman, C.unzuru_w_amman + 0.2, C.unzuru_w_takhudhun, C.unzuru_w_takhudhun + 0.3, C.unzuru_w_dinakum];
    nodes.forEach((n, i) => tl.to(n.c, { fill: i === nodes.length - 1 ? '#f2c55f' : '#d6a944', stroke: gold, duration: 0.25 }, lightAt[i]));
    links.forEach((l, i) => tl.fromTo(l, { drawSVG: 0 }, { drawSVG: '100%', duration: 0.3, ease: 'power2.out' }, lightAt[i]));
    const ray = el('circle', { cx: 960, cy: 610, r: 30, fill: 'none', stroke: '#b8862e', 'stroke-width': 4, opacity: 0 }, sv);
    tl.fromTo(ray, { attr: { r: 30 }, opacity: 1 }, { attr: { r: 260 }, opacity: 0, duration: 1.0, ease: 'expo.out', immediateRender: false }, C.unzuru_w_dinakum + 0.05);
    // the page burns into night — the top node becomes a star over Makkah
    const burn = div('layer', s); burn.style.background = 'radial-gradient(circle at 50% 56%, rgba(5,12,20,0) 0%, rgba(5,12,20,0) 20%, #050c14 45%)';
    tl.fromTo(burn, { opacity: 0, scale: 3 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.in' }, C.unzuru_end + 0.05);
  });
})();
