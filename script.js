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

sendBtn.addEventListener('click', () => {
  if (emailMsg.value.trim()) {
    closeModal();
    emailMsg.value = '';
  }
});

function closeModal() {
  modalOverlay.classList.remove('active');
}
