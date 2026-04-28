/* ═══════════════════════════════════════════════════════
   MASSIS BARON — Landing Page
   script.js
   ═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   CONFIGURAÇÃO — edite aqui
───────────────────────────────────────────────────── */
const CONFIG = { /* v2 */
  // Web3Forms — chave de acesso (web3forms.com)
  WEB3FORMS_KEY: '257727df-c2aa-41cb-a81a-231f1eab73b2',

  // Número WhatsApp (somente dígitos, com DDI)
  WPP_NUMBER: '5511999371175',
};

/* ─────────────────────────────────────────────────────
   1. PARTÍCULAS (canvas)
───────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, raf, active = true;

  const COUNT    = 55;
  const MAX_SIZE = 2.2;
  const MIN_SIZE = 0.8;
  const MAX_SPD  = 0.28;
  const COLORS   = [
    'rgba(255,255,255,',
    'rgba(255,107,0,',
    'rgba(255,140,53,',
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:     rand(0, W),
      y:     rand(0, H),
      r:     rand(MIN_SIZE, MAX_SIZE),
      vx:    rand(-MAX_SPD, MAX_SPD),
      vy:    rand(-MAX_SPD, MAX_SPD),
      alpha: rand(0.04, 0.18),
      color,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function draw() {
    if (!active) return;
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    }

    raf = requestAnimationFrame(draw);
  }

  // Pausa quando fora do viewport (performance)
  const observer = new IntersectionObserver(
    (entries) => {
      active = entries[0].isIntersecting;
      if (active) draw();
      else cancelAnimationFrame(raf);
    },
    { threshold: 0 }
  );

  init();
  draw();
  observer.observe(canvas);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); }, 150);
  });
})();

/* ─────────────────────────────────────────────────────
   2. HEADER — scroll behavior
───────────────────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 30);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─────────────────────────────────────────────────────
   3. MOBILE NAV — toggle
───────────────────────────────────────────────────── */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  function close() {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fecha ao clicar em link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', close);
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) close();
  });

  // Fecha com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* ─────────────────────────────────────────────────────
   4. REVEAL — scroll animations (IntersectionObserver)
───────────────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;

        // Delay escalonado para elementos filhos do mesmo pai
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')]
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 320);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────
   5. FAQ — accordion
───────────────────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros
      items.forEach(other => {
        const otherBtn    = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn && otherAnswer && other !== item) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.hidden = true;
        }
      });

      // Alterna o atual
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });
})();

/* ─────────────────────────────────────────────────────
   6. SMOOTH SCROLL — com offset do header
───────────────────────────────────────────────────── */
(function initSmoothScroll() {
  const OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });

      // Atualiza foco para acessibilidade
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();

/* ─────────────────────────────────────────────────────
   7. BOTÃO WPP FLUTUANTE — aparece após scroll
───────────────────────────────────────────────────── */
(function initWppFloat() {
  const btn = document.getElementById('wpp-float');
  if (!btn) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────────────────
   8. ANO NO FOOTER
───────────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─────────────────────────────────────────────────────
   9. FORMULÁRIO — validação + envio
───────────────────────────────────────────────────── */
(function initForm() {
  const form       = document.getElementById('lead-form');
  if (!form) return;

  const btnText    = form.querySelector('.btn-text');
  const btnLoading = form.querySelector('.btn-loading');
  const successEl  = document.getElementById('form-success');
  const errorEl    = document.getElementById('form-error');
  const submitBtn  = form.querySelector('.form-submit-btn');

  /* ── Máscara de telefone ── */
  const wppInput = document.getElementById('whatsapp');
  if (wppInput) {
    wppInput.addEventListener('input', () => {
      let v = wppInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        v = `(${v}`;
      }
      wppInput.value = v;
    });
  }

  /* ── Validação por campo ── */
  const rules = {
    nome: {
      validate: v => v.trim().length >= 2,
      msg: 'Informe seu nome completo.',
    },
    whatsapp: {
      validate: v => v.replace(/\D/g, '').length >= 10,
      msg: 'Informe um WhatsApp válido.',
    },
    email: {
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      msg: 'Informe um e-mail válido.',
    },
    negocio: {
      validate: v => v.trim().length >= 2,
      msg: 'Informe o segmento do negócio.',
    },
    objetivo: {
      validate: v => v !== '',
      msg: 'Selecione um objetivo.',
    },
  };

  function getFieldError(name, value) {
    const rule = rules[name];
    if (!rule) return '';
    return rule.validate(value) ? '' : rule.msg;
  }

  function showFieldError(input, msg) {
    const errorSpan = input.closest('.form-group')?.querySelector('.field-error');
    if (errorSpan) errorSpan.textContent = msg;
    input.classList.toggle('error', !!msg);
  }

  function clearFieldError(input) {
    showFieldError(input, '');
  }

  // Validação inline ao sair do campo
  Object.keys(rules).forEach(name => {
    const input = form.elements[name];
    if (!input) return;

    input.addEventListener('blur', () => {
      const msg = getFieldError(name, input.value);
      showFieldError(input, msg);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        const msg = getFieldError(name, input.value);
        showFieldError(input, msg);
      }
    });
  });

  /* ── Envio do formulário ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Valida todos os campos
    let hasError = false;
    Object.keys(rules).forEach(name => {
      const input = form.elements[name];
      if (!input) return;
      const msg = getFieldError(name, input.value);
      showFieldError(input, msg);
      if (msg) hasError = true;
    });

    if (hasError) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Estado de loading
    submitBtn.disabled = true;
    if (btnText)    btnText.hidden    = true;
    if (btnLoading) btnLoading.hidden = false;
    if (successEl)  successEl.hidden  = true;
    if (errorEl)    errorEl.hidden    = true;

    // Coleta dados
    const data = {
      nome:      form.elements['nome'].value.trim(),
      whatsapp:  form.elements['whatsapp'].value.trim(),
      email:     form.elements['email'].value.trim(),
      negocio:   form.elements['negocio'].value.trim(),
      objetivo:  form.elements['objetivo'].value,
      mensagem:  form.elements['mensagem']?.value.trim() || '',
    };

    try {
      /* ════════════════════════════════════════════════════
         ENVIO — Web3Forms (web3forms.com)
         ════════════════════════════════════════════════════ */
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify({ access_key: CONFIG.WEB3FORMS_KEY, ...data }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        form.reset();
        if (successEl) successEl.hidden = false;

        // Evento de conversão GA4 (via GTM)
        if (typeof gtag === 'function') {
          gtag('event', 'lead_form_submit', { event_category: 'lead', event_label: data.objetivo });
        }
        // Meta Lead é disparado pelo GTM (tag "Meta - Lead Formulário")
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (errorEl) errorEl.hidden = false;
    } finally {
      submitBtn.disabled = false;
      if (btnText)    btnText.hidden    = false;
      if (btnLoading) btnLoading.hidden = true;
    }
  });
})();
