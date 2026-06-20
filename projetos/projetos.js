/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PROJETOS.JS — Autossuficiente
   Não depende de script/main.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

'use strict';

/* ━━━━ Detecção de dispositivo ━━━━ */
const isMobile = /Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent) || window.innerWidth <= 900;
const isTouch  = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

/* ━━━━ Utilitários ━━━━ */
function debounce(fn, wait) {
  let t = null;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function normalizeStr(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAV SCROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HAMBURGER MENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initHamburger() {
  const hbg      = document.getElementById('hbg');
  const navlinks = document.getElementById('navlinks');
  if (!hbg || !navlinks) return;

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
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SMOOTH SCROLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      if (a.classList.contains('open-contact-btn')) return;
      const href = a.getAttribute('href');
      /* Links "placeholder" (href="#") não têm alvo de scroll —
         apenas previne o salto padrão sem tentar buscar um seletor inválido. */
      if (!href || href.length <= 1) { e.preventDefault(); return; }
      e.preventDefault();
      const t = document.querySelector(href);
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INTERSECTION OBSERVER — .reveal / .reveal-l / .reveal-r
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal,.reveal-l,.reveal-r');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.1 });

  els.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    io.observe(el);
  });
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GLOW BORDERS — pausa fora da viewport
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initGlowPause() {
  const glowEls = document.querySelectorAll('.glow-border-card,.glow-border-section');
  if (!glowEls.length || !('IntersectionObserver' in window)) return;

  const ioGlow = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.classList.toggle('glow-paused', !e.isIntersecting);
    });
  }, { threshold: 0, rootMargin: '50px' });

  glowEls.forEach(el => ioGlow.observe(el));
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MODAL DE CONTATO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initContactModal() {
  const modal    = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('cmodal-close');
  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstInput = modal.querySelector('input,textarea,select');
      if (firstInput) firstInput.focus();
    }, 380);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-contact-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* ━━━━ Envio do formulário ━━━━ */
  window.doSend = function doSend(e) {
    e.preventDefault();
    const btn   = document.getElementById('sbtn');
    const nome  = document.getElementById('f-nome');
    const email = document.getElementById('f-email');

    if (!nome || !email) return;

    if (!nome.value.trim() || !email.value.trim()) {
      const first = !nome.value.trim() ? nome : email;
      first.focus();
      first.style.borderColor = 'rgba(255,80,80,.7)';
      setTimeout(() => { first.style.borderColor = ''; }, 2000);
      return;
    }

    if (btn) {
      btn.disabled    = true;
      btn.textContent = '⏳ PROCESSANDO...';
    }

    const steps = ['VALIDANDO DADOS...', 'CRIPTOGRAFANDO...', 'TRANSMITINDO...', 'RECEBIDO COM SUCESSO!'];
    let si = 0;
    const iv = setInterval(() => {
      if (si >= steps.length - 1) {
        clearInterval(iv);
        if (btn) {
          btn.textContent      = '✅ MENSAGEM ENVIADA!';
          btn.style.background = 'linear-gradient(135deg,#00ff88,#00aa55)';
        }
        setTimeout(() => {
          closeModal();
          if (btn) {
            btn.disabled         = false;
            btn.textContent      = 'ENVIAR MENSAGEM';
            btn.style.background = '';
          }
          e.target.reset();
        }, 3500);
      } else {
        if (btn) btn.textContent = steps[si];
        si++;
      }
    }, 500);
  };
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SISTEMA DE FILTROS POR CATEGORIA + BUSCA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initFiltros() {
  const filtroNav   = document.getElementById('filtro-nav');
  const grid        = document.getElementById('proj-grid');
  const emptyState  = document.getElementById('proj-empty');
  const countNum    = document.getElementById('count-num');
  const searchInput = document.getElementById('proj-search');
  const searchClear = document.getElementById('search-clear');
  const resetBtn    = document.getElementById('reset-filters');

  if (!filtroNav || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.proj-card'));

  let activeCat  = 'todos';
  let searchTerm = '';

  function applyFilters(animate) {
    const term = normalizeStr(searchTerm.trim());
    let visibleCount = 0;

    cards.forEach(card => {
      const cat  = card.dataset.cat   || '';
      const title = normalizeStr(card.dataset.title || '');
      const text  = normalizeStr(card.textContent   || '');

      const catMatch  = activeCat === 'todos' || cat === activeCat;
      const termMatch = term === '' || title.includes(term) || text.includes(term);
      const show      = catMatch && termMatch;

      if (show) {
        card.classList.remove('hidden');
        visibleCount++;
        if (animate) {
          card.classList.remove('visible');
          const delay = (visibleCount - 1) * 55;
          setTimeout(() => card.classList.add('visible'), delay);
        }
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });

    if (countNum)   countNum.textContent = visibleCount;
    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
  }

  /* Botões de categoria */
  const filtrosBtns = filtroNav.querySelectorAll('.filtro-btn');

  filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      if (cat === activeCat) return;
      activeCat = cat;
      filtrosBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      applyFilters(true);
    });
  });

  /* Busca com debounce */
  if (searchInput) {
    searchInput.addEventListener('input', debounce(e => {
      searchTerm = e.target.value;
      if (searchClear) searchClear.style.display = searchTerm ? 'flex' : 'none';
      applyFilters(true);
    }, 220));

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchTerm        = '';
        searchClear.style.display = 'none';
        searchInput.focus();
        applyFilters(true);
      });
    }

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchTerm        = '';
        if (searchClear) searchClear.style.display = 'none';
        applyFilters(true);
      }
    });
  }

  /* Botão "Limpar Filtros" no estado vazio */
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeCat  = 'todos';
      searchTerm = '';
      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';
      filtrosBtns.forEach(b => {
        const isTodos = b.dataset.cat === 'todos';
        b.classList.toggle('active', isTodos);
        b.setAttribute('aria-pressed', String(isTodos));
      });
      applyFilters(true);
    });
  }

  /* Estado inicial — sem animação (IntersectionObserver cuida da entrada) */
  applyFilters(false);
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ANIMAÇÃO DE ENTRADA DOS CARDS (IntersectionObserver)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initCardReveal() {
  const cards = document.querySelectorAll('.proj-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('hidden')) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
    observer.observe(card);
  });

  /* Remove delays após animação inicial para não atrasar hover */
  setTimeout(() => {
    cards.forEach(c => { c.style.transitionDelay = ''; });
  }, cards.length * 60 + 600);
})();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ANIMAÇÃO DE CONTAGEM — ESTATÍSTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOutCubic(progress) * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => io.observe(el));
})();