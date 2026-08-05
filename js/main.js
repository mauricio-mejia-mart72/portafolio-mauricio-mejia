/* =========================================================
   Portafolio de fotografía — lógica y animaciones
   ---------------------------------------------------------
   TODO lo que necesitas editar está en el objeto SITE de abajo.
   ========================================================= */

/* ---------------------------------------------------------
   1) CONFIGURACIÓN DEL SITIO  (edita esto)
   --------------------------------------------------------- */

const SITE = {
  nombre: "Mauricio Mejía",
  eyebrow: "Fotografía",
  taglineHero: "",
  email: "mejiamartinezmauricio@gmail.com",

  // Foto del hero (portada)
  hero: "img/hero/hero.jpg",

  // Redes sociales (deja solo las que uses; añade las que quieras)
  redes: [
    { nombre: "Instagram", url: "https://www.instagram.com/mauricio_mejia_mart" },
  ],

  // Categorías del portafolio. Los datos (fotos por categoría) se generan
  // automáticamente en js/galeria.js con: node scripts/build-galeria.mjs
  categorias: window.GALERIAS || [],
};

/* ---------------------------------------------------------
   2) RENDER: construir el DOM a partir de la config
   --------------------------------------------------------- */

const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// Lista plana de todas las fotos, para la navegación del lightbox
const galleryFlat = [];

function aplicarTextos() {
  document.title = `${SITE.nombre} — Fotografía`;
  $("#year").textContent = new Date().getFullYear();
  $("#footerName").textContent = SITE.nombre;

  $(".brand").textContent = "Inicio";

  const eyebrowEl = $(".hero__eyebrow");
  eyebrowEl.textContent = SITE.eyebrow;
  eyebrowEl.style.display = SITE.eyebrow ? "" : "none";

  // Título en líneas enmascaradas (cada palabra sube desde detrás de su línea)
  $(".hero__title").innerHTML = SITE.nombre
    .split(" ")
    .map((w) => `<span class="hero__line"><span class="hero__line-inner">${w}</span></span>`)
    .join("");

  const taglineEl = $(".hero__tagline");
  taglineEl.textContent = SITE.taglineHero;
  taglineEl.style.display = SITE.taglineHero ? "" : "none";
  $("#heroImg").src = SITE.hero;

  $("#contactoRedes").innerHTML = SITE.redes
    .map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener">${r.nombre}</a></li>`)
    .join("");
}

function construirMenu() {
  const menu = $("#menu");
  const entradas = [
    { num: "00", label: "Inicio", href: "#hero", sub: SITE.eyebrow || "Portafolio" },
    ...SITE.categorias.map((c, i) => ({
      num: String(i + 1).padStart(2, "0"),
      label: c.titulo,
      href: `#${c.id}`,
      sub: `${c.fotos.length} fotos`,
    })),
    {
      num: String(SITE.categorias.length + 1).padStart(2, "0"),
      label: "Contacto",
      href: "#contacto",
      sub: SITE.email,
    },
  ];

  menu.innerHTML = `
    <button class="menu__close" id="menuClose" aria-label="Cerrar menú">&times;</button>
    <nav class="menu__nav" aria-label="Navegación">
      ${entradas
        .map(
          (e) => `
        <a class="menu__item" href="${e.href}" data-scroll>
          <span class="menu__num">${e.num}</span>
          <span class="menu__label">${e.label}</span>
          <span class="menu__sub">${e.sub}</span>
        </a>`
        )
        .join("")}
    </nav>
    <div class="menu__foot">
      <span>${SITE.nombre}</span>
      <a href="${SITE.redes[0] ? SITE.redes[0].url : "#"}" target="_blank" rel="noopener">${SITE.redes[0] ? SITE.redes[0].nombre : ""}</a>
    </div>`;
}

// Citas por categoría (+ una de cierre). texto = traducción; orig = original.
const CITAS = {
  retrato: {
    texto: "Todas las fotografías son exactas. Ninguna es la verdad.",
    orig: "All photographs are accurate. None of them is the truth.",
    autor: "Richard Avedon",
  },
  calle: {
    texto: "Cosas misteriosas suceden en lugares familiares.",
    orig: "Mysterious things happen in familiar places.",
    autor: "Saul Leiter",
  },
  paisaje: {
    texto: "Una buena imagen nace de un estado de gracia.",
    orig: "", // original ya en español
    autor: "Sergio Larraín",
  },
  cierre: {
    texto: "La cámara enseña a ver sin cámara.",
    orig: "The camera is an instrument that teaches people how to see without a camera.",
    autor: "Dorothea Lange",
  },
};

