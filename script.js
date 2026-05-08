/* ═══════════════════════════════════════════════════════════════
   ARCHIVE — script.js
   Funcionalidades: navbar, búsqueda, filtros, terminal, partículas
   Sin dependencias externas · Compatible con GitHub Pages
   ═══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   1. UTILIDADES GENERALES
   ══════════════════════════════════════ */

/**
 * Selecciona un elemento del DOM de forma segura.
 * @param {string} selector - Selector CSS
 * @returns {Element|null}
 */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Escapa HTML para evitar XSS en búsquedas.
 */
const escapeHtml = (str) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ══════════════════════════════════════
   2. NAVBAR — HAMBURGUESA & SCROLL
   ══════════════════════════════════════ */
const initNavbar = () => {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const navbar     = $('#navbar');

  if (!hamburger || !mobileMenu) return;

  /* Toggle del menú móvil */
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  /* Cerrar menú al hacer clic en un link */
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  /* Efecto de scroll: agregar sombra al navbar cuando se desplaza */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 30px rgba(176, 96, 255, 0.12)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });

  /* Cerrar menú al hacer clic fuera */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
};

/* ══════════════════════════════════════
   3. ANIMACIÓN DE ESTADÍSTICAS (contador)
   ══════════════════════════════════════ */
const initCounters = () => {
  const counters = $$('[data-target]');
  if (!counters.length) return;

  /**
   * Anima un número del 0 hasta el valor objetivo.
   * @param {Element} el - Elemento con data-target
   */
  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1200; // ms
    const step     = 16;   // ~60fps
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      /* Formatear: si el original tenía dos cifras poner 0 al principio */
      el.textContent = Math.floor(current).toString().padStart(
        el.dataset.target.length, '0'
      );
    }, step);
  };

  /* Usar IntersectionObserver para iniciar cuando sea visible */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};

/* ══════════════════════════════════════
   4. WIDGET TERMINAL (solo index.html)
   ══════════════════════════════════════ */
const initTerminal = () => {
  const body = $('#terminalBody');
  if (!body) return;

  /* Secuencia de líneas a mostrar */
  const lines = [
    { delay: 200,  html: '<span class="prompt">visitor@archive:~$</span> <span class="cmd">ls -la ./collections/</span>' },
    { delay: 700,  html: '<span class="output">total 6 directories</span>' },
    { delay: 900,  html: '<span class="output">drwxr-xr-x  <span class="purple">audio/</span>        <span class="muted">444 MB · 4 archivos</span></span>' },
    { delay: 1100, html: '<span class="output">drwxr-xr-x  <span class="purple">video/</span>        <span class="muted">2.3 GB · 3 archivos</span></span>' },
    { delay: 1300, html: '<span class="output">drwxr-xr-x  <span class="purple">documentos/</span>   <span class="muted">93 MB  · 5 archivos</span></span>' },
    { delay: 1500, html: '<span class="output">drwxr-xr-x  <span class="purple">imagenes/</span>     <span class="muted">1.2 GB · 3 archivos</span></span>' },
    { delay: 1700, html: '<span class="output">drwxr-xr-x  <span class="purple">software/</span>     <span class="muted">476 MB · 4 archivos</span></span>' },
    { delay: 1900, html: '<span class="output">drwxr-xr-x  <span class="purple">libros/</span>       <span class="muted">2.1 GB · 4 archivos</span></span>' },
    { delay: 2400, html: '<span class="prompt">visitor@archive:~$</span> <span class="cmd">echo $STATUS</span>' },
    { delay: 2900, html: '<span class="success">✓ Todos los archivos disponibles · Sin restricciones</span>' },
    { delay: 3300, html: '<span class="prompt">visitor@archive:~$</span> <span class="cursor-blink">_</span>' },
  ];

  /* Insertar cada línea con su delay correspondiente */
  lines.forEach(({ delay, html }) => {
    setTimeout(() => {
      const line = document.createElement('span');
      line.className = 't-line';
      line.innerHTML = html;
      body.appendChild(line);
      /* Auto-scroll del terminal */
      body.scrollTop = body.scrollHeight;
    }, delay);
  });
};

/* ══════════════════════════════════════
   5. PARTÍCULAS DE FONDO (solo index.html)
   ══════════════════════════════════════ */
const initParticles = () => {
  const container = $('#particles');
  if (!container) return;

  const count = window.innerWidth < 600 ? 15 : 30; // menos en móvil

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    /* Posición aleatoria */
    p.style.left     = `${Math.random() * 100}%`;
    p.style.top      = `${Math.random() * 100}%`;

    /* Tamaño variable */
    const size = Math.random() * 3 + 1;
    p.style.width    = `${size}px`;
    p.style.height   = `${size}px`;

    /* Duración y delay aleatorios */
    p.style.setProperty('--duration', `${6 + Math.random() * 8}s`);
    p.style.setProperty('--delay',    `${Math.random() * 6}s`);

    /* Opacidad máxima variable */
    p.style.opacity  = Math.random() * 0.6 + 0.1;

    container.appendChild(p);
  }
};

/* ══════════════════════════════════════
   6. ACTUALIZAR FECHA EN PANTALLA
   ══════════════════════════════════════ */
