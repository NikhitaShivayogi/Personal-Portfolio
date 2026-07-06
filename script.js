/* ===========================
   CERTIFICATE MODAL
=========================== */
const certModal      = document.getElementById('certModal');
const certModalImg   = document.getElementById('certModalImg');
const certModalTitle = document.getElementById('certModalTitle');
const certModalClose = document.getElementById('certModalClose');

document.querySelectorAll('.resume-cert-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const imgSrc = link.getAttribute('data-cert');
    const title  = link.getAttribute('data-title');
    certModalImg.src       = imgSrc;
    certModalImg.alt       = title;
    certModalTitle.textContent = title;
    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

// Close on button
certModalClose.addEventListener('click', closeModal);

// Close on overlay click
certModal.addEventListener('click', (e) => {
  if (e.target === certModal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function closeModal() {
  certModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { certModalImg.src = ''; }, 300);
}

/* ===========================
   THEME TOGGLE
=========================== */
const themeToggle = document.getElementById('themeToggle');
const body        = document.body;

// Load saved preference
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

/* ===========================
   NAVBAR — scroll + active
=========================== */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
});

function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => link.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
}));

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }
});

/* ===========================
   TYPED EFFECT
=========================== */
const roles    = [' Software Engineer', 'Python Enthusiast', 'MCA Graduate 2027', 'Problem Solver', 'Learner'];
let rIdx       = 0;
let cIdx       = 0;
let deleting   = false;
const typedEl  = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const current = roles[rIdx];
  if (!deleting) {
    cIdx++;
    typedEl.textContent = current.slice(0, cIdx);
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    cIdx--;
    typedEl.textContent = current.slice(0, cIdx);
    if (cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 55 : 95);
}
type();

/* ===========================
   INTERSECTION OBSERVER
=========================== */
const animEls = document.querySelectorAll(
  '.hero-content, .hero-image, .about-text, .skills-area, ' +
  '.resume-col, .project-card, .contact-info, .contact-form, ' +
  '.timeline-item, .achievement-item, .highlight-box'
);
animEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animEls.forEach(el => observer.observe(el));

// Skill bar animation
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => fill.classList.add('animate'));
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsArea = document.querySelector('.skills-area');
if (skillsArea) skillObserver.observe(skillsArea);

/* ===========================
   CONTACT FORM
=========================== */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      form.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 4500);
    } catch (error) {
      alert('Unable to send message. Please try again later.');
      console.error('Contact form error:', error);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  });
}
