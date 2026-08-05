/* ==========================================================
   INVITACIÓN DIGITAL PREMIUM — script.js
   Toda la información del evento vive en el objeto `evento`.
   Edita únicamente este objeto para personalizar la invitación.
   ========================================================== */

const evento = {
  nombre: "Mi Fiesta",
  fecha: "2026-08-08",          // formato YYYY-MM-DD
  hora: "15:00",                 // formato 24h HH:MM
  lugar: "Jardín Rebollar",
  direccion: "San Miguel 26, Vicente Guerrero, 62570 Jiutepec, Mor.",
  googleMaps: "https://www.google.com/maps/place/Jardín+Rebollar/@18.9048775,-99.1626412,17z/data=!3m1!4b1!4m6!3m5!1s0x85ce75c8af78d313:0x8b49c3eff64be135!8m2!3d18.9048775!4d-99.1626412!16s%2Fg%2F11np9315k_!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDgwMi4wIKXMDSoASAFQAw%3D%3D",
  mensaje: "Será un gusto compartir este día contigo. ¡Esperamos contar con tu presencia!",
  estacionamiento: true,
  acompanantes: 1,
  codigoVestimenta: false,
  fechaLimiteConfirmacion: "2026-08-05"
};

/* ==========================================================
   CONFIGURACIÓN DE SUPABASE
   --------------------------------------------------------
   1. Crea un proyecto gratuito en https://supabase.com
   2. Ve a Project Settings -> API
   3. Copia "Project URL" y pégalo en SUPABASE_URL
   4. Copia la "anon public" key y pégala en SUPABASE_ANON_KEY
   Instrucciones completas en README.md
   ========================================================== */
const SUPABASE_URL = "https://kyudezssecqqutgadqbe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dWRlenNzZWNxcXV0Z2FkcWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4ODkyNTcsImV4cCI6MjEwMTQ2NTI1N30.z2xxwoft2DBXZZ8ww4ikqQG_8U-WYofan_fSWqyDa0I";
let supabaseClient = null;
try {
  if (
    window.supabase &&
    SUPABASE_URL &&
    !SUPABASE_URL.includes("PEGA_AQUI") &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes("PEGA_AQUI")
  ) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn("Supabase no se pudo inicializar:", err);
}

/* ==========================================================
   UTILIDADES DE FECHA
   ========================================================== */
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

function parseFechaHora(fechaISO, horaHHMM) {
  const [y, m, d] = fechaISO.split("-").map(Number);
  const [hh, mm] = horaHHMM.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0);
}

