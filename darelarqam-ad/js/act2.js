// ACT II (60 – 95.6 s): Makkah & the original Dar al-Arqam → light to the world →
// the encyclopedic website → logo reveal.
(() => {
  const { W, H, tl, draw, show, el, div, svg, khatam, archPath, clamp, lerp, prog, ease, rng, noise2, glow, SPR } = E;
  const C = CUE;
  const SC = window.SCENES;

  // ======================================================================
  // 8 · MAKKAH AT NIGHT — the house at al-Safa; gathering; light goes out to the world
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 60.15, 79.6, 0.6, 0.55);
    const cam = { z: 1.0, x: 960, y: 560 };
    const st = { rim: 0, gather: 0, house: 0.35, pulse: 0, burst: 0, stars: 0, kaaba: 0 };
    tl.to(st, { stars: 1, duration: 1.4 }, 60.1);
    tl.to(cam, { z: 1.08, x: 900, y: 600, duration: 3.7, ease: 'sine.inOut' }, 60.2);
    tl.to(st, { kaaba: 1, duration: 1.0 }, C.awwal);
    tl.to(cam, { z: 2.15, x: 1150, y: 850, duration: 2.4, ease: 'expo.inOut' }, C.arqam - 0.1);
    tl.to(st, { house: 0.75, duration: 1.5 }, C.arqam_w_dar);
    tl.to(st, { rim: 1, duration: 0.8 }, C.safa);
    tl.to(cam, { z: 2.5, x: 1165, y: 865, duration: 7.8, ease: 'none' }, C.safa);
    tl.to(st, { gather: 1, duration: 3.4, ease: 'none' }, C.yajtami - 0.1);
    tl.to(st, { house: 1, duration: 1.2 }, C.yajtami_w_nabi);
    [C.yuallim, C.yuallim_w_yuzakki].forEach(t => tl.fromTo(st, { pulse: 0 }, { pulse: 1, duration: 0.9, ease: 'none', immediateRender: false }, t));
    tl.to(cam, { z: 0.92, x: 1000, y: 470, duration: 2.0, ease: 'expo.inOut' }, C.tilka - 0.1);
    tl.to(st, { burst: 1, duration: 2.9, ease: 'none' }, C.kharaja - 0.05);

    const HX = 1180, HY = 905, KX = 690, KY = 935;
    const mts = [0, 1, 2].map(k => {
      const pts = [], r = rng(k * 31 + 3);
      for (let x = -900; x <= 2900; x += 20) {
        const n = noise2(x * 0.0022 + k * 7, k * 3) * 0.7 + noise2(x * 0.009 + k, 1 + k) * 0.25 + noise2(x * 0.03, k * 5) * 0.06;
        pts.push([x, 760 + k * 70 - (n + 0.5) * (300 - k * 70)]);
      }
      return pts;
    });
    const stars = [...Array(520)].map((_, i) => { const r = rng(i + 7000); return { x: r() * 3800 - 950, y: r() * 900 - 200, s: r() < 0.06 ? 2.6 : 0.6 + r() * 1.3, ph: r() * 9, sp: 0.8 + r() * 3 }; });
    const motes = [...Array(70)].map((_, i) => { const r = rng(i + 8100); return { x: HX + (r() - 0.5) * 1300, y: HY - r() * 380 + 60, d: r() * 0.6 }; });
    const streaks = [...Array(30)].map((_, i) => { const r = rng(i + 8200); const a = -Math.PI / 2 + (r() - 0.5) * 2.6; return { a, len: 900 + r() * 1300, d: r() * 0.45, curve: (r() - 0.5) * 600 }; });

    draw('bg', 60.1, 79.7, (g, t) => {
      const sky = g.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#030814'); sky.addColorStop(0.55, '#0a1d33'); sky.addColorStop(0.85, '#1a3446'); sky.addColorStop(1, '#0c1820');
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      // stars at 20% parallax
      const pz = lerp(1, cam.z, 0.2), px = lerp(960, cam.x, 0.2), py = lerp(540, cam.y, 0.2);
      g.save(); g.translate(960, 540); g.scale(pz, pz); g.translate(-px, -py);
      g.globalCompositeOperation = 'lighter';
      for (const S of stars) {
        const tw = 0.55 + 0.45 * Math.sin(t * S.sp + S.ph);
        g.fillStyle = `rgba(255,248,230,${tw * st.stars * (S.s > 2 ? 1 : 0.8)})`;
        g.beginPath(); g.arc(S.x, S.y, S.s, 0, 7); g.fill();
        if (S.s > 2) glow(g, SPR.white, S.x, S.y, 22, tw * st.stars * 0.6);
      }
      // crescent
      glow(g, SPR.gold, 1560, 170, 260, 0.35 * st.stars);
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = `rgba(255,240,205,${st.stars})`; g.beginPath(); g.arc(1560, 170, 46, 0, 7); g.fill();
      g.fillStyle = '#05101e'; g.beginPath(); g.arc(1582, 158, 44, 0, 7); g.fill();
      g.restore();

      // world (camera)
      g.save(); g.translate(960, 540); g.scale(cam.z, cam.z); g.translate(-cam.x, -cam.y);
      const cols = ['#0f2438', '#0a1a2a', '#07121d'];
      mts.forEach((pts, k) => {
        g.beginPath(); g.moveTo(pts[0][0], 1400);
        pts.forEach(p => g.lineTo(p[0], p[1])); g.lineTo(pts[pts.length - 1][0], 1400); g.closePath();
        g.fillStyle = cols[k]; g.fill();
        if (k === 0) { g.strokeStyle = 'rgba(120,160,190,.12)'; g.lineWidth = 2; g.stroke(); }
      });
      // valley floor
      const vf = g.createLinearGradient(0, 900, 0, 1100); vf.addColorStop(0, '#0b1720'); vf.addColorStop(1, '#04080c');
      g.fillStyle = vf; g.fillRect(-900, 920, 3800, 600);
      // al-Safa: the hill beside the house
      const safa = new Path2D('M1150,965 C1230,900 1290,760 1420,735 C1530,715 1610,800 1700,880 C1760,930 1800,950 1860,965 Z');
      const sg = g.createLinearGradient(0, 720, 0, 965); sg.addColorStop(0, '#1a2f40'); sg.addColorStop(1, '#0a1520');
      g.fillStyle = sg; g.fill(safa);
      g.save(); g.clip(safa); g.globalCompositeOperation = 'lighter'; glow(g, SPR.warm, HX, HY, 700, 0.25 * st.house + 0.35 * st.rim); g.restore();
      if (st.rim > 0) {
        g.strokeStyle = `rgba(242,205,130,${0.45 * st.rim})`; g.lineWidth = 2.5; g.shadowColor = 'rgba(242,205,130,.8)'; g.shadowBlur = 14 * st.rim;
        g.beginPath(); g.moveTo(1230, 905); g.bezierCurveTo(1290, 790, 1340, 748, 1420, 735); g.bezierCurveTo(1530, 715, 1610, 800, 1700, 880); g.stroke(); g.shadowBlur = 0;
      }
      // the Ka'bah in the valley
      if (st.kaaba > 0) {
        g.globalCompositeOperation = 'lighter'; glow(g, SPR.warm, KX, KY - 20, 260, 0.35 * st.kaaba); g.globalCompositeOperation = 'source-over';
        g.fillStyle = '#020304'; g.fillRect(KX - 26, KY - 50, 52, 50);
        g.fillStyle = `rgba(217,174,87,${st.kaaba})`; g.fillRect(KX - 26, KY - 38, 52, 4);
      }
      // the house (Dar al-Arqam)
      g.fillStyle = '#0d1a22'; g.strokeStyle = 'rgba(160,140,110,.35)'; g.lineWidth = 1.5;
      g.beginPath(); g.rect(HX - 85, HY - 70, 170, 105); g.fill(); g.stroke();
      g.fillRect(HX - 92, HY - 78, 184, 10);
      g.fillRect(HX + 30, HY - 108, 50, 32);
      g.fillRect(HX - 150, HY - 30, 70, 65); g.strokeRect(HX - 150, HY - 30, 70, 65);
      g.strokeStyle = 'rgba(160,140,110,.12)'; g.lineWidth = 1;
      for (let yy = HY - 55; yy < HY + 35; yy += 14) { g.beginPath(); g.moveTo(HX - 85, yy); g.lineTo(HX + 85, yy); g.stroke(); }
      const L = st.house * (1 + 0.35 * Math.sin(st.pulse * Math.PI)) * (0.93 + 0.07 * noise2(t * 4, 9));
      g.globalCompositeOperation = 'lighter';
      glow(g, SPR.warm, HX, HY + 10, 520 * L, 0.75 * L);
      glow(g, SPR.warm, HX, HY + 40, 900 * st.pulse * (1 - st.pulse) * 4, 0.5 * Math.sin(st.pulse * Math.PI));
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = `rgba(255,${190 + 40 * L},${110 + 60 * L},${0.6 + 0.4 * L})`;
      g.beginPath(); g.moveTo(HX - 18, HY + 35); g.lineTo(HX - 18, HY - 8); g.quadraticCurveTo(HX, HY - 30, HX + 18, HY - 8); g.lineTo(HX + 18, HY + 35); g.closePath(); g.fill();
      g.fillRect(HX - 62, HY - 40, 18, 22); g.fillRect(HX + 46, HY - 40, 18, 22);
      // light spill on the ground
      const sp = g.createRadialGradient(HX, HY + 38, 0, HX, HY + 38, 260 * L);
      sp.addColorStop(0, `rgba(255,200,120,${0.4 * L})`); sp.addColorStop(1, 'rgba(255,200,120,0)');
      g.fillStyle = sp; g.beginPath(); g.ellipse(HX, HY + 40, 260 * L, 40 * L, 0, 0, 7); g.fill();
      // gathering motes drift to the door
      g.globalCompositeOperation = 'lighter';
      if (st.gather > 0) motes.forEach((m, i) => {
        const p = ease.io(clamp((st.gather - m.d) / 0.4));
        if (p >= 1 || st.gather < m.d) return;
        const x = lerp(m.x, HX, p) + Math.sin(t * 2 + i) * 12 * (1 - p), y = lerp(m.y, HY + 10, p);
        glow(g, SPR.gold, x, y, 26, 0.9 * Math.sin(p * Math.PI) + 0.1);
      });
      // light carried out to the world
      if (st.burst > 0) streaks.forEach(S => {
        const p = clamp((st.burst - S.d) / 0.55); if (p <= 0) return;
        const head = ease.out(p), tail = ease.out(clamp(p - 0.25));
        const pt = u => { const ex = HX + Math.cos(S.a) * S.len, ey = HY + Math.sin(S.a) * S.len; const cx = (HX + ex) / 2 + S.curve, cy = (HY + ey) / 2 - 200; return [(1 - u) * (1 - u) * HX + 2 * (1 - u) * u * cx + u * u * ex, (1 - u) * (1 - u) * HY + 2 * (1 - u) * u * cy + u * u * ey]; };
        g.beginPath(); for (let k = 0; k <= 24; k++) { const [x, y] = pt(lerp(tail, head, k / 24)); k ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.strokeStyle = 'rgba(255,220,150,.75)'; g.lineWidth = 3; g.lineCap = 'round'; g.stroke();
        const [hx, hy] = pt(head); glow(g, SPR.gold, hx, hy, 70, 1); glow(g, SPR.white, hx, hy, 16, 1);
      });
      g.globalCompositeOperation = 'source-over';
      g.restore();
      // atmospheric haze at horizon
      const hz = g.createLinearGradient(0, 600, 0, 1080); hz.addColorStop(0, 'rgba(40,70,90,0)'); hz.addColorStop(1, 'rgba(10,20,28,.5)');
      g.fillStyle = hz; g.fillRect(0, 600, W, 480);
    });
  });

  // ======================================================================
  // 8b · THE GLOBE — arcs of light from Makkah reach the world
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 79.0, 81.9, 0.6, 0.35);
    const land = topojson.feature(LAND_TOPO, LAND_TOPO.objects.land);
    // rasterise land once, sample a dot grid
    const rc = document.createElement('canvas'); rc.width = 720; rc.height = 360;
    const rg = rc.getContext('2d'); const eq = d3.geoEquirectangular().scale(720 / (2 * Math.PI)).translate([360, 180]);
    rg.fillStyle = '#fff'; rg.beginPath(); d3.geoPath(eq, rg)(land); rg.fill();
    const im = rg.getImageData(0, 0, 720, 360).data, dots = [];
    for (let lat = -80; lat <= 82; lat += 1.25) {
      const step = 1.25 / Math.max(0.25, Math.cos((lat * Math.PI) / 180));
      for (let lon = -180; lon < 180; lon += step) { const x = Math.floor(((lon + 180) / 360) * 720), y = Math.floor(((90 - lat) / 180) * 360); if (im[(y * 720 + x) * 4] > 128) dots.push([lon, lat]); }
    }
    const MK = [39.82, 21.42];
    const cities = [[31.2, 30.0], [29, 41], [106.8, -6.2], [101.7, 3.1], [3.4, 6.5], [-0.1, 51.5], [67, 24.9], [90.4, 23.8], [-4.8, 37.9], [66.9, 39.6], [-3, 16.8], [39.2, -6.2], [2.35, 48.85], [37.6, 55.75], [77.2, 28.6], [-7.6, 33.6], [44.4, 33.3], [10.2, 36.8], [32.5, 15.5], [55.3, 25.2], [69.2, 34.5], [120.9, 14.6], [-17.4, 14.7], [18.4, -33.9], [13.4, 52.5], [51.4, 35.7]];
    const arcs = cities.map((c, i) => ({ c, interp: d3.geoInterpolate(MK, c), d: (i / cities.length) * 0.55 + rng(i + 300)() * 0.1, h: 0.08 + d3.geoDistance(MK, c) * 0.12 }));
    const st = { a: 0, rot: 0, R: 0, sh: 0 };
    tl.fromTo(st, { R: 1500 }, { R: 400, duration: 1.4, ease: 'expo.out' }, 79.0);
    tl.to(st, { rot: 1, duration: 3.0, ease: 'none' }, 79.0);
    tl.to(st, { a: 1, duration: 2.0, ease: 'none' }, 79.2);
    tl.to(st, { sh: 1, duration: 0.75, ease: 'expo.in' }, 81.15);
    draw('bg', 78.95, 82.0, (g, t) => {
      g.fillStyle = '#040a10'; g.fillRect(0, 0, W, H);
      const R = st.R * (1 - st.sh * 0.985);
      const proj = d3.geoOrthographic().scale(R).translate([960, 540]).rotate([-(MK[0] - 12 + st.rot * 26), -(MK[1] + 4)]).clipAngle(90);
      const ctr = proj.invert([960, 540]);
      g.globalCompositeOperation = 'lighter';
      glow(g, SPR.teal, 960, 540, R * 3.0, 0.55);
      const gb = g.createRadialGradient(960 - R * 0.3, 540 - R * 0.3, R * 0.1, 960, 540, R);
      gb.addColorStop(0, '#12333a'); gb.addColorStop(1, '#061418');
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = gb; g.beginPath(); g.arc(960, 540, R, 0, 7); g.fill();
      g.strokeStyle = 'rgba(120,200,190,.35)'; g.lineWidth = 2; g.stroke();
      g.fillStyle = 'rgba(160,210,200,.55)';
      const ds = Math.max(1, R / 220);
      for (const d of dots) { if (d3.geoDistance(d, ctr) > 1.5) continue; const p = proj(d); if (p) g.fillRect(p[0] - ds / 2, p[1] - ds / 2, ds, ds); }
      g.globalCompositeOperation = 'lighter';
      const mk = proj(MK); if (mk) { glow(g, SPR.warm, mk[0], mk[1], R * 0.9, 0.9); glow(g, SPR.white, mk[0], mk[1], 24, 1); }
      for (const A of arcs) {
        const p = clamp((st.a - A.d) / 0.42); if (p <= 0) continue;
        const head = ease.out(p), tail = clamp(head - 0.35);
        g.beginPath(); let started = false;
        for (let k = 0; k <= 30; k++) {
          const u = lerp(tail, head, k / 30), ll = A.interp(u);
          if (d3.geoDistance(ll, ctr) > 1.55) { started = false; continue; }
          const pp = proj(ll); if (!pp) continue;
          const lift = 1 + A.h * Math.sin(Math.PI * u);
          const x = 960 + (pp[0] - 960) * lift, y = 540 + (pp[1] - 540) * lift;
          started ? g.lineTo(x, y) : g.moveTo(x, y); started = true;
        }
        g.strokeStyle = 'rgba(255,215,140,.85)'; g.lineWidth = 2.4; g.stroke();
        if (p >= 1 || head > 0.98) { const cp = d3.geoDistance(A.c, ctr) < 1.5 && proj(A.c); if (cp) { glow(g, SPR.gold, cp[0], cp[1], 70, 0.9); glow(g, SPR.white, cp[0], cp[1], 12, 1); } }
      }
      if (st.sh > 0) glow(g, SPR.gold, 960, 540, 600 * st.sh, st.sh);
      g.globalCompositeOperation = 'source-over';
    });
  });

  // ======================================================================
  // 9 · THE ENCYCLOPEDIC WEBSITE
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 81.7, 92.6, 0.3, 0.5);
    const wallSt = { a: 0, suck: 0 };
    // wall of knowledge cards (canvas) behind the browser
    const cards = []; { const r = rng(909); for (let j = 0; j < 9; j++) for (let i = 0; i < 16; i++) cards.push({ x: 60 + i * 120 + (j % 2) * 30, y: 40 + j * 118, w: 96, h: 96, d: r(), hue: r() }); }
    draw('bg', 81.6, 92.7, (g, t) => {
      const gr = g.createRadialGradient(960, 540, 100, 960, 540, 1200); gr.addColorStop(0, '#0e2a2c'); gr.addColorStop(1, '#03090b');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      if (wallSt.a <= 0) return;
      for (const c of cards) {
        const ap = clamp((wallSt.a - c.d * 0.6) / 0.4); if (ap <= 0) continue;
        const sp = ease.in(clamp((wallSt.suck - c.d * 0.5) / 0.5));
        const x = lerp(c.x, 960 - c.w / 2, sp), y = lerp(c.y, 540 - c.h / 2, sp), sc = 1 - sp * 0.85;
        g.globalAlpha = ap * (1 - sp) * 0.55;
        g.fillStyle = c.hue < 0.33 ? '#1f5e55' : c.hue < 0.66 ? '#173f43' : '#3a3220';
        g.fillRect(x, y, c.w * sc, c.h * sc);
        g.fillStyle = 'rgba(241,230,207,.35)'; g.fillRect(x + 12 * sc, y + c.h * sc - 26 * sc, 60 * sc, 5 * sc); g.fillRect(x + 12 * sc, y + c.h * sc - 16 * sc, 40 * sc, 4 * sc);
        g.strokeStyle = 'rgba(217,174,87,.35)'; g.lineWidth = 1; g.strokeRect(x, y, c.w * sc, c.h * sc);
      }
      g.globalAlpha = 1;
    });
    tl.to(wallSt, { a: 1, duration: 0.9, ease: 'none' }, C.mawqi_w_mawsui - 0.05);
    tl.to(wallSt, { suck: 1, duration: 1.1, ease: 'none' }, C.mawqi_w_yajma);

    const br = div('browser', s);
    Object.assign(br.style, { left: '310px', top: '150px', width: '1300px', height: '780px' });
    br.innerHTML = `<div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><div class="addr">darelarqam.com</div></div>
      <div class="ui-head"><div class="ui-logo"><svg width="46" height="54" viewBox="0 0 600 700"><path d="${archPath(300, 640, 380, 360, 0.42)}" fill="none" stroke="#f2d28b" stroke-width="40"/><path d="${khatam(300, 268, 70)[0]}" fill="#f2d28b"/><path d="${khatam(300, 268, 70)[1]}" fill="#f2d28b"/></svg>دار الأرقم</div>
      <div class="ui-nav"><span>الرئيسية</span><span>الكتب</span><span>الصوتيات</span><span>المرئيات</span><span>العلماء</span><span>الفتاوى</span></div></div>
      <div class="search"><svg width="30" height="30" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" fill="none" stroke="#d9ae57" stroke-width="2"/><path d="M15 15l6 6" stroke="#d9ae57" stroke-width="2"/></svg><span class="ph">ابحث في الكتب والدروس والفتاوى…</span></div>`;
    const content = div('abs', br); Object.assign(content.style, { left: '0', top: '300px', width: '1300px', height: '480px' });
    // category tiles
    const cats = [['العقيدة', '٣٢٠ مادة'], ['الفقه', '٨٤٠ مادة'], ['الحديث', '٥١٠ مادة'], ['التفسير', '٢٩٠ مادة'], ['السيرة', '١٨٠ مادة'], ['اللغة العربية', '١٤٠ مادة']];
    const tiles = cats.map(([n, c], i) => {
      const d = div('tile', content, `<div class="sub">${c}</div><div class="lbl">${n}</div>`);
      Object.assign(d.style, { right: `${46 + (i % 3) * 406}px`, top: `${22 + Math.floor(i / 3) * 200}px`, width: '384px', height: '180px' });
      const ic = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); ic.setAttribute('viewBox', '0 0 100 100'); Object.assign(ic.style, { position: 'absolute', left: '22px', top: '22px', width: '74px', height: '74px', opacity: 0.85 });
      const [a, b] = khatam(50, 50, 38, (i * Math.PI) / 16); el('path', { d: a, fill: 'none', stroke: '#d9ae57', 'stroke-width': 3 }, ic); el('path', { d: b, fill: 'none', stroke: '#d9ae57', 'stroke-width': 3 }, ic);
      d.appendChild(ic); return d;
    });
    // scholars row (no faces — geometric medallions)
    const sch = div('abs', br); Object.assign(sch.style, { left: '0', top: '300px', width: '1300px', height: '480px', opacity: 0 });
    const schCards = [0, 1, 2, 3, 4].map(i => {
      const d = div('tile', sch); Object.assign(d.style, { right: `${46 + i * 246}px`, top: '40px', width: '222px', height: '300px' });
      const ic = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); ic.setAttribute('viewBox', '0 0 100 100'); Object.assign(ic.style, { position: 'absolute', left: '51px', top: '30px', width: '120px', height: '120px' });
      el('circle', { cx: 50, cy: 50, r: 46, fill: 'rgba(5,20,22,.6)', stroke: '#d9ae57', 'stroke-width': 2.5 }, ic);
      const [a, b] = khatam(50, 50, 26, i * 0.3); el('path', { d: a, fill: 'rgba(217,174,87,.25)', stroke: '#f2d28b', 'stroke-width': 2 }, ic); el('path', { d: b, fill: 'rgba(217,174,87,.25)', stroke: '#f2d28b', 'stroke-width': 2 }, ic);
      d.appendChild(ic);
      const l1 = div('abs', d); Object.assign(l1.style, { left: '36px', right: '36px', top: '180px', height: '14px', borderRadius: '7px', background: 'rgba(241,230,207,.55)' });
      const l2 = div('abs', d); Object.assign(l2.style, { left: '60px', right: '60px', top: '208px', height: '10px', borderRadius: '5px', background: 'rgba(241,230,207,.25)' });
      const badge = div('abs', d, '<svg viewBox="0 0 40 40" width="46" height="46"><circle cx="20" cy="20" r="18" fill="#d9ae57"/><path d="M11 20l6 6 12-13" fill="none" stroke="#0a1b1f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      Object.assign(badge.style, { left: '88px', top: '240px' });
      return { d, badge };
    });

    tl.fromTo(br, { scale: 0.02, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 1.0, ease: 'expo.out' }, C.mawqi_w_mawqi - 0.2);
    tl.from(br.querySelectorAll('.ui-head > *, .search'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.08 }, C.mawqi_w_mawqi + 0.2);
    tl.from(tiles, { y: 60, opacity: 0, rotationX: -40, duration: 0.6, stagger: 0.06, ease: 'back.out(1.6)' }, C.mawqi_w_mawsui);
    tl.fromTo(br, { boxShadow: '0 50px 120px rgba(0,0,0,.6), 0 0 0 1.5px rgba(217,174,87,.45)' }, { boxShadow: '0 50px 160px rgba(0,0,0,.6), 0 0 0 3px rgba(242,210,139,.95), 0 0 120px rgba(242,210,139,.35)', duration: 0.6, immediateRender: false }, C.mawqi_w_nafi);
    // "ويقرب الناس من العلماء الثقات"
    tl.to(content, { opacity: 0, y: -40, duration: 0.4 }, C.mawqi_w_yuqarrib - 0.1);
    tl.to(sch, { opacity: 1, duration: 0.3 }, C.mawqi_w_yuqarrib);
    tl.from(schCards.map(c => c.d), { y: 80, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(1.5)' }, C.mawqi_w_yuqarrib);
    tl.to(br, { scale: 1.16, y: 40, duration: 2.2, ease: 'power2.inOut' }, C.mawqi_w_yuqarrib + 0.1);
    tl.from(schCards.map(c => c.badge), { scale: 0, rotation: -90, duration: 0.45, stagger: 0.06, ease: 'back.out(3)' }, C.mawqi_w_thiqat - 0.05);
    // "ويتيح لهم الوصول إلى الكتب والصوتيات والمرئيات"
    tl.to(br, { scale: 0.62, y: -230, opacity: 0.35, filter: 'blur(3px)', duration: 0.9, ease: 'expo.inOut' }, C.yutih - 0.1);
    const feat = div('layer', s);
    const mk = (cls, x, html) => { const d = div('tile ' + cls, feat, html); Object.assign(d.style, { left: `${x}px`, top: '420px', width: '440px', height: '440px', borderRadius: '30px', background: 'linear-gradient(160deg, rgba(31,94,85,.85), rgba(8,28,30,.95))', border: '2px solid rgba(217,174,87,.6)' }); return d; };
    const fBook = mk('fb', 1290, '<svg viewBox="0 0 200 200" style="position:absolute;inset:60px"><g fill="none" stroke="#f2d28b" stroke-width="5" stroke-linejoin="round"><path class="pg" d="M100,160 C78,148 46,146 22,152 L22,52 C46,46 78,48 100,62 Z" fill="rgba(5,20,22,.6)"/><path d="M100,160 C122,148 154,146 178,152 L178,52 C154,46 122,48 100,62 Z" fill="rgba(5,20,22,.6)"/><path class="flip" d="M100,160 C122,148 154,146 178,152 L178,52 C154,46 122,48 100,62 Z" fill="rgba(242,210,139,.15)"/><path d="M40,80 L84,86 M40,100 L84,104 M40,120 L84,122 M116,86 L160,80 M116,104 L160,100 M116,122 L160,120" stroke-width="3" opacity=".6"/></g></svg>');
    const fAudio = mk('fa', 740, '<svg viewBox="0 0 200 200" style="position:absolute;inset:60px">' + [...Array(15)].map((_, i) => `<rect class="bar" x="${18 + i * 11}" y="70" width="6" height="60" rx="3" fill="#f2d28b"/>`).join('') + '</svg>');
    const fVideo = mk('fv', 190, '<svg viewBox="0 0 200 200" style="position:absolute;inset:60px"><rect x="14" y="40" width="172" height="110" rx="14" fill="rgba(5,20,22,.6)" stroke="#f2d28b" stroke-width="5"/><path d="M86,72 L122,95 L86,118 Z" fill="#f2d28b"/><rect x="14" y="164" width="172" height="6" rx="3" fill="rgba(242,210,139,.25)"/><rect class="prog" x="14" y="164" width="172" height="6" rx="3" fill="#f2d28b"/></svg>');
    [[fBook, C.yutih_w_kutub], [fAudio, C.yutih_w_sawtiyat], [fVideo, C.yutih_w_mariyyat]].forEach(([d, t]) => {
      tl.fromTo(d, { y: 260, opacity: 0, scale: 0.6, rotation: 6 }, { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.65, ease: 'back.out(1.4)' }, t - 0.12);
    });
    tl.fromTo(fBook.querySelector('.flip'), { scaleX: 1, svgOrigin: '100 100' }, { scaleX: -1, duration: 0.8, ease: 'power2.inOut', repeat: 1, repeatDelay: 0.3 }, C.yutih_w_kutub + 0.3);
    fAudio.querySelectorAll('.bar').forEach((b, i) => {
      const r = rng(i + 70), kf = [...Array(14)].map(() => ({ attr: { height: 14 + r() * 100, y: 0 }, duration: 0.11, ease: 'sine.inOut' }));
      kf.forEach(k => (k.attr.y = 100 - k.attr.height / 2));
      tl.to(b, { keyframes: kf }, C.yutih_w_sawtiyat + 0.1);
    });
    tl.fromTo(fVideo.querySelector('.prog'), { attr: { width: 0 } }, { attr: { width: 172 }, duration: 2.0, ease: 'none' }, C.yutih_w_mariyyat + 0.2);
    // "في مكان واحد" — the three converge into one
    tl.to([fBook, fAudio, fVideo], { left: 740, scale: 0.4, opacity: 0.0, duration: 0.7, ease: 'expo.in' }, C.wahid - 0.05);
    tl.to(br, { opacity: 0, duration: 0.4 }, C.wahid);
  });

  // ======================================================================
  // 10 · LOGO REVEAL — "دار الأرقم"
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 91.9, 95.45, 0.3, 0.4);
    const st = { inhale: 0, boom: 0 };
    draw('bg', 91.9, 95.9, (g, t) => {
      const gr = g.createRadialGradient(960, 470, 50, 960, 540, 1250); gr.addColorStop(0, '#103a36'); gr.addColorStop(0.55, '#071a1c'); gr.addColorStop(1, '#020607');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'lighter';
      // particles drawn inward during the pause, then blown outward on the reveal
      const r = rng(1010);
      for (let i = 0; i < 220; i++) {
        const a = r() * Math.PI * 2, d0 = 300 + r() * 900, sp = r();
        const inn = ease.in(st.inhale), out = ease.out(st.boom);
        const d = lerp(d0, 40, inn * 0.92) + out * (500 + sp * 1300);
        const x = 960 + Math.cos(a + t * 0.2) * d, y = 470 + Math.sin(a + t * 0.2) * d * 0.8;
        glow(g, SPR.gold, x, y, 8 + sp * 16, (0.3 + 0.7 * inn) * (1 - out * 0.8));
      }
      glow(g, SPR.warm, 960, 470, 600 + 1600 * st.boom, 0.35 + st.inhale * 0.4 - st.boom * 0.2);
      // god rays
      if (st.boom > 0) {
        g.save(); g.translate(960, 420); g.rotate(t * 0.05);
        for (let k = 0; k < 18; k++) {
          g.rotate((Math.PI * 2) / 18);
          const gl = g.createLinearGradient(0, 0, 1400, 0); gl.addColorStop(0, `rgba(255,226,160,${0.16 * (1 - st.boom * 0.6)})`); gl.addColorStop(1, 'rgba(255,226,160,0)');
          g.fillStyle = gl; g.beginPath(); g.moveTo(0, 0); g.lineTo(1400, -50); g.lineTo(1400, 50); g.closePath(); g.fill();
        }
        g.restore();
      }
      g.globalCompositeOperation = 'source-over';
    });
    tl.to(st, { inhale: 1, duration: 2.1, ease: 'none' }, C.wahid_w_wahid - 0.3);
    tl.to(st, { boom: 1, duration: 2.0, ease: 'none' }, C.brand1 - 0.02);
    const L = Brand.logo(s, { x: 960, y: 405, scale: 0.78, id: 'L1' });
    // arch forms on "واحد" (from the three merged cards), then the full mark on the name
    tl.fromTo([L.arch, L.archIn], { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.0, ease: 'expo.out' }, C.wahid_w_wahid - 0.1);
    tl.fromTo(L.base, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.0, ease: 'expo.out' }, C.wahid_w_wahid);
    tl.fromTo(L.star, { drawSVG: 0 }, { drawSVG: '100%', duration: 0.5, ease: 'expo.out' }, C.brand1 - 0.05);
    tl.fromTo(L.star, { rotation: -90, svgOrigin: '300 268' }, { rotation: 0, duration: 1.0, ease: 'expo.out' }, C.brand1 - 0.05);
    tl.fromTo(L.circle, { scale: 0, svgOrigin: '300 268' }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, C.brand1);
    tl.fromTo(L.book, { drawSVG: 0, fillOpacity: 0 }, { drawSVG: '100%', fillOpacity: 1, duration: 0.5, ease: 'expo.out' }, C.brand1 - 0.05);
    tl.fromTo(L.rays, { drawSVG: 0 }, { drawSVG: '100%', duration: 0.4, stagger: 0.04 }, C.brand1 + 0.1);
    tl.fromTo(L.archIn, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.5 }, C.brand1);
    tl.fromTo(L.halo, { opacity: 0 }, { opacity: 1, duration: 0.6 }, C.brand1);
    tl.fromTo(L.svg, { scale: 0.92 }, { scale: 1, duration: 1.4, ease: 'expo.out' }, C.brand1 - 0.05);
    window.flash(C.brand1, 0.75, 0.9); window.shake(s, C.brand1, 0.35, 8, 4);
    const wm = div('wordmark center', s, 'دار الأرقم');
    Object.assign(wm.style, { top: '850px', fontSize: '150px' });
    tl.fromTo(wm, { opacity: 0, scale: 1.3, filter: 'blur(14px)', letterSpacing: '0.3em' }, { opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '0em', duration: 0.9, ease: 'expo.out' }, C.brand1 - 0.02);
    // light sweep across the wordmark on "الأرقم"
    const sweep = div('center', s, 'دار الأرقم'); sweep.className = 'wordmark center';
    Object.assign(sweep.style, { top: '850px', fontSize: '150px', color: 'transparent', backgroundImage: 'linear-gradient(100deg, transparent 40%, rgba(255,250,235,.95) 50%, transparent 60%)', backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', textShadow: 'none' });
    tl.fromTo(sweep, { backgroundPosition: '100% 0' }, { backgroundPosition: '-50% 0', duration: 1.1, ease: 'power2.inOut' }, C.brand1_w_arqam - 0.1);
  });
})();
