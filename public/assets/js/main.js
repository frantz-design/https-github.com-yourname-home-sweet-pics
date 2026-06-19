// E&L Assets — shared interactivity
document.addEventListener('DOMContentLoaded', () => {

  // ---- Nav scroll state ----
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) scrollTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const navWrap = document.querySelector('.nav-wrap');
    const setBackgroundInert = (state) => {
      Array.from(document.body.children).forEach(el => {
        if (el === menu || el === navWrap) return;
        if (state) el.setAttribute('inert', ''); else el.removeAttribute('inert');
      });
    };
    const closeMenu = (returnFocus) => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      setBackgroundInert(false);
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      setBackgroundInert(isOpen);
      if (isOpen) menu.querySelector('a')?.focus();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu(true);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu(false)));
  }

  // ---- Scroll-to-top ----
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Reveal on scroll ----
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger-scale');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ---- Animated counters ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReduced && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = (target * eased);
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => counterIO.observe(c));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  }

  // ---- FAQ accordion (keyboard-accessible) ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.setAttribute('tabindex', '0');
    q.setAttribute('role', 'button');
    q.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');

    const toggle = () => {
      const wasOpen = item.classList.contains('open');
      const group = item.closest('.faq-list')?.querySelectorAll('.faq-item') || [item];
      group.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    };

    q.addEventListener('click', toggle);
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // ---- Lead form submit (demo handling) ----
  document.querySelectorAll('.lead-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.style.opacity = '.75';
        btn.innerHTML = 'Submitting…';
        setTimeout(() => {
          btn.innerHTML = 'Offer Request Sent ✓';
          form.reset();
          setTimeout(() => { btn.innerHTML = original; btn.disabled = false; btn.style.opacity = '1'; }, 2600);
        }, 1100);
      }
    });
  });

  // ---- Testimonial track: auto-scroll marquee on desktop, snap-scroll on mobile ----
  const isMobileWidth = window.matchMedia('(max-width: 768px)').matches;
  document.querySelectorAll('.test-track').forEach(track => {
    if (!isMobileWidth) {
      track.innerHTML += track.innerHTML;
    }
  });

  // ---- Hero cycling headline words ----
  const cycleWrap = document.getElementById('heroCycle');
  if (cycleWrap) {
    const words = Array.from(cycleWrap.querySelectorAll('.cycle-word'));
    if (words.length > 1) {
      let idx = 0;
      setInterval(() => {
        const current = words[idx];
        const nextIdx = (idx + 1) % words.length;
        const next = words[nextIdx];
        current.classList.remove('is-active');
        current.classList.add('is-leaving');
        next.classList.add('is-active');
        setTimeout(() => current.classList.remove('is-leaving'), 500);
        idx = nextIdx;
      }, 2200);
    }
  }

  // ---- Hero video crossfade sequencer ----
  const heroBg = document.querySelector('.hero-video-bg');
  if (heroBg) {
    const videos = Array.from(heroBg.querySelectorAll('video'));
    const poster = heroBg.querySelector('.hero-poster');
    const tags = Array.from(document.querySelectorAll('#heroSceneTags span'));
    const saveData = navigator.connection && navigator.connection.saveData;

    if (prefersReduced || saveData || videos.length === 0) {
      // Static fallback: keep poster image, skip video entirely.
      videos.forEach(v => v.remove());
    } else {
      let current = 0;
      const setActiveTag = (i) => {
        tags.forEach((t, idx) => t.classList.toggle('is-active', idx === i));
      };

      const playScene = (i) => {
        videos.forEach((v, idx) => v.classList.toggle('is-active', idx === i));
        setActiveTag(i);
        const v = videos[i];
        v.currentTime = 0;
        v.play().catch(() => {});
        // Start buffering the next scene now, so it's ready by the time this one ends.
        const next = videos[(i + 1) % videos.length];
        if (next && next.preload !== 'auto') {
          next.preload = 'auto';
          next.load();
        }
      };

      videos.forEach((v, i) => {
        v.addEventListener('ended', () => {
          current = (i + 1) % videos.length;
          playScene(current);
        });
      });

      // Start once the first video can play; otherwise keep poster visible.
      videos[0].addEventListener('canplay', () => {
        if (poster) poster.style.opacity = '0';
        playScene(0);
      }, { once: true });

      videos[0].load();
    }
  }
});
