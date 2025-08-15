/* ==========================================================================
   CONFIGURACIÓN RÁPIDA
   ========================================================================== */
'use strict';

/** Logo(s) — SOLO CAMBIA LAS RUTAS **/
const LOGO_TOPBAR_SRC = 'assets/jusan-logo.png';        // Topbar centrado
const LOGO_BRAND_SRC  = 'assets/juSan-logo-azul.png';   // Header (izquierda)
const LOGO_ALT_TEXT   = 'JuSan Clean Home';

/** WhatsApp principal (botón grande del hero) **/
const WA_DEFAULT_NUMBER = '50762460648'; // alterno: '50767466919'

/** Formulario de Google **/
const GOOGLE_FORM_URL = 'https://forms.gle/DSvZPWDqCZVSAuYL7';
const REDIRIGIR_SIEMPRE_A_GOOGLE_FORM = false;

/** Slides del carrusel **/
const SLIDES = [
  { type: 'img',   src: 'assets/antes-despues-colchon-danado.png', alt: 'Limpieza de sillón - antes y después' },
  { type: 'img',   src: 'assets/colchon.jpg',                      alt: 'Lavado de colchón - resultado final' },
  { type: 'video', src: 'assets/demo3.mp4',                       alt: 'Proceso de lavado (video)' }
];

/** Flyers (grid) — opcional **/
const FLYERS = [
  // { src: 'assets/flyer1.jpg', alt: 'Promoción 2x1' },
  // { src: 'assets/flyer2.jpg', alt: 'Descuento por temporada' },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/** Año footer */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/** Cargar logos desde config */
(function setLogos() {
  const topbarLogo = $('#topbarLogo');
  const brandLogo  = $('#brandLogo');

  if (topbarLogo && LOGO_TOPBAR_SRC) {
    topbarLogo.src = LOGO_TOPBAR_SRC;
    topbarLogo.alt = LOGO_ALT_TEXT;
  } else if (topbarLogo) {
    topbarLogo.style.display = 'none';
  }

  if (brandLogo && LOGO_BRAND_SRC) {
    brandLogo.src = LOGO_BRAND_SRC;
    brandLogo.alt = LOGO_ALT_TEXT;
  } else if (brandLogo) {
    brandLogo.style.display = 'none';
  }
})();

/** Botón Google Form visible solo si hay URL */
(function setupGoogleBtn() {
  const googleBtn = $('#googleFormLink');
  if (!googleBtn) return;

  if (GOOGLE_FORM_URL && GOOGLE_FORM_URL.trim() !== '') {
    googleBtn.href = GOOGLE_FORM_URL.trim();
  } else {
    googleBtn.addEventListener('click', (e) => e.preventDefault());
    googleBtn.classList.add('is-disabled');
    googleBtn.title = 'Pega tu Google Form en app.js (GOOGLE_FORM_URL)';
  }
})();

/* ==========================================================================
   RENDER DINÁMICO: Carrusel y Flyers
   ========================================================================== */
(function renderMedia() {
  // Carrusel
  const track = $('#carouselTrack');
  if (track) {
    track.innerHTML = '';
    SLIDES.forEach((s) => {
      const slide = document.createElement('div');
      slide.className = 'slide';

      if (s.type === 'img') {
        const img = document.createElement('img');
        img.src = s.src;
        img.alt = s.alt || '';
        img.loading = 'lazy';
        slide.appendChild(img);
      } else if (s.type === 'video') {
        const v = document.createElement('video');
        v.src = s.src;
        v.controls = true;
        v.preload = 'metadata';
        v.setAttribute('aria-label', s.alt || 'Video');
        slide.appendChild(v);
      }

      track.appendChild(slide);
    });
  }

  // Flyers
  const grid = $('#flyersGrid');
  if (!grid) return;

  if (FLYERS.length === 0) {
    grid.style.display = 'none';
  } else {
    grid.style.display = 'grid';
    grid.innerHTML = FLYERS
      .map((f) => `<img src="${f.src}" alt="${f.alt || 'Flyer'}" loading="lazy" />`)
      .join('');
  }
})();

/* ==========================================================================
   CARRUSEL BÁSICO
   ========================================================================== */
(function initCarousel() {
  const track    = $('#carouselTrack');
  const prev     = $('.carousel .prev');
  const next     = $('.carousel .next');
  const dotsWrap = $('#carouselDots');

  if (!track || !prev || !next || !dotsWrap) return;

  const slides = $$('.slide', track);
  let index = 0;

  // Puntos
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  });

  function update() {
    const width = track.getBoundingClientRect().width;
    track.style.transform = `translateX(-${index * width}px)`;
    $$('.carousel__dots button').forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  const ro = new ResizeObserver(update);
  ro.observe(track);
  update();
})();

