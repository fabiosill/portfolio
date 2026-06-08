// ━━━━ DETECT TOUCH / MOBILE ━━━━
const isMobile = /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent) || window.innerWidth <= 900;
const isTouch  = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

// ━━━━ CURSOR (desktop only) ━━━━
const cur  = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
if (!isTouch && cur && cur2) {
  let mx = 0, my = 0, dx = 0, dy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur2.style.left = mx + 'px'; cur2.style.top = my + 'px';
  });
  (function animC() {
    dx += (mx - dx) * .13; dy += (my - dy) * .13;
    cur.style.left = dx + 'px'; cur.style.top = dy + 'px';
    requestAnimationFrame(animC);
  })();
  document.querySelectorAll('a,button,.svc,.pcard,.tcard,.sbox,.citem,.pshow-item').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
}

// ━━━━ NAV SCROLL ━━━━
const nav = document.getElementById('nav');
const stt = document.getElementById('stt');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', s > 50);
  if (stt) stt.classList.toggle('show', s > 400);
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
      if (e.target.closest('#about'))  triggerCounters();
      if (e.target.closest('#skills')) triggerSkills();
    }
  });
}, { threshold: .1 });

document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * .08 + 's';
  io.observe(el);
});

// ━━━━ COUNTERS ━━━━
let countersRan = false;
function triggerCounters() {
  if (countersRan) return; countersRan = true;
  document.querySelectorAll('.snum[data-t]').forEach(el => {
    const t = +el.dataset.t; let n = 0;
    const iv = setInterval(() => {
      n += t / 60;
      if (n >= t) { n = t; clearInterval(iv); }
      el.textContent = Math.floor(n) + (t === 100 ? '%' : '+');
    }, 20);
  });
}

// ━━━━ SKILL BARS ━━━━
let skillsRan = false;
function triggerSkills() {
  if (skillsRan) return; skillsRan = true;
  document.querySelectorAll('.skfill').forEach(el => {
    el.style.width = el.dataset.w + '%';
  });
}

// ━━━━ PORTFOLIO FILTER ━━━━
function pf(btn, cat) {
  document.querySelectorAll('.pfbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.pcard').forEach((c, i) => {
    const show = cat === 'all' || c.dataset.c === cat;
    c.style.transition = `all .35s ease ${i * .04}s`;
    c.style.opacity    = show ? '1' : '0';
    c.style.transform  = show ? 'scale(1)' : 'scale(.96)';
    c.style.pointerEvents = show ? 'all' : 'none';
    setTimeout(() => c.style.display = show ? 'block' : 'none', show ? 0 : 350);
    if (show) setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'scale(1)'; }, 40);
  });
}

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

