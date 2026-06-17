// ━━━━ DETECT TOUCH / MOBILE ━━━━
const isMobile = /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent) || window.innerWidth <= 900;
const isTouch  = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

// Helper: true se o canvas está oculto via CSS (display:none) ou a aba está em segundo plano.
// Evita rodar requestAnimationFrame/setInterval "no vazio" — principal causa de
// aquecimento/CPU alta no navegador interno do Instagram e em telas < 600px,
// onde #c-net/#c-rain/#c-grid são display:none mas os loops continuavam ativos.
function isCanvasActive(c) {
  return document.visibilityState === 'visible' && c.offsetParent !== null && getComputedStyle(c).display !== 'none';
}

// Debounce: evita reflows/realocações repetidas durante o resize contínuo
// (ex.: barra de endereço do mobile aparecendo/escondendo, redimensionamento de janela).
function debounce(fn, wait) {
  let t = null;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// ━━━━ NAV SCROLL ━━━━
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ━━━━ NEURAL NET BG ━━━━
(()=>{
  const c = document.getElementById('c-net');
  if (!c) return;
  const ctx = c.getContext('2d');
  const particleCount = isMobile ? 55 : 100;
  const linkDistance   = isMobile ? 100 : 130;
  let W, H, pts;

  function init() {
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
    pts = Array.from({ length: particleCount }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * (isMobile ? .25 : .35),
      vy: (Math.random() - .5) * (isMobile ? .25 : .35),
      r:  Math.random() * 2 + .5
    }));
  }

  function draw() {
    if (!isCanvasActive(c)) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59,156,237,.6)';
      ctx.fill();
    });
    if (!isMobile || window.innerWidth > 480) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < linkDistance) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(59,156,237,${.12 * (1 - d / linkDistance)})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(draw);
  }
  init(); draw();
  window.addEventListener('resize', debounce(init, 200), { passive: true });
})();

// ━━━━ CODE RAIN (desktop only) ━━━━
(()=>{
  const c = document.getElementById('c-rain');
  if (!c) return;
  if (isMobile) { c.style.display = 'none'; return; }
  const ctx = c.getContext('2d');
  let W, H, cols, drops;
  const chars = '01ABCDEF</>{}[];()★◆■';
  function init() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    cols = Math.floor(W / 14);
    drops = Array(cols).fill(1);
  }
  function draw(now) {
    requestAnimationFrame(draw);
    if (!isCanvasActive(c)) return;
    if (now - lastT < 55) return;
    lastT = now;
    ctx.fillStyle = 'rgba(1,13,31,.055)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#3B9CED';
    ctx.font = '12px Share Tech Mono';
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y * 14);
      if (y * 14 > H && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    });
  }
  let lastT = 0;
  init(); requestAnimationFrame(draw);
  window.addEventListener('resize', debounce(init, 200), { passive: true });
})();

// ━━━━ PERSPECTIVE GRID ━━━━
(()=>{
  const c = document.getElementById('c-grid');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H;
  function init() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }
  function draw() {
    if (!isCanvasActive(c)) return;
    ctx.clearRect(0, 0, W, H);
    const vp = { x: W / 2, y: H * .55 };
    const rows = isMobile ? 8 : 12;
    const cols = isMobile ? 14 : 20;
    const fz = 800;
    for (let r = 0; r <= rows; r++) {
      const y = H * .55 + (r / rows) * H * .7;
      const scale = fz / (fz + (y - vp.y));
      const xw = W * scale;
      ctx.beginPath();
      ctx.moveTo(vp.x - xw / 2, y);
      ctx.lineTo(vp.x + xw / 2, y);
      ctx.strokeStyle = `rgba(0,80,200,${.15 * scale})`;
      ctx.lineWidth = scale; ctx.stroke();
    }
    for (let col = 0; col <= cols; col++) {
      const t = col / cols;
      const x0 = W * t;
      ctx.beginPath();
      ctx.moveTo(x0, H * .55);
      const steps = isMobile ? 12 : 20;
      for (let s = 0; s <= steps; s++) {
        const r = s / steps;
        const y = H * .55 + r * H * .7;
        const scale = fz / (fz + (y - vp.y));
        const cx = vp.x + (x0 - vp.x) * scale;
        ctx.lineTo(cx, y);
      }
      ctx.strokeStyle = 'rgba(0,80,200,.1)';
      ctx.lineWidth = .5; ctx.stroke();
    }
  }
  init(); draw();
  window.addEventListener('resize', () => { init(); draw(); }, { passive: true });
})();