/* ==========================================================================
   WHATSAPP: Mensaje auto desde el formulario
   ========================================================================== */
function collectFormData() {
  const form = $('#contactForm');
  if (!form) return { nombre: '', telUser: '', servicio: '', ubic: '', mensaje: '' };

  const data = new FormData(form);
  return {
    nombre:   (data.get('Nombre')   || '').trim(),
    telUser:  (data.get('Teléfono') || '').trim(),
    servicio: (data.get('Servicio') || '').trim(),
    ubic:     (data.get('Ubicación')|| '').trim(),
    mensaje:  (data.get('Mensaje')  || '').trim(),
  };
}

function buildWAmessage() {
  const { nombre, telUser, servicio, ubic, mensaje } = collectFormData();
  const filled = nombre || telUser || servicio || ubic || mensaje;

  if (filled) {
    let msg = 'Hola JuSan Clean Home, quiero una cotización.';
    if (nombre)   msg += `\nNombre: ${nombre}`;
    if (telUser)  msg += `\nTeléfono: ${telUser}`;
    if (servicio) msg += `\nServicio: ${servicio}`;
    if (ubic)     msg += `\nUbicación: ${ubic}`;
    if (mensaje)  msg += `\nMensaje: ${mensaje}`;
    return msg;
  }
  return 'Hola JuSan Clean Home, deseo información y cotización.';
}

function openWA(number) {
  const msg = buildWAmessage();
  const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
}

/* Botón principal (hero) */
(function setupMainWA() {
  const btnMainWA = $('#btnWhatsAppMain');
  if (!btnMainWA) return;

  btnMainWA.addEventListener('click', () => {
    const number = btnMainWA.dataset.wa || WA_DEFAULT_NUMBER;
    openWA(number);
  });
})();

/* Tarjetas WA (contacto) */
(function setupContactCards() {
  $$('.wa-card').forEach((btn) => {
    btn.addEventListener('click', () => openWA(btn.dataset.wa));
  });
})();

/* Enlaces de la topbar con números */
(function setupTopbarLinks() {
  $$('.wa-static').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openWA(a.dataset.wa);
    });
  });
})();

/* ==========================================================================
   SUBMIT DEL FORMULARIO: WhatsApp o Google Form (según config)
   ========================================================================== */
(function setupFormSubmit() {
  const form       = $('#contactForm');
  const btn        = $('#submitActionBtn');
  const icon       = $('#submitActionIcon');
  const textSpan   = $('#submitActionText');
  const formMsgEl  = $('#formMsg');

  if (!form || !btn || !icon || !textSpan) return;

  // Determinar acción
  const useGoogleForm = Boolean(REDIRIGIR_SIEMPRE_A_GOOGLE_FORM && GOOGLE_FORM_URL && GOOGLE_FORM_URL.trim() !== '');

  // Ajustar UI del botón
  if (useGoogleForm) {
    icon.className = 'ri-external-link-line';
    textSpan.textContent = 'Ir al Formulario de Google';
  } else {
    icon.className = 'ri-whatsapp-line';
    textSpan.textContent = 'Enviar por WhatsApp';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (useGoogleForm) {
      window.open(GOOGLE_FORM_URL, '_blank', 'noopener');
      if (formMsgEl) formMsgEl.textContent = 'Abriendo formulario de Google…';
      return;
    }

    openWA(WA_DEFAULT_NUMBER);
    if (formMsgEl) formMsgEl.textContent = 'Abriendo WhatsApp…';
  });
})();
