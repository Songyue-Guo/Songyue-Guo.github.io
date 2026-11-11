/* Eight-second paper storyboards. No third-party player or animation dependency. */
(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (typeof Element.prototype.animate !== 'function') return;

  document.querySelectorAll('[data-paper-animation]').forEach(card => {
    const kind = card.dataset.paperAnimation;
    if (kind !== 'mega' && kind !== 'fqora') return;
    const animationName = kind === 'fqora' ? ' FQora market animation' : ' evidence-selection animation';
    const button = card.querySelector('.mega-play');
    const label = card.querySelector('[data-play-label]');
    const icon = card.querySelector('.mega-play-icon');
    const duration = Math.min(15000, Math.max(3000, Number(card.dataset.duration) || 8000));
    let animations = [], state = 'idle', inView = false, seen = false, userPaused = false;
    let startTimer = 0;
    const updateButton = () => {
      button.hidden = motion.matches;
      const playing = state === 'playing';
      label.textContent = playing ? 'Pause' : state === 'paused' ? 'Play' : 'Replay';
      icon.textContent = playing ? 'Ⅱ' : state === 'paused' ? '▷' : '↻';
      button.setAttribute('aria-label', (playing ? 'Pause' : state === 'paused' ? 'Resume' : 'Replay') + animationName);
      card.dataset.playback = state;
    };
    const cancelTimer = () => { clearTimeout(startTimer); startTimer = 0; };
    const stop = () => {
      cancelTimer();
      animations.forEach(a => { a.onfinish = null; a.cancel(); });
      animations = []; state = 'idle'; userPaused = false;
      updateButton();
    };
    const pause = manual => {
      if (state !== 'playing') return;
      animations.forEach(a => a.pause());
      state = 'paused'; userPaused = manual;
      updateButton();
    };
    const resume = (manual = false) => {
      if (state !== 'paused' || motion.matches || document.hidden || (!inView && !manual)) return;
      animations.forEach(a => a.play());
      state = 'playing'; userPaused = false;
      updateButton();
    };
    const track = (name, frames) => {
      const target = card.querySelector('[data-track="' + name + '"]');
      if (!target) return null;
      const a = target.animate(frames, { duration, fill: 'both', easing: 'linear' });
      a.pause(); a.currentTime = 0;
      animations.push(a);
      return a;
    };
    const opacity = (name, points) => track(name, points.map(([offset, value]) => ({ offset, opacity: value })));
    const appear = (name, at, distance = 8) => track(name, [
      { offset: 0, opacity: 0, transform: 'translateY(' + distance + 'px)' },
      { offset: at, opacity: 0, transform: 'translateY(' + distance + 'px)', easing: 'cubic-bezier(.2,.8,.2,1)' },
      { offset: Math.min(at + .055, 1), opacity: 1, transform: 'translateY(0)' },
      { offset: 1, opacity: 1, transform: 'translateY(0)' }
    ]);
    const play = () => {
      if (motion.matches || document.hidden) return;
      stop(); seen = true;
      try {

        if (kind === 'fqora') {
          // One persistent market; information, prices and utilities change over eight seconds.
          appear('fq-seller', .01, 7); appear('fq-buyer', .04, 7); appear('fq-arbiter', .10, 5);
          opacity('fq-phase-query', [[0,1],[.21,1],[.24,0],[1,0]]);
          opacity('fq-phase-price', [[0,0],[.21,0],[.25,1],[.44,1],[.48,0],[1,0]]);
          opacity('fq-phase-balance', [[0,0],[.44,0],[.48,1],[.80,1],[.84,0],[1,0]]);
          opacity('fq-phase-result', [[0,0],[.80,0],[.85,1],[1,1]]);
          track('fq-query-packet', [
            {offset:0,opacity:0,transform:'translateX(0)'},
            {offset:.10,opacity:0,transform:'translateX(0)'},
            {offset:.13,opacity:1,transform:'translateX(0)'},
            {offset:.22,opacity:1,transform:'translateX(-24px)'},
            {offset:.24,opacity:0,transform:'translateX(-24px)'},
            {offset:1,opacity:0,transform:'translateX(-24px)'}
          ]);
          track('fq-data-packet', [
            {offset:0,opacity:0,transform:'translateX(0)'},
            {offset:.20,opacity:0,transform:'translateX(0)'},
            {offset:.23,opacity:1,transform:'translateX(0)'},
            {offset:.32,opacity:1,transform:'translateX(24px)'},
            {offset:.34,opacity:0,transform:'translateX(24px)'},
            {offset:1,opacity:0,transform:'translateX(24px)'}
          ]);
          track('fq-halo', [
            {offset:0,opacity:0,transform:'scale(.9)'},
            {offset:.26,opacity:0,transform:'scale(.9)'},
            {offset:.32,opacity:.6,transform:'scale(1)'},
            {offset:.42,opacity:0,transform:'scale(1.2)'},
            {offset:.46,opacity:0,transform:'scale(.9)'},
            {offset:.53,opacity:.5,transform:'scale(1)'},
            {offset:.65,opacity:0,transform:'scale(1.2)'},
            {offset:.69,opacity:0,transform:'scale(.9)'},
            {offset:.74,opacity:.4,transform:'scale(1)'},
            {offset:.84,opacity:0,transform:'scale(1.2)'},
            {offset:1,opacity:0,transform:'scale(1.2)'}
          ]);
          // Schematic utility trade-offs, settling near one another without implying equality.
          track('fq-seller-utility', [
            {offset:0,opacity:.4,transform:'scaleX(.35)'},
            {offset:.30,opacity:.4,transform:'scaleX(.35)'},
            {offset:.42,opacity:1,transform:'scaleX(1.25)'},
            {offset:.58,opacity:1,transform:'scaleX(.72)'},
            {offset:.72,opacity:1,transform:'scaleX(1.10)'},
            {offset:.83,opacity:1,transform:'scaleX(1)'},
            {offset:1,opacity:1,transform:'scaleX(1)'}
          ]);
          track('fq-buyer-utility', [
            {offset:0,opacity:.4,transform:'scaleX(1.2)'},
            {offset:.30,opacity:.4,transform:'scaleX(1.2)'},
            {offset:.42,opacity:1,transform:'scaleX(.55)'},
            {offset:.58,opacity:1,transform:'scaleX(1.15)'},
            {offset:.72,opacity:1,transform:'scaleX(.92)'},
            {offset:.83,opacity:1,transform:'scaleX(1)'},
            {offset:1,opacity:1,transform:'scaleX(1)'}
          ]);
        } else {
        // Stage 1: candidate evidence; reranking fades as the hidden-state route opens.
        opacity('scene-pool', [[0,1],[.185,1],[.22,0],[1,0]]);
        opacity('scene-features', [[0,0],[.19,0],[.22,1],[.515,1],[.55,0],[1,0]]);
        opacity('scene-selection', [[0,0],[.525,0],[.555,1],[.825,1],[.86,0],[1,0]]);
        opacity('scene-result', [[0,0],[.835,0],[.875,1],[1,1]]);
        for (let i=0; i<6; i++) appear('pool-doc-' + i, .012 + i*.014, 12);
        opacity('rank-route', [[0,.7],[.08,.7],[.16,.22],[1,.22]]);
        appear('hidden-route', .075, 6);
        // Stage 2: middle-layer activations produce four information-gain features.
        for (let i=0; i<5; i++) track('layer-' + i, [
          {offset:0,opacity:.35,transform:'translateY(0)'},
          {offset:.23+i*.018,opacity:.35,transform:'translateY(0)'},
          {offset:.26+i*.018,opacity:1,transform:'translateY(-4px)'},
          {offset:.31+i*.018,opacity:i===0||i===4?.4:1,transform:'translateY(0)'},
          {offset:1,opacity:i===0||i===4?.4:1,transform:'translateY(0)'}
        ]);
        for (let i=0; i<4; i++) appear('feature-' + i, .28+i*.035, 6);
        track('feature-scan', [
          {offset:0,opacity:0,transform:'translateX(0)'},
          {offset:.30,opacity:0,transform:'translateX(0)'},
          {offset:.32,opacity:.7,transform:'translateX(0)'},
          {offset:.48,opacity:.7,transform:'translateX(315px)'},
          {offset:.50,opacity:0,transform:'translateX(315px)'},
          {offset:1,opacity:0,transform:'translateX(315px)'}
        ]);
        appear('gain-node', .41, 0);
        // Stage 3: joint selection. Two complementary documents cover A/B/C.
        for (let i=0; i<6; i++) {
          const selected = i===1 || i===4;
          track('candidate-' + i, [
            {offset:0,opacity:1,transform:'scale(1)'},
            {offset:.59,opacity:1,transform:'scale(1)'},
            {offset:.68,opacity:selected?1:.2,transform:selected?'scale(1.08)':'scale(.94)'},
            {offset:.76,opacity:selected?1:.2,transform:selected?'scale(1.02)':'scale(.94)'},
            {offset:1,opacity:selected?1:.2,transform:selected?'scale(1.02)':'scale(.94)'}
          ]);
        }
        appear('coverage-ab', .61, 0);
        appear('coverage-c', .69, 0);
        appear('set-connectors', .64, 0);
        appear('covered-A', .67, 0); appear('covered-B', .69, 0); appear('covered-C', .75, 0);
        appear('set-count', .76, 0);
        // Stage 4: selected evidence supports the cited answer; retain this frame.
        appear('result-doc-1', .845, 8); appear('result-doc-2', .865, 8);
        appear('result-flow', .88, 0); appear('result-answer', .90, 6);
        }
        const clock = track('progress', [{transform:'scaleX(0)'},{transform:'scaleX(1)'}]);
        if (!clock) { stop(); return; }
        clock.onfinish = () => {
          animations.forEach(a => { a.onfinish = null; a.cancel(); });
          animations = []; state = 'idle'; userPaused = false;
          updateButton();
        };
        state = 'playing';
        animations.forEach(a => a.play());
        updateButton();
      } catch (_) { stop(); }
    };
    const syncVisibility = () => {
      if (!inView || document.hidden) { cancelTimer(); pause(false); return; }
      if (state === 'paused' && !userPaused) resume();
      else if (!seen && !motion.matches && !startTimer) {
        // Let the publication row's entrance animation finish first.
        startTimer = setTimeout(() => { startTimer=0; if(inView && !document.hidden) play(); }, 650);
      }
    };
    button.addEventListener('click', () => {
      if (state === 'playing') pause(true);
      else if (state === 'paused') resume(true);
      else play();
    });
    card.addEventListener('pointerenter', () => {
      if (finePointer.matches && seen && state === 'idle' && inView) play();
    });
    if ('IntersectionObserver' in window) {
      try {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => { inView = entry.isIntersecting && entry.intersectionRatio >= .35; });
          syncVisibility();
        }, { threshold: [0, .35] });
        observer.observe(card);
      } catch (_) { inView = true; /* Manual playback still works. */ }
    } else { inView = true; /* No offscreen autoplay without an observer. */ }
    document.addEventListener('visibilitychange', syncVisibility);
    window.addEventListener('beforeprint', stop);
    window.addEventListener('pagehide', stop);
    motion.addEventListener('change', () => { stop(); if (!motion.matches) syncVisibility(); });
    updateButton();
  });
})();
