// ----------------------------------------------------
// 1. NAMA TAMU DARI URL — ?to=NamaTamu
// ----------------------------------------------------
const params = new URLSearchParams(window.location.search);
const rawName = params.get('to');
const guestName = rawName ? decodeURIComponent(rawName.replace(/\+/g, ' ')) : 'Tamu Undangan';
document.getElementById('guestName').textContent = guestName;
document.title = `Undangan Pernikahan Anwar & Linda — ${guestName}`;

// ----------------------------------------------------
// 2. BUKA UNDANGAN — cinematic crossfade + musik
// ----------------------------------------------------
const cover = document.getElementById('cover');
const openBtn = document.getElementById('openBtn');
const bgMusic = document.getElementById('bgMusic');
const body = document.body;

openBtn.addEventListener('click', () => {
  body.classList.add('is-opening');
  cover.classList.add('cover--closing');

  if (bgMusic.querySelector('source').src) {
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    fadeAudioIn(bgMusic, 0.35, 1800);
  }

  // Let the cinematic crossfade play out, then hand scrolling back to the page
  window.setTimeout(() => {
    body.classList.remove('locked');
    cover.classList.add('cover--hidden');
  }, 1500);
});

function fadeAudioIn(audioEl, target, durationMs) {
  const steps = 30;
  const stepTime = durationMs / steps;
  const increment = target / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    audioEl.volume = Math.min(current, target);
    if (current >= target) clearInterval(timer);
  }, stepTime);
}

// ----------------------------------------------------
// 3. SCROLL REVEAL (Intersection Observer) — fade / leaf / bloom / photo / pollen / polaroid
// ----------------------------------------------------
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // A tiny extra delay on top of each element's own CSS transition-delay
      // keeps the cascade feeling hand-timed rather than mechanical.
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ----------------------------------------------------
// 4. GENTLE PARALLAX — meadow layers drift at different speeds while scrolling
// ----------------------------------------------------
const parallaxLayers = [
  { el: document.querySelector('.meadow--cover .sky'), speed: 0.06 },
  { el: document.querySelector('.meadow--cover .hills'), speed: 0.12 },
  { el: document.querySelector('.meadow--cover .grass'), speed: 0.2 },
];

let ticking = false;
function updateParallax() {
  const y = window.scrollY;
  parallaxLayers.forEach(layer => {
    if (layer.el) layer.el.style.transform = `translate3d(0, ${y * layer.speed}px, 0)`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

// ----------------------------------------------------
// 5. FLOATING PETALS, LEAVES & POLLEN — sparse, slow, alive
// ----------------------------------------------------
const particleField = document.getElementById('particleField');
const MAX_PARTICLES = 8;
let activeParticles = 0;
let nearFooter = false;

function spawnParticle() {
  if (activeParticles >= MAX_PARTICLES) return;

  const types = ['petal', 'petal', 'leaf', 'pollen'];
  const type = types[Math.floor(Math.random() * types.length)];

  const el = document.createElement('span');
  el.className = `particle particle--${type}`;

  const startX = Math.random() * 100;
  const duration = 14 + Math.random() * 10; // 14s - 24s, slow & unhurried
  const sway = 30 + Math.random() * 60;
  const rotateMid = (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 80);
  const rotateEnd = rotateMid + (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 80);
  const opacity = 0.35 + Math.random() * 0.35;
  const size = type === 'pollen' ? 3 + Math.random() * 2 : 8 + Math.random() * 6;

  el.style.setProperty('--start-x', `${startX}vw`);
  el.style.setProperty('--fall-duration', `${duration}s`);
  el.style.setProperty('--sway', `${sway}px`);
  el.style.setProperty('--rotate-mid', `${rotateMid}deg`);
  el.style.setProperty('--rotate-end', `${rotateEnd}deg`);
  el.style.setProperty('--particle-opacity', opacity);
  el.style.setProperty('--particle-size', `${size}px`);

  el.addEventListener('animationend', () => {
    el.remove();
    activeParticles--;
  });

  particleField.appendChild(el);
  activeParticles++;
}

// Base gentle rhythm — a new particle drifts in every couple of seconds
setInterval(() => {
  spawnParticle();
  // Near the closing meadow, let a few more drift down for a "settling" feel
  if (nearFooter && Math.random() > 0.5) spawnParticle();
}, 2200);

// A soft first breath of particles on load
for (let i = 0; i < 3; i++) {
  window.setTimeout(spawnParticle, i * 900);
}

const footerMeadow = document.getElementById('footerMeadow');
if (footerMeadow) {
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { nearFooter = entry.isIntersecting; });
  }, { threshold: 0.25 });
  footerObserver.observe(footerMeadow);
}

