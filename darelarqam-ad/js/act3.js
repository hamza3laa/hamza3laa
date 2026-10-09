// ACT III (95.6 – 142 s): the platform → every door opens a door → room for all →
// knowledge as insight, understanding, action → start today → end card.
(() => {
  const { W, H, tl, draw, show, el, div, svg, khatam, archPath, clamp, lerp, prog, ease, rng, noise2, glow, SPR } = E;
  const C = CUE;
  const SC = window.SCENES;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const icon = (kind, size = 40) => {
    const p = {
      book: '<path d="M20,32 C15,29 8,29 3,30 L3,9 C8,8 15,8 20,11 Z M20,32 C25,29 32,29 37,30 L37,9 C32,8 25,8 20,11 Z" fill="none" stroke="#f2d28b" stroke-width="2.4" stroke-linejoin="round"/>',
      audio: [...Array(7)].map((_, i) => `<rect x="${4 + i * 5}" y="${20 - [5, 9, 14, 8, 12, 6, 4][i]}" width="2.6" height="${[5, 9, 14, 8, 12, 6, 4][i] * 2}" rx="1.3" fill="#f2d28b"/>`).join(''),
      video: '<rect x="3" y="8" width="34" height="24" rx="4" fill="none" stroke="#f2d28b" stroke-width="2.4"/><path d="M17,14 L25,20 L17,26 Z" fill="#f2d28b"/>',
    }[kind];
    return `<svg viewBox="0 0 40 40" width="${size}" height="${size}">${p}</svg>`;
  };

  // ======================================================================
  // 11 · THE PLATFORM — search made easy; doors of knowledge; read · listen · watch; the journey
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 95.25, 107.95, 0.45, 0.45);
    draw('bg', 95.2, 108.0, (g, t) => {
      const gr = g.createRadialGradient(960, 500, 80, 960, 540, 1250); gr.addColorStop(0, '#11403b'); gr.addColorStop(0.6, '#08201f'); gr.addColorStop(1, '#030909');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // slow geometric lattice in the background
      g.strokeStyle = 'rgba(217,174,87,.06)'; g.lineWidth = 1.5;
      const off = (t * 12) % 160;
      for (let x = -160; x < W + 160; x += 160) for (let y = -160; y < H + 160; y += 160) { const [a, b] = khatam(x + off, y, 54); g.stroke(new Path2D(a)); g.stroke(new Path2D(b)); }
    });

    // ---- A: search → results
    const stage3d = div('layer', s); stage3d.style.perspective = '2200px';
    const br = div('browser', stage3d);
    Object.assign(br.style, { left: '360px', top: '170px', width: '1200px', height: '740px' });
    br.innerHTML = `<div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><div class="addr">darelarqam.com</div></div>
      <div class="ui-head"><div class="ui-logo" style="font-size:38px">دار الأرقم</div><div class="ui-nav"><span>الرئيسية</span><span>الكتب</span><span>الصوتيات</span><span>المرئيات</span><span>العلماء</span></div></div>`;
    const search = div('search', br); search.style.width = '78%';
    search.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" fill="none" stroke="#d9ae57" stroke-width="2"/><path d="M15 15l6 6" stroke="#d9ae57" stroke-width="2"/></svg><span class="typed"></span><span class="caret"></span>`;
    const typed = search.querySelector('.typed'), caret = search.querySelector('.caret');
    const query = 'فضل طلب العلم';
    const typeObj = { n: 0 };
    tl.to(typeObj, { n: query.length, duration: 1.0, ease: 'none', onUpdate: () => (typed.textContent = query.slice(0, Math.round(typeObj.n))) }, C.minassa + 0.35);
    tl.set(typed, { textContent: '' }, 0);
    tl.to(caret, { opacity: 0, duration: 0.01, repeat: 15, yoyo: true, repeatDelay: 0.25 }, C.minassa);
    const results = div('abs', br); Object.assign(results.style, { left: '130px', right: '130px', top: '300px' });
    const rows = [['book', 'كتاب · ١٢ فصلاً'], ['audio', 'سلسلة صوتية · ٢٤ درساً'], ['video', 'محاضرة مرئية · ٥٨ دقيقة'], ['book', 'متن مشروح · ٣ مجلدات']].map(([k, sub], i) => {
      const r = div('', results);
      Object.assign(r.style, { display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '22px', height: '86px', marginBottom: '14px', padding: '0 26px', borderRadius: '16px', background: 'rgba(241,230,207,.05)', border: '1px solid rgba(217,174,87,.22)', direction: 'rtl' });
      r.innerHTML = `${icon(k, 46)}<div style="flex:1"><div style="height:14px;width:${58 - i * 7}%;border-radius:7px;background:rgba(241,230,207,.6)"></div><div style="margin-top:12px;font:400 18px Plex;color:rgba(241,230,207,.5)">${sub}</div></div><div style="width:12px;height:12px;border-radius:50%;background:#d9ae57"></div>`;
      return r;
    });
    tl.fromTo(br, { rotationY: -28, rotationX: 8, z: -500, opacity: 0 }, { rotationY: -10, rotationX: 4, z: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, C.minassa - 0.1);
    tl.to(br, { rotationY: 8, rotationX: 2, duration: 3.6, ease: 'sine.inOut' }, C.minassa + 1.0);
    tl.fromTo(search, { boxShadow: '0 0 0 0 rgba(242,210,139,0)' }, { boxShadow: '0 0 0 6px rgba(242,210,139,.25)', duration: 0.25, yoyo: true, repeat: 1, immediateRender: false }, C.minassa_w_wusul - 0.05);
    tl.from(rows, { x: -80, opacity: 0, duration: 0.45, stagger: 0.1, ease: 'back.out(1.6)' }, C.minassa_w_wusul);
    tl.to(rows[0], { background: 'rgba(217,174,87,.16)', borderColor: 'rgba(242,210,139,.8)', duration: 0.3 }, C.minassa_w_aysar - 0.05);
    tl.fromTo(rows[0], { scale: 1 }, { scale: 1.04, duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, C.minassa_w_aysar - 0.05);

    // ---- B: doors of knowledge
    const doors = div('abs', br); Object.assign(doors.style, { left: '0', right: '0', top: '170px', height: '560px', opacity: 0 });
    const dNames = ['العقيدة', 'الفقه', 'الحديث', 'التفسير', 'السيرة', 'الآداب'];
    const doorEls = dNames.map((n, i) => {
      const d = div('abs', doors); Object.assign(d.style, { left: `${70 + (5 - i) * 180}px`, top: '60px', width: '160px', height: '420px' });
      d.innerHTML = `<svg viewBox="0 0 160 330" width="160" height="330" style="overflow:visible"><path d="${archPath(80, 320, 140, 220, 0.42)}" fill="rgba(31,94,85,.45)" stroke="#d9ae57" stroke-width="4"/><path class="glowd" d="${archPath(80, 320, 116, 208, 0.42)}" fill="rgba(242,210,139,0)" stroke="rgba(217,174,87,.5)" stroke-width="2"/>${(() => { const [a, b] = khatam(80, 150, 26, i * 0.2); return `<path d="${a}" fill="none" stroke="#f2d28b" stroke-width="2.5"/><path d="${b}" fill="none" stroke="#f2d28b" stroke-width="2.5"/>`; })()}</svg><div style="text-align:center;font:500 28px Kufi;color:#f1e6cf;margin-top:16px;direction:rtl">${n}</div>`;
      return d;
    });
    tl.to([search, results], { opacity: 0, y: -30, duration: 0.35 }, C.abwab - 0.1);
    tl.to(doors, { opacity: 1, duration: 0.2 }, C.abwab);
    tl.from(doorEls, { y: 120, opacity: 0, scale: 0.7, duration: 0.55, stagger: 0.07, ease: 'back.out(1.7)' }, C.abwab_w_abwab - 0.3);
    tl.to(doorEls.map(d => d.querySelector('.glowd')), { fill: 'rgba(242,210,139,.35)', duration: 0.4, stagger: 0.05 }, C.abwab_w_marifa);
    tl.to(br, { rotationY: 0, rotationX: 0, duration: 1.2, ease: 'power2.inOut' }, C.abwab);

    // ---- C: phone — read · listen · watch
    const phone = div('abs', s);
    Object.assign(phone.style, { left: '760px', top: '120px', width: '400px', height: '840px', borderRadius: '58px', background: '#06161a', boxShadow: '0 0 0 3px #d9ae57, 0 0 0 14px #0b1d1f, 0 0 0 16px rgba(217,174,87,.45), 0 60px 140px rgba(0,0,0,.7)', overflow: 'hidden' });
    const notch = div('abs', phone); Object.assign(notch.style, { left: '150px', top: '18px', width: '100px', height: '28px', borderRadius: '14px', background: '#000', zIndex: 5 });
    const screen = (html) => { const d = div('abs', phone, html); Object.assign(d.style, { left: '0', top: '0', width: '400px', height: '840px' }); return d; };
    const sRead = screen(`<div style="position:absolute;inset:80px 34px 40px;direction:rtl">
      <div style="font:700 34px Amiri;color:#f2d28b;text-align:center">الباب الأول</div>
      <div style="height:2px;background:linear-gradient(90deg,transparent,#d9ae57,transparent);margin:18px 0 26px"></div>
      ${[92, 100, 96, 88, 100, 94, 70, 0, 100, 90, 97, 84, 100, 60].map(w => `<div style="height:10px;width:${w}%;margin:0 0 18px auto;border-radius:5px;background:rgba(241,230,207,${w ? 0.5 : 0})"></div>`).join('')}
      <div class="hl" style="position:absolute;right:0;top:118px;height:16px;width:0;background:rgba(242,210,139,.4);border-radius:4px"></div></div>`);
    const sListen = screen(`<div style="position:absolute;inset:0;direction:rtl">
      <div style="position:absolute;left:70px;top:120px;width:260px;height:260px;border-radius:30px;background:linear-gradient(160deg,#1f5e55,#0a2224);border:2px solid rgba(217,174,87,.6);display:grid;place-items:center">${icon('audio', 140)}</div>
      <div style="position:absolute;left:60px;right:60px;top:430px;height:12px;border-radius:6px;background:rgba(241,230,207,.5)"></div>
      <div style="position:absolute;left:110px;right:110px;top:458px;height:8px;border-radius:4px;background:rgba(241,230,207,.25)"></div>
      <svg class="wave" viewBox="0 0 300 80" style="position:absolute;left:50px;top:520px;width:300px;height:80px">${[...Array(30)].map((_, i) => `<rect x="${i * 10}" y="30" width="5" height="20" rx="2.5" fill="#d9ae57"/>`).join('')}</svg>
      <div style="position:absolute;left:150px;top:650px;width:100px;height:100px;border-radius:50%;background:#d9ae57;display:grid;place-items:center"><svg viewBox="0 0 40 40" width="40"><rect x="10" y="8" width="7" height="24" rx="2" fill="#0a1b1f"/><rect x="23" y="8" width="7" height="24" rx="2" fill="#0a1b1f"/></svg></div></div>`);
    const sWatch = screen(`<div style="position:absolute;inset:0;direction:rtl">
      <div class="vid" style="position:absolute;left:0;right:0;top:140px;height:300px;background:radial-gradient(circle at 50% 45%,#2f8c7c,#0a2224 70%);overflow:hidden">
        <svg viewBox="0 0 400 300" width="400" height="300">${(() => { const [a, b] = khatam(200, 150, 90); return `<path class="vk" d="${a}" fill="none" stroke="rgba(242,210,139,.7)" stroke-width="3"/><path class="vk" d="${b}" fill="none" stroke="rgba(242,210,139,.7)" stroke-width="3"/>`; })()}</svg></div>
      <div style="position:absolute;left:30px;right:30px;top:460px;height:6px;border-radius:3px;background:rgba(241,230,207,.2)"><div class="vp" style="height:6px;width:0;border-radius:3px;background:#d9ae57"></div></div>
      ${[0, 1, 2].map(i => `<div style="position:absolute;left:30px;right:30px;top:${510 + i * 100}px;height:80px;border-radius:14px;background:rgba(241,230,207,.06);border:1px solid rgba(217,174,87,.2)"><div style="position:absolute;right:16px;top:12px;width:100px;height:56px;border-radius:8px;background:#123a35"></div><div style="position:absolute;right:136px;top:22px;width:${150 - i * 20}px;height:10px;border-radius:5px;background:rgba(241,230,207,.5)"></div></div>`).join('')}</div>`);
    tl.set(phone, { autoAlpha: 0 }, 0);
    tl.to(br, { z: -900, opacity: 0, duration: 0.6, ease: 'power2.in' }, C.taqra - 0.45);
    tl.fromTo(phone, { autoAlpha: 0, y: 500, rotation: -6 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.6, ease: 'expo.out' }, C.taqra - 0.3);
    tl.set([sListen, sWatch], { xPercent: -100 }, 0);
    tl.fromTo(sRead.querySelector('.hl'), { width: '0%' }, { width: '85%', duration: 0.6, ease: 'power1.inOut' }, C.taqra + 0.1);
    tl.to(sRead, { xPercent: 100, duration: 0.4, ease: 'power3.inOut' }, C.tastami - 0.2);
    tl.to(sListen, { xPercent: 0, duration: 0.4, ease: 'power3.inOut' }, C.tastami - 0.2);
    sListen.querySelectorAll('.wave rect').forEach((b, i) => {
      const r = rng(i + 500), kf = [...Array(8)].map(() => { const h = 8 + r() * 70; return { attr: { height: h, y: 40 - h / 2 }, duration: 0.1, ease: 'sine.inOut' }; });
      tl.to(b, { keyframes: kf }, C.tastami);
    });
    tl.to(sListen, { xPercent: 100, duration: 0.4, ease: 'power3.inOut' }, C.tushahid - 0.2);
    tl.to(sWatch, { xPercent: 0, duration: 0.4, ease: 'power3.inOut' }, C.tushahid - 0.2);
    tl.fromTo(sWatch.querySelector('.vp'), { width: '0%' }, { width: '70%', duration: 1.2, ease: 'none' }, C.tushahid);
    tl.fromTo(sWatch.querySelectorAll('.vk'), { rotation: 0, svgOrigin: '200 150' }, { rotation: 90, duration: 1.4, ease: 'none' }, C.tushahid);
    // three ghost phones flank for read/listen/watch rhythm
    tl.fromTo(phone, { scale: 1 }, { scale: 1.035, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, C.tastami);
    tl.fromTo(phone, { scale: 1 }, { scale: 1.035, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, C.tushahid);

    // ---- D: the journey begins
    tl.to(phone, { x: -560, scale: 0.8, rotation: -4, duration: 0.9, ease: 'expo.inOut' }, C.rihla - 0.2);
    const sv = svg(s);
    const route = el('path', { d: 'M760,900 C980,880 1020,760 1180,720 C1360,676 1260,560 1420,500 C1560,450 1540,330 1680,250', fill: 'none', stroke: '#d9ae57', 'stroke-width': 5, 'stroke-dasharray': '2 16', 'stroke-linecap': 'round' }, sv);
    const routeSolid = el('path', { d: route.getAttribute('d'), fill: 'none', stroke: '#f2d28b', 'stroke-width': 5, 'stroke-linecap': 'round', style: 'filter:drop-shadow(0 0 8px rgba(242,210,139,.8))' }, sv);
    const miles = [[760, 900], [1180, 720], [1420, 500], [1680, 250]].map(([x, y], i) => {
      const g = el('g', {}, sv);
      el('circle', { cx: x, cy: y, r: i === 3 ? 30 : 16, fill: '#071a1c', stroke: '#d9ae57', 'stroke-width': 4 }, g);
      const dot = el('circle', { cx: x, cy: y, r: i === 3 ? 14 : 7, fill: '#f2d28b', opacity: 0 }, g);
      return { g, dot, x, y };
    });
    const insight = el('g', { opacity: 0 }, sv);
    const [ia, ib] = khatam(1680, 250, 70); el('path', { d: ia, fill: 'rgba(242,210,139,.25)', stroke: '#fff1cf', 'stroke-width': 3 }, insight); el('path', { d: ib, fill: 'rgba(242,210,139,.25)', stroke: '#fff1cf', 'stroke-width': 3 }, insight);
    tl.set([route, routeSolid, ...miles.map(m => m.g)], { opacity: 0 }, 0);
    tl.to([route, ...miles.map(m => m.g)], { opacity: 1, duration: 0.3 }, C.rihla);
    tl.from(miles.map(m => m.g), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.1, ease: 'back.out(3)' }, C.rihla);
    tl.set(routeSolid, { opacity: 1 }, C.rihla_w_rihla);
    tl.fromTo(routeSolid, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.8, ease: 'power1.inOut' }, C.rihla_w_rihla);
    [C.rihla_w_rihla, C.rihla_w_rihla + 0.6, C.rihla_w_ilm, C.basira1_w].forEach((t, i) => tl.to(miles[i].dot, { opacity: 1, duration: 0.2 }, t));
    tl.fromTo(insight, { opacity: 0, scale: 0.2, rotation: -60, svgOrigin: '1680 250' }, { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(2.2)' }, C.basira1_w - 0.05);
    window.flash(C.basira1_w, 0.25, 0.6);
    draw('fx', C.basira1_w - 0.1, 108.0, (g, t) => { g.globalCompositeOperation = 'lighter'; const p = clamp((t - C.basira1_w) / 0.4); glow(g, SPR.warm, 1680, 250, 900 * p, 0.8 * p); glow(g, SPR.white, 1680, 250, 70 * p, p); });
  });

  // ======================================================================
  // 12 · EVERY DOOR OPENS A DOOR
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 107.8, 112.95, 0.4, 0.5);
    const st = { slide: 0, speed: 0, zoom: 0, open1: 0, open2: 0, open3: 0, carousel: 1 };
    tl.to(st, { slide: 1, duration: 2.5, ease: 'power1.inOut' }, C.tanaqqal - 0.1);
    tl.to(st, { carousel: 0, duration: 0.5 }, C.kullbab - 0.3);
    tl.to(st, { zoom: 3, duration: 1.9, ease: 'power1.in' }, C.kullbab - 0.3);
    tl.to(st, { open1: 1, duration: 0.55, ease: 'power2.inOut' }, C.kullbab_w_bab - 0.1);
    tl.to(st, { open2: 1, duration: 0.55, ease: 'power2.inOut' }, C.kullbab_w_yaftah);
    tl.to(st, { open3: 1, duration: 0.5, ease: 'power2.inOut' }, C.kullbab_w_baban - 0.05);
    const labels = ['الكتب', 'الصوتيات', 'المرئيات', 'العلماء', 'الفتاوى', 'المقالات', 'الدروس', 'المتون', 'البحوث'];
    const lblEls = labels.map(n => { const d = div('doorlabel', s, n); d.style.fontSize = '34px'; return d; });
    function archShape(g, cx, by, w, h) { g.beginPath(); const p = new Path2D(archPath(cx, by, w, h, 0.42) + 'Z'); return p; }
    function drawDoor(g, cx, cy, sc, open, lit, k) {
      const w = 300 * sc, h = 380 * sc, by = cy + h * 0.55;
      const p = archShape(g, cx, by, w, h);
      // light beyond the door
      g.save(); g.clip(p);
      const lg = g.createRadialGradient(cx, by - h * 0.5, 0, cx, by - h * 0.5, h * 1.2);
      lg.addColorStop(0, `rgba(255,236,190,${0.8 * lit})`); lg.addColorStop(0.35, `rgba(200,150,80,${0.35 * lit})`); lg.addColorStop(1, 'rgba(8,30,30,.95)');
      g.fillStyle = lg; g.fillRect(cx - w, by - h * 2, w * 2, h * 2.2);
      // two leaves, swinging open
      for (const side of [-1, 1]) {
        const lw = (w / 2) * Math.cos(open * Math.PI * 0.46);
        const x0 = side < 0 ? cx - w / 2 : cx + w / 2 - lw;
        const gr = g.createLinearGradient(x0, 0, x0 + lw, 0);
        gr.addColorStop(0, '#0f3d37'); gr.addColorStop(1, '#0a2a28');
        g.fillStyle = gr; g.fillRect(x0, by - h * 1.6, lw, h * 1.6);
        g.strokeStyle = 'rgba(217,174,87,.7)'; g.lineWidth = 2 * sc;
        g.strokeRect(x0 + 12 * sc, by - h + 30 * sc, Math.max(0, lw - 24 * sc), h - 60 * sc);
        if (lw > 30 * sc) { const [a, b] = khatam(x0 + lw / 2, by - h * 0.55, Math.min(lw * 0.3, 40 * sc)); g.stroke(new Path2D(a)); g.stroke(new Path2D(b)); }
      }
      g.restore();
      g.strokeStyle = '#d9ae57'; g.lineWidth = 6 * sc; g.shadowColor = 'rgba(242,210,139,.6)'; g.shadowBlur = 20; g.stroke(p); g.shadowBlur = 0;
      g.lineWidth = 2 * sc; g.stroke(archShape(g, cx, by + 14 * sc, w + 28 * sc, h + 18 * sc));
    }
    draw('bg', 107.75, 113.0, (g, t) => {
      g.fillStyle = '#041012'; g.fillRect(0, 0, W, H);
      const gr = g.createRadialGradient(960, 560, 0, 960, 560, 900); gr.addColorStop(0, 'rgba(31,94,85,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // carousel row (perspective-ish: scale by distance from centre)
      if (st.carousel > 0.01) {
        g.globalAlpha = st.carousel;
        const shift = st.slide * 4 * 420;
        labels.forEach((n, i) => {
          const x = 120 + i * 420 - shift;
          const d = (x - 960) / 960, sc = 0.78 - Math.abs(d) * 0.22, y = 520 + Math.abs(d) * 30;
          drawDoor(g, x, y, Math.max(0.3, sc), 0.12 + 0.88 * clamp(1 - Math.abs(d) * 2.5) * 0.35, 0.7, i);
          const L = lblEls[i]; L.style.left = x + 'px'; L.style.top = (y + 380 * sc * 0.55 + 30) + 'px'; L.style.opacity = (1 - Math.min(1, Math.abs(d) * 1.2)) * st.carousel; L.style.transform = `translateX(-50%) scale(${sc / 0.78})`;
        });
        g.globalAlpha = 1;
      } else lblEls.forEach(L => (L.style.opacity = 0));
      // infinite zoom through nested doors
      if (st.carousel < 1) {
        g.globalAlpha = 1 - st.carousel;
        const z = Math.pow(2.6, st.zoom);
        const opens = [st.open1, st.open2, st.open3, 0];
        for (let k = 0; k <= 3; k++) {
          const sc = (0.95 * z) / Math.pow(2.6, k);
          if (sc > 14 || sc < 0.05) continue;
          // an inner door is only seen once the door around it has opened
          const vis = k === 0 ? 1 : opens[k - 1];
          if (vis <= 0.01) continue;
          g.globalAlpha = (1 - st.carousel) * vis;
          drawDoor(g, 960, 560 - 40 * Math.min(sc, 3), sc, opens[k], 0.4 + 0.6 * opens[k], k);
        }
        g.globalAlpha = 1;
      }
    });
  });

  // ======================================================================
  // 13 · THE ROAD — at its start or far along; room for everyone
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 112.75, 119.75, 0.45, 0.55);
    const st = { m1: 0, m2: 0, tilt: 0, many: 0, sun: 0 };
    tl.to(st, { sun: 1, duration: 3 }, C.sawa - 0.3);
    tl.to(st, { m1: 1, duration: 0.5, ease: 'back.out(2)' }, C.sawa_w_awwal);
    tl.to(st, { m2: 1, duration: 0.5, ease: 'back.out(2)' }, C.sawa_w_qataat + 0.05);
    tl.to(st, { tilt: 1, duration: 1.8, ease: 'expo.inOut' }, C.muttasa - 0.1);
    tl.to(st, { many: 1, duration: 1.2, ease: 'power2.out' }, C.muttasa_w_jami - 0.25);
    const roadX = (u, t) => 960 + Math.sin(u * 5.2 + 0.6) * 380 * (1 - u) ** 1.2 * (1 - u * 0.4);
    draw('bg', 112.7, 119.8, (g, t) => {
      const hy = lerp(560, 760, st.tilt);
      const sky = g.createLinearGradient(0, 0, 0, hy);
      sky.addColorStop(0, '#071827'); sky.addColorStop(0.6, '#14404a'); sky.addColorStop(1, `rgb(${120 + 100 * st.sun},${100 + 60 * st.sun},${70})`);
      g.fillStyle = sky; g.fillRect(0, 0, W, hy + 2);
      const r = rng(1313);
      g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * hy * (1 + st.tilt * 0.3); if (y > hy - 40) continue; g.fillStyle = `rgba(255,248,230,${(0.3 + 0.5 * r()) * (1 - y / hy) * (0.6 + 0.4 * Math.sin(t * 2 + i))})`; g.fillRect(x, y - st.tilt * 200 * (1 - y / hy), 2, 2); }
      glow(g, SPR.warm, 960, hy, 1400 + st.sun * 500, 0.7 * st.sun + 0.3);
      glow(g, SPR.white, 960, hy - 10, 120, st.sun);
      g.globalCompositeOperation = 'source-over';
      const gd = g.createLinearGradient(0, hy, 0, H); gd.addColorStop(0, '#1d2a26'); gd.addColorStop(1, '#060b0b');
      g.fillStyle = gd; g.fillRect(0, hy, W, H - hy);
      // road
      const N = 90, pts = [];
      for (let k = 0; k <= N; k++) { const u = k / N, y = hy + (H + 200 - hy) * Math.pow(1 - u, 2.2), w = 6 + 520 * Math.pow(1 - u, 2.2); pts.push([roadX(u, t), y, w]); }
      g.beginPath(); pts.forEach(([x, y, w], i) => (i ? g.lineTo(x - w / 2, y) : g.moveTo(x - w / 2, y))); for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0] + pts[i][2] / 2, pts[i][1]); g.closePath();
      const rg = g.createLinearGradient(0, hy, 0, H); rg.addColorStop(0, 'rgba(255,220,150,.9)'); rg.addColorStop(1, 'rgba(160,120,70,.35)');
      g.fillStyle = rg; g.fill();
      // centre dashes moving toward the viewer
      g.fillStyle = 'rgba(255,245,220,.8)';
      for (let k = 0; k < 30; k++) { const u = 1 - ((k / 30 + t * 0.12) % 1); if (u < 0.02) continue; const y = hy + (H + 200 - hy) * Math.pow(1 - u, 2.2), w = 2 + 10 * Math.pow(1 - u, 2.2); g.fillRect(roadX(u, t) - w / 2, y, w, w * 3); }
      g.globalCompositeOperation = 'lighter';
      // milestone near the start, and one far along
      const mark = (u, a, sz) => { if (a <= 0) return; const y = hy + (H + 200 - hy) * Math.pow(1 - u, 2.2), x = roadX(u, t); glow(g, SPR.warm, x, y, sz * 4 * a, 0.9 * a); glow(g, SPR.white, x, y, sz * 0.5 * a, 1); g.strokeStyle = `rgba(255,236,190,${a * 0.8})`; g.lineWidth = 3; g.beginPath(); g.arc(x, y, sz * (0.6 + a * 0.4), 0, 7); g.stroke(); };
      mark(0.22, st.m1, 90); mark(0.62, st.m2, 40);
      // room for all: travellers on every road to the horizon
      if (st.many > 0) {
        const R = rng(77);
        for (let i = 0; i < 420; i++) {
          const lane = R() * 2 - 1, sp = 0.03 + R() * 0.05, u = (R() + t * sp) % 1, appear = clamp((st.many - R() * 0.8) / 0.2);
          if (appear <= 0) continue;
          const y = hy + (H - hy) * Math.pow(1 - u, 2), x = 960 + lane * (30 + 1400 * Math.pow(1 - u, 2));
          glow(g, SPR.gold, x, y, 6 + 26 * Math.pow(1 - u, 2), 0.85 * appear);
        }
      }
      g.globalCompositeOperation = 'source-over';
    });
  });

  // ======================================================================
  // 14 · NOT MERE INFORMATION — insight that guides, understanding that corrects, action that changes
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 119.65, 127.95, 0.4, 0.55);
    // target points: a mishkāt lamp outline, sampled from an offscreen drawing
    const oc = document.createElement('canvas'); oc.width = 600; oc.height = 600; const og = oc.getContext('2d');
    og.strokeStyle = '#fff'; og.lineWidth = 7;
    og.stroke(new Path2D('M300,40 L300,120 M240,120 L360,120 L380,150 L220,150 Z M200,160 C160,210 150,270 170,330 C190,400 250,440 300,446 C350,440 410,400 430,330 C450,270 440,210 400,160 Z M260,446 L340,446 L355,490 L245,490 Z M190,250 C260,280 340,280 410,250 M180,330 C260,360 340,360 420,330'));
    const od = og.getImageData(0, 0, 600, 600).data, targets = [];
    for (let y = 0; y < 600; y += 5) for (let x = 0; x < 600; x += 5) if (od[(y * 600 + x) * 4 + 3] > 100) targets.push([660 + x, 160 + y]);
    const letters = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
    const N = Math.min(targets.length, 520);
    const parts = [...Array(N)].map((_, i) => { const r = rng(i + 1400); return { x: r() * W, y: r() * H, vx: (r() - 0.5) * 60, vy: (r() - 0.5) * 60, rot: r() * 6, ch: letters[i % letters.length], tg: targets[Math.floor((i / N) * targets.length)], d: r() }; });
    const st = { more: 0.4, gather: 0, form: 0, beam: 0, straight: 0, sprout: 0, ripple: 0, zz: 0 };
    tl.to(st, { more: 1, duration: 0.6 }, C.maalumat_w_maalumat - 0.1);
    tl.to(st, { gather: 1, duration: 0.6, ease: 'power3.in' }, C.maalumat_w_tujma - 0.1);
    tl.to(st, { form: 1, duration: 1.0, ease: 'expo.out' }, C.tahdi);
    tl.to(st, { beam: 1, duration: 0.6, ease: 'power2.out' }, C.tahdi_w - 0.1);
    tl.to(st, { zz: 1, duration: 0.3 }, C.yusahhih - 0.15);
    tl.to(st, { straight: 1, duration: 0.6, ease: 'back.out(1.6)' }, C.yusahhih_w - 0.1);
    tl.to(st, { sprout: 1, duration: 1.1, ease: 'power2.out' }, C.yughayyir - 0.05);
    tl.to(st, { ripple: 1, duration: 1.4, ease: 'power1.out' }, C.yughayyir_w - 0.1);
    window.flash(C.tahdi, 0.3, 0.5);
    draw('bg', 119.6, 128.0, (g, t) => {
      const warm = st.form;
      const gr = g.createRadialGradient(960, 450, 50, 960, 540, 1200);
      gr.addColorStop(0, `rgb(${20 + warm * 30},${28 + warm * 30},${30 + warm * 10})`); gr.addColorStop(1, '#040707');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // ripple of change: colour floods outward
      if (st.ripple > 0) {
        const R = st.ripple * 1500;
        const rg = g.createRadialGradient(960, 760, Math.max(0, R - 300), 960, 760, R);
        rg.addColorStop(0, 'rgba(31,94,85,.55)'); rg.addColorStop(0.85, 'rgba(242,210,139,.35)'); rg.addColorStop(1, 'rgba(242,210,139,0)');
        g.fillStyle = rg; g.fillRect(0, 0, W, H);
        g.strokeStyle = `rgba(242,210,139,${0.6 * (1 - st.ripple)})`; g.lineWidth = 4; g.beginPath(); g.arc(960, 760, R, 0, 7); g.stroke();
      }
      // letters: drifting info → heap → lamp
      g.textAlign = 'center'; g.textBaseline = 'middle';
      parts.forEach((p, i) => {
        if (p.d > st.more) return;
        let x = (p.x + p.vx * (t - 120)) % W, y = (p.y + p.vy * (t - 120)) % H; if (x < 0) x += W; if (y < 0) y += H;
        const hx = 960 + Math.cos(i) * (40 + (i % 13) * 6), hy = 760 + Math.sin(i * 1.7) * 30 - (i % 11) * 6;
        x = lerp(x, hx, st.gather); y = lerp(y, hy, st.gather);
        const f = ease.io(clamp((st.form - p.d * 0.3) / 0.7));
        x = lerp(x, p.tg[0], f); y = lerp(y, p.tg[1], f);
        if (f < 0.98) {
          g.save(); g.translate(x, y); g.rotate(p.rot + t * 0.5 * (1 - st.gather));
          g.font = '500 30px Kufi'; g.fillStyle = `rgba(${lerp(150, 255, f)},${lerp(160, 226, f)},${lerp(160, 160, f)},${0.55 + 0.45 * f})`;
          g.fillText(p.ch, 0, 0); g.restore();
        }
        if (f > 0.02) { g.globalCompositeOperation = 'lighter'; glow(g, SPR.gold, x, y, 16, f); g.globalCompositeOperation = 'source-over'; }
      });
      g.globalCompositeOperation = 'lighter';
      if (st.form > 0.4) glow(g, SPR.warm, 960, 440, 600, (st.form - 0.4) * 1.2);
      // guiding beam sweeping from the lamp
      if (st.beam > 0) {
        const ang = Math.PI / 2 + Math.sin((t - C.tahdi_w) * 1.6) * 0.5;
        g.save(); g.translate(960, 470); g.rotate(ang - Math.PI / 2);
        const bg2 = g.createLinearGradient(0, 0, 0, 900); bg2.addColorStop(0, `rgba(255,230,170,${0.45 * st.beam})`); bg2.addColorStop(1, 'rgba(255,230,170,0)');
        g.fillStyle = bg2; g.beginPath(); g.moveTo(-30, 0); g.lineTo(30, 0); g.lineTo(260 * st.beam, 900); g.lineTo(-260 * st.beam, 900); g.closePath(); g.fill();
        g.restore();
      }
      g.globalCompositeOperation = 'source-over';
      // crooked line → corrected
      if (st.zz > 0) {
        g.beginPath();
        for (let k = 0; k <= 40; k++) {
          const x = lerp(260, 1660, k / 40) , zz = (k % 2 ? 1 : -1) * 70 * (1 - st.straight) * Math.sin((k / 40) * Math.PI) + noise2(k * 0.7, 3) * 40 * (1 - st.straight);
          k ? g.lineTo(x, 760 + zz) : g.moveTo(x, 760 + zz);
        }
        g.strokeStyle = `rgba(${lerp(200, 242, st.straight)},${lerp(110, 210, st.straight)},${lerp(90, 139, st.straight)},${st.zz})`; g.lineWidth = 6; g.lineJoin = 'round'; g.lineCap = 'round';
        g.shadowColor = 'rgba(242,210,139,.7)'; g.shadowBlur = 16 * st.straight; g.stroke(); g.shadowBlur = 0;
      }
      // action: a sprout grows from the line and blooms
      if (st.sprout > 0) {
        const p = st.sprout, top = 760 - 220 * p;
        g.strokeStyle = '#7fc8a0'; g.lineWidth = 6; g.beginPath(); g.moveTo(960, 760); g.bezierCurveTo(960, 700, 940, 640, 960, top); g.stroke();
        const leaf = (dir, k) => { const lp = clamp((p - k) / 0.4); if (lp <= 0) return; g.save(); g.translate(960, 760 - 220 * k - 40); g.rotate(dir * 0.8); g.scale(lp, lp); g.fillStyle = '#3fae84'; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(dir * 50, -30, dir * 90, 0); g.quadraticCurveTo(dir * 50, 26, 0, 0); g.fill(); g.restore(); };
        leaf(-1, 0.25); leaf(1, 0.45);
        const bp = clamp((p - 0.6) / 0.4);
        if (bp > 0) { g.globalCompositeOperation = 'lighter'; glow(g, SPR.warm, 960, top, 260 * bp, bp); g.globalCompositeOperation = 'source-over';
          g.save(); g.translate(960, top); g.rotate(t * 0.4); g.fillStyle = '#f2d28b'; for (let k = 0; k < 8; k++) { g.rotate(Math.PI / 4); g.beginPath(); g.ellipse(0, -22 * bp, 9 * bp, 22 * bp, 0, 0, 7); g.fill(); } g.fillStyle = '#fff1cf'; g.beginPath(); g.arc(0, 0, 10 * bp, 0, 7); g.fill(); g.restore(); }
      }
    });
  });

  // ======================================================================
  // 15 · START TODAY — one step; a little, constant, beats much that stops
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 127.9, 135.0, 0.45, 0.5);
    const st = { sun: 0, step: 0, path: 0, drops: 0, cmp: 0, brk: 0 };
    tl.to(st, { sun: 1, duration: 1.0, ease: 'expo.out' }, C.ibda - 0.05);
    tl.to(st, { path: 1, duration: 0.6 }, C.khutwa - 0.2);
    tl.to(st, { step: 1, duration: 0.35, ease: 'back.out(2)' }, C.khutwa_w);
    tl.to(st, { drops: 1, duration: 0.3 }, C.qalil - 0.15);
    tl.to(st, { cmp: 1, duration: 1.9, ease: 'none' }, C.khayr - 0.1);
    tl.to(st, { brk: 1, duration: 0.5 }, C.khayr_w_munqati - 0.05);
    draw('bg', 127.85, 135.05, (g, t) => {
      const hy = 640;
      const sky = g.createLinearGradient(0, 0, 0, hy);
      sky.addColorStop(0, '#0b2230'); sky.addColorStop(1, `rgb(${70 + 140 * st.sun},${70 + 90 * st.sun},${60 + 30 * st.sun})`);
      g.fillStyle = sky; g.fillRect(0, 0, W, hy);
      g.fillStyle = '#0b1514'; g.fillRect(0, hy, W, H - hy);
      g.globalCompositeOperation = 'lighter';
      const sy = lerp(hy + 120, hy - 150, ease.out(st.sun));
      glow(g, SPR.warm, 960, sy, 1600, 0.85 * st.sun); glow(g, SPR.white, 960, sy, 180, st.sun);
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = '#0b1514'; g.fillRect(0, hy, W, H - hy);
      // stepping stones toward the sun
      const fade = 1 - st.drops;
      if (st.path > 0 && fade > 0) {
        for (let k = 0; k < 9; k++) {
          const u = k / 9, y = lerp(1040, hy + 12, Math.pow(u, 0.7)), w = lerp(260, 30, Math.pow(u, 0.7)), h = w * 0.22;
          const lit = k === 0 ? st.step : 0;
          g.globalAlpha = st.path * fade * (1 - u * 0.6);
          g.fillStyle = lit ? `rgba(242,210,139,${0.4 + 0.6 * lit})` : 'rgba(90,110,105,.6)';
          g.beginPath(); g.ellipse(960 + Math.sin(k * 1.3) * 30 * (1 - u), y, w / 2, h / 2, 0, 0, 7); g.fill();
          if (lit) { g.globalCompositeOperation = 'lighter'; glow(g, SPR.warm, 960, y, 600 * lit, lit); g.strokeStyle = `rgba(255,236,190,${1 - lit * 0.6})`; g.lineWidth = 3; g.beginPath(); g.ellipse(960, y, w * (0.5 + lit), h * (0.5 + lit), 0, 0, 7); g.stroke(); g.globalCompositeOperation = 'source-over'; }
        }
        g.globalAlpha = 1;
      }
      // steady drops carving stone
      if (st.drops > 0 && st.cmp < 1) {
        const a = st.drops * (1 - clamp(st.cmp * 3));
        g.globalAlpha = a;
        const stoneY = 860;
        g.fillStyle = '#26302e'; g.beginPath(); g.ellipse(960, stoneY + 40, 260, 70, 0, 0, 7); g.fill();
        const n = Math.floor((t - C.qalil + 0.15) / 0.32);
        const groove = clamp((t - C.qalil) / 3) * 40;
        g.fillStyle = '#121a19'; g.beginPath(); g.ellipse(960, stoneY + 10, 30 + groove, 8 + groove * 0.25, 0, 0, 7); g.fill();
        g.globalCompositeOperation = 'lighter';
        glow(g, SPR.gold, 960, stoneY + 10, 120 + groove * 3, 0.3 + groove / 60);
        for (let k = Math.max(0, n - 3); k <= n; k++) {
          const t0 = C.qalil - 0.15 + k * 0.32, lt = t - t0; if (lt < 0) continue;
          const fall = clamp(lt / 0.2), y = lerp(200, stoneY, fall * fall);
          if (fall < 1) { glow(g, SPR.white, 960, y, 24, 1); glow(g, SPR.gold, 960, y, 60, 0.6); }
          else { const rp = lt - 0.2; g.strokeStyle = `rgba(242,210,139,${Math.max(0, 0.8 - rp * 1.2)})`; g.lineWidth = 2.5; g.beginPath(); g.ellipse(960, stoneY + 10, 30 + rp * 260, 8 + rp * 64, 0, 0, 7); g.stroke(); }
        }
        g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      }
      // the race: steady small steps vs big bursts that stop
      if (st.cmp > 0) {
        const a = clamp(st.cmp * 4);
        g.globalAlpha = a;
        g.fillStyle = 'rgba(4,10,10,.3)'; g.fillRect(0, 640, W, H - 640);
        const X0 = 300, X1 = 1620, Y0 = 900, Y1 = 220, P = st.cmp;
        g.strokeStyle = 'rgba(241,230,207,.15)'; g.lineWidth = 2; g.beginPath(); g.moveTo(X0, Y0); g.lineTo(X1, Y0); g.stroke();
        // much, then broken (ember)
        const bursts = [[0, 0], [0.12, 0.34], [0.2, 0.34], [0.3, 0.52], [0.45, 0.52], [0.52, 0.6], [0.62, 0.6]];
        g.strokeStyle = '#e07a3b'; g.lineWidth = 14; g.lineCap = 'round'; g.lineJoin = 'round';
        g.beginPath(); let started = false;
        for (let k = 0; k <= 160; k++) {
          const u = k / 160; if (u > P) break; if (u > 0.62) break;
          let v = 0; for (let j = 1; j < bursts.length; j++) if (u >= bursts[j - 1][0]) v = u < bursts[j][0] ? lerp(bursts[j - 1][1], bursts[j][1], (u - bursts[j - 1][0]) / (bursts[j][0] - bursts[j - 1][0])) : bursts[j][1];
          const x = lerp(X0, X1, u), y = lerp(Y0, Y1, v) + (st.brk * (u > 0.5 ? (u - 0.5) * 900 * st.brk : 0));
          started ? g.lineTo(x, y) : g.moveTo(x, y); started = true;
        }
        g.globalAlpha = a * (1 - st.brk * 0.7); g.stroke(); g.globalAlpha = a;
        // a little, constant (gold): small regular steps
        g.strokeStyle = '#f2d28b'; g.lineWidth = 7; g.shadowColor = 'rgba(242,210,139,.8)'; g.shadowBlur = 18;
        g.beginPath();
        for (let k = 0; k <= 200; k++) {
          const u = k / 200; if (u > P) break;
          const stepped = Math.floor(u * 40) / 40 + ease.io((u * 40) % 1) / 40;
          const x = lerp(X0, X1, u), y = lerp(Y0, Y1, stepped * 0.95);
          k ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.stroke(); g.shadowBlur = 0;
        const hu = Math.min(P, 1), hs = Math.floor(hu * 40) / 40 + ease.io((hu * 40) % 1) / 40;
        g.globalCompositeOperation = 'lighter'; glow(g, SPR.gold, lerp(X0, X1, hu), lerp(Y0, Y1, hs * 0.95), 90, 1); glow(g, SPR.white, lerp(X0, X1, hu), lerp(Y0, Y1, hs * 0.95), 20, 1); g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
      }
    });
  });

  // ======================================================================
  // 16 · END CARD — دار الأرقم · darelarqam.com
  // ======================================================================
  SC.push(root => {
    const s = div('scene', root); show(s, 134.95, C.END + 1, 0.55, 0.1);
    const st = { road: 0, rays: 0 };
    draw('bg', 134.9, C.END + 1, (g, t) => {
      const gr = g.createRadialGradient(960, 420, 60, 960, 540, 1300); gr.addColorStop(0, '#11403b'); gr.addColorStop(0.55, '#071a1c'); gr.addColorStop(1, '#020607');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(217,174,87,.05)'; g.lineWidth = 1.5;
      for (let x = 0; x < W + 200; x += 200) for (let y = 0; y < H + 200; y += 200) { const [a, b] = khatam(x, y, 70, t * 0.05); g.stroke(new Path2D(a)); g.stroke(new Path2D(b)); }
      g.globalCompositeOperation = 'lighter';
      // road of light into the door of the house
      if (st.road > 0) {
        const p = st.road;
        const rg = g.createLinearGradient(0, 1080, 0, 560); rg.addColorStop(0, 'rgba(255,226,160,0)'); rg.addColorStop(1, `rgba(255,226,160,${0.4 * p})`);
        g.fillStyle = rg; g.beginPath(); g.moveTo(960 - 520 * p, 1080); g.lineTo(960 + 520 * p, 1080); g.lineTo(990, 560); g.lineTo(930, 560); g.closePath(); g.fill();
        for (let i = 0; i < 40; i++) { const R = rng(i + 4000), u = (R() + t * 0.14) % 1, lane = R() * 2 - 1, y = lerp(1080, 570, u), x = 960 + lane * lerp(480, 20, u) * p; glow(g, SPR.gold, x, y, lerp(26, 6, u), 0.9 * p * Math.sin(u * Math.PI)); }
      }
      glow(g, SPR.warm, 960, 380, 1300, 0.35 + st.rays * 0.25);
      g.globalCompositeOperation = 'source-over';
    });
    const L = Brand.logo(s, { x: 960, y: 360, scale: 0.68, id: 'L2' });
    Brand.reveal(tl, L, C.brand2 - 0.35, 0.75);
    window.flash(C.brand2, 0.4, 0.8);
    const wm = div('wordmark center', s, 'دار الأرقم'); Object.assign(wm.style, { top: '742px', fontSize: '128px', textShadow: '0 0 30px rgba(242,210,139,.35), 0 6px 30px rgba(0,0,0,.7)' });
    tl.fromTo(wm, { opacity: 0, y: 30, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out' }, C.brand2_w_arqam - 0.25);
    tl.to(st, { road: 1, duration: 1.6, ease: 'power2.out' }, C.rihla2 - 0.1);
    tl.to(st, { rays: 1, duration: 1.0 }, C.rihla2);
    const line = div('abs', s); Object.assign(line.style, { left: '760px', top: '868px', width: '400px', height: '2px', background: 'linear-gradient(90deg, transparent, #d9ae57, transparent)' });
    const url = div('url center', s, 'darelarqam.com'); Object.assign(url.style, { top: '918px', fontSize: '54px' });
    tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, C.tariq - 0.15);
    tl.fromTo(url, { opacity: 0, letterSpacing: '0.5em' }, { opacity: 1, letterSpacing: '0.14em', duration: 1.1, ease: 'expo.out' }, C.tariq - 0.05);
    // "البصيرة" — the star at the crown glints
    tl.fromTo(L.circle, { scale: 1, svgOrigin: '300 268' }, { scale: 1.5, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, C.tariq_w_basira);
    tl.fromTo(L.star, { rotation: 0, svgOrigin: '300 268' }, { rotation: 45, duration: 1.2, ease: 'expo.out', immediateRender: false }, C.tariq_w_basira);
    draw('fx', C.tariq_w_basira - 0.05, C.END + 1, (g, t) => {
      const p = clamp((t - C.tariq_w_basira) / 0.3), q = Math.exp(-Math.max(0, t - C.tariq_w_basira - 0.3) * 2.5);
      const cx = 960, cy = 360 - 350 * 0.68 + 268 * 0.68;
      g.globalCompositeOperation = 'lighter';
      glow(g, SPR.white, cx, cy, 140 * p, q); glow(g, SPR.gold, cx, cy, 500 * p, 0.6 * q);
      g.fillStyle = `rgba(255,248,230,${0.85 * q * p})`;
      g.beginPath(); g.ellipse(cx, cy, 420 * p, 2.5, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(cx, cy, 2.5, 160 * p, 0, 0, 7); g.fill();
    });
    // final breath: fade to black
    const black = div('layer', s); black.style.background = '#000'; black.style.opacity = 0;
    tl.fromTo(black, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'none', immediateRender: false }, C.END - 0.6);
  });
})();
