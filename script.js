// ── Hamburger menu toggle ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksEl.classList.toggle('active');
});

navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksEl.classList.remove('active');
  });
});

// ── Smooth centered scroll for nav links ──────────────────
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const visibleHeight = window.innerHeight - navbarHeight;
    const cardHeight = target.offsetHeight;

    // Center the card in the visible space; if card is taller just clear the navbar
    const offset = cardHeight < visibleHeight
      ? Math.round((visibleHeight - cardHeight) / 2)
      : 0;

    const scrollTo = target.getBoundingClientRect().top + window.scrollY - navbarHeight - offset;
    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  });
});

const emailBtn = document.getElementById('emailBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const sendBtn = document.getElementById('sendBtn');
const emailMsg = document.getElementById('emailMsg');

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

emailBtn.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  emailMsg.focus();
});

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
      setTimeout(() => {
        closeModal();
        contactForm.style.display = 'flex';
        formSuccess.style.display = 'none';
        contactForm.reset();
      }, 2500);
    }
  } catch (err) {
    console.error('Form submission error:', err);
  }
});

function closeModal() {
  modalOverlay.classList.remove('active');
}