const initDates = () => {
  /* Fecha para la cabecera de files.html */
  const dateEl = $('#currentDate');
  if (dateEl) {
    const now    = new Date();
    const yyyy   = now.getFullYear();
    const mm     = String(now.getMonth() + 1).padStart(2, '0');
    const dd     = String(now.getDate()).padStart(2, '0');
    dateEl.textContent = `${yyyy}-${mm}-${dd}`;
  }
};

/* ══════════════════════════════════════
   7. BUSCADOR DE CARPETAS (files.html)
   ══════════════════════════════════════ */
const initSearch = () => {
  const searchInput  = $('#searchInput');
  const foldersGrid  = $('#foldersGrid');
  const noResults    = $('#noResults');
  const searchQuery  = $('#searchQuery');
  const resultsCount = $('#resultsCount');
  const totalCount   = $('#totalCount');

  if (!searchInput || !foldersGrid) return;

  /* Obtener todas las tarjetas */
  const cards = Array.from($$('.folder-card'));

  /* Actualizar total */
  if (totalCount) totalCount.textContent = cards.length;

  /**
   * Filtra las carpetas según el texto de búsqueda y la categoría activa.
   */
  const filterCards = () => {
    const query    = searchInput.value.trim().toLowerCase();
    const filter   = ($('.filter-btn.active')?.dataset.filter) || 'all';
    let   visible  = 0;

    cards.forEach(card => {
      /* Texto de búsqueda en nombre + descripción + archivos */
      const name     = (card.dataset.name    || '').toLowerCase();
      const category = (card.dataset.category || '').toLowerCase();
      const text     = card.textContent.toLowerCase();

      const matchQuery  = !query || name.includes(query) || text.includes(query);
      const matchFilter = filter === 'all' || category === filter;

      if (matchQuery && matchFilter) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    /* Mostrar / ocultar mensaje de sin resultados */
    if (noResults) {
      noResults.style.display = visible === 0 ? 'block' : 'none';
    }
    if (searchQuery) {
      searchQuery.textContent = escapeHtml(searchInput.value);
    }
    if (resultsCount) {
      resultsCount.textContent = visible;
    }
  };

  /* Escuchar input con pequeño debounce para fluidez */
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(filterCards, 150);
  });

  /* Atajo de teclado: CTRL+K / CMD+K enfoca el buscador */
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    /* ESC limpia el buscador */
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      filterCards();
      searchInput.blur();
    }
  });

  /* Inicializar el counter al cargar */
  filterCards();
};

/* ══════════════════════════════════════
   8. BOTONES DE FILTRO (files.html)
   ══════════════════════════════════════ */
const initFilters = () => {
  const filterBtns  = $$('.filter-btn');
  const searchInput = $('#searchInput');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      /* Quitar activo de todos */
      filterBtns.forEach(b => b.classList.remove('active'));
      /* Activar el clickeado */
      btn.classList.add('active');

      /* Re-ejecutar la búsqueda con el nuevo filtro */
      if (searchInput) {
        searchInput.dispatchEvent(new Event('input'));
      }
    });
  });
};

/* ══════════════════════════════════════
   9. ANIMACIÓN DE ENTRADA PARA TARJETAS
      (IntersectionObserver)
   ══════════════════════════════════════ */
const initCardAnimations = () => {
  const cards = $$('.folder-card, .recent-card');
  if (!cards.length) return;

  /* Si el navegador no soporta IntersectionObserver, mostrar todo */
  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.style.opacity = '1');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  cards.forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
};

/* ══════════════════════════════════════
   10. EFECTO DE TIPEO EN EL PATH
       (solo index.html)
   ══════════════════════════════════════ */
const initTypingEffect = () => {
  const pathEl = $('#terminalPath');
  if (!pathEl) return;

  /* Pequeña animación: hacer aparecer el path con retraso */
  pathEl.style.opacity = '0';
  setTimeout(() => {
    pathEl.style.transition = 'opacity 0.5s ease';
    pathEl.style.opacity    = '1';
  }, 300);
};

/* ══════════════════════════════════════
   11. HOVER GLOW EN TARJETAS (touch)
       Para dispositivos táctiles sin hover
   ══════════════════════════════════════ */
const initTouchFeedback = () => {
  /* Solo en dispositivos táctiles */
  if (!('ontouchstart' in window)) return;

  $$('.folder-card, .recent-card').forEach(card => {
    card.addEventListener('touchstart', () => {
      card.style.transform  = 'translateY(-4px)';
      card.style.boxShadow  = '0 8px 30px rgba(176, 96, 255, 0.2)';
    }, { passive: true });

    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
      }, 300);
    }, { passive: true });
  });
};

/* ══════════════════════════════════════
   12. INIT — PUNTO DE ENTRADA
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* Funcionalidades comunes en todas las páginas */
  initNavbar();
  initDates();
  initCardAnimations();
  initTouchFeedback();

  /* Solo para index.html */
  initCounters();
  initTerminal();
  initParticles();
  initTypingEffect();

  /* Solo para files.html */
  initSearch();
  initFilters();

  /* Log amistoso en la consola */
  console.log(
    '%c[ARCHIVE] %cSistema iniciado · Sin cookies · Código libre',
    'color: #b060ff; font-family: monospace; font-weight: bold;',
    'color: #9580c0; font-family: monospace;'
  );
});
