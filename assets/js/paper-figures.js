/* Progressive enhancement: the thumbnail links directly to the figure without JS. */
(() => {
  'use strict';
  const dialog = document.querySelector('.paper-figure-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const fullImage = dialog.querySelector('[data-figure-full]');
  const title = dialog.querySelector('#paper-figure-title');
  const zoom = dialog.querySelector('[data-figure-zoom]');
  const close = dialog.querySelector('[data-figure-close]');
  const viewport = dialog.querySelector('.paper-figure-viewport');
  let trigger = null, savedOverflow = '';
  const setZoom = value => {
    dialog.classList.toggle('is-zoomed', value);
    zoom.textContent = value ? 'Fit to view' : 'Zoom in';
    zoom.setAttribute('aria-pressed', String(value));
    viewport.scrollTop = 0;
    viewport.scrollLeft = 0;
  };
  document.querySelectorAll('[data-paper-figure]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      const thumbnail = link.querySelector('img');
      fullImage.src = link.href;
      fullImage.alt = thumbnail.alt;
      fullImage.width = Number(thumbnail.getAttribute('width'));
      fullImage.height = Number(thumbnail.getAttribute('height'));
      fullImage.style.setProperty('--figure-native-width', fullImage.width + 'px');
      title.textContent = link.dataset.figureTitle;
      setZoom(false);
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  zoom.addEventListener('click', () => setZoom(zoom.getAttribute('aria-pressed') !== 'true'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = savedOverflow;
    setZoom(false);
    if (trigger) trigger.focus({ preventScroll: true });
  });
})();
