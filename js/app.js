/* A. Syahrul — Portfolio v3 (vanilla JS; Lenis loaded lazily from CDN as a progressive enhancement) */
(() => {
  'use strict';

  const SITE = { email: 'ndisyahrul27@gmail.com' }; // used only for copy + mailto, never printed on the page
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });

  /* ---------- Theme ---------- */
  const themeBtn = $('.theme-toggle');
  const setThemeLabel = () => {
    const dark = root.dataset.theme !== 'light';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    $('meta[name="theme-color"]').content = dark ? '#0A0A0A' : '#FAF7F2';
  };
  setThemeLabel();
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    setThemeLabel();
  });

  /* ---------- Teaching archive (built before reveals so its tiles get observed) ---------- */
  const A = 'assets/v3/photos/';
  const ARCHIVE = [
    { f: 'campus', src: A + 'speak-002.jpg', cap: 'Intermediate Training', sub: 'HMI · campus' },
    { f: 'pakai', src: A + 'sas-104.jpg', cap: 'Desk-side coaching', sub: 'Pakai AI · SAS International' },
    { f: 'nag', src: A + 'nag-000.jpg', cap: 'Great Leader session', sub: 'New Armada Group' },
    { f: 'campus', src: A + 'speak-010.jpg', cap: 'Basic Training, mapping session', sub: 'HMI · campus' },
    { f: 'pakai', type: 'video', src: 'assets/v3/video/class-reel.mp4', poster: 'assets/v3/video/class-reel-poster.jpg', cap: 'In the classroom', sub: 'Pakai AI · video' },
    { f: 'campus', src: A + 'speak-022.jpg', cap: 'At the whiteboard', sub: 'Campus training' },
    { f: 'nag', src: A + 'nag-014.jpg', cap: 'Generative AI workshop', sub: 'New Armada Group' },
    { f: 'pakai', src: A + 'ahm-002.jpg', cap: 'Claude AI Mastery', sub: 'Pakai AI · Astra Honda Motor' },
    { f: 'campus', src: A + 'speak-016.jpg', cap: 'Basic Training LX', sub: 'HMI · campus' },
    { f: 'pakai', src: A + 'sas-029.jpg', cap: 'Presenting the workflow', sub: 'Pakai AI · SAS International' },
    { f: 'campus', src: A + 'speak-021.jpg', cap: 'Auditorium session', sub: 'Campus' },
    { f: 'nag', type: 'video', src: 'assets/v3/video/pakai-ai-reel.mp4', poster: 'assets/v3/video/pakai-ai-reel-poster.jpg', cap: 'Performance appraisal framework session', sub: 'New Armada Group · video' },
    { f: 'nag', src: A + 'nag-009.jpg', cap: 'Hands-on session', sub: 'New Armada Group' },
    { f: 'campus', src: A + 'speak-000.jpg', cap: 'Seminar, February 2024', sub: 'Speaker' },
    { f: 'pakai', src: A + 'sas-110.jpg', cap: 'Live Work Lab', sub: 'Pakai AI · SAS International' },
    { f: 'nag', src: A + 'nag-001.jpg', cap: 'Leadership cohort', sub: 'New Armada Group' },
    { f: 'campus', src: A + 'speak-007.jpg', cap: 'Whiteboard facilitation', sub: 'HMI · campus' },
    { f: 'pakai', type: 'video', src: 'assets/v3/video/astra-honda-reel.mp4', poster: 'assets/v3/video/astra-honda-reel-poster.jpg', cap: 'Training Claude AI, Astra Honda', sub: 'Pakai AI · video' },
    { f: 'campus', src: A + 'speak-013.jpg', cap: 'Intermediate Training, plenary', sub: 'HMI · campus' },
    { f: 'nag', src: A + 'nag-013.jpg', cap: 'Workshop facilitation', sub: 'New Armada Group' },
    { f: 'pakai', src: A + 'sas-106.jpg', cap: 'Checking in with participants', sub: 'Pakai AI · SAS International' },
    { f: 'campus', src: A + 'speak-008.jpg', cap: 'Leading a discussion', sub: 'HMI · campus' },
    { f: 'pakai', src: A + 'ahm-021.jpg', cap: 'Batch 2 cohort', sub: 'Pakai AI · Astra Honda Motor' },
    { f: 'nag', src: A + 'nag-004.jpg', cap: 'Session delivery', sub: 'New Armada Group' },
    { f: 'campus', src: A + 'speak-024.jpg', cap: 'Training forum', sub: 'HMI · campus' },
    { f: 'pakai', src: A + 'sas-095.jpg', cap: 'RCCCF in action', sub: 'Pakai AI · SAS International' },
    { f: 'campus', src: A + 'speak-027.jpg', cap: 'Session delivery', sub: 'HMI · campus' },
    { f: 'nag', src: A + 'nag-015.jpg', cap: 'Program cohort', sub: 'New Armada Group' },
    { f: 'pakai', src: A + 'sas-112.jpg', cap: 'Closing day', sub: 'Pakai AI · SAS International' },
    { f: 'campus', src: A + 'speak-012.jpg', cap: 'Basic Training CIX', sub: 'HMI · campus' },
    { f: 'campus', src: A + 'speak-030.jpg', cap: 'Opening a training', sub: 'HMI · campus' },
    { f: 'nag', src: A + 'nag-006.jpg', cap: 'Training cohort', sub: 'New Armada Group' },
    { f: 'pakai', src: A + 'ahm-007.jpg', cap: 'Prompt lab', sub: 'Pakai AI · Astra Honda Motor' },
  ];
  const TAG = { campus: 'Campus & HMI', nag: 'New Armada', pakai: 'Pakai AI' };
  const archive = $('.archive');
  archive.innerHTML = ARCHIVE.map((m, i) => `<button class="arc${m.type === 'video' ? ' arc-video' : ''}" type="button" data-f="${m.f}" data-arc="${i}">
      ${m.type === 'video'
        ? `<video src="${m.src}" poster="${m.poster}" muted loop playsinline preload="none" data-autoplay></video><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>`
        : `<img src="${m.src}" alt="${esc(m.cap)}, ${esc(m.sub)}" loading="lazy">`}
      <span class="arc-tag">${TAG[m.f]}</span><span class="arc-cap">${esc(m.cap)}<small>${esc(m.sub)}</small></span></button>`).join('');
  const tabs = $$('.tc-tabs button');
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => x.setAttribute('aria-selected', x === t));
    $$('.arc', archive).forEach((el, i) => {
      const show = t.dataset.f === 'all' || el.dataset.f === t.dataset.f;
      el.classList.toggle('is-out', !show);
      if (show) { el.classList.remove('is-in'); setTimeout(() => el.classList.add('is-in'), 30 + (i % 8) * 50); }
    });
  }));

  /* ---------- Work log (New Armada task tracker) ---------- */
  const WL = window.WORKLOG || { cats: {}, items: [] };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtMonth = (ym) => { const [y, m] = ym.split('-'); return y ? `${MONTHS[+m - 1]} ${y.slice(2)}` : ''; };
  const counts = {};
  WL.items.forEach((it) => { counts[it[1]] = (counts[it[1]] || 0) + 1; });
  const catKeys = Object.keys(WL.cats).sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
  const maxCount = Math.max(...catKeys.map((k) => counts[k] || 0));
  const chart = $('.cat-chart');
  chart.innerHTML = catKeys.map((k, i) => `<button class="cc-row" type="button" data-cat="${k}" style="--k:${i}"><span class="cc-name">${WL.cats[k]}</span><span class="cc-bar"><i style="--w:${(counts[k] / maxCount).toFixed(3)}"></i></span><span class="cc-n" data-count="${counts[k]}">${counts[k]}</span></button>`).join('');
  const wlFilters = $('.wl-filters'), wlList = $('.wl-list'), wlMore = $('.wl-more'), wlInput = $('.wl-search input');
  wlFilters.innerHTML = `<button type="button" role="tab" aria-selected="true" data-cat="all">All<span>${WL.items.length}</span></button>` +
    catKeys.map((k) => `<button type="button" role="tab" aria-selected="false" data-cat="${k}">${WL.cats[k]}<span>${counts[k]}</span></button>`).join('');
  const wl = { cat: 'all', q: '', limit: 12 };
  const renderWL = () => {
    const q = wl.q.trim().toLowerCase();
    const rows = WL.items.filter((it) => (wl.cat === 'all' || it[1] === wl.cat) && (!q || it[0].toLowerCase().includes(q)));
    const shown = rows.slice(0, wl.limit);
    const hl = (s) => { const e = esc(s); if (!q) return e; const i = e.toLowerCase().indexOf(esc(q)); return i < 0 ? e : `${e.slice(0, i)}<mark>${e.slice(i, i + esc(q).length)}</mark>${e.slice(i + esc(q).length)}`; };
    wlList.innerHTML = shown.length
      ? shown.map((it, i) => `<li style="--k:${i % 12}"><span class="wl-m">${fmtMonth(it[2])}</span><span class="wl-t">${hl(it[0])}<small class="wl-c c-${it[1]}">${WL.cats[it[1]]}</small></span></li>`).join('')
      : '<li class="wl-empty">No deliverables match that search.</li>';
    wlMore.hidden = rows.length <= wl.limit;
    wlMore.textContent = `Show more (${rows.length - shown.length} left)`;
  };
  const setCat = (cat) => {
    wl.cat = cat; wl.limit = 12;
    $$('button', wlFilters).forEach((b) => b.setAttribute('aria-selected', b.dataset.cat === cat));
    $$('.cc-row', chart).forEach((r) => r.classList.toggle('is-sel', r.dataset.cat === cat));
    renderWL();
  };
  wlFilters.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setCat(b.dataset.cat); });
  chart.addEventListener('click', (e) => {
    const r = e.target.closest('.cc-row'); if (!r) return;
    setCat(r.dataset.cat);
    $('.worklog').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });
  wlInput.addEventListener('input', () => { wl.q = wlInput.value; wl.limit = 12; renderWL(); });
  wlMore.addEventListener('click', () => { wl.limit += 24; renderWL(); });
  renderWL();

  /* ---------- Split words ---------- */
  const splitWords = (el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const inner = document.createElement('span'); inner.textContent = part;
            inner.style.setProperty('--wi', i++);
            w.appendChild(inner); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.hasAttribute('data-count')) walk(n);
        else if (n.nodeType === 1) { // keep counters intact, but still animate them as one word
          const w = document.createElement('span'); w.className = 'w';
          const inner = document.createElement('span'); inner.style.setProperty('--wi', i++);
          n.replaceWith(w); inner.appendChild(n); w.appendChild(inner);
        }
      });
    };
    walk(el);
  };
  $$('.split-words').forEach(splitWords);

  /* ---------- Text scramble on eyebrows ---------- */
  const GLYPHS = '!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const scramble = (el) => {
    const node = [...el.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim());
    if (!node || reduced) return;
    const target = node.textContent; let frame = 0; const total = 22;
    const tick = () => {
      const p = frame / total;
      node.textContent = target.split('').map((ch, i) => (ch === ' ' || i / target.length < p) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
      if (frame++ < total) setTimeout(tick, 32); else node.textContent = target;
    };
    tick();
  };

  /* ---------- Reveal on scroll ---------- */
  $$('.reveal').forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.setProperty('--d', `${sibs.indexOf(el) * 0.08}s`);
  });
  $$('.card').forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 0.08}s`; });
  $$('.pilot-grid i, .track-12 i').forEach((el) => el.style.setProperty('--k', [...el.parentElement.children].indexOf(el)));

  const counters = new WeakSet();
  const runCount = (el) => {
    if (counters.has(el)) return; counters.add(el);
    const target = +el.dataset.count; const fmt = (n) => n.toLocaleString('en-US');
    if (reduced) { el.textContent = fmt(target); return; }
    const dur = 1600; const t0 = performance.now();
    const tick = (t) => {
      const p = clamp((t - t0) / dur, 0, 1); const e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0'; requestAnimationFrame(tick);
  };
  const reveal = (el) => {
    if (el.classList.contains('is-in')) return;
    el.classList.add('is-in');
    $$('[data-count]', el).forEach(runCount);
    if (el.matches('[data-count]')) runCount(el);
    if (el.matches('.eyebrow')) scramble(el);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  const revealTargets = $$('.split-words, .reveal, .card, .arc, .proof, .hero-stats, .trusted, .cat-chart, .eyebrow');
  revealTargets.forEach((el) => io.observe(el));
  // A fully clipped element never reports as intersecting, so watch the parent for mask reveals
  const maskIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { $$(':scope > .reveal-mask', en.target).forEach((m) => m.classList.add('is-in')); maskIO.unobserve(en.target); } });
  }, { threshold: 0.12 });
  [...new Set($$('.reveal-mask').map((el) => el.parentElement))].forEach((p) => maskIO.observe(p));
  // Anchor jumps can skip past elements without an intersection event; reveal anything already scrolled past
  setInterval(() => {
    revealTargets.concat($$('.reveal-mask')).forEach((el) => {
      if (el.classList.contains('is-in') || el.classList.contains('is-out')) return;
      const host = el.classList.contains('reveal-mask') ? el.parentElement : el;
      if (host.getBoundingClientRect().top < innerHeight * 0.9) reveal(el);
    });
  }, 400);

  /* ---------- Autoplay muted loops only while visible ---------- */
  const vidIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting && !reduced) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); }
      else v.pause();
    });
  }, { threshold: 0.25 });
  $$('video[data-autoplay]').forEach((v) => vidIO.observe(v));

  /* ---------- Hero intro + rotator ---------- */
  requestAnimationFrame(() => {
    root.classList.add('is-loaded');
    setTimeout(() => $('#hero-h').classList.add('is-in'), 150);
    setTimeout(() => $$('.hero-stats [data-count]').forEach(runCount), 1100);
  });
  const words = $$('.rot-word');
  let wi = 0;
  if (!reduced && words.length > 1) {
    setInterval(() => {
      const cur = words[wi]; wi = (wi + 1) % words.length; const nxt = words[wi];
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      nxt.classList.remove('is-out'); nxt.classList.add('is-on');
      setTimeout(() => cur.classList.remove('is-out'), 700);
    }, 2400);
  }

  /* ---------- Hero waves: a dotted field that ripples and bends toward the pointer ---------- */
  const waves = $('.hero-waves');
  const wavePointer = { x: -9999, y: -9999 };
  let waveVisible = true;
  if (waves && !reduced) {
    const ctx = waves.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    const size = () => { dpr = Math.min(devicePixelRatio, 2); W = waves.clientWidth; H = waves.clientHeight; waves.width = W * dpr; waves.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener('resize', size);
    new IntersectionObserver(([en]) => { waveVisible = en.isIntersecting; }).observe(waves);
    $('.hero').addEventListener('pointermove', (e) => { const r = waves.getBoundingClientRect(); wavePointer.x = e.clientX - r.left; wavePointer.y = e.clientY - r.top; });
    $('.hero').addEventListener('pointerleave', () => { wavePointer.x = wavePointer.y = -9999; });
    const draw = (t) => {
      requestAnimationFrame(draw);
      if (!waveVisible) return;
      const s = t / 1000; const gap = W < 700 ? 26 : 34;
      const light = root.dataset.theme === 'light';
      ctx.clearRect(0, 0, W, H);
      for (let y = gap / 2; y < H; y += gap) {
        for (let x = gap / 2; x < W; x += gap) {
          const wave = Math.sin(x * 0.012 + s * 1.2) * Math.cos(y * 0.016 - s * 0.9);
          const dx = x - wavePointer.x, dy = y - wavePointer.y; const d = Math.hypot(dx, dy);
          const pull = Math.max(0, 1 - d / 220);
          const px = x + (pull ? (dx / (d || 1)) * pull * 18 : 0);
          const py = y + wave * 7 + (pull ? (dy / (d || 1)) * pull * 18 : 0);
          const a = 0.12 + (wave + 1) * 0.12 + pull * 0.6;
          const r = 1 + (wave + 1) * 0.6 + pull * 2.2;
          ctx.fillStyle = pull > 0.05 ? `rgba(198,244,50,${a})` : (light ? `rgba(20,20,20,${a * 0.6})` : `rgba(255,255,255,${a * 0.55})`);
          ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.fill();
        }
      }
    };
    requestAnimationFrame(draw);
  }

  /* ---------- Radar (8 position levels) ---------- */
  (() => {
    const svg = $('.viz-radar'); if (!svg) return;
    const ns = 'http://www.w3.org/2000/svg';
    const cx = 120, cy = 120, R = 86, N = 8;
    // The CV names only the ends of the range ("Sales Staff to Director"), so middle tiers stay generic
    const labels = ['Sales Staff', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'Director'];
    const pt = (i, r) => { const a = -Math.PI / 2 + (i / N) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    const grid = $('.r-grid', svg);
    [1, 0.66, 0.33].forEach((f) => {
      const p = document.createElementNS(ns, 'polygon');
      p.setAttribute('points', Array.from({ length: N }, (_, i) => pt(i, R * f).join(',')).join(' '));
      grid.appendChild(p);
    });
    for (let i = 0; i < N; i++) {
      const l = document.createElementNS(ns, 'line'); const [x, y] = pt(i, R);
      l.setAttribute('x1', cx); l.setAttribute('y1', cy); l.setAttribute('x2', x); l.setAttribute('y2', y);
      grid.appendChild(l);
    }
    const vals = [0.9, 0.72, 0.84, 0.66, 0.92, 0.7, 0.8, 0.62];
    $('.r-shape', svg).setAttribute('points', vals.map((v, i) => pt(i, R * v).join(',')).join(' '));
    const lg = $('.r-labels', svg);
    labels.forEach((t, i) => {
      const [x, y] = pt(i, R + 18); const tx = document.createElementNS(ns, 'text');
      tx.setAttribute('x', x); tx.setAttribute('y', y + 3); tx.setAttribute('text-anchor', Math.abs(x - cx) < 4 ? 'middle' : x > cx ? 'start' : 'end');
      tx.textContent = t; lg.appendChild(tx);
    });
  })();

  /* ---------- Nav: compact, scroll-spy ---------- */
  const nav = $('#nav');
  const links = $$('.nav-links a');
  const indicator = $('.nav-indicator');
  const moveIndicator = (a) => {
    if (!a) { indicator.style.opacity = 0; return; }
    indicator.style.opacity = 1;
    indicator.style.width = `${a.offsetWidth}px`;
    indicator.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  const spyIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.id;
      links.forEach((a) => a.classList.toggle('is-active', a.dataset.spy === id));
      moveIndicator(links.find((a) => a.dataset.spy === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['hero', 'journey', 'work', 'armada', 'pakai', 'about', 'skills', 'experience', 'teaching', 'credentials', 'services', 'contact'].forEach((id) => { const s = document.getElementById(id); if (s) spyIO.observe(s); });
  links.forEach((a) => {
    a.addEventListener('mouseenter', () => moveIndicator(a));
    a.addEventListener('mouseleave', () => moveIndicator($('.nav-links a.is-active')));
  });

  /* ---------- Mobile menu ---------- */
  const burger = $('.burger'), menu = $('#menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });

  /* ---------- Smooth scroll (Lenis) + in-page links ---------- */
  let lenis = null;
  if (!reduced) {
    loadScript('https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js').then(() => {
      if (!window.Lenis) return;
      lenis = new window.Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      root.classList.add('lenis');
    }).catch(() => {});
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = document.querySelector(id); if (!t) return;
    e.preventDefault();
    if (menu.classList.contains('is-open')) setMenu(false);
    const top = t.getBoundingClientRect().top + scrollY - (id === '#hero' ? 0 : 20);
    if (lenis) lenis.scrollTo(top, { force: true });
    else scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  });

  /* ---------- Pointer glow, magnetic buttons, tilt, spotlight (native cursor stays) ---------- */
  const glow = $('.glow-follow');
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const gpos = { x: mouse.x, y: mouse.y };
  if (finePointer && !reduced) {
    addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; glow.classList.add('is-on'); }, { passive: true });
    document.addEventListener('pointerleave', () => glow.classList.remove('is-on'));

    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)'; el.style.transform = ''; setTimeout(() => (el.style.transition = ''), 600); });
    });

    $$('.tilt').forEach((el) => {
      const max = +el.dataset.tilt || 4;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
        el.style.setProperty('--mx', `${px * 100}%`); el.style.setProperty('--my', `${py * 100}%`);
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1), opacity .9s, translate 1s, border-color .4s'; el.style.transform = ''; setTimeout(() => (el.style.transition = ''), 800); });
    });
  }

  /* ---------- Accordion (experience) ---------- */
  const roles = $$('.role');
  roles.forEach((r) => {
    $('.role-head', r).addEventListener('click', () => {
      const open = !r.classList.contains('is-open');
      r.classList.toggle('is-open', open);
      $('.role-head', r).setAttribute('aria-expanded', open);
    });
  });
  const ecN = $('.ec-n');
  const roleIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting && ecN) ecN.textContent = String(roles.indexOf(en.target) + 1).padStart(2, '0'); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  roles.forEach((r) => roleIO.observe(r));

  /* ---------- Case studies (Problem → Process → Solution → Result, all from the CV) ---------- */
  const CASES = {
    native: {
      kicker: 'Case study 01 · New Armada Group',
      title: 'AI-native People Development',
      metrics: [['50+', 'AI integration projects in 3 months'], ['12', 'AI pilots designed'], ['96%', 'satisfaction'], ['83%', 'advocacy']],
      steps: [
        ['Problem', 'People Development had to serve 2,000+ employees across four business units (BRA, MAI, MAJ, AHG) in a group of 8,000+.'],
        ['Process', 'Built AI-native People Development functions from the ground up, spearheading 50+ AI integration projects in three months.'],
        ['Solution', '12 AI pilots, including AI-powered assessment tools, automated competency mapping systems and intelligent training path generators.'],
        ['Result', 'The pilots reached 96% satisfaction and 83% advocacy scores.'],
      ],
    },
    adapt: {
      kicker: 'Case study 02 · Learning platform',
      title: 'ADAPT LMS',
      metrics: [['2,000+', 'employees supported'], ['-40%', 'assessment time'], ['+35%', 'accuracy']],
      steps: [
        ['Problem', 'Digital learning and on-the-job assessment needed to reach 2,000+ employees across branches and business units.'],
        ['Process', 'Built assessment tools and Competency Management frameworks to evaluate how employees apply what they learn on the job.'],
        ['Solution', 'ADAPT, an integrated HRIS-linked Learning Management System, built and administered in-house, with a dashboard redesigned for MT Batch 3.'],
        ['Result', 'Assessment time reduced by 40% while accuracy improved by 35%.'],
      ],
    },
    assess: {
      kicker: 'Case study 03 · Assessment',
      title: 'AI Competency Assessment',
      metrics: [['8', 'position levels'], ['100+', 'case studies analyzed'], ['-40%', 'assessment time'], ['+35%', 'accuracy']],
      steps: [
        ['Problem', 'Competency had to be assessed consistently across 8 position levels, from Sales Staff to Director.'],
        ['Process', 'Analyzed 100+ case studies with machine-learning insights to shape the assessment.'],
        ['Solution', 'AI-powered competency assessment systems engineered for each position level.'],
        ['Result', 'Assessment time reduced by 40% while accuracy improved by 35%.'],
      ],
    },
    prompts: {
      kicker: 'Case study 04 · Prompt engineering',
      title: 'Prompt Library',
      metrics: [['150+', 'production-ready prompts'], ['10+', 'L&D use cases'], ['3', 'AI platforms']],
      steps: [
        ['Problem', 'Learning Specialists and Assessors needed a reliable way to use generative AI in daily work.'],
        ['Process', 'Engineered prompt engineering frameworks for assessment design, training development and data analysis workflows.'],
        ['Solution', 'A curated library of 150+ production-ready prompts across ChatGPT, Claude and Gemini.'],
        ['Result', 'Learning Specialists and Assessors now leverage generative AI across 10+ L&D use cases.'],
      ],
    },
    mt: {
      kicker: 'Case study 05 · Program',
      title: 'Management Trainee, Batch 3',
      metrics: [['12', 'months, ADDIE-based'], ['200+', 'HR & management staff trained'], ['100%', 'documentation accuracy']],
      steps: [
        ['Problem', 'A 12-month Management Trainee program needed consistent delivery, documentation and LMS adoption.'],
        ['Process', 'Coached and mentored MT mentors and trainees on training delivery and LMS usage; drafted the program handbook.'],
        ['Solution', 'Structured execution workflows, automated reporting and a 10-day interactive onboarding dashboard.'],
        ['Result', '200+ HR and management staff trained with 100% documentation accuracy.'],
      ],
    },
  };
  const dlg = $('#case');
  let lastFocus = null;
  const openCase = (key) => {
    const c = CASES[key]; if (!c) return;
    lastFocus = document.activeElement;
    $('.case-kicker', dlg).textContent = c.kicker;
    $('.case-title', dlg).textContent = c.title;
    $('.case-metrics', dlg).innerHTML = c.metrics.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('');
    $('.case-steps', dlg).innerHTML = c.steps.map(([h, p], i) => `<section><h4><span>0${i + 1}</span>${h}</h4><p>${p}</p></section>`).join('');
    dlg.showModal(); dlg.scrollTop = 0;
    if (lenis) lenis.stop();
  };
  dlg.addEventListener('close', () => { if (lenis) lenis.start(); lastFocus && lastFocus.focus(); });
  $('.case-close', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  $$('[data-case]').forEach((el) => {
    el.addEventListener('click', () => openCase(el.dataset.case));
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCase(el.dataset.case); } });
  });

  /* ---------- Lightbox (archive + certificates) ---------- */
  const CREDS = [
    { src: 'assets/creds/bnsp-trainer.jpg', cap: 'Certified Trainer, KKNI Level 4 · BNSP 2026' },
    { src: 'assets/creds/bnsp-hr.jpg', cap: 'Certified Human Capital Staff · BNSP 2025' },
    { src: 'assets/creds/bnsp-coach.jpg', cap: 'Certified Professional Coach · BNSP 2025' },
    { src: 'assets/creds/udemy-coaching.jpg', cap: 'Coaching, Counseling & Mentoring L3 · Udemy 2024' },
  ];
  const lb = $('#lb'), stage = $('.lb-stage', lb);
  let lbIdx = 0, lbGroup = [], lbOpener = null;
  const renderLb = () => {
    const m = lbGroup[lbIdx];
    const cap = m.sub ? `${m.cap} · ${m.sub}` : m.cap;
    stage.innerHTML = m.type === 'video'
      ? `<video src="${m.src}" poster="${m.poster}" controls playsinline autoplay muted loop></video><figcaption>${esc(cap)}</figcaption>`
      : `<img src="${m.src}" alt="${esc(cap)}"><figcaption>${esc(cap)}</figcaption>`;
    stage.style.animation = 'none'; void stage.offsetWidth; stage.style.animation = '';
    $('.lb-count', lb).textContent = `${lbIdx + 1} / ${lbGroup.length}`;
  };
  const openLb = (group, i, opener) => {
    lbGroup = group; lbIdx = i; lbOpener = opener;
    lb.hidden = false; document.body.style.overflow = 'hidden'; if (lenis) lenis.stop();
    renderLb(); $('.lb-close', lb).focus();
  };
  const closeLb = () => { lb.hidden = true; stage.innerHTML = ''; document.body.style.overflow = ''; if (lenis) lenis.start(); lbOpener && lbOpener.focus(); };
  const stepLb = (d) => { lbIdx = (lbIdx + d + lbGroup.length) % lbGroup.length; renderLb(); };
  archive.addEventListener('click', (e) => {
    const b = e.target.closest('.arc'); if (!b) return;
    const visible = $$('.arc:not(.is-out)', archive);
    openLb(visible.map((el) => ARCHIVE[+el.dataset.arc]), visible.indexOf(b), b);
  });
  $$('[data-lb^="cred-"]').forEach((el) => el.addEventListener('click', () => openLb(CREDS, +el.dataset.lb.split('-')[1], el)));
  $('.lb-close', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', () => stepLb(-1));
  $('.lb-next', lb).addEventListener('click', () => stepLb(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') stepLb(1);
    if (e.key === 'ArrowLeft') stepLb(-1);
    if (e.key === 'Tab') { // focus trap
      const f = $$('button, video', lb).filter((x) => x.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let tx0 = null;
  lb.addEventListener('touchstart', (e) => { tx0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { if (tx0 === null) return; const dx = e.changedTouches[0].clientX - tx0; if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1); tx0 = null; });

  /* Fan: spread on touch when in view */
  const fan = $('.fan');
  if (fan && !finePointer) {
    $('.fan-hint', fan).textContent = 'Tap a certificate to enlarge';
    const fio = new IntersectionObserver(([en]) => fan.classList.toggle('is-spread', en.isIntersecting), { threshold: 0.6 });
    fio.observe(fan);
  }

  /* ---------- Contact ---------- */
  const copyBtn = $('.copy-email');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(SITE.email); copyBtn.classList.add('is-done'); setTimeout(() => copyBtn.classList.remove('is-done'), 2400); }
    catch (e) { location.href = `mailto:${SITE.email}`; }
  });
  const form = $('#contact-form'), note = $('.form-note', form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('.field', form).forEach((f) => {
      const inp = $('input, textarea', f); const bad = !inp.value.trim() || (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value));
      f.classList.toggle('is-error', bad); if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Please fill in your name, a valid email and a short message.'; return; }
    const d = Object.fromEntries(new FormData(form));
    note.textContent = 'Opening your email app…';
    location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Portfolio enquiry from ' + d.name)}&body=${encodeURIComponent(d.message + '\n\n' + d.name + ' (' + d.email + ')')}`;
  });

  /* ---------- Clock ---------- */
  const clock = $('.clock');
  const tickClock = () => { clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date()); };
  tickClock(); setInterval(tickClock, 30000);

  /* ---------- Render loop: journey pin, marquees, parallax, progress, timeline, glow ---------- */
  const marquees = [
    ...$$('.logo-track').map((el) => ({ el, dir: -1, speed: 0.35, x: 0 })),
    ...$$('.sm-row').map((row) => ({ el: $('.sm-track', row), dir: +row.dataset.dir, speed: 0.55, x: 0 })),
    ...$$('.bt-track').map((el) => ({ el, dir: -1, speed: 0.6, x: 0 })),
  ];
  marquees.forEach((m) => { m.el.innerHTML += m.el.innerHTML; }); // duplicate for seamless loop
  const parallax = $$('[data-parallax]');
  const progress = $('.progress i');
  const timeline = $('.timeline');
  const journey = $('.journey'), jTrack = $('.journey-track'), jCards = $$('.jt'), jNum = $('.jy-num'), jBar = $('.jy-bar b');
  let lastY = scrollY, vel = 0, jActive = -1;

  const frame = () => {
    const y = scrollY;
    const dy = y - lastY; lastY = y;
    vel = lerp(vel, dy, 0.1);

    // nav stays pinned and clickable at all times; it only compacts after 80px
    nav.classList.toggle('is-compact', y > 80);

    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    // journey: vertical scroll drives the horizontal track
    if (journey && !reduced) {
      const r = journey.getBoundingClientRect();
      const span = r.height - innerHeight;
      const p = clamp(-r.top / (span || 1), 0, 1);
      const dist = Math.max(0, jTrack.scrollWidth - innerWidth);
      jTrack.style.transform = `translate3d(${-p * dist}px,0,0)`;
      jBar.style.transform = `scaleX(${p})`;
      const idx = Math.min(jCards.length - 1, Math.floor(p * jCards.length * 0.999));
      if (idx !== jActive) {
        jActive = idx;
        jCards.forEach((c, i) => c.classList.toggle('is-active', i === idx));
        jNum.textContent = jCards[idx].dataset.year;
      }
    }

    if (!reduced) {
      marquees.forEach((m) => {
        const half = m.el.scrollWidth / 2; if (!half) return;
        m.x += m.dir * (m.speed + Math.abs(vel) * 0.12);
        if (m.x <= -half) m.x += half; if (m.x > 0) m.x -= half;
        m.el.style.transform = `translate3d(${m.x}px,0,0)`;
      });
      parallax.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const c = r.top + r.height / 2 - innerHeight / 2;
        el.style.transform = `translate3d(0, ${c * -(+el.dataset.parallax)}px, 0)`;
      });
      if (finePointer) {
        gpos.x = lerp(gpos.x, mouse.x, 0.08); gpos.y = lerp(gpos.y, mouse.y, 0.08);
        glow.style.transform = `translate3d(${gpos.x}px, ${gpos.y}px, 0)`;
      }
    }
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = clamp((innerHeight * 0.6 - r.top) / r.height, 0, 1);
      timeline.style.setProperty('--tl', `${p * 100}%`);
    }
    if (lenis) lenis.raf(performance.now());
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  if (reduced && jCards.length) { jCards.forEach((c) => c.classList.add('is-active')); jNum.textContent = '2026'; }
})();
