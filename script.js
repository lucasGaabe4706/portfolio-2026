/* ============================================================
   NAVIGATION — scroll state & active link tracking
   ============================================================ */

const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const linkEls   = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  syncActiveLink();
}, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function syncActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let active = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) active = s.id;
  });
  linkEls.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${active}`);
  });
}

/* ============================================================
   TYPEWRITER
   ============================================================ */

const roles = [
  'Full Stack Developer',
  'Frontend Developer',
  'React Developer',
  'Node.js Developer',
  'Problem Solver',
];

const twEl    = document.getElementById('typewriter');
let ri        = 0;
let ci        = 0;
let deleting  = false;

function tick() {
  const word = roles[ri % roles.length];

  if (deleting) {
    ci--;
  } else {
    ci++;
  }

  twEl.textContent = word.slice(0, ci);

  let delay = deleting ? 45 : 95;

  if (!deleting && ci === word.length) {
    delay = 2000;
    deleting = true;
  } else if (deleting && ci === 0) {
    deleting = false;
    ri++;
    delay = 380;
  }

  setTimeout(tick, delay);
}

tick();

/* ============================================================
   SCROLL ANIMATIONS — Intersection Observer
   ============================================================ */

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));

/* ============================================================
   SMOOTH SCROLL — respects nav height
   ============================================================ */

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
  });
});

/* ============================================================
   PROJECT CARD — stagger link transition on hover
   ============================================================ */

document.querySelectorAll('.project-card').forEach(card => {
  const links = card.querySelectorAll('.plink');
  links.forEach((link, i) => {
    link.style.transitionDelay = `${i * 0.05}s`;
  });
});

/* ============================================================
   SKILL ITEMS — subtle stagger on section enter
   ============================================================ */

const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const items = entry.target.querySelectorAll('.skill-item');
      items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';
        item.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'none';
          });
        });
      });
      skillObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.skill-group').forEach(g => skillObserver.observe(g));

/* ============================================================
   FOOTER — current year
   ============================================================ */

const copy = document.querySelector('.footer-copy');
if (copy) {
  copy.textContent = copy.textContent.replace(/\d{4}/, new Date().getFullYear());
}