// ----------------------------------------------------
// 6. COUNTDOWN TIMER
// ----------------------------------------------------
const weddingDate = new Date('2026-08-16T08:00:00+07:00').getTime();
function updateCountdown() {
  const now = new Date().getTime();
  const dist = weddingDate - now;
  const set = (id, val) => { document.getElementById(id).textContent = String(Math.max(val, 0)).padStart(2, '0'); };
  if (dist < 0) {
    set('cd-days', 0); set('cd-hours', 0); set('cd-minutes', 0); set('cd-seconds', 0);
    return;
  }
  set('cd-days', Math.floor(dist / (1000 * 60 * 60 * 24)));
  set('cd-hours', Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  set('cd-minutes', Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)));
  set('cd-seconds', Math.floor((dist % (1000 * 60)) / 1000));
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ----------------------------------------------------
// 7. SAVE THE DATE (Google Calendar) & LIHAT LOKASI (Maps)
// ----------------------------------------------------
const calDates = '20260816T080000/20260816T120000';
const calText = encodeURIComponent('Tasyakuran Walimatul Ursy - Anwar & Linda');
const calLoc = encodeURIComponent('Hotel Grand Tryas Cirebon');
const calDetails = encodeURIComponent('Tasyakuran pernikahan Dr. Anwar Sanusi, M.Ag. & Linda Handayani, S.Ag.');
document.getElementById('calendarBtn').href =
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calText}&dates=${calDates}&details=${calDetails}&location=${calLoc}`;

document.getElementById('mapsBtn').href =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Hotel Grand Tryas Cirebon')}`;

// ----------------------------------------------------
// 8. RESPECT REDUCED MOTION — stop non-essential motion for users who ask for it
// ----------------------------------------------------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  document.body.classList.add('reduced-motion');
}

// ----------------------------------------------------
// 9. RSVP — kirim ke Google Apps Script (Google Sheet)
// ----------------------------------------------------
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzh1CEryCmISX1fxcixiNxvBQOJ3ee9InK7g1wXRr8Pfz-lElvGIrPaQpZvI9u5gqmvaA/exec';

const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

if (rsvpForm) {
  const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');
  const rsvpLabel = rsvpSubmitBtn.querySelector('.btn-label');
  const defaultLabel = rsvpLabel.textContent;

  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const namaValue = document.getElementById('rsvpNama').value.trim();
    if (!namaValue) return;

    rsvpSubmitBtn.disabled = true;
    rsvpSubmitBtn.classList.add('is-loading');
    rsvpLabel.textContent = 'Mengirim...';

    const formData = new FormData(rsvpForm);
    formData.set('nama', namaValue);
    formData.append('tamuUndangan', guestName);
    formData.append('waktuKirim', new Date().toISOString());

    try {
      // Google Apps Script web apps don't return CORS headers by default,
      // so the response is opaque — a resolved fetch is our success signal.
      await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      rsvpForm.hidden = true;
      document.getElementById('rsvpSuccessName').textContent = namaValue;
      rsvpSuccess.hidden = false;
      rsvpSuccess.classList.add('visible');
    } catch (err) {
      rsvpSubmitBtn.disabled = false;
      rsvpSubmitBtn.classList.remove('is-loading');
      rsvpLabel.textContent = 'Gagal, coba lagi';
      window.setTimeout(() => { rsvpLabel.textContent = defaultLabel; }, 2600);
    }
  });
}
