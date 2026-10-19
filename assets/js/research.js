(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const applyTheme = (dark) => {
    root.dataset.theme = dark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(dark));
  };
  let saved;
  try { saved = localStorage.getItem('sg-theme'); } catch (_) {}
  const preference = matchMedia('(prefers-color-scheme: dark)');
  applyTheme(saved ? saved === 'dark' : preference.matches);
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    applyTheme(dark);
    saved = dark ? 'dark' : 'light';
    try { localStorage.setItem('sg-theme', saved); } catch (_) {}
  });
  preference.addEventListener('change', (event) => { if (!saved) applyTheme(event.matches); });
  const papers = [...document.querySelectorAll('.paper')];
  const filters = document.querySelector('.filters');
  const status = document.querySelector('.filter-status');
  ['All', ...new Set(papers.map(p => p.dataset.topic))].forEach(topic => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'filter'; button.textContent = topic;
    button.setAttribute('aria-pressed', String(topic === 'All'));
    button.addEventListener('click', () => {
      filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      papers.forEach(p => { p.hidden = topic !== 'All' && p.dataset.topic !== topic; });
      status.textContent = `${papers.filter(p => !p.hidden).length} publications shown`;
    });
    filters.append(button);
  });
  filters.hidden = papers.length < 2;
})();