function renderCita(cita, code, i) {
  const lado = i % 2 === 0 ? "statement--left" : "statement--right";
  return `
    <section class="statement ${lado}">
      <blockquote class="statement__quote">${cita.texto}</blockquote>
      <span class="statement__rule" aria-hidden="true"></span>
      <div class="statement__meta">
        <span class="statement__author">${cita.autor}</span>
        ${cita.orig ? `<span class="statement__orig">“${cita.orig}”</span>` : ""}
      </div>
    </section>`;
}

// Notas descriptivas que "rompen" el grid (serif, otro tamaño).
// Varias por categoría, con posición, tamaño y lado variados para sorprender.
// pos = tras cuántas fotos · col/row = spans en el grid · align = "right" opcional.
const NOTAS = {
  retrato: [
    { pos: 3, texto: "Dentro de cada persona se esconde un secreto; mi tarea es revelarlo.", autor: "Yousuf Karsh", col: "span 3", row: "span 2" },
    { pos: 11, texto: "Una fotografía es un secreto sobre un secreto.", autor: "Diane Arbus", col: "span 4", row: "span 2", align: "right" },
    { pos: 19, texto: "Cuanto más tiempo miras un objeto, más abstracto se vuelve.", autor: "Lucian Freud", col: "span 3", row: "span 2" },
  ],
  calle: [
    { pos: 5, texto: "La fotografía debe contener la humanidad del momento.", autor: "Robert Frank", col: "span 3", row: "span 2" },
    { pos: 13, texto: "Fotografío para ver cómo se ve el mundo fotografiado.", autor: "Garry Winogrand", col: "span 4", row: "span 2", align: "right" },
    { pos: 20, texto: "Si pudiera decirlo con palabras, no habría razón para pintar.", autor: "Edward Hopper", col: "span 4", row: "span 2" },
  ],
  paisaje: [
    { pos: 4, texto: "No fotografíes el objeto: fotografía lo que hay entre tú y él.", autor: "Minor White", col: "span 3", row: "span 2", align: "right" },
    { pos: 13, texto: "El pintor no pinta solo lo que ve ante sí, también lo que ve dentro de sí.", autor: "Caspar David Friedrich", col: "span 3", row: "span 2" },
  ],
};

function renderNota(n) {
  const cls = n.align === "right" ? "gnote gnote--right" : "gnote";
  return `
    <div class="${cls}" data-reveal style="grid-column:${n.col || "span 3"};grid-row:${n.row || "span 2"};">
      <p class="gnote__text">${n.texto}</p>
      <span class="gnote__author">${n.autor}</span>
    </div>`;
}

function construirGalerias() {
  const cont = $("#galerias");
  cont.innerHTML =
    SITE.categorias
      .map((cat, i) => {
      const itemsArr = cat.fotos.map((foto, localIdx) => {
        const index = galleryFlat.length;
        galleryFlat.push({ ...foto, categoria: cat.titulo });
        const num = String(localIdx + 1).padStart(2, "0");
        const codigo = `${cat.titulo.charAt(0).toUpperCase()}—${num}`;
        const pie = foto.titulo ? ` · ${foto.titulo}` : "";
        return `
            <figure class="gallery__item" data-reveal data-index="${index}">
              <img class="gallery__img" src="${foto.src}" alt="${foto.alt || ""}"
                   ${foto.foco ? `style="object-position:${foto.foco}"` : ""}
                   loading="lazy" decoding="async" />
              <figcaption class="gallery__caption"><span class="gallery__caption-num">${codigo}</span>${pie}</figcaption>
            </figure>`;
      });

      // Insertar las notas descriptivas para romper el grid.
      // De mayor a menor posición para no correr los índices al insertar.
      const notas = [...(NOTAS[cat.id] || [])].sort((a, b) => b.pos - a.pos);
      notas.forEach((n) => {
        itemsArr.splice(Math.min(n.pos, itemsArr.length), 0, renderNota(n));
      });
      const items = itemsArr.join("");

      const total = String(SITE.categorias.length).padStart(2, "0");
      const numCat = String(i + 1).padStart(2, "0");
      const cita = CITAS[cat.id]
        ? renderCita(CITAS[cat.id], numCat, i)
        : "";
      return `
        ${cita}
        <section class="category" id="${cat.id}">
          <span class="category__num" aria-hidden="true">${numCat} — ${cat.titulo}</span>
          <div class="category__head">
            <span class="category__index">[ ${String(i + 1).padStart(2, "0")} / ${total} ]</span>
            <h2 class="category__title" data-reveal>${cat.titulo}</h2>
            ${cat.desc ? `<p class="category__desc" data-reveal>${cat.desc}</p>` : ""}
          </div>
          <div class="gallery">${items}<span class="gline gline--v" style="left:26%"></span><span class="gline gline--v" style="left:71%"></span><span class="gline gline--h" style="top:19%"></span><span class="gline gline--h" style="top:52%"></span><span class="gline gline--h" style="top:86%"></span><span class="gallery__plus" style="left:26%;top:19%">+</span><span class="gallery__plus" style="left:71%;top:52%">+</span><span class="gallery__plus" style="left:26%;top:86%">+</span></div>
        </section>`;
      })
      .join("") +
    (CITAS.cierre ? renderCita(CITAS.cierre, "00", SITE.categorias.length) : "");
}

