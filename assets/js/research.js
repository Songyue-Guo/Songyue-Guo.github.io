(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.theme-toggle');
  const applyTheme = dark => {
    root.dataset.theme = dark ? 'dark' : 'light';
    toggle?.setAttribute('aria-pressed', String(dark));
  };
  let saved;
  try { saved = localStorage.getItem('sg-theme'); } catch (_) {}
  const preference = matchMedia('(prefers-color-scheme: dark)');
  applyTheme(saved ? saved === 'dark' : preference.matches);
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const dark = root.dataset.theme !== 'dark';
      applyTheme(dark);
      saved = dark ? 'dark' : 'light';
      try { localStorage.setItem('sg-theme', saved); } catch (_) {}
    });
  }
  preference.addEventListener('change', event => { if (!saved) applyTheme(event.matches); });

  // Visible by default; only a working observer can prepare reveals.
  const targets = [...document.querySelectorAll([
    '.hero-copy > *', '.portrait-panel', '.section-heading', '.topic', '.paper',
    '#news .timeline-row', '.background', '.column-title', '.education-item',
    '.award', '.archive', '.contact', 'footer'
  ].join(', '))];
  const animations = new Map();
  let observer;
  const canAnimate = typeof Element.prototype.animate === 'function';
  const cancelAnimation = element => {
    animations.get(element)?.cancel();
    animations.delete(element);
  };
  const reveal = (element, delay = 0) => {
    observer?.unobserve(element);
    element.classList.remove('reveal-pending');
    cancelAnimation(element);
    if (reducedMotion.matches || !canAnimate) return;
    try {
      const animation = element.animate([
        { opacity: 0, transform: 'translateY(22px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 640, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' });
      animations.set(element, animation);
      const clean = () => {
        if (animations.get(element) === animation) animations.delete(element);
      };
      animation.onfinish = clean;
      animation.oncancel = clean;
    } catch (_) { /* The visible state is already restored. */ }
  };
  const showAll = () => {
    observer?.disconnect();
    observer = undefined;
    targets.forEach(element => {
      element.classList.remove('reveal-pending');
      cancelAnimation(element);
    });
  };
  if (!reducedMotion.matches && canAnimate && 'IntersectionObserver' in window) {
    try {
      observer = new IntersectionObserver(entries => {
        let index = 0;
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.hidden) {
            reveal(entry.target, Math.min(index++ * 65, 195));
          }
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
      targets.forEach(element => {
        observer.observe(element);
        element.classList.add('reveal-pending');
      });
    } catch (_) { showAll(); }
  }
  // Keyboard focus, printing and motion changes must never leave text hidden.
  document.addEventListener('focusin', event => {
    const element = event.target.closest('.reveal-pending');
    if (element) {
      observer?.unobserve(element);
      element.classList.remove('reveal-pending');
      cancelAnimation(element);
    }
  });
  window.addEventListener('beforeprint', showAll);
  window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
  reducedMotion.addEventListener('change', event => { if (event.matches) showAll(); });

  const papers = [...document.querySelectorAll('.paper')];
  const filters = document.querySelector('.filters');
  const status = document.querySelector('.filter-status');
  if (filters) {
    ['All', ...new Set(papers.map(p => p.dataset.topic))].forEach(topic => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'filter'; button.textContent = topic;
      button.setAttribute('aria-pressed', String(topic === 'All'));
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-pressed') === 'true') return;
        filters.querySelectorAll('button').forEach(b => {
          b.setAttribute('aria-pressed', String(b === button));
        });
        papers.forEach(paper => {
          cancelAnimation(paper);
          observer?.unobserve(paper);
          paper.classList.remove('reveal-pending');
          paper.hidden = topic !== 'All' && paper.dataset.topic !== topic;
        });
        let index = 0;
        papers.filter(paper => !paper.hidden).forEach(paper => {
          const bounds = paper.getBoundingClientRect();
          if (bounds.top < window.innerHeight - 24 && bounds.bottom > 0) {
            reveal(paper, Math.min(index++ * 65, 195));
          } else if (observer && !reducedMotion.matches) {
            observer.observe(paper);
            paper.classList.add('reveal-pending');
          }
        });
        if (status) status.textContent = papers.filter(p => !p.hidden).length + ' publications shown';
        scheduleProgress();
      });
      filters.append(button);
    });
    filters.hidden = papers.length < 2;
  }

  // Passive scrolling with one frame update, without a polling loop.
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);
  let progressFrame = 0;
  function scheduleProgress() {
    if (progressFrame) return;
    progressFrame = requestAnimationFrame(() => {
      const range = root.scrollHeight - root.clientHeight;
      const ratio = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      progress.style.transform = 'scaleX(' + ratio + ')';
      progressFrame = 0;
    });
  }
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress);
  window.addEventListener('load', scheduleProgress);
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', scheduleProgress));
  if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
  scheduleProgress();
})();
