/* Mobile menu */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open'); hamburger.classList.remove('open');
}));

/* Navbar background on scroll */
const navbar = document.getElementById('navbar');
addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 20), { passive: true });

/* Scroll-reveal */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Active nav link */
const sections = document.querySelectorAll('main section[id]');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) navLinks.querySelectorAll('a').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

/* Copy email + toast */
const toast = document.getElementById('toast');
document.getElementById('copyEmail').addEventListener('click', async (e) => {
  const email = e.currentTarget.dataset.email;
  try { await navigator.clipboard.writeText(email); }
  catch { const t = document.createElement('textarea'); t.value = email; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});

document.getElementById('year').textContent = new Date().getFullYear();

/* ===== Interactive layer ===== */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll progress bar */
const bar = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

/* Typing effect */
const phrases = ['Building secure ASP.NET Core APIs', 'Integrating AI models & agent workflows', 'Shipping containerized multi-service systems'];
const typed = document.getElementById('typed');
if (reduce) typed.textContent = phrases[0];
else {
  let p = 0, c = 0, del = false;
  (function tick() {
    const s = phrases[p];
    typed.textContent = s.slice(0, c);
    if (!del && c === s.length) { del = true; return setTimeout(tick, 1800); }
    if (del && c === 0) { del = false; p = (p + 1) % phrases.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 25 : 55);
  })();
}

/* Counters */
const counters = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
    const t0 = performance.now();
    (function step(t) {
      const k = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + (k === 1 ? suf : '');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
    counters.unobserve(el);
  });
}, { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

if (!reduce && matchMedia('(hover:hover)').matches) {
  /* Cursor glow */
  const glow = document.getElementById('cursorGlow');
  addEventListener('mousemove', e => {
    document.body.classList.add('has-cursor');
    glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  });

  /* 3D tilt + spotlight */
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - .5) * 8) + 'deg');
      card.style.setProperty('--rx', ((.5 - y) * 8) + 'deg');
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
    });
    card.addEventListener('mouseleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  });

  /* Magnetic buttons */
  document.querySelectorAll('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
}

/* Hero particle network */
(function () {
  const cv = document.getElementById('particles');
  if (!cv || reduce) return;
  const ctx = cv.getContext('2d');
  let w, h, pts = [], mouse = { x: -999, y: -999 };
  const resize = () => {
    w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight;
    const n = Math.min(70, Math.floor(w * h / 18000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
  };
  resize(); addEventListener('resize', resize);
  cv.parentElement.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  let visible = true;
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(cv);
  (function draw() {
    requestAnimationFrame(draw);
    if (!visible) return;
    ctx.clearRect(0, 0, w, h);
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = 'rgba(147,129,255,.7)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) { ctx.strokeStyle = `rgba(56,189,248,${.18 * (1 - d / 120)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 150) { ctx.strokeStyle = `rgba(147,129,255,${.4 * (1 - dm / 150)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    });
  })();
})();