// ━━━━ HERO 3D TILT (desktop only) ━━━━
const logo3di = document.getElementById('logo3di');
if (logo3di && !isTouch) {
  let tiltRaf = false, tiltX = 0, tiltY = 0;
  document.addEventListener('mousemove', e => {
    tiltX = e.clientX; tiltY = e.clientY;
    if (tiltRaf) return;
    tiltRaf = true;
    requestAnimationFrame(() => {
      const rx = (tiltY / window.innerHeight - .5) * 25;
      const ry = (tiltX / window.innerWidth - .5) * 25;
      logo3di.style.transform = `perspective(600px) rotateX(${-rx}deg) rotateY(${ry}deg)`;
      tiltRaf = false;
    });
  }, { passive: true });
}

// ━━━━ TYPEWRITER ━━━━
const el = document.getElementById('typeEl');
if (el) {
  const phrases = [
    'Especialista em Soluções Digitais',
    'Experiente em E-commerce',
    'Desenvolvedor Full Stack',
    'Designer de Interfaces UI/UX'
  ];
  let pi = 0, ci = 0, del = false;
  function type() {
    const ph = phrases[pi];
    el.innerHTML = ph.slice(0, ci) + '<span class="cursor-blink"></span>';
    if (!del) {
      ci++;
      if (ci > ph.length) { del = true; setTimeout(type, 2000); return; }
    } else {
      ci--;
      if (ci < 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 500); return; }
    }
    setTimeout(type, del ? 40 : 85);
  }
  type();
}

// ━━━━ INTERSECTION OBSERVER ━━━━
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: .1 });

document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * .08 + 's';
  io.observe(el);
});

// ━━━━ SC3D CAROUSEL — pausa fora da viewport ━━━━
// Evita rodar a animação 16s rotateY (com preserve-3d + reflexos com blur)
// quando a seção não está visível, reduzindo GPU/aquecimento em mobile.
(()=>{
  const carousel3d = document.querySelector('.sc3d-carousel');
  if (!carousel3d) return;
  const io3d = new IntersectionObserver(entries => {
    entries.forEach(e => {
      carousel3d.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });
  io3d.observe(carousel3d);
})();

// ━━━━ GLOW BORDERS — pausa fora da viewport ━━━━
// .tcard::before / .pcardx::before / .citem::before / .glow-border-* usam
// conic-gradient animado via @property (gb-spin/rgb-spin), o que força repaint
// contínuo do pseudo-elemento. Pausar quando fora da tela elimina repaints
// desnecessários (causa relevante de aquecimento/CPU alta em mobile),
// sem alterar a aparência enquanto visível.
(()=>{
  const glowSelectors = '.tcard,.pcardx,.citem,.glow-border-card,.glow-border-section';
  const glowEls = document.querySelectorAll(glowSelectors);
  if (!glowEls.length) return;
  const ioGlow = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.classList.toggle('glow-paused', !e.isIntersecting);
    });
  }, { threshold: 0, rootMargin: '50px' });
  glowEls.forEach(el => ioGlow.observe(el));
  // Expõe globalmente para o marquee observar os clones
  window._ioGlow = ioGlow;
})();

