// ── Auto-size resume iframe ────────────────────────────────
const resumeFrame = document.querySelector('.resume-frame');
if (resumeFrame) {
  resumeFrame.addEventListener('load', () => {
    const doc = resumeFrame.contentDocument || resumeFrame.contentWindow.document;
    resumeFrame.style.height = doc.documentElement.scrollHeight + 'px';
  });
}

// ── Carousel ───────────────────────────────────────────────
const slidesContainer = document.getElementById('carouselSlides');
const slides = [...document.querySelectorAll('.carousel-slide')];
const dots = [...document.querySelectorAll('.carousel-dot')];
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

let current = 0;
let animating = false;

const ANIM_SELECTORS = [
  '.greeting', '.hero-name', '.hero-tagline',
  '.about-text',
  '.skill-icon-box',
  '.project-item',
  '.resume-frame',
  '.social-link', '.email-btn'
].join(',');


function goTo(index) {
  if (animating || index === current || index < 0 || index >= slides.length) return;
  animating = true;
  current = index;

  const enterSlide = slides[current];

  // Hide all animated elements before the slide becomes visible
  enterSlide.querySelectorAll(ANIM_SELECTORS + ', .hero-portrait, .about-portrait').forEach(el => { el.style.opacity = '0'; });

  // CSS classes drive all positioning:
  //   slides left of current  → 'slide-left' (translateX(-100%))
  //   current slide           → 'active'      (position: relative, translateX(0))
  //   slides right of current → no class      (translateX(100%) from base CSS)
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'slide-left', 'card-enter');
    if (i < current) slide.classList.add('slide-left');
    else if (i === current) slide.classList.add('active');
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      enterSlide.querySelectorAll(ANIM_SELECTORS + ', .hero-portrait, .about-portrait').forEach(el => {
        el.style.opacity = '';
        el.style.animation = 'none';
      });
      void enterSlide.offsetWidth;
      enterSlide.querySelectorAll(ANIM_SELECTORS + ', .hero-portrait, .about-portrait').forEach(el => {
        el.style.animation = '';
      });
      enterSlide.classList.add('card-enter');
    });
  });

  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;

  setTimeout(() => { animating = false; }, 910);
}

// Init — slide 0 already has 'active' in HTML, height is natural
slides[0].classList.add('card-enter');
prevBtn.disabled = true;
nextBtn.disabled = slides.length <= 1;

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') goTo(current - 1);
  if (e.key === 'ArrowRight') goTo(current + 1);
});

// Swipe navigation
let touchStartX = 0;

function addSwipe(el) {
  el.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  el.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });
}

addSwipe(slidesContainer);
addSwipe(document.querySelector('.resume-touch-overlay'));

// ── Email modal ────────────────────────────────────────────
const emailBtn = document.getElementById('emailBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
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
  modalOverlay.classList.add('closing');
  setTimeout(() => {
    modalOverlay.classList.remove('active', 'closing');
  }, 900);
}