/* ---------------------------------------------------------
   3) ANIMACIONES (GSAP + ScrollTrigger)
   --------------------------------------------------------- */

const prefiereMenosMovimiento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Instancia global de Lenis (scroll con inercia). Puede quedar null.
let lenis = null;

function iniciarLenis() {
  if (prefiereMenosMovimiento || !window.Lenis) return;

  lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expoOut
    smoothWheel: true,
  });

  // Mantener ScrollTrigger sincronizado con Lenis
  lenis.on("scroll", () => {
    if (window.ScrollTrigger) ScrollTrigger.update();
  });

  // Usar el ticker de GSAP para el bucle de animación de Lenis
  if (window.gsap) {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}

// Muestra todo el contenido sin animación (fallback si no hay GSAP
// o si el usuario prefiere menos movimiento). Evita que títulos/fotos
// queden invisibles si el CDN falla.
function mostrarTodoSinAnimacion() {
  $$("[data-reveal]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
  $$(".gallery__item").forEach((el) => {
    el.style.clipPath = "none";
  });
  $$("[data-hero-el]").forEach((el) => {
    el.style.opacity = "1";
  });
}

// Reveal robusto con IntersectionObserver: añade .is-visible cuando el elemento
// entra en pantalla y la transición CSS hace el resto. No depende de GSAP, de
// las fuentes ni del reloj rAF, así que las fotos SIEMPRE terminan visibles.
function iniciarReveals() {
  const els = $$("[data-reveal]");

  if (prefiereMenosMovimiento || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0 }
  );

  els.forEach((el) => io.observe(el));
}

// Entrada del hero: fija el estado oculto (antes del primer pintado) y lo revela.
// Se llama directo en init (sin rAF) para que NO haya flash del título.
function animarHeroEntrada() {
  if (prefiereMenosMovimiento || !window.gsap) return;
  gsap.set(".hero__line-inner", { yPercent: 120 });
  gsap.set("[data-hero-el]", { opacity: 0, y: 30 });
  gsap.to(".hero__line-inner", {
    yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.13, delay: 0.25,
  });
  gsap.to("[data-hero-el]", {
    opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, delay: 0.65,
  });
}

// Parte una cita en líneas reales (según el ancho actual) y envuelve cada
// línea en una máscara (overflow:hidden) con un inner desplazable. Devuelve
// los inners para animarlos. El corte por línea se hace midiendo offsetTop
// tras el layout, así que debe llamarse con la fuente ya cargada.
function partirEnLineas(el, textoPlano) {
  el.textContent = "";
  const palabras = textoPlano.split(/\s+/).filter(Boolean);
  const spans = palabras.map((p) => {
    const s = document.createElement("span");
    s.className = "cita-w";
    s.textContent = p;
    el.appendChild(s);
    el.appendChild(document.createTextNode(" "));
    return s;
  });
  // Agrupar por línea según la posición vertical resultante.
  const lineas = [];
  let top = null;
  spans.forEach((s) => {
    const t = s.offsetTop;
    if (top === null || Math.abs(t - top) > 4) { lineas.push([]); top = t; }
    lineas[lineas.length - 1].push(s.textContent);
  });
  // Reconstruir con máscaras por línea.
  el.textContent = "";
  const inners = [];
  lineas.forEach((palabrasLinea) => {
    const line = document.createElement("span");
    line.className = "cita-line";
    const inner = document.createElement("span");
    inner.className = "cita-line-inner";
    inner.textContent = palabrasLinea.join(" ");
    line.appendChild(inner);
    el.appendChild(line);
    inners.push(inner);
  });
  return inners;
}

