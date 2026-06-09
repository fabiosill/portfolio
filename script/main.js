// ━━━━ DETECT TOUCH / MOBILE ━━━━
const isMobile = /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent) || window.innerWidth <= 900;
const isTouch  = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;


// ━━━━ NAV SCROLL ━━━━
// [MODIFICADO] STT removido — apenas controla classe 'scrolled' da nav
const nav = document.getElementById('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', s > 50);
  lastScroll = s;
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

// ━━━━ CODE RAIN (disabled on mobile for performance) ━━━━
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
    if (!del) {
      el.innerHTML = ph.slice(0, ci) + '<span class="cursor-blink"></span>';
      ci++;
      if (ci > ph.length) { del = true; setTimeout(type, 2000); return; }
    } else {
      el.innerHTML = ph.slice(0, ci) + '<span class="cursor-blink"></span>';
      ci--;
      if (ci < 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 500); return; }
    }
    setTimeout(type, del ? 40 : 85);
  }
  type();
}

// ━━━━ INTERSECTION OBSERVER ━━━━
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
    }
  });
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
        // Fechar o modal após sucesso
        setTimeout(closeContactModal, 1800);
      }, 3500);
    } else { btn.textContent = steps[si]; si++; }
  }, 500);
}

// ━━━━ TILT CARDS (desktop only) ━━━━
if (!isTouch) {
  document.querySelectorAll('.svc,.tcard,.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


// ━━━━ SMOOTH SCROLL ━━━━
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    // Não executar scroll se for o botão de contato (handled separately)
    if (a.classList.contains('open-contact-btn')) return;
    e.preventDefault();
    const t = document.querySelector(href);
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// ━━━━ HAMBURGER MENU ━━━━
const hbg      = document.getElementById('hbg');
const navlinks = document.getElementById('navlinks');
if (hbg && navlinks) {
  hbg.addEventListener('click', () => {
    hbg.classList.toggle('open');
    navlinks.classList.toggle('open');
    document.body.style.overflow = navlinks.classList.contains('open') ? 'hidden' : '';
  });
  navlinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hbg.classList.remove('open');
      navlinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', e => {
    if (!hbg.contains(e.target) && !navlinks.contains(e.target)) {
      hbg.classList.remove('open');
      navlinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ━━━━ CSS INJECTIONS ━━━━
const s = document.createElement('style');
s.textContent = `@keyframes rs{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
document.head.appendChild(s);


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PORTFOLIO — SCROLL INTERNO NO HOVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(() => {
  const cards = document.querySelectorAll('.pcardx-frame');
  if (!cards.length) return;

  const SPEED_PX_PER_SEC = 220;
  const MIN_DURATION = 2.2;
  const MAX_DURATION = 9;

  cards.forEach(frame => {
    const scroller = frame.querySelector('.pcardx-scroll');
    const img = scroller && scroller.querySelector('img');
    if (!scroller || !img) return;

    let maxTranslate = 0;

    const measure = () => {
      const frameH = frame.clientHeight;
      const imgH = img.getBoundingClientRect().height;
      maxTranslate = Math.max(0, imgH - frameH);
      const duration = Math.min(
        MAX_DURATION,
        Math.max(MIN_DURATION, maxTranslate / SPEED_PX_PER_SEC)
      );
      scroller.style.setProperty('--pdur', duration.toFixed(2) + 's');
    };

    if (img.complete) measure();
    else img.addEventListener('load', measure, { once: true });
    window.addEventListener('resize', measure);

    const enter = () => {
      if (!maxTranslate) measure();
      scroller.classList.add('is-animating');
      void scroller.offsetWidth;
      scroller.style.transform = `translate3d(0, ${-maxTranslate}px, 0)`;
    };

    const leave = () => {
      scroller.classList.add('is-animating');
      void scroller.offsetWidth;
      scroller.style.transform = 'translate3d(0,0,0)';
    };

    frame.addEventListener('mouseenter', enter);
    frame.addEventListener('mouseleave', leave);
    frame.addEventListener('touchstart', enter, { passive: true });
    frame.addEventListener('touchend', leave, { passive: true });
  });
})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTACT MODAL — abrir / fechar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const contactModal   = document.getElementById('contact-modal');
const contactModalClose = document.getElementById('cmodal-close');

function openContactModal() {
  if (!contactModal) return;
  contactModal.classList.add('open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Focar o primeiro campo do formulário para acessibilidade
  setTimeout(() => {
    const firstInput = contactModal.querySelector('input, textarea, select');
    if (firstInput) firstInput.focus();
  }, 380);
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove('open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Botões que abrem o modal (class open-contact-btn)
document.querySelectorAll('.open-contact-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openContactModal();
  });
});

// Botão fechar
if (contactModalClose) {
  contactModalClose.addEventListener('click', closeContactModal);
}

// Fechar ao clicar no overlay (fora do box)
if (contactModal) {
  contactModal.addEventListener('click', e => {
    if (e.target === contactModal) closeContactModal();
  });
}

// Fechar com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && contactModal && contactModal.classList.contains('open')) {
    closeContactModal();
  }
});


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TESTIMONIALS — CARROSSEL AUTOMÁTICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function testimonialCarousel() {
  const carousel = document.getElementById('tcarousel');
  const dotsContainer = document.getElementById('tcarousel-dots');
  if (!carousel) return;

  // Todos os cards originais (os 3 primeiros são reais, os 2 últimos são clones para loop)
  const TOTAL_REAL = 3;
  const cards = carousel.querySelectorAll('.tcard');
  const dots  = dotsContainer ? dotsContainer.querySelectorAll('.tdot') : [];

  // Largura de cada card + gap (2rem = 32px)
  // Calculamos dinamicamente
  let cardW = 0;
  let gap = 0;
  let currentIdx = 0;
  let offset = 0;
  let autoTimer = null;
  let isDragging = false;
  let startX = 0;
  let startOffset = 0;
  let transitioning = false;

  function getCardWidth() {
    const card = carousel.querySelector('.tcard');
    if (!card) return 340;
    const style = window.getComputedStyle(carousel);
    gap = parseFloat(style.gap) || 32;
    return card.offsetWidth;
  }

  function goTo(idx, animate = true) {
    cardW = getCardWidth();
    currentIdx = idx;
    offset = currentIdx * (cardW + gap);

    if (animate) {
      carousel.style.transition = 'transform 0.6s cubic-bezier(.23,1,.32,1)';
    } else {
      carousel.style.transition = 'none';
    }
    carousel.style.transform = `translateX(${-offset}px)`;

    // Atualizar dots
    const realIdx = currentIdx % TOTAL_REAL;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === realIdx);
    });
  }

  function next() {
    if (transitioning) return;
    const nextIdx = currentIdx + 1;
    goTo(nextIdx);

    // Quando chega nos clones, reseta silenciosamente
    if (nextIdx >= TOTAL_REAL) {
      transitioning = true;
      setTimeout(() => {
        goTo(nextIdx % TOTAL_REAL, false);
        transitioning = false;
      }, 680);
    }
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 4000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Dots clicáveis
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(i);
      startAuto();
    });
  });

  // Pause no hover
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Suporte a touch/swipe
  carousel.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startOffset = currentIdx * (getCardWidth() + gap);
    isDragging = true;
    stopAuto();
  }, { passive: true });

  carousel.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    carousel.style.transition = 'none';
    carousel.style.transform = `translateX(${-(startOffset - dx)}px)`;
  }, { passive: true });

  carousel.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50) {
      next();
    } else if (dx > 50 && currentIdx > 0) {
      goTo(currentIdx - 1);
    } else {
      goTo(currentIdx);
    }
    startAuto();
  }, { passive: true });

  // Inicializar
  setTimeout(() => {
    goTo(0, false);
    startAuto();
  }, 300);

  // Re-calc no resize
  window.addEventListener('resize', () => {
    goTo(currentIdx, false);
  }, { passive: true });
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TILT — extend to svc-mini cards
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
if (!isTouch) {
  document.querySelectorAll('.svc-mini').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateX(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SHOWCASE — Card dinâmico de projetos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function showcaseDynamicCard() {

  // Dados dos projetos (mesmos do pgrid)
  const projects = [
    {
      num:   '01',
      cat:   'Site institucional',
      img:   'img/kleberpintosite.png',
      alt:   'Kleber Pinto — preview do site',
      title: 'Kleber Pinto',
      desc:  'Site institucional para serviços de química, cabelo e barba.',
      tags:  ['HTML','CSS','JS'],
      url:   'https://fabiosill.github.io/hairstylist-website'
    },
    {
      num:   '02',
      cat:   'Landing Page',
      img:   'img/sisacleansite.png',
      alt:   'SISA Clean — preview do site',
      title: 'SISA Clean',
      desc:  'Site limpo e moderno com foco em conversão e identidade visual forte.',
      tags:  ['HTML','CSS','UI/UX'],
      url:   'https://fabiosill.github.io/sisa-clean'
    },
    {
      num:   '03',
      cat:   'E-commerce',
      img:   'img/leparfragancysite.png',
      alt:   'Le Parfragancy — preview do site',
      title: 'Le Parfragancy',
      desc:  'Loja de perfumaria premium com experiência de compra luxuosa.',
      tags:  ['E-commerce','UX','JS'],
      url:   'https://fabiosill.github.io/leparfragancy-web'
    }
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

  let current = 0;
  let transitioning = false;

  // Inicializar estado visível
  card.classList.add('sc-visible');

  // Re-bind scroll animation for the showcase card frame
  function bindScrollAnim(frame) {
    const scroller = frame.querySelector('.pcardx-scroll');
    const img = scroller && scroller.querySelector('img');
    if (!scroller || !img) return;

    const SPEED = 220;
    const MIN_DUR = 2.2;
    const MAX_DUR = 9;
    let maxT = 0;

    const measure = () => {
      const frameH = frame.clientHeight;
      const imgH   = img.getBoundingClientRect().height;
      maxT = Math.max(0, imgH - frameH);
      const dur = Math.min(MAX_DUR, Math.max(MIN_DUR, maxT / SPEED));
      scroller.style.setProperty('--pdur', dur.toFixed(2) + 's');
    };

    if (img.complete) measure(); else img.addEventListener('load', measure, { once: true });
    window.addEventListener('resize', measure, { passive: true });

    // Remove previous listeners by cloning
    const newFrame = frame.cloneNode(false);
    // We keep the same frame element; just re-attach events
    frame._scMeasure = measure;
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
    frame.addEventListener('touchstart', frame._scEnter, { passive: true });
    frame.addEventListener('touchend',   frame._scLeave, { passive: true });
  }

  // First bind
  const initialFrame = document.querySelector('#showcase-card .pcardx-frame');
  if (initialFrame) bindScrollAnim(initialFrame);

  function goTo(idx) {
    if (transitioning || idx === current) return;
    transitioning = true;

    // Fade out
    card.classList.remove('sc-visible');
    card.classList.add('sc-fading');

    setTimeout(() => {
      const p = projects[idx];

      // Update data
      scNum.textContent    = p.num;
      scCat.textContent    = p.cat;
      scImg.src            = p.img;
      scImg.alt            = p.alt;
      scTitle.textContent  = p.title;
      scDesc.textContent   = p.desc;
      scLink.href          = p.url;
      scLink.setAttribute('aria-label', 'Ver ' + p.title + ' ao vivo');
      scPlink.href         = p.url;

      // Tags
      scTags.innerHTML = p.tags.map(t => `<span class="ptag">${t}</span>`).join('');

      // Reset scroll position
      const scroller = scScroll;
      scroller.classList.remove('is-animating');
      scroller.style.transform = 'translate3d(0,0,0)';

      current = idx;

      // Fade in
      card.classList.remove('sc-fading');
      card.classList.add('sc-visible');

      // Re-bind scroll hover (img changed)
      const frame = card.querySelector('.pcardx-frame');
      if (frame) {
        frame.removeEventListener('mouseenter', frame._scEnter);
        frame.removeEventListener('mouseleave', frame._scLeave);
        frame.removeEventListener('touchstart', frame._scEnter);
        frame.removeEventListener('touchend',   frame._scLeave);
        bindScrollAnim(frame);
      }

      transitioning = false;
    }, 230); // matches fade-out duration

    // Update dots
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      // [MODIFICADO] ao clicar manualmente, reinicia o timer do autoplay
      stopAutoplay();
      goTo(i);
      startAutoplay();
    });
  });

  // ── [MODIFICADO] Autoplay do showcase esquerdo ─────────────────────────────
  // Troca automática a cada 3.5 s; pausa no hover/touch; retoma ao sair.
  let autoplayTimer = null;

  function nextSlide() {
    const nextIdx = (current + 1) % projects.length;
    goTo(nextIdx);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 3500);
  }

  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  // Pausa no hover do card
  if (card) {
    card.addEventListener('mouseenter', stopAutoplay);
    card.addEventListener('mouseleave', startAutoplay);
    card.addEventListener('touchstart', stopAutoplay, { passive: true });
    card.addEventListener('touchend',   startAutoplay, { passive: true });
  }

  // Iniciar autoplay após breve delay (aguarda reveal animation)
  setTimeout(startAutoplay, 1200);
  // ── fim autoplay ────────────────────────────────────────────────────────────

  // ── Swipe mobile (não interfere no scroll vertical) ──────────────────────
  const wrapper = document.querySelector('.showcase-card-wrapper');
  if (wrapper && isTouch) {
    let swipeStartX = 0;
    let swipeStartY = 0;
    let swipeLocked = false; // true = gesto vertical, ignora horizontal

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
      // Se movimento predominantemente vertical, trava o swipe horizontal
      if (Math.abs(dy) > Math.abs(dx)) {
        swipeLocked = true;
        return;
      }
      // Movimento predominantemente horizontal: impede scroll da página
      if (Math.abs(dx) > 8) e.preventDefault();
    }, { passive: false });

    wrapper.addEventListener('touchend', e => {
      if (swipeLocked) { startAutoplay(); return; }
      const dx = e.changedTouches[0].clientX - swipeStartX;
      if (dx < -40) {
        // Arrastar para esquerda → próximo slide
        const nextIdx = (current + 1) % projects.length;
        goTo(nextIdx);
      } else if (dx > 40) {
        // Arrastar para direita → slide anterior
        const prevIdx = (current - 1 + projects.length) % projects.length;
        goTo(prevIdx);
      }
      startAutoplay();
    }, { passive: true });
  }
  // ── fim swipe ──────────────────────────────────────────────────────────────

})();


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SHOWCASE — Carrossel 3D: reflexo via CSS var
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function showcase3DReflection() {
  // Injeta a variável --sc3d-ref-img em cada .sc3d-card via JS
  // lendo o atributo style="--sc3d-ref: url(...)" definido no HTML
  document.querySelectorAll('.sc3d-card').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    // A imagem src é a referência
    const src = img.getAttribute('src');
    if (src) {
      card.style.setProperty('--sc3d-ref-img', `url('${src}')`);
    }
  });
})();