function formatearFechaLarga(fechaISO) {
  const [y, m, d] = fechaISO.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

function formatearHora12(horaHHMM) {
  const [hh, mm] = horaHHMM.split(":").map(Number);
  const periodo = hh >= 12 ? "PM" : "AM";
  const hora12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${hora12}:${String(mm).padStart(2, "0")} ${periodo}`;
}

/* ==========================================================
   RENDERIZAR DATOS DEL EVENTO EN EL DOM
   ========================================================== */
function pintarDatosEvento() {
  document.title = `${evento.nombre} — Confirma tu asistencia`;
  document.getElementById("navEventName").textContent = evento.nombre;
  document.getElementById("heroEventName").textContent = evento.nombre;
  document.getElementById("heroMessage").textContent = evento.mensaje;
  document.getElementById("heroDate").textContent = formatearFechaLarga(evento.fecha);
  document.getElementById("heroTime").textContent = formatearHora12(evento.hora);
  document.getElementById("direccionTexto").textContent = evento.direccion;
  document.getElementById("rsvpDeadlineText").textContent =
    `Por favor confirma antes del ${formatearFechaLarga(evento.fechaLimiteConfirmacion)}.`;

  // Mapa embebido y botón
  const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(evento.direccion)}&output=embed`;
  document.getElementById("mapaEmbed").src = mapaSrc;
  document.getElementById("mapaBoton").href = evento.googleMaps;

  // Tarjetas de información
  const infoCards = [
    { icon: "fa-regular fa-calendar", titulo: "Fecha", texto: formatearFechaLarga(evento.fecha) },
    { icon: "fa-regular fa-clock", titulo: "Hora", texto: formatearHora12(evento.hora) },
    { icon: "fa-solid fa-location-dot", titulo: "Lugar", texto: evento.lugar },
    {
      icon: "fa-solid fa-square-parking",
      titulo: "Estacionamiento",
      texto: evento.estacionamiento ? "Sí, contamos con estacionamiento disponible." : "No disponible en el lugar."
    },
    {
      icon: "fa-solid fa-users",
      titulo: "Acompañantes",
      texto: evento.acompanantes > 0
        ? `Puedes llevar hasta ${evento.acompanantes} acompañante${evento.acompanantes > 1 ? "s" : ""}.`
        : "Este evento es solo para invitados directos."
    }
  ];

  if (evento.codigoVestimenta) {
    infoCards.push({ icon: "fa-solid fa-shirt", titulo: "Código de vestimenta", texto: "Formal" });
  }

  const grid = document.getElementById("infoCardsGrid");
  grid.innerHTML = infoCards.map((card, i) => `
    <div class="info-card reveal" data-reveal style="transition-delay:${i * 60}ms">
      <div class="info-card-icon"><i class="${card.icon}"></i></div>
      <h3 class="font-semibold text-lg mb-1.5">${card.titulo}</h3>
      <p class="text-charcoal/65 text-sm leading-relaxed">${card.texto}</p>
    </div>
  `).join("");

  // Volver a observar las nuevas tarjetas con el IntersectionObserver
  observarReveal();
}

/* ==========================================================
   GALERÍA (imágenes de ejemplo — reemplázalas en assets/img/)
   ========================================================== */
const galeriaImagenes = [
  { src: "assets/img/galeria-1.jpg", alt: "Momento especial 1" },
  { src: "assets/img/galeria-2.jpg", alt: "Momento especial 2" },
  { src: "assets/img/galeria-3.jpg", alt: "Momento especial 3" },
  { src: "assets/img/galeria-4.jpg", alt: "Momento especial 4" }
];

function pintarGaleria() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = galeriaImagenes.map((img, i) => `
    <button class="gallery-item reveal" data-reveal style="transition-delay:${i * 70}ms" data-full="${img.src}" aria-label="Ampliar ${img.alt}">
      <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.closest('.gallery-item').style.display='none'" />
    </button>
  `).join("");

  grid.querySelectorAll(".gallery-item").forEach(btn => {
    btn.addEventListener("click", () => abrirLightbox(btn.dataset.full, btn.querySelector("img").alt));
  });

  observarReveal();
}

function abrirLightbox(src, alt) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  img.src = src;
  img.alt = alt;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function cerrarLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

/* ==========================================================
   FAQ — PREGUNTAS FRECUENTES
   ========================================================== */
function pintarFaq() {
  const faqs = [
    {
      pregunta: "¿Hay estacionamiento?",
      respuesta: evento.estacionamiento
        ? "Sí. Contamos con estacionamiento disponible."
        : "El lugar no cuenta con estacionamiento propio."
    },
    {
      pregunta: "¿Puedo llevar acompañante?",
      respuesta: evento.acompanantes > 0
        ? `Sí. Puedes llevar únicamente ${evento.acompanantes} acompañante${evento.acompanantes > 1 ? "s" : ""}.`
        : "Este evento es exclusivo para invitados directos."
    },
    {
      pregunta: "¿Cómo confirmo mi asistencia?",
      respuesta: "Llena el formulario en la sección de confirmación y presiona \"Confirmar asistencia\"."
    },
    {
      pregunta: "¿Hasta cuándo puedo confirmar?",
      respuesta: `Puedes confirmar tu asistencia hasta el ${formatearFechaLarga(evento.fechaLimiteConfirmacion)}.`
    }
  ];

  const acordeon = document.getElementById("faqAccordion");
  acordeon.innerHTML = faqs.map((f, i) => `
    <div class="faq-item reveal" data-reveal style="transition-delay:${i * 60}ms">
      <button class="faq-question" aria-expanded="false">
        <span>${f.pregunta}</span>
        <i class="fa-solid fa-plus"></i>
      </button>
      <div class="faq-answer">${f.respuesta}</div>
    </div>
  `).join("");

  acordeon.querySelectorAll(".faq-item").forEach(item => {
    const boton = item.querySelector(".faq-question");
    const respuesta = item.querySelector(".faq-answer");
    boton.addEventListener("click", () => {
      const abierto = item.classList.contains("open");
      // Cerramos todos los demás para un acordeón limpio
      acordeon.querySelectorAll(".faq-item.open").forEach(other => {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-answer").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !abierto);
      boton.setAttribute("aria-expanded", String(!abierto));
      respuesta.style.maxHeight = !abierto ? respuesta.scrollHeight + "px" : null;
    });
  });

  observarReveal();
}

/* ==========================================================
   CUENTA REGRESIVA
   ========================================================== */
function iniciarCountdown() {
  const objetivo = parseFechaHora(evento.fecha, evento.hora);
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds")
  };

  function actualizar() {
    const ahora = new Date();
    let diff = Math.max(0, objetivo - ahora);

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    els.days.textContent = String(dias).padStart(2, "0");
    els.hours.textContent = String(horas).padStart(2, "0");
    els.minutes.textContent = String(minutos).padStart(2, "0");
    els.seconds.textContent = String(segundos).padStart(2, "0");

    if (diff <= 0) clearInterval(intervalo);
  }

  actualizar();
  const intervalo = setInterval(actualizar, 1000);
}

/* ==========================================================
   FORMULARIO RSVP
   ========================================================== */
function limpiarErrores(form) {
  form.querySelectorAll(".form-error").forEach(el => (el.textContent = ""));
  form.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

function validarFormulario(form) {
  limpiarErrores(form);
  let valido = true;

  const nombre = form.nombre.value.trim();
  if (nombre.length < 3) {
    document.getElementById("error-nombre").textContent = "Escribe tu nombre completo.";
    form.nombre.classList.add("input-error");
    valido = false;
  }

  const asistenciaSeleccionada = form.querySelector('input[name="asistencia"]:checked');
  if (!asistenciaSeleccionada) {
    document.getElementById("error-asistencia").textContent = "Indica si podrás asistir.";
    valido = false;
  }

  return valido;
}

/**
 * Envía la confirmación a Supabase (tabla `rsvp`).
 * Si Supabase no está configurado, muestra un error amigable
 * en lugar de fallar silenciosamente.
 */
async function enviarConfirmacion(datos) {
  if (!supabaseClient) {
    throw new Error("Supabase no está configurado todavía.");
  }

  const { error } = await supabaseClient.from("rsvp").insert([
    {
      nombre: datos.nombre,
      personas: datos.personas,
      asistencia: datos.asistencia,
      comentarios: datos.comentarios || null
    }
  ]);

  if (error) throw error;
}

function inicializarFormularioRsvp() {
  const form = document.getElementById("rsvpForm");
  const submitBtn = document.getElementById("rsvpSubmit");
  const submitText = document.getElementById("rsvpSubmitText");
  const successBox = document.getElementById("rsvpSuccess");
  const errorBox = document.getElementById("rsvpErrorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    successBox.hidden = true;
    errorBox.hidden = true;

    if (!validarFormulario(form)) return;

    const datos = {
      nombre: form.nombre.value.trim(),
      personas: 1, // Campo de número de personas removido del formulario; se guarda un valor por defecto
      asistencia: form.querySelector('input[name="asistencia"]:checked').value,
      comentarios: form.comentarios.value.trim()
    };

    submitBtn.disabled = true;
    submitText.textContent = "Enviando…";

    try {
      await enviarConfirmacion(datos);
      form.reset();
      successBox.hidden = false;
      successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (err) {
      console.error("Error al guardar la confirmación:", err);
      errorBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = "Confirmar asistencia";
    }
  });
}

/* ==========================================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================================== */
let revealObserver = null;

function observarReveal() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }
  document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(el => revealObserver.observe(el));
}

/* ==========================================================
   PARALLAX LIGERO EN EL HERO
   ========================================================== */
function inicializarParallax() {
  const bg = document.querySelector("[data-parallax]");
  if (!bg) return;
  window.addEventListener("scroll", () => {
    const offset = window.scrollY;
    if (offset < window.innerHeight) {
      bg.style.transform = `translateY(${offset * 0.25}px)`;
    }
  }, { passive: true });
}

/* ==========================================================
   BOTÓN VOLVER ARRIBA
   ========================================================== */
function inicializarBackToTop() {
  const btn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ==========================================================
   LOADER INICIAL
   ========================================================== */
function inicializarLoader() {
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.getElementById("loader").classList.add("loader-hidden");
    }, 500);
  });
}

/* ==========================================================
   LIGHTBOX — eventos de cierre
   ========================================================== */
function inicializarLightbox() {
  document.getElementById("lightboxClose").addEventListener("click", cerrarLightbox);
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") cerrarLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarLightbox();
  });
}

/* ==========================================================
   INICIALIZACIÓN GENERAL
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  pintarDatosEvento();
  pintarGaleria();
  pintarFaq();
  iniciarCountdown();
  inicializarFormularioRsvp();
  inicializarLightbox();
  inicializarBackToTop();
  inicializarParallax();
  observarReveal();
});

inicializarLoader();