// Citas de categoría: se "arman" con el scroll (máscara por línea + scrub).
// El autor y la traducción entran un beat después, al final del recorrido.
function iniciarCitasScroll() {
  if (prefiereMenosMovimiento || !window.gsap || !window.ScrollTrigger) return;
  const quotes = $$(".statement__quote");
  if (!quotes.length) return;

  let triggers = [];
  const construir = () => {
    triggers.forEach((t) => t && t.kill());
    triggers = [];
    quotes.forEach((q) => {
      if (!q.dataset.raw) q.dataset.raw = q.textContent.trim();
      const inners = partirEnLineas(q, q.dataset.raw);
      const section = q.closest(".statement");
      const rule = section && section.querySelector(".statement__rule");
      const meta = section && section.querySelector(".statement__meta");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: q, start: "top 88%", end: "top 42%", scrub: 0.6 },
      });
      // Cada línea sube desde la máscara con un leve skew que se endereza y
      // un blur que enfoca — sensación de "peso" cinematográfico.
      tl.from(inners, {
        yPercent: 118, skewY: 4, filter: "blur(12px)",
        duration: 1, ease: "power4.out", stagger: 0.5,
      });
      // La hairline dorada se traza al terminar de armarse la frase.
      if (rule) tl.from(rule, { scaleX: 0, duration: 0.6, ease: "power3.inOut" }, "-=0.3");
      if (meta) tl.from(meta, { autoAlpha: 0, y: 22, duration: 0.7, ease: "power2.out" }, "-=0.35");
      triggers.push(tl.scrollTrigger);
    });
    ScrollTrigger.refresh();
  };

  // Cortar líneas con la fuente ya cargada (Anton llega tarde y cambia el wrap).
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(construir);
  else construir();

  // Rehacer si cambia el ancho (el corte de líneas depende del ancho).
  let w = window.innerWidth, tid;
  window.addEventListener("resize", () => {
    if (Math.abs(window.innerWidth - w) < 40) return;
    w = window.innerWidth;
    clearTimeout(tid);
    tid = setTimeout(construir, 200);
  }, { passive: true });
}

function iniciarAnimaciones() {
  if (prefiereMenosMovimiento || !window.gsap) {
    mostrarTodoSinAnimacion();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // (La entrada del hero vive en animarHeroEntrada(), llamada en init SIN el
  //  retardo de rAF, para fijar el estado inicial antes del primer pintado
  //  y evitar el "flash" del título antes de ocultarse.)

  // --- Hero: parallax del fondo ---
  gsap.to("[data-hero-bg]", {
    yPercent: 18,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // (El "reveal" de títulos, textos y fotos lo maneja iniciarReveals() con
  //  IntersectionObserver — no depende de GSAP ni de la carga de fuentes.)

  // --- Parallax de profundidad DENTRO de cada marco (no mueve el marco) ---
  // Se anima la <img> (no el figure) con una escala fija que da margen, para
  // que se desplace sin mostrar bordes y sin que los marcos se traslapen.
  const speeds = [0.6, 1.0, 0.75, 1.15, 0.65, 1.3];
  $$(".gallery__item").forEach((item, i) => {
    const img = item.querySelector(".gallery__img");
    if (!img) return;
    const s = speeds[i % speeds.length];
    gsap.fromTo(
      img,
      { yPercent: -7 * s, scale: 1.2 },
      {
        yPercent: 7 * s,
        scale: 1.2,
        ease: "none",
        scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 0.6 },
      }
    );
  });

  // Citas de categoría que se arman con el scroll.
  iniciarCitasScroll();

  // Recalcular posiciones cuando fuentes e imágenes terminen de cargar.
  // (Anton y las fotos cargan tarde y cambian la altura del layout, lo que
  //  dejaría los disparadores del reveal desalineados.)
  ScrollTrigger.refresh();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("load", () => ScrollTrigger.refresh());
  $$(".gallery__img").forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    }
  });
}

/* ---------------------------------------------------------
   4) HEADER: ocultar/mostrar y estado "scrolled"
   --------------------------------------------------------- */

function iniciarHeader() {
  const header = $("#siteHeader");
  let lastY = 0;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 40);
      // Ocultar al bajar, mostrar al subir (no en el top)
      if (y > lastY && y > 300) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
      lastY = y;
    },
    { passive: true }
  );
}

/* ---------------------------------------------------------
   5) MENÚ OVERLAY (hamburguesa a pantalla completa)
   --------------------------------------------------------- */

function iniciarMenu() {
  const toggle = $("#navToggle");
  const menu = $("#menu");

  const abrir = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
  };
  const cerrar = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
  };

  toggle.addEventListener("click", () =>
    menu.classList.contains("is-open") ? cerrar() : abrir()
  );
  menu.addEventListener("click", (e) => {
    if (e.target.closest("#menuClose") || e.target.closest(".menu__item")) cerrar();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) cerrar();
  });
}

/* ---------------------------------------------------------
   6) SCROLL SUAVE (respeta enlaces con data-scroll)
   --------------------------------------------------------- */

function iniciarScrollSuave() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-scroll]");
    if (!link) return;
    const id = link.getAttribute("href");
    if (!id || !id.startsWith("#")) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -10 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - 10;
      window.scrollTo({ top, behavior: prefiereMenosMovimiento ? "auto" : "smooth" });
    }
  });
}

/* ---------------------------------------------------------
   7) LIGHTBOX
   --------------------------------------------------------- */

function iniciarLightbox() {
  const lb = $("#lightbox");
  const backdrop = $("#lightboxBackdrop");
  const img = $("#lightboxImg");
  const cap = $("#lightboxCaption");
  const ctrls = [$("#lightboxClose"), $("#lightboxPrev"), $("#lightboxNext"), cap];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const puedeFlip = !!window.gsap && !reduce;
  let actual = 0;
  let animando = false;

  const thumbDe = (i) =>
    document.querySelector(`.gallery__item[data-index="${i}"] .gallery__img`);

  const mostrar = (i, fade) => {
    actual = (i + galleryFlat.length) % galleryFlat.length;
    const f = galleryFlat[actual];
    img.src = f.src;
    img.alt = f.alt || "";
    const etiqueta = f.titulo ? `${f.titulo} · ${f.categoria}` : f.categoria;
    cap.textContent = `${etiqueta} — ${actual + 1}/${galleryFlat.length}`;
    if (fade && puedeFlip) gsap.fromTo(img, { autoAlpha: 0.15 }, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
  };

  // Transición FLIP: la imagen del lightbox parte de la posición/tamaño de
  // la miniatura (First) y se anima hasta su posición final (Last).
  // Escala UNIFORME (un solo factor) para no distorsionar la imagen: la
  // miniatura está recortada (cover) y el lightbox va completo (contain),
  // así que sus aspect ratios difieren; escalar sx/sy por separado la
  // estiraría. Usamos el factor que cubre la miniatura.
  const flip = (thumb, opts) => {
    const rL = img.getBoundingClientRect();          // destino (centrado)
    const rF = thumb.getBoundingClientRect();        // origen (miniatura)
    if (!rL.width || !rF.width) return null;
    const s = Math.max(rF.width / rL.width, rF.height / rL.height);
    const dx = (rF.left + rF.width / 2) - (rL.left + rL.width / 2);
    const dy = (rF.top + rF.height / 2) - (rL.top + rL.height / 2);
    const desde = { x: dx, y: dy, scale: s };
    const hasta = { x: 0, y: 0, scale: 1 };
    if (opts.abrir) {
      gsap.set(img, { ...desde, transformOrigin: "center center", autoAlpha: 1 });
      return gsap.to(img, { ...hasta, duration: 0.6, ease: "power3.out", onComplete: opts.onDone });
    }
    return gsap.to(img, { ...desde, duration: 0.45, ease: "power3.in", onComplete: opts.onDone });
  };

  const abrir = (i) => {
    if (animando) return;
    mostrar(i);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    if (!puedeFlip) return;

    lb.classList.add("is-flip");
    animando = true;
    const run = () => {
      gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(ctrls, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, delay: 0.28 });
      const thumb = thumbDe(actual);
      const tw = thumb && flip(thumb, { abrir: true, onDone: () => { animando = false; } });
      if (!tw) { gsap.set(img, { autoAlpha: 1 }); animando = false; }
    };
    if (img.complete && img.naturalWidth) requestAnimationFrame(run);
    else img.addEventListener("load", () => requestAnimationFrame(run), { once: true });
  };

  const finalizarCierre = () => {
    lb.classList.remove("is-open", "is-flip");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (window.gsap) gsap.set(img, { clearProps: "all" });
    if (lenis) lenis.start();
    animando = false;
  };

  const cerrar = () => {
    if (animando) return;
    if (!puedeFlip) { finalizarCierre(); return; }
    animando = true;
    gsap.to(backdrop, { autoAlpha: 0, duration: 0.4, ease: "power2.in" });
    gsap.to(ctrls, { autoAlpha: 0, duration: 0.2 });
    const thumb = thumbDe(actual);
    const rF = thumb && thumb.getBoundingClientRect();
    const visible = rF && rF.bottom > 0 && rF.top < window.innerHeight;
    if (visible && flip(thumb, { abrir: false, onDone: finalizarCierre })) return;
    gsap.to(img, { autoAlpha: 0, duration: 0.3, onComplete: finalizarCierre });
  };

  $("#galerias").addEventListener("click", (e) => {
    const item = e.target.closest(".gallery__item");
    if (item) abrir(Number(item.dataset.index));
  });
  $("#lightboxClose").addEventListener("click", cerrar);
  $("#lightboxPrev").addEventListener("click", () => { if (!animando) mostrar(actual - 1, true); });
  $("#lightboxNext").addEventListener("click", () => { if (!animando) mostrar(actual + 1, true); });
  backdrop.addEventListener("click", cerrar);
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") cerrar();
    if (e.key === "ArrowLeft" && !animando) mostrar(actual - 1, true);
    if (e.key === "ArrowRight" && !animando) mostrar(actual + 1, true);
  });
}

/* ---------------------------------------------------------
   8) PRELOADER
   --------------------------------------------------------- */

function ocultarPreloader() {
  const pre = $("#preloader");
  window.addEventListener("load", () => {
    setTimeout(() => pre.classList.add("is-hidden"), 300);
  });
  // Respaldo por si "load" tarda demasiado
  setTimeout(() => pre.classList.add("is-hidden"), 2500);
}

/* ---------------------------------------------------------
   FORMULARIO DE CONTACTO (envía por mailto, sin backend)
   --------------------------------------------------------- */

function iniciarFormulario() {
  const form = $("#contactForm");
  if (!form) return;
  const status = $("#formStatus");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const nombre = (d.get("nombre") || "").toString().trim();
    const correo = (d.get("correo") || "").toString().trim();
    const telefono = (d.get("telefono") || "").toString().trim();
    const asunto = (d.get("asunto") || "").toString().trim();
    if (!nombre || !correo) {
      status.textContent = "Completa al menos nombre y correo.";
      return;
    }
    const subject = asunto ? `Contacto — ${asunto}` : "Contacto desde el portafolio";
    const body =
      `Nombre: ${nombre}\nCorreo: ${correo}\nTeléfono: ${telefono}\n\nMensaje:\n`;
    window.location.href =
      `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Abriendo tu correo…";
  });
}

/* ---------------------------------------------------------
   SCROLL NAV (navegación editorial fija a la derecha)
   --------------------------------------------------------- */

function iniciarScrollNav() {
  const nav = $("#scrollnav");
  if (!nav) return;
  const secciones = [
    { id: "hero", num: "01", label: "Inicio" },
    ...SITE.categorias.map((c, i) => ({
      id: c.id,
      num: String(i + 2).padStart(2, "0"),
      label: c.titulo,
    })),
    { id: "contacto", num: String(SITE.categorias.length + 2).padStart(2, "0"), label: "Contacto" },
  ];

  nav.innerHTML = secciones
    .map(
      (s) => `
      <a class="scrollnav__item" href="#${s.id}" data-scroll data-target="${s.id}" aria-label="${s.label}">
        <span class="scrollnav__label">${s.label}</span>
        <span class="scrollnav__num">${s.num}</span>
      </a>`
    )
    .join("");

  const items = {};
  $$(".scrollnav__item", nav).forEach((a) => (items[a.dataset.target] = a));

  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && items[e.target.id]) {
          Object.values(items).forEach((a) => a.classList.remove("is-active"));
          items[e.target.id].classList.add("is-active");
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );
  secciones.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) io.observe(el);
  });
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */

function init() {
  aplicarTextos();
  animarHeroEntrada(); // fija/oculta el hero antes del primer pintado (sin flash)
  construirMenu();
  construirGalerias();

  iniciarReveals();
  iniciarLenis();
  iniciarHeader();
  iniciarMenu();
  iniciarScrollSuave();
  iniciarScrollNav();
  iniciarFormulario();
  iniciarLightbox();
  ocultarPreloader();

  // Espera a que las imágenes tengan dimensiones para calcular triggers
  requestAnimationFrame(iniciarAnimaciones);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