// ━━━━ CONTACT FORM ━━━━
function doSend(e) {
  e.preventDefault();
  const btn = document.getElementById('sbtn');
  btn.textContent = '⏳ PROCESSANDO...'; btn.disabled = true;
  const steps = ['VALIDANDO DADOS...', 'CRIPTOGRAFANDO...', 'TRANSMITINDO...', 'RECEBIDO COM SUCESSO!'];
  let si = 0;
  const iv = setInterval(() => {
    if (si >= steps.length - 1) {
      clearInterval(iv);
      btn.textContent = '✅ MENSAGEM ENVIADA!';
      btn.style.background = 'linear-gradient(135deg,#00ff88,#00aa55)';
      setTimeout(() => {
        btn.textContent = '⚡ ENVIAR MENSAGEM';
        btn.style.background = '';
        btn.disabled = false;
        e.target.reset();
        setTimeout(closeContactModal, 1800);
      }, 3500);
    } else { btn.textContent = steps[si]; si++; }
  }, 500);
}

// ━━━━ TILT CARDS (desktop only) ━━━━
if (!isTouch) {
  document.querySelectorAll('.svc-mini,.tcard,.pcard').forEach(card => {
    let tcRaf = false, tcEvent = null;
    card.addEventListener('mousemove', e => {
      tcEvent = e;
      if (tcRaf) return;
      tcRaf = true;
      requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (tcEvent.clientX - r.left) / r.width - .5;
        const y = (tcEvent.clientY - r.top) / r.height - .5;
        const intensity = card.classList.contains('svc-mini') ? 6 : 10;
        const tx = card.classList.contains('svc-mini') ? '6px' : '-10px';
        card.style.transform = `perspective(${card.classList.contains('svc-mini') ? 600 : 900}px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateX(${tx})`;
        tcRaf = false;
      });
    }, { passive: true });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ━━━━ SMOOTH SCROLL ━━━━
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    if (a.classList.contains('open-contact-btn')) return;
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// ━━━━ HAMBURGER MENU ━━━━
const hbg      = document.getElementById('hbg');
const navlinks = document.getElementById('navlinks');
if (hbg && navlinks) {
  const closeMenu = () => {
    hbg.classList.remove('open');
    navlinks.classList.remove('open');
    hbg.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  hbg.addEventListener('click', () => {
    const isOpen = navlinks.classList.toggle('open');
    hbg.classList.toggle('open', isOpen);
    hbg.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (!hbg.contains(e.target) && !navlinks.contains(e.target)) closeMenu();
  });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PORTFOLIO — SCROLL INTERNO NO HOVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(()=>{
  const cards = document.querySelectorAll('.pcardx-frame');
  if (!cards.length) return;

  const SPEED = 220, MIN_DUR = 2.2, MAX_DUR = 9;

  cards.forEach(frame => {
    const scroller = frame.querySelector('.pcardx-scroll');
    const img = scroller && scroller.querySelector('img');
    if (!scroller || !img) return;

    let maxT = 0;
    const measure = () => {
      maxT = Math.max(0, img.getBoundingClientRect().height - frame.clientHeight);
      scroller.style.setProperty('--pdur', Math.min(MAX_DUR, Math.max(MIN_DUR, maxT / SPEED)).toFixed(2) + 's');
    };
    if (img.complete) measure(); else img.addEventListener('load', measure, { once: true });
    window.addEventListener('resize', debounce(measure, 200), { passive: true });

    const enter = () => {
      if (!maxT) measure();
      scroller.classList.add('is-animating');
      void scroller.offsetWidth;
      scroller.style.transform = `translate3d(0,${-maxT}px,0)`;
    };
    const leave = () => {
      scroller.classList.add('is-animating');
      void scroller.offsetWidth;
      scroller.style.transform = 'translate3d(0,0,0)';
    };

    frame.addEventListener('mouseenter', enter);
    frame.addEventListener('mouseleave', leave);
    if (!isTouch) {
      frame.addEventListener('touchstart', enter, { passive: true });
      frame.addEventListener('touchend', leave, { passive: true });
    }
  });
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTACT MODAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const contactModal      = document.getElementById('contact-modal');
const contactModalClose = document.getElementById('cmodal-close');

function openContactModal() {
  if (!contactModal) return;
  contactModal.classList.add('open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const firstInput = contactModal.querySelector('input,textarea,select');
    if (firstInput) firstInput.focus();
  }, 380);
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove('open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-contact-btn').forEach(btn => {
  btn.addEventListener('click', e => { e.preventDefault(); openContactModal(); });
});
if (contactModalClose) contactModalClose.addEventListener('click', closeContactModal);
if (contactModal) {
  contactModal.addEventListener('click', e => { if (e.target === contactModal) closeContactModal(); });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && contactModal?.classList.contains('open')) closeContactModal();
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TESTIMONIALS — INFINITE MARQUEE
   Técnica: clona os cards originais até ter largura >= 2× o track,
   depois anima via CSS custom property --marquee-shift.
   Não reinicia, não trava, não "volta": quando o translateX atinge
   o ponto de shift, o loop CSS reinicia do mesmo ponto visual.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initInfiniteMarquee() {
  const wrap     = document.querySelector('.tcarousel-wrap');
  const carousel = document.getElementById('tcarousel');
  if (!wrap || !carousel) return;

  // Remove dots container (não se aplica ao marquee)
  const dotsEl = document.getElementById('tcarousel-dots');
  if (dotsEl) dotsEl.remove();

  // Remove atributos de lista/role para melhor semântica no novo contexto
  carousel.removeAttribute('role');
  carousel.querySelectorAll('.tcard').forEach(c => {
    c.removeAttribute('role');
    c.removeAttribute('aria-hidden');
  });

  // ── CLONAR ATÉ COBRIR NO MÍNIMO 2× A LARGURA DA JANELA ──────────────
  // Garante que quando o set 1 sai da tela o set 2 já está visível,
  // e o loop anima exatamente 1 set completo (originalWidth + gap entre sets).

  const GAP = 32; // deve coincidir com o gap do .tcarousel (2rem = 32px)

  function buildMarquee() {
    // Remove todos os clones anteriores, mantém apenas os originais
    carousel.querySelectorAll('[data-clone]').forEach(el => el.remove());

    const originals = Array.from(carousel.querySelectorAll('.tcard:not([data-clone])'));
    if (!originals.length) return;

    // Mede o bloco original COMPLETO (cards + gaps internos)
    // = último card (right) - primeiro card (left)
    const firstRect = originals[0].getBoundingClientRect();
    const lastRect  = originals[originals.length - 1].getBoundingClientRect();
    const originalWidth = (lastRect.right - firstRect.left);

    // O "shift" para o loop é exatamente um conjunto de cards + 1 gap de separação
    const shiftPx = originalWidth + GAP;

    // Clonar até ter pelo menos 2× o viewport de largura (+ segurança de 1 set extra)
    const minWidth = window.innerWidth * 2 + shiftPx;
    let totalWidth = shiftPx; // já temos o set original
    while (totalWidth < minWidth) {
      originals.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('data-clone', '1');
        clone.setAttribute('aria-hidden', 'true');
        carousel.appendChild(clone);
      });
      totalWidth += shiftPx;
    }

    // Registra nova largura total para glow observer e tilt (se existir)
    document.querySelectorAll('[data-clone] .glow-border-card, [data-clone].glow-border-card').forEach(el => {
      if (window._ioGlow) window._ioGlow.observe(el);
    });

    // Velocidade: px/s constante → duração proporcional à distância
    const PX_PER_SECOND = 60; // ajuste fino de velocidade (px/s)
    const dur = (shiftPx / PX_PER_SECOND).toFixed(2);

    // Aplica as custom properties no CSS
    carousel.style.setProperty('--marquee-shift', `-${shiftPx}px`);
    carousel.style.setProperty('--marquee-dur',   `${dur}s`);

    // Reinicia a animação sem flash (remove/readd)
    carousel.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    carousel.offsetWidth; // reflow forçado
    carousel.style.animation = '';
  }

  // Constrói na primeira vez após layout estabilizar
  requestAnimationFrame(() => requestAnimationFrame(buildMarquee));

  // Reconstrói no resize (debounced)
  window.addEventListener('resize', debounce(buildMarquee, 250), { passive: true });

  // ── PAUSA: hover + focus (acessibilidade) + touch ───────────────────
  const pause   = () => wrap.style.setProperty('--marquee-play', 'paused');
  const resume  = () => wrap.style.setProperty('--marquee-play', 'running');

  wrap.addEventListener('mouseenter',  pause,  { passive: true });
  wrap.addEventListener('mouseleave',  resume, { passive: true });
  wrap.addEventListener('focusin',     pause,  { passive: true });
  wrap.addEventListener('focusout',    resume, { passive: true });
  wrap.addEventListener('touchstart',  pause,  { passive: true });
  wrap.addEventListener('touchend',    resume, { passive: true });
  wrap.addEventListener('touchcancel', resume, { passive: true });

  // Pausa quando aba fica em segundo plano
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') pause(); else resume();
  });
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SHOWCASE — Card dinâmico de projetos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function showcaseDynamicCard() {
  const projects = [
    { num:'01', cat:'Site institucional', img:'img/kleberpintosite.png', alt:'Kleber Pinto — preview do site', title:'Kleber Pinto', desc:'Site institucional para serviços de química, cabelo e barba.', tags:['HTML','CSS','JS'], url:'https://fabiosill.github.io/hairstylist-website' },
    { num:'02', cat:'Landing Page',       img:'img/sisacleansite.png',   alt:'SISA Clean — preview do site', title:'SISA Clean', desc:'Site limpo e moderno com foco em conversão e identidade visual forte.', tags:['HTML','CSS','UI/UX'], url:'https://fabiosill.github.io/sisa-clean' },
    { num:'03', cat:'E-commerce',         img:'img/leparfragancysite.png', alt:'Le Parfragancy — preview do site', title:'Le Parfragancy', desc:'Loja de perfumaria premium com experiência de compra luxuosa.', tags:['E-commerce','UX','JS'], url:'https://fabiosill.github.io/leparfragancy-web' }
  ];

  const card    = document.getElementById('showcase-card');
  const scNum   = document.getElementById('sc-num');
  const scCat   = document.getElementById('sc-cat');
  const scLink  = document.getElementById('sc-link');
  const scScroll = document.getElementById('sc-scroll');
  const scImg   = document.getElementById('sc-img');
  const scTitle = document.getElementById('sc-title');
  const scDesc  = document.getElementById('sc-desc');
  const scTags  = document.getElementById('sc-tags');
  const scPlink = document.getElementById('sc-plink');
  const dots    = document.querySelectorAll('.sc-dot');

  if (!card || !scNum) return;

  let current = 0, transitioning = false, autoplayTimer = null;
  card.classList.add('sc-visible');

  function bindScrollAnim(frame) {
    const scroller = frame.querySelector('.pcardx-scroll');
    const img = scroller && scroller.querySelector('img');
    if (!scroller || !img) return;

    const SPEED = 220, MIN_DUR = 2.2, MAX_DUR = 9;
    let maxT = 0;
    const measure = () => {
      maxT = Math.max(0, img.getBoundingClientRect().height - frame.clientHeight);
      scroller.style.setProperty('--pdur', Math.min(MAX_DUR, Math.max(MIN_DUR, maxT / SPEED)).toFixed(2) + 's');
    };
    if (img.complete) measure(); else img.addEventListener('load', measure, { once: true });
    window.addEventListener('resize', debounce(measure, 200), { passive: true });

    frame._scEnter = () => {
      if (!maxT) measure();
      scroller.classList.add('is-animating');
      void scroller.offsetWidth;
      scroller.style.transform = `translate3d(0,${-maxT}px,0)`;
    };
    frame._scLeave = () => {
      scroller.classList.add('is-animating');
      void scroller.offsetWidth;
      scroller.style.transform = 'translate3d(0,0,0)';
    };

    frame.addEventListener('mouseenter', frame._scEnter);
    frame.addEventListener('mouseleave', frame._scLeave);
    if (!isTouch) {
      frame.addEventListener('touchstart', frame._scEnter, { passive: true });
      frame.addEventListener('touchend',   frame._scLeave, { passive: true });
    }
  }

  const initialFrame = document.querySelector('#showcase-card .pcardx-frame');
  if (initialFrame) bindScrollAnim(initialFrame);

  function goTo(idx) {
    if (transitioning || idx === current) return;
    transitioning = true;

    card.classList.remove('sc-visible');
    card.classList.add('sc-fading');

    setTimeout(() => {
      const p = projects[idx];
      scNum.textContent  = p.num;
      scCat.textContent  = p.cat;
      scImg.src          = p.img;
      scImg.alt          = p.alt;
      scTitle.textContent = p.title;
      scDesc.textContent  = p.desc;
      scLink.href         = p.url;
      scLink.setAttribute('aria-label', 'Ver ' + p.title + ' ao vivo');
      scPlink.href        = p.url;
      scTags.innerHTML    = p.tags.map(t => `<span class="ptag">${t}</span>`).join('');

      scScroll.classList.remove('is-animating');
      scScroll.style.transform = 'translate3d(0,0,0)';
      current = idx;

      card.classList.remove('sc-fading');
      card.classList.add('sc-visible');

      const frame = card.querySelector('.pcardx-frame');
      if (frame) {
        frame.removeEventListener('mouseenter', frame._scEnter);
        frame.removeEventListener('mouseleave', frame._scLeave);
        if (!isTouch) {
          frame.removeEventListener('touchstart', frame._scEnter);
          frame.removeEventListener('touchend',   frame._scLeave);
        }
        bindScrollAnim(frame);
      }
      transitioning = false;
    }, 230);

    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  const stopAutoplay  = () => { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } };
  const startAutoplay = () => { stopAutoplay(); autoplayTimer = setInterval(() => goTo((current + 1) % projects.length), 5500); };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); });
  });

  card.addEventListener('mouseenter', stopAutoplay);
  card.addEventListener('mouseleave', startAutoplay);
  card.addEventListener('touchstart',  stopAutoplay,  { passive: true });
  card.addEventListener('touchend',    startAutoplay, { passive: true });

  setTimeout(startAutoplay, 1200);

  // Swipe mobile
  const wrapper = document.querySelector('.showcase-card-wrapper');
  if (wrapper && isTouch) {
    let swipeStartX = 0, swipeStartY = 0, swipeLocked = false;

    wrapper.addEventListener('touchstart', e => {
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
      swipeLocked = false;
      stopAutoplay();
    }, { passive: true });

    wrapper.addEventListener('touchmove', e => {
      if (swipeLocked) return;
      const dx = e.touches[0].clientX - swipeStartX;
      const dy = e.touches[0].clientY - swipeStartY;
      const frame = e.target.closest('.pcardx-frame');
      if (frame ? (Math.abs(dy) >= Math.abs(dx) * 0.7) : (Math.abs(dy) > Math.abs(dx))) {
        swipeLocked = true; return;
      }
      if (Math.abs(dx) > 8) e.preventDefault();
    }, { passive: false });

    wrapper.addEventListener('touchend', e => {
      if (swipeLocked) { startAutoplay(); return; }
      const dx = e.changedTouches[0].clientX - swipeStartX;
      if (dx < -40) goTo((current + 1) % projects.length);
      else if (dx > 40) goTo((current - 1 + projects.length) % projects.length);
      startAutoplay();
    }, { passive: true });
  }
})();