// ━━━━ PHONE SHOWCASE — AUTO-SCROLL SUAVE NO HOVER ━━━━
(function phoneShowcaseScroll() {
  function init() {
    document.querySelectorAll('.pshow-screen').forEach(screen => {
      const iframe = screen.querySelector('iframe');
      if (!iframe) return;

      let animId = null;
      let scrollY = 0;
      let maxScroll = 0;
      const SPEED = 0.5;

      function updateMax() {
        try {
          const iDoc = iframe.contentDocument || iframe.contentWindow.document;
          maxScroll = iDoc.body.scrollHeight - iDoc.documentElement.clientHeight;
        } catch(e) {
          maxScroll = 6000;
        }
      }

      iframe.addEventListener('load', updateMax);
      setTimeout(updateMax, 800);

      function scrollStep() {
        scrollY += SPEED;
        if (scrollY >= maxScroll) {
          scrollY = 0;
          updateMax();
        }
        iframe.style.transform = `scale(${getScale(screen)}) translateY(${-scrollY}px)`;
        iframe.style.transformOrigin = 'top left';
        animId = requestAnimationFrame(scrollStep);
      }

      function getScale(s) {
        return s.offsetWidth / 375;
      }

      function resetTransform() {
        const sc = getScale(screen);
        iframe.style.transform = `scale(${sc}) translateY(${-scrollY}px)`;
        iframe.style.transformOrigin = 'top left';
        iframe.style.width = '375px';
        iframe.style.height = '812px';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.border = 'none';
      }

      screen.addEventListener('mouseenter', () => {
        updateMax();
        if (!animId) animId = requestAnimationFrame(scrollStep);
      });

      screen.addEventListener('mouseleave', () => {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        resetTransform();
      });

      setTimeout(resetTransform, 100);
      window.addEventListener('resize', resetTransform, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

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

// ━━━━ PORTFOLIO FILTER (compatibilidade) ━━━━
if (typeof pf === 'undefined') {
  function pf(btn, cat) {
    document.querySelectorAll('.pfbtn').forEach(b => b.classList.remove('on'));
    if (btn) btn.classList.add('on');
  }
}

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
   ORBIT ANIMATION — disabled (orbit removed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function buildOrbit() {
  return; // orbit removido
  const ring1 = document.getElementById('orb-ring1');
  const ring2 = document.getElementById('orb-ring2');
  const ring3 = document.getElementById('orb-ring3');
  if (!ring1 || !ring2 || !ring3) return;

  // SVG icons matching skills list
  const techIcons = {
    'HTML5': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>`,
    'CSS3': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>`,
    'JS': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>`,
    'TS': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>`,
    'React': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278zm-.005 1.09c.213 0 .397.045.553.14.631.363.851 1.826.516 3.725-.077.421-.18.867-.308 1.329a23.83 23.83 0 0 0-3.049-.316 23.337 23.337 0 0 0-2.022-2.35c1.34-1.226 2.638-1.903 3.31-1.528zM6.674 7.19c-.215 0-.412.044-.569.136-.63.361-.851 1.823-.517 3.72.077.422.18.868.308 1.33a23.4 23.4 0 0 0-3.049.315 23.337 23.337 0 0 0-2.021-2.35c1.341-1.225 2.638-1.902 3.31-1.527.155.09.285.152.538.166zm8.948 5.524c.197.62.365 1.227.5 1.81.434 1.91.394 3.416-.117 3.713a.61.61 0 0 1-.312.079c-.608 0-1.528-.485-2.612-1.34a23.62 23.62 0 0 0 1.538-1.832 23.27 23.27 0 0 0 1.003-2.43zm-8.558-.01c.321.833.7 1.64 1.126 2.41a23.35 23.35 0 0 0 1.474 1.838c-1.083.862-2.005 1.35-2.62 1.35-.095 0-.197-.017-.294-.073-.508-.293-.554-1.786-.131-3.693.138-.594.313-1.21.513-1.832H7.064zm4.917.71c-.496 0-.993-.025-1.485-.074-.46.636-.872 1.29-1.23 1.95.357.66.768 1.314 1.228 1.95.492-.049.99-.074 1.487-.074.497 0 .994.025 1.485.074a22.87 22.87 0 0 0 1.23-1.95 22.887 22.887 0 0 0-1.228-1.95c-.492.049-.99.074-1.487.074z"/></svg>`,
    'Next': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/></svg>`,
    'Node': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339c.082.045.197.045.272 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68C2.99 6.729 2.936 6.825 2.936 6.921v10.15c0 .097.054.189.139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675c-.57-.329-.922-.945-.922-1.604V6.921c0-.659.353-1.275.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.57.329.924.944.924 1.603v10.15c0 .659-.354 1.275-.924 1.604l-8.794 5.078C12.643 23.916 12.324 24 11.998 24z"/></svg>`,
    'PHP': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.558-.577.964-.949 1.217-.372.253-.82.38-1.345.38H5.86l-.346 1.77H4.309l1.28-6.601h2.4c.705 0 1.213.199 1.525.597.312.397.342.995.09 1.795zm4.24 0c-.262.558-.577.964-.95 1.217-.372.253-.819.38-1.345.38H9.1l-.346 1.77H7.549l1.28-6.601h2.4c.705 0 1.213.199 1.525.597.313.397.343.995.09 1.795zm5.47-1.451h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.174-.193-.524-.29-1.047-.29zm2.3 3.396c-.261.558-.576.964-.949 1.217-.372.253-.82.38-1.345.38h-1.586l-.346 1.77h-1.205l1.281-6.601h2.4c.705 0 1.212.199 1.524.597.313.397.344.995.09 1.795z"/></svg>`,
    'Docker': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/></svg>`,
    'Figma': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117v-6.038H8.148zm4.587 12.012c0 2.476-2.014 4.49-4.49 4.49S3.756 21.997 3.756 19.52s2.014-4.49 4.49-4.49h4.588v4.49zm-4.587-3.019c-1.665 0-3.019 1.354-3.019 3.019 0 1.665 1.354 3.019 3.019 3.019s3.019-1.354 3.019-3.019v-3.019H8.148zm7.704 0h-.001v.001c-2.476 0-4.49-2.015-4.49-4.491s2.014-4.49 4.49-4.49c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.489 4.49zm0-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02 3.019-1.355 3.019-3.02c0-1.664-1.354-3.018-3.019-3.019z"/></svg>`
  };

  // Ring 1: 2 items
  const ring1Items = [
    { key: 'HTML5', label: 'HTML5' },
    { key: 'CSS3', label: 'CSS3' }
  ];
  // Ring 2: 4 items
  const ring2Items = [
    { key: 'JS', label: 'JavaScript' },
    { key: 'React', label: 'React.js' },
    { key: 'Node', label: 'Node.js' },
    { key: 'TS', label: 'TypeScript' }
  ];
  // Ring 3: 5 items
  const ring3Items = [
    { key: 'Next', label: 'Next.js' },
    { key: 'PHP', label: 'PHP' },
    { key: 'Docker', label: 'Docker' },
    { key: 'Figma', label: 'Figma' },
    { key: 'Node', label: 'PostgreSQL' }
  ];

  function placeOnRing(ring, items, duration) {
    const count = items.length;
    items.forEach((item, i) => {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const radius = ring.offsetWidth / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const el = document.createElement('div');
      el.className = 'orb-item';
      el.setAttribute('data-tech', item.label);
      el.innerHTML = techIcons[item.key] || '◈';

      // Percent-based centering
      el.style.position = 'absolute';
      el.style.left = `calc(50% + ${x}px - 22px)`;
      el.style.top  = `calc(50% + ${y}px - 22px)`;
      el.style.animationDuration = duration + 's';
      el.style.animationName = 'rs';
      el.style.animationTimingFunction = 'linear';
      el.style.animationIterationCount = 'infinite';
      el.style.animationDirection = 'reverse';

      ring.appendChild(el);
    });
  }

  // Wait for layout
  requestAnimationFrame(() => {
    placeOnRing(ring1, ring1Items, 8);
    placeOnRing(ring2, ring2Items, 14);
    placeOnRing(ring3, ring3Items, 20);
  });
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
   C3D CAROUSEL — pause on hover, resume on leave
   The animation runs entirely via CSS (@keyframes c3d-spin).
   JS only handles the pause/resume interaction and
   extends the cursor hover target for the portfolio section.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function c3dCarousel() {
  const carousel = document.querySelector('.c3d-carousel');
  if (!carousel) return;

  // Pause animation on hover over the scene
  const scene = carousel.closest('.c3d-scene');
  if (scene) {
    scene.addEventListener('mouseenter', () => {
      carousel.style.animationPlayState = 'paused';
    });
    scene.addEventListener('mouseleave', () => {
      carousel.style.animationPlayState = 'running';
    });
    // Touch: tap to toggle pause
    scene.addEventListener('touchstart', () => {
      const state = carousel.style.animationPlayState;
      carousel.style.animationPlayState = (state === 'paused') ? 'running' : 'paused';
    }, { passive: true });
  }

  // Extend cursor hover list to include c3d-scene
  if (!isTouch && typeof cur !== 'undefined' && cur) {
    scene && scene.addEventListener('mouseenter', () => cur.classList.add('big'));
    scene && scene.addEventListener('mouseleave', () => cur.classList.remove('big'));
  }
})();