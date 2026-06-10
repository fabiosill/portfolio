// ━━━━ DETECT TOUCH / MOBILE ━━━━
const isMobile = /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent) || window.innerWidth <= 900;
const isTouch  = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

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
  window.addEventListener('resize', init, { passive: true });
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
  function draw() {
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
  init(); setInterval(draw, 55);
  window.addEventListener('resize', init, { passive: true });
})();

// ━━━━ PERSPECTIVE GRID ━━━━
(()=>{
  const c = document.getElementById('c-grid');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, off = 0;
  const speed = isMobile ? .2 : .3;
  function init() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    off = (off + speed) % 60;
    const vp = { x: W / 2, y: H * .55 };
    const rows = isMobile ? 8 : 12;
    const cols = isMobile ? 14 : 20;
    const fz = 800;
    for (let r = 0; r <= rows; r++) {
      const y = H * .55 + ((r / rows) * H * .7 + off * 4) - off * 4;
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
    requestAnimationFrame(draw);
  }
  init(); draw();
  window.addEventListener('resize', init, { passive: true });
})();

// ━━━━ HERO 3D TILT (desktop only) ━━━━
const logo3di = document.getElementById('logo3di');
if (logo3di && !isTouch) {
  document.addEventListener('mousemove', e => {
    const rx = (e.clientY / window.innerHeight - .5) * 25;
    const ry = (e.clientX / window.innerWidth - .5) * 25;
    logo3di.style.transform = `perspective(600px) rotateX(${-rx}deg) rotateY(${ry}deg)`;
  });
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
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      const intensity = card.classList.contains('svc-mini') ? 6 : 10;
      const tx = card.classList.contains('svc-mini') ? '6px' : '-10px';
      card.style.transform = `perspective(${card.classList.contains('svc-mini') ? 600 : 900}px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) translateX(${tx})`;
    });
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
    window.addEventListener('resize', measure, { passive: true });

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
   TESTIMONIALS — CARROSSEL AUTOMÁTICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function testimonialCarousel() {
  const carousel = document.getElementById('tcarousel');
  const dotsContainer = document.getElementById('tcarousel-dots');
  if (!carousel) return;

  const TOTAL_REAL = 3;
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.tdot') : [];
  let cardW = 0, gap = 0, currentIdx = 0, autoTimer = null;
  let isDragging = false, startX = 0, startOffset = 0, transitioning = false;

  function getCardWidth() {
    const card = carousel.querySelector('.tcard');
    if (!card) return 340;
    gap = parseFloat(window.getComputedStyle(carousel).gap) || 32;
    return card.offsetWidth;
  }

  function goTo(idx, animate = true) {
    cardW = getCardWidth();
    currentIdx = idx;
    carousel.style.transition = animate ? 'transform 0.6s cubic-bezier(.23,1,.32,1)' : 'none';
    carousel.style.transform = `translateX(${-(currentIdx * (cardW + gap))}px)`;
    const realIdx = currentIdx % TOTAL_REAL;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === realIdx);
      d.setAttribute('aria-selected', String(i === realIdx));
    });
  }

  function next() {
    if (transitioning) return;
    const nextIdx = currentIdx + 1;
    goTo(nextIdx);
    if (nextIdx >= TOTAL_REAL) {
      transitioning = true;
      setTimeout(() => { goTo(nextIdx % TOTAL_REAL, false); transitioning = false; }, 680);
    }
  }

  function startAuto() { stopAuto(); autoTimer = setInterval(next, 4000); }
  function stopAuto()  { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  carousel.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startOffset = currentIdx * (getCardWidth() + gap);
    isDragging = true; stopAuto();
  }, { passive: true });
  carousel.addEventListener('touchmove', e => {
    if (!isDragging) return;
    carousel.style.transition = 'none';
    carousel.style.transform = `translateX(${-(startOffset - (e.touches[0].clientX - startX))}px)`;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50) next();
    else if (dx > 50 && currentIdx > 0) goTo(currentIdx - 1);
    else goTo(currentIdx);
    startAuto();
  }, { passive: true });

  setTimeout(() => { goTo(0, false); startAuto(); }, 300);
  window.addEventListener('resize', () => goTo(currentIdx, false), { passive: true });
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
    window.addEventListener('resize', measure, { passive: true });

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