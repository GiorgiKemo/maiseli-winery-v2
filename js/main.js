/* Maiseli Winery — interactions & motion */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger && window.SplitText);
  if (reduced) root.classList.add('reduced');
  if (hasGsap && !reduced) root.classList.add('js');
  if (hasGsap) gsap.registerPlugin(ScrollTrigger, SplitText);

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } }
  };

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------------
     Smooth scroll
  ------------------------------------------------------------------ */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const lockScroll = on => {
    document.body.classList.toggle('is-locked', on);
    if (lenis) on ? lenis.stop() : lenis.start();
  };
  const scrollToTarget = target => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
    else (typeof target === 'number' ? window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' }) : target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }));
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    closeMenu();
    if (a.dataset.go) setFilter(a.dataset.go);
    scrollToTarget(target);
  });

  /* ------------------------------------------------------------------
     Magnetic buttons (native cursor is used throughout)
  ------------------------------------------------------------------ */
  if (finePointer && hasGsap && !reduced) {
    $$('[data-magnetic]').forEach(el => {
      const mx = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1,.4)' });
      const my = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1,.4)' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * .3);
        my((e.clientY - r.top - r.height / 2) * .4);
      });
      el.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  /* ------------------------------------------------------------------
     Navigation
  ------------------------------------------------------------------ */
  const nav = $('[data-nav]');
  const burger = $('.nav__burger');
  const menu = $('#menu');
  function closeMenu() {
    if (!root.classList.contains('menu-open')) return;
    root.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    lockScroll(false);
  }
  burger.addEventListener('click', () => {
    const open = !root.classList.contains('menu-open');
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    lockScroll(open);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  let lastY = 0;
  const onScrollNav = () => {
    const y = window.scrollY;
    const heroH = $('.hero').offsetHeight;
    nav.classList.toggle('is-solid', y > heroH - 120);
    nav.classList.toggle('is-hidden', y > heroH && y > lastY + 4 && !root.classList.contains('menu-open'));
    if (y < lastY - 4 || y < heroH) nav.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', onScrollNav, { passive: true });

  // active section link
  const navLinks = $$('.nav__links a');
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['wines', 'story', 'vineyard', 'winemaking', 'homeland', 'cellar'].forEach(id => { const s = document.getElementById(id); if (s) sectionObs.observe(s); });

  // progress bar
  const bar = $('.progress span');
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  }, { passive: true });

  /* ------------------------------------------------------------------
     Hi-res image upgrade
  ------------------------------------------------------------------ */
  const upgrade = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const img = en.target;
      const hi = new Image();
      hi.onload = () => { img.src = img.dataset.src; };
      hi.src = img.dataset.src;
      upgrade.unobserve(img);
    });
  }, { rootMargin: '600px' });
  if (innerWidth > 700) $$('img[data-src]').forEach(img => upgrade.observe(img));

  /* ------------------------------------------------------------------
     Wines
  ------------------------------------------------------------------ */
  const WINES = window.MAISELI_WINES || [];
  const COLS = window.MAISELI_COLLECTIONS || {};

  let svgUid = 0;
  function bottleSVG(w) {
    const gid = `gl-${w.id}-${++svgUid}`;
    // Illustrated stand-in for the one wine whose bottle photograph was not supplied
    return `<svg class="bottle-svg" viewBox="0 0 280 1100" role="img" aria-label="${w.name}, French Oak — bottle photograph coming soon">
      <defs><linearGradient id="${gid}" x1="0" x2="1"><stop offset="0" stop-color="#0d0507"/><stop offset=".22" stop-color="#2a1116"/><stop offset=".3" stop-color="#4a2a2e"/><stop offset=".42" stop-color="#1a0a0d"/><stop offset="1" stop-color="#070203"/></linearGradient></defs>
      <rect x="112" y="10" width="56" height="120" rx="8" fill="#d6862f"/>
      <path d="M116 120h48v150c0 60 100 110 100 200v600c0 12-8 20-20 20H36c-12 0-20-8-20-20V470c0-90 100-140 100-200z" fill="url(#${gid})"/>
      <rect x="28" y="600" width="224" height="330" fill="#f1e8d8"/>
      <g fill="none" stroke="#b39a92" stroke-width="3"><path d="M118 720v-60a22 22 0 0 1 44 0v60"/><path d="M126 690h28M126 700h28M126 680h28"/></g>
      <text x="140" y="752" text-anchor="middle" font-size="22" letter-spacing="8" fill="#7d6660">MAISELI</text>
      <text x="140" y="800" text-anchor="middle" font-size="19" letter-spacing="3" fill="#2a1a1c">RKATSITELI QVEVRI</text>
      <text x="140" y="826" text-anchor="middle" font-size="16" letter-spacing="3" fill="#2a1a1c">FRENCH OAK</text>
      <text x="140" y="890" text-anchor="middle" font-size="15" font-style="italic" fill="#8b7a6c">bottle photo coming soon</text>
    </svg>`;
  }
  const bottleMarkup = (w, cls = '') => w.img
    ? `<img src="${w.img}" alt="${w.placeholder ? `${w.sub} — bottle photograph coming soon` : `${w.name} ${w.vintage || ''} bottle`}" class="${cls}" draggable="false">`
    : bottleSVG(w);

  const stage = $('.stage');
  const rail = $('.rail');
  const stageImg = $('.stage__img');
  const ghost = $('.stage__ghost span');
  const info = {
    col: $('.stage__collection'), name: $('.stage__name'), sub: $('.stage__sub'),
    facts: $('.stage__facts'), desc: $('.stage__desc'), idx: $('.stage__idx'), total: $('.stage__total')
  };
  let current = 0;
  let filter = 'all';

  const factsHTML = w => [
    ['Vintage', w.vintage || '—'],
    ['Alcohol', w.abv || '—'],
    ['Grape', w.grape]
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');

  rail.innerHTML = WINES.map((w, i) => `
    <button class="rail__item" role="listitem" data-i="${i}" data-col="${w.collection}" aria-label="${w.name} — ${w.sub}">
      ${bottleMarkup(w)}
      <b>${w.name}</b><small>${w.sub}</small>
    </button>`).join('');
  const railItems = $$('.rail__item', rail);

  const visibleList = () => WINES.map((w, i) => i).filter(i => filter === 'all' || WINES[i].collection === filter);

  // instant parts: counter, active thumbnail, colour — respond the moment a wine is chosen
  function renderMeta(w, i) {
    const list = visibleList();
    info.idx.textContent = String(list.indexOf(i) + 1).padStart(2, '0');
    info.total.textContent = String(list.length).padStart(2, '0');
    stage.style.setProperty('--hue', w.hue);
    stage.style.setProperty('--glow', w.glow);
    railItems.forEach(r => r.classList.toggle('is-active', +r.dataset.i === i));
  }

  function renderInfo(w, i) {
    info.col.textContent = (COLS[w.collection] || {}).name || '';
    info.name.textContent = w.name;
    info.sub.textContent = w.sub;
    info.facts.innerHTML = factsHTML(w);
    info.desc.textContent = w.desc;
    ghost.textContent = w.grape;
    renderMeta(w, i);
  }

  // Transitions are interruptible: a new choice takes over from wherever the last one is,
  // and rapid choices play faster so browsing never waits on an animation.
  let stageTl = null;
  let lastSelect = 0;
  function select(i, dir = 1, instant = false) {
    const w = WINES[i];
    const leaving = [...stageImg.children].filter(el => !el.classList.contains('is-leaving'));
    current = i;
    stageImg.insertAdjacentHTML('beforeend', bottleMarkup(w));
    const nextEl = stageImg.lastElementChild;

    if (instant || !hasGsap || reduced) {
      [...stageImg.children].forEach(el => { if (el !== nextEl) el.remove(); });
      renderInfo(w, i);
      return;
    }

    const now = performance.now();
    const rushed = (stageTl && stageTl.isActive()) || now - lastSelect < 900;
    lastSelect = now;
    const speed = rushed ? 1.8 : 1;
    if (stageTl) stageTl.kill();
    renderMeta(w, i);

    // outgoing bottles leave from their current position, independent of the timeline
    leaving.forEach(el => {
      el.classList.add('is-leaving');
      gsap.to(el, { xPercent: -140 * dir, rotation: -14 * dir, opacity: 0, duration: .7 / speed, ease: 'power3.in', overwrite: true, onComplete: () => el.remove() });
    });

    // when rushed, the next wine arrives almost at once so the stage is never empty
    const inAt = rushed ? .12 : .45;
    const texts = [info.col, info.name, info.sub, info.facts, info.desc];
    stageTl = gsap.timeline();
    stageTl.to(texts, { y: -20, opacity: 0, duration: rushed ? .12 : .35, stagger: rushed ? .01 : .03, ease: 'power2.in', overwrite: true }, 0)
      .to(ghost, { opacity: 0, x: -80 * dir, duration: rushed ? .12 : .4, overwrite: true }, 0)
      .add(() => renderInfo(w, i), inAt)
      .fromTo(nextEl, { xPercent: 140 * dir, rotation: 14 * dir, opacity: 0 }, { xPercent: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, rushed ? 0 : inAt)
      .fromTo(texts, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .06, ease: 'power3.out' }, inAt + .05)
      .fromTo(ghost, { opacity: 0, x: 80 * dir }, { opacity: 1, x: 0, duration: 1.2, ease: 'expo.out' }, inAt + .05);
    stageTl.timeScale(speed);
  }

  function step(d) {
    const list = visibleList();
    let pos = list.indexOf(current);
    pos = (pos + d + list.length) % list.length;
    select(list[pos], d);
  }

  $('.stage__arrow--prev').addEventListener('click', () => step(-1));
  $('.stage__arrow--next').addEventListener('click', () => step(1));
  rail.addEventListener('click', e => {
    const b = e.target.closest('.rail__item');
    if (!b) return;
    const i = +b.dataset.i;
    if (filter !== 'all' && WINES[i].collection !== filter) setFilter('all', false);
    if (i !== current) select(i, i > current ? 1 : -1);
    if (innerWidth < 960) scrollToTarget(stage);
  });
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  stage.tabIndex = 0;
  stage.setAttribute('aria-label', 'Wine showcase — use arrow keys to browse');

  // drag / swipe
  let sx = null, sy = null;
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    sx = e.clientX; sy = e.clientY;
    stage.classList.add('is-dragging');
  });
  addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    sx = null;
    stage.classList.remove('is-dragging');
  });
  addEventListener('pointercancel', () => { sx = null; stage.classList.remove('is-dragging'); });

  // 3D tilt
  if (finePointer && hasGsap && !reduced) {
    const rx = gsap.quickTo(stageImg, 'rotationY', { duration: .8, ease: 'power3' });
    const ry = gsap.quickTo(stageImg, 'rotationX', { duration: .8, ease: 'power3' });
    const tx = gsap.quickTo(ghost, 'xPercent', { duration: 1.2, ease: 'power3' });
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      rx(px * 22); ry(-py * 8); tx(-px * 6);
    });
    stage.addEventListener('pointerleave', () => { rx(0); ry(0); tx(0); });
  }

  // tabs
  const tabs = $$('.tabs button');
  const pill = $('.tabs__pill');
  function movePill() {
    const sel = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    if (!sel || !pill) return;
    pill.style.width = sel.offsetWidth + 'px';
    pill.style.transform = `translateX(${sel.offsetLeft}px)`;
  }
  function setFilter(f, jump = true) {
    filter = f;
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.filter === f)));
    movePill();
    railItems.forEach(r => r.classList.toggle('is-dim', f !== 'all' && r.dataset.col !== f));
    if (jump) {
      const list = visibleList();
      if (!list.includes(current)) select(list[0], 1);
      else renderInfo(WINES[current], current);
    }
  }
  tabs.forEach(t => t.addEventListener('click', () => setFilter(t.dataset.filter)));
  addEventListener('resize', movePill);
  document.fonts && document.fonts.ready.then(movePill);

  select(0, 1, true);

  // detail dialog
  const dialog = $('.detail');
  $('.stage__more').addEventListener('click', () => openDetail(WINES[current]));
  function openDetail(w) {
    const col = COLS[w.collection] || {};
    $('.detail__collection', dialog).textContent = col.name || '';
    $('.detail__name', dialog).textContent = w.name;
    $('.detail__sub', dialog).textContent = w.sub;
    $('.detail__img', dialog).innerHTML = bottleMarkup(w);
    const facts = [['Vintage', w.vintage || 'To be confirmed'], ['Alcohol', w.abv || 'To be confirmed'], ['Grape', w.grape], ['Production', w.placeholder ? 'To be confirmed' : 'Hand-crafted limited run of 1,500 bottles']];
    $('.detail__facts', dialog).innerHTML = facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('.detail__desc', dialog).textContent = w.desc;
    $('.detail__coll', dialog).textContent = col.text || '';
    const vis = $('.detail__visual', dialog);
    vis.style.setProperty('--hue', w.hue);
    vis.style.setProperty('--glow', w.glow);
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');    lockScroll(true);
    if (hasGsap && !reduced) gsap.fromTo($('.detail__img', dialog), { y: 80, rotation: 8, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: .1 });
  }
  $('.detail__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => lockScroll(false));

  /* ------------------------------------------------------------------
     Varieties hover image
  ------------------------------------------------------------------ */
  const floatBox = $('.varieties__float');
  if (finePointer && hasGsap && floatBox) {
    const floatImg = $('img', floatBox);
    const fx = gsap.quickTo(floatBox, 'x', { duration: .7, ease: 'power3' });
    const fy = gsap.quickTo(floatBox, 'y', { duration: .7, ease: 'power3' });
    const list = $('.varieties__list');
    const wrap = $('.varieties');
    list.addEventListener('pointermove', e => {
      const r = wrap.getBoundingClientRect();
      fx(e.clientX - r.left - 140); fy(e.clientY - r.top - 190);
    });
    $$('li', list).forEach(li => li.addEventListener('pointerenter', () => {
      floatImg.src = li.dataset.img;
      gsap.to(floatBox, { opacity: 1, scale: 1, rotation: gsap.utils.random(-6, 6), duration: .6, ease: 'expo.out' });
    }));
    list.addEventListener('pointerleave', () => gsap.to(floatBox, { opacity: 0, scale: .6, duration: .5, ease: 'power3' }));
  }

  /* ------------------------------------------------------------------
     Hero dust particles
  ------------------------------------------------------------------ */
  function dust() {
    const c = $('.hero__dust');
    if (!c || reduced) return;
    const ctx = c.getContext('2d');
    let w, h, dpr, parts = [], running = true;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.offsetWidth; h = c.offsetHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, w / 16));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + .4,
        vy: -(Math.random() * .35 + .08), vx: (Math.random() - .5) * .2, p: Math.random() * Math.PI * 2
      }));
    };
    resize();
    addEventListener('resize', resize);
    new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) requestAnimationFrame(tick); }).observe(c);
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx + Math.sin(p.p) * .15; p.y += p.vy; p.p += .012;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const a = .35 + Math.sin(p.p * 3) * .3;
        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 206, 140, ${Math.max(a, .05)})`;
        ctx.shadowColor = 'rgba(240, 190, 110, .9)'; ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------
     Motion (GSAP)
  ------------------------------------------------------------------ */
  let heroIntro = null;

  function buildHeroIntro() {
    if (!hasGsap || reduced) return null;
    const split = SplitText.create('.hero__title', { type: 'lines,words,chars', mask: 'lines', linesClass: 'sl' });
    const tl = gsap.timeline({ paused: true });
    tl.from('.hero__media img', { scale: 1.35, duration: 2.6, ease: 'expo.out' }, 0)
      .from(split.chars, { yPercent: 120, rotation: 10, opacity: 0, duration: 1.3, stagger: .022, ease: 'expo.out' }, .15)
      .from('.hero__eyebrow', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, .3)
      .from('.hero__script', { clipPath: 'inset(-1em 130% -1em -1em)', duration: 1.6, ease: 'power2.inOut' }, .8)
      .from('.hero__actions > *', { y: 30, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out' }, 1)
      .from('.hero__ka', { opacity: 0, x: 80, duration: 2, ease: 'expo.out' }, .4)
      .from('.hero__meta, .hero__scroll', { opacity: 0, duration: 1 }, 1.3)
      .from(nav, { opacity: 0, duration: 1.1, ease: 'power2.out', clearProps: 'opacity' }, .6);
    return tl;
  }

  function motion() {
    if (!hasGsap || reduced) return;

    // hero scroll-out
    gsap.to('.hero__media img', { yPercent: 18, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__content', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true } });
    gsap.to('.hero__ka', { xPercent: -25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    // gentle ken burns + pointer parallax
    gsap.to('.hero__media', { scale: 1.06, duration: 16, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (finePointer) {
      const hx = gsap.quickTo('.hero__media', 'x', { duration: 1.4, ease: 'power3' });
      const hy = gsap.quickTo('.hero__media', 'y', { duration: 1.4, ease: 'power3' });
      $('.hero').addEventListener('pointermove', e => { hx((e.clientX / innerWidth - .5) * -24); hy((e.clientY / innerHeight - .5) * -16); });
    }

    // velocity marquee
    const track = $('.marquee__track');
    const loop = gsap.to(track, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
    let skewTo = gsap.quickTo(track, 'skewX', { duration: .5, ease: 'power3' });
    ScrollTrigger.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate: self => {
        const v = self.getVelocity();
        const dir = self.direction;
        gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 300, 5)), duration: .2, overwrite: true, onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1 }) });
        skewTo(gsap.utils.clamp(-8, 8, v / -300));
      }
    });

    // generic reveals
    $$('.reveal').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
    $$('.reveal-lines').forEach(el => {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'sl', autoSplit: true,
        onSplit: self => gsap.from(self.lines, { yPercent: 110, duration: 1.3, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
      });
    });

    // wine stage entrance
    gsap.from('.stage', { clipPath: 'inset(12% 8% 12% 8% round 200px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.stage', start: 'top 80%' } });
    gsap.from('.rail__item', { y: 60, opacity: 0, duration: 1, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '.rail', start: 'top 92%' } });

    // pull quote word fill
    const pq = SplitText.create('.pull__text', { type: 'words', wordsClass: 'w' });
    gsap.to(pq.words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.pull', start: 'top 80%', end: 'bottom 45%', scrub: true } });

    // story
    gsap.fromTo('.story__year span', { yPercent: 30, scale: .9 }, { yPercent: -10, scale: 1, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
    $$('.story__img').forEach((fig, i) => {
      gsap.fromTo($('img', fig), { scale: 1.3, yPercent: -8 }, { scale: 1.05, yPercent: 8, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to(fig, { yPercent: i ? -18 : 6, ease: 'none', scrollTrigger: { trigger: '.story__grid', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 961px)', () => {
      // May — title plays on entry, then the two moments slide in while pinned
      const maySplit = SplitText.create('.may__title', { type: 'words,chars', mask: 'words', wordsClass: 'sw' });
      gsap.timeline({ scrollTrigger: { trigger: '.may', start: 'top 65%' } })
        .from('.may__word', { scale: 1.5, opacity: 0, duration: 2, ease: 'expo.out' }, 0)
        .from(maySplit.chars, { yPercent: 110, duration: 1.2, stagger: .025, ease: 'expo.out' }, .1)
        .from('.may__center .eyebrow, .may__text', { opacity: 0, y: 30, stagger: .12, duration: 1, ease: 'power3.out' }, .5);
      gsap.timeline({ scrollTrigger: { trigger: '.may__pin', start: 'top top', end: '+=120%', pin: true, scrub: 1 } })
        .fromTo('.may__side--past', { xPercent: -170, yPercent: -30, rotation: -14 }, { xPercent: 0, yPercent: -50, rotation: -4, duration: 1 }, 0)
        .fromTo('.may__side--future', { xPercent: 170, yPercent: -70, rotation: 14 }, { xPercent: 0, yPercent: -50, rotation: 4, duration: 1 }, 0)
        .to('.may__word', { scale: .85, opacity: .5, duration: 1 }, 0)
        .to('.may__center', { scale: .96, duration: 1 }, 0);

      // Vineyard — arch window opens to full bleed, then the caption rises
      gsap.timeline({ scrollTrigger: { trigger: '.vineyard__hero', start: 'top top', end: 'bottom bottom', scrub: true } })
        .to('.vineyard__media', { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'power1.inOut', duration: 1 }, 0)
        .to('.vineyard__media > img', { scale: 1, ease: 'none', duration: 1.4 }, 0)
        .fromTo('.vineyard__caption > *', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: .12, duration: .5, ease: 'power2.out' }, .75);

      // Winemaking — stacked cards recede
      const cards = $$('.card');
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card, { scale: .9 + i * .02, opacity: .45, filter: 'blur(2px)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 20%', scrub: true } });
      });

      // Homeland — horizontal journey
      const trackH = $('.homeland__track');
      const dist = () => trackH.scrollWidth - innerWidth;
      const horiz = gsap.to(trackH, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.homeland__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
      gsap.to('.homeland__line span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.homeland__pin', start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true } });
      $$('.era').forEach(era => {
        gsap.from(era, { y: 80, opacity: 0, rotation: 3, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: era, containerAnimation: horiz, start: 'left 90%' } });
        const img = $('img', era);
        if (img) gsap.fromTo(img, { xPercent: -10, scale: 1.25 }, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: era, containerAnimation: horiz, start: 'left right', end: 'right left', scrub: true } });
      });

      return () => maySplit.revert();
    });

    mm.add('(max-width: 960px)', () => {
      gsap.from('.may__side', { y: 60, opacity: 0, stagger: .15, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.may__side', start: 'top 90%' } });
      gsap.timeline({ scrollTrigger: { trigger: '.vineyard__hero', start: 'top top', end: 'bottom bottom', scrub: true } })
        .to('.vineyard__media', { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'none', duration: 1 }, 0)
        .to('.vineyard__media > img', { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo('.vineyard__caption > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .4 }, .6);
      $$('.era').forEach(era => gsap.from(era, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: era, start: 'top 90%' } }));
    });

    // stats counters
    $$('[data-count]').forEach(el => {
      const end = +el.dataset.count;
      const o = { v: end > 1000 ? 1800 : 0 };
      gsap.to(o, { v: end, duration: 2.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => { el.textContent = Math.round(o.v); } });
    });

    // harvest columns parallax
    $$('.harvest__col').forEach(col => {
      const s = parseFloat(col.dataset.speed) || 0;
      gsap.fromTo(col, { yPercent: -s * 100 }, { yPercent: s * 100, ease: 'none', scrollTrigger: { trigger: '.harvest', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // varieties
    gsap.from('.varieties__list li', { y: 80, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.varieties__list', start: 'top 85%' } });

    // card images
    $$('.card__img img').forEach(img => gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // Cellar — zoom through the grid
    const others = $$('.cg:not(.cg--main)');
    const main = $('.cg--main');
    const grid = $('.cellar__grid');
    gsap.fromTo('.cg img', { opacity: 0, scale: 1.25, yPercent: 12 }, { opacity: 1, scale: 1, yPercent: 0, ease: 'power2.out', stagger: { each: .04, from: 'center' }, scrollTrigger: { trigger: '.cellar', start: 'top 95%', end: 'top 5%', scrub: 1 } });
    const cellar = gsap.timeline({ scrollTrigger: { trigger: '.cellar__pin', start: 'top top', end: '+=240%', pin: true, scrub: 1.2, invalidateOnRefresh: true } });
    cellar.to(main, {
      scale: () => Math.max(innerWidth / main.offsetWidth, innerHeight / main.offsetHeight) * 1.02,
      borderRadius: 0, ease: 'power2.inOut', duration: 1
    }, 0)
      .to(others, {
        x: i => (others[i].offsetLeft + others[i].offsetWidth / 2 - grid.offsetWidth / 2) * 1.2,
        y: i => (others[i].offsetTop + others[i].offsetHeight / 2 - grid.offsetHeight / 2) * 1.2,
        scale: 1.3, opacity: 0, ease: 'power2.in', duration: 1
      }, 0)
      .to(main, { '--shade': 1, duration: .3 }, .7)
      .to('.cellar__copy', { opacity: 1, y: 0, duration: .35 }, .75)
      .from('.cellar__script', { clipPath: 'inset(-1em 130% -1em -1em)', duration: .4 }, .78);
    gsap.set('.cellar__copy', { y: 40 });

    // footer word
    gsap.from('.footer__word span', { yPercent: 100, duration: 1.4, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '.footer__word', start: 'top 95%' } });
    gsap.from('.footer__title', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 80%' } });

    // refresh once late images/fonts settle (debounced for lazy images)
    let refreshT;
    document.addEventListener('load', e => { if (e.target.tagName === 'IMG') { clearTimeout(refreshT); refreshT = setTimeout(() => ScrollTrigger.refresh(), 200); } }, true);
    addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ------------------------------------------------------------------
     Loader → age gate → intro
  ------------------------------------------------------------------ */
  const loader = $('.loader');
  const gate = $('.gate');

  function startSite() {
    document.body.classList.remove('is-loading');
    lockScroll(false);
    if (heroIntro) heroIntro.play();
    if (hasGsap) ScrollTrigger.refresh();
  }

  function showGate() {
    if (store.get('maiseli-age') === 'yes') { startSite(); return; }
    gate.hidden = false;
    lockScroll(true);
    if (hasGsap && !reduced) gsap.from('.gate__card', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out' });
    $('[data-gate="yes"]', gate).focus();
    gate.addEventListener('click', e => {
      const b = e.target.closest('[data-gate]');
      if (!b) return;
      if (b.dataset.gate === 'yes') {
        store.set('maiseli-age', 'yes');
        const done = () => { gate.hidden = true; startSite(); };
        if (hasGsap && !reduced) gsap.to(gate, { opacity: 0, duration: .7, ease: 'power2.inOut', onComplete: done });
        else done();
      } else if (!$('.gate__denied', gate)) {
        $('.gate__card', gate).insertAdjacentHTML('beforeend', '<p class="gate__denied">We look forward to welcoming you when the time is right.</p>');
      }
    });
  }

  async function runLoader() {
    // split text only once web fonts are in, so line breaks are measured correctly
    if (document.fonts) await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]);
    heroIntro = buildHeroIntro();
    motion();
    dust();
    if (!hasGsap || reduced) { loader.remove(); showGate(); return; }

    const yearEl = $('.loader__year');
    const now = new Date().getFullYear();
    const heroImg = $('.hero__media img');
    const imgReady = new Promise(res => { if (heroImg.complete) res(); else { heroImg.onload = res; heroImg.onerror = res; } setTimeout(res, 4000); });
    const counter = { y: 1908 };

    const tl = gsap.timeline();
    tl.to('.loader__arch path', { strokeDashoffset: 0, duration: 1.8, stagger: .12, ease: 'power2.inOut' }, 0)
      .from('.loader__word', { letterSpacing: '1.4em', opacity: 0, duration: 1.6, ease: 'expo.out' }, .2)
      .to('.loader__bar span', { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
      .to(counter, { y: now, duration: 2.2, ease: 'power2.inOut', onUpdate: () => { yearEl.textContent = Math.round(counter.y); } }, 0);

    Promise.all([imgReady, new Promise(r => tl.eventCallback('onComplete', r))]).then(() => {
      gsap.timeline({ onComplete: () => { loader.remove(); } })
        .to('.loader__inner', { opacity: 0, y: -30, duration: .6, ease: 'power2.in' })
        .to('.loader__panel--top', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, .4)
        .to('.loader__panel--bottom', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, .4)
        .add(showGate, .9);
    });
  }

  runLoader();
})();
