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

const slideTitles = ['Portfolio', 'About', 'Skills', 'Projects', 'Resume', 'Find Me'];

// Declared early so startTypewriter() can be called during init
const taglineEl = document.querySelector('.hero-tagline');
const taglineText = taglineEl.textContent;
let typewriterTimer = null;

const dotsContainer = document.querySelector('.carousel-dots');
const indicator = document.createElement('span');
indicator.className = 'dot-indicator';
dotsContainer.appendChild(indicator);

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

  const previous = current;
  const forward = index > previous;
  current = index;

  const enterSlide = slides[current];
  const exitSlide = slides[previous];

  // Hide animated content in entering slide
  enterSlide.querySelectorAll(ANIM_SELECTORS + ', .hero-portrait, .about-portrait')
    .forEach(el => { el.style.opacity = '0'; });

  // Pin entering slide's off-screen start position via inline style
  enterSlide.style.transform = forward ? 'translateX(100%)' : 'translateX(-100%)';

  // Update classes — exit slide gets explicit directional exit class
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'slide-left', 'slide-exit-right', 'card-enter');
    if (i === previous) {
      slide.classList.add(forward ? 'slide-left' : 'slide-exit-right');
    } else if (i < current) {
      slide.classList.add('slide-left');
    } else if (i === current) {
      slide.classList.add('active');
    }
  });

  // Reflow commits the inline start position, then clearing it triggers the transition to 0
  void enterSlide.offsetWidth;
  enterSlide.style.transform = '';

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
  arrowPrev.disabled = current === 0;
  arrowNext.disabled = current === slides.length - 1;
  moveIndicator();
  document.title = `Max Messick — ${slideTitles[current]}`;
  if (current === 0) startTypewriter();

  setTimeout(() => { animating = false; }, 910);
}

// Init — slide 0 already has 'active' in HTML, height is natural
slides[0].classList.add('card-enter');
startTypewriter();
prevBtn.disabled = true;
nextBtn.disabled = slides.length <= 1;

document.querySelector('.logo').addEventListener('click', (e) => {
  e.preventDefault();
  goTo(0);
});

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

const arrowPrev = document.getElementById('arrowPrev');
const arrowNext = document.getElementById('arrowNext');
arrowPrev.addEventListener('click', () => goTo(current - 1));
arrowNext.addEventListener('click', () => goTo(current + 1));
arrowPrev.disabled = true;

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') goTo(current - 1);
  if (e.key === 'ArrowRight') goTo(current + 1);
});

// Swipe navigation
function addSwipe(el) {
  let startX = 0;
  let startY = 0;
  let isHorizontal = null;

  el.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isHorizontal = null;
  }, { passive: true });

  el.addEventListener('touchmove', (e) => {
    if (isHorizontal === null) {
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (dx > 5 || dy > 5) isHorizontal = dx > dy;
    }
    if (isHorizontal) e.preventDefault();
  }, { passive: false });

  el.addEventListener('touchend', (e) => {
    if (!isHorizontal) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });
}

addSwipe(slidesContainer);

// Add swipe to iframe content once loaded (same-origin allows this)
const resumeFrameEl = document.querySelector('.resume-frame');
if (resumeFrameEl) {
  resumeFrameEl.addEventListener('load', () => {
    try {
      addSwipe(resumeFrameEl.contentDocument.body);
    } catch(e) {}
  });
}

// ── Sliding dot indicator ──────────────────────────────────
function moveIndicator() {
  const activeDot = dots[current];
  const containerRect = dotsContainer.getBoundingClientRect();
  const dotRect = activeDot.getBoundingClientRect();
  indicator.style.width = `${dotRect.width}px`;
  indicator.style.left = `${dotRect.left - containerRect.left}px`;
}

moveIndicator();
window.addEventListener('resize', moveIndicator);

// ── Typewriter effect on hero tagline ─────────────────────
function startTypewriter() {
  clearTimeout(typewriterTimer);
  taglineEl.textContent = '';
  let i = 0;
  function type() {
    if (i < taglineText.length) {
      taglineEl.textContent += taglineText[i++];
      typewriterTimer = setTimeout(type, 30);
    }
  }
  typewriterTimer = setTimeout(type, 1650);
}

// ── Cursor highlight ───────────────────────────────────────
document.querySelectorAll('.card, .dark-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--mouse-x', '-9999px');
    card.style.setProperty('--mouse-y', '-9999px');
  });
});

// ── Footer year ────────────────────────────────────────────
document.querySelector('.site-footer p').innerHTML = `Max Messick &copy; ${new Date().getFullYear()}`;

// ── Email modal ────────────────────────────────────────────
const emailBtn = document.getElementById('emailBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const emailMsg = document.getElementById('emailMsg');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

emailBtn.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  document.getElementById('emailInput').focus();
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
