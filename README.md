# Max Messick — Portfolio

My personal portfolio site: a hand-built, single-page carousel that introduces me, my skills, my projects, and my resume. It's my first project, and I keep improving it as I learn new techniques.

**Live site:** [maxmessickportfolio.vercel.app](https://maxmessickportfolio.vercel.app/)

## Highlights

- **Six-slide carousel** (Portfolio, About, Skills, Projects, Resume, Find Me) with arrow buttons, dot navigation and a sliding indicator, keyboard arrows, and touch swipe on mobile.
- **Original illustrations.** The portraits on the site are my own digital illustrations.
- **Staggered entrance animations** on every slide, including a skills grid whose icons animate in order automatically, however many there are.
- **Typewriter tagline** and a cursor-following highlight on each card.
- **Embedded resume** that sizes itself to its content, with a print-optimized layout and a downloadable PDF.
- **Contact form** in a modal, powered by Formspree.
- **Responsive** layout for desktop, tablet, and phone.

## Built with

- HTML5, CSS3, and vanilla JavaScript, with no framework or build step
- [Formspree](https://formspree.io/) for the contact form
- [Puppeteer](https://pptr.dev/) (headless Chrome) to generate the resume PDF from `resume.html`
- Deployed on [Vercel](https://vercel.com/)
- Developed with [Claude Code](https://claude.com/claude-code) as an AI coding agent, with every change reviewed and tested before committing

## Interesting problems I've solved

**A resume that wouldn't resize.** The embedded resume sometimes stayed stuck at its fallback height. On cached page loads, the iframe's `load` event fired before the script attached its listener, so the resize never ran. After fixing that, testing showed the content kept growing as web fonts finished loading, so a one-time measurement became a `ResizeObserver` that keeps the height in sync.

**A PDF that kept overflowing to two pages.** The print layout was silently collapsing to one column, because the PDF's print width fell below a responsive breakpoint. Adjusting the breakpoint fixed the real cause instead of just shrinking content.

**Animations that didn't scale.** The skill icons' entrance stagger used one hand-written CSS rule per icon, so new icons skipped the animation. Now a few lines of JavaScript give each icon its delay as a CSS variable, spread evenly across the same total time, and new icons join in automatically.

The commit history documents each of these in detail.

## Project structure

```
index.html     The carousel and all slides
style.css      Layout, theming, animations, and responsive breakpoints
script.js      Carousel, animations, resume auto-sizing, contact modal
resume.html    The resume page (also the source for the PDF)
```

## Running locally

No build step needed. Serve the folder with any static server, for example:

```bash
npx serve -l 3000 .
```

Then open http://localhost:3000.

## Contact

- [LinkedIn](https://www.linkedin.com/in/max-messick-3bb639157)
- [GitHub](https://github.com/maxamus87)
