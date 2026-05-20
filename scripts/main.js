/* ==========================================================================
   T MOBE / NGUNQ — main.js
   Handles:
     1. Nav background change on scroll
     2. Mobile nav toggle
     3. Reveal-on-scroll via IntersectionObserver
     4. Contact form: Formspree submit with mailto fallback
     5. Footer year stamp
   ========================================================================== */

(() => {
  'use strict';


  /* ---------- 1. NAV: scroll state ---------- */
  const nav = document.getElementById('nav');
  const setNavState = () => {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else                     nav.classList.remove('is-scrolled');
  };
  setNavState();
  window.addEventListener('scroll', setNavState, { passive: true });


  /* ---------- 2. MOBILE NAV TOGGLE ---------- */
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click (mobile)
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (links.classList.contains('is-open')) {
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }


  /* ---------- 3. REVEAL ON SCROLL ---------- */
  // Every element with .reveal fades+slides in once visible.
  // Honors `data-delay` (ms) for staggered animations.
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
          setTimeout(() => el.classList.add('is-visible'), delay);
          io.unobserve(el);
        }
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08
    });

    reveals.forEach((el) => io.observe(el));
  } else {
    // Fallback: just show everything immediately
    reveals.forEach((el) => el.classList.add('is-visible'));
  }


  /* ---------- 4. CONTACT FORM ---------- */
  /*
    Behavior:
      Submitting opens the user's SMS app with a prefilled text message
      addressed to Coach Tyrell. To change the destination phone number,
      update COACH_PHONE below.

      The sms: URI scheme works on iOS, Android, and macOS (Messages app).
      On desktop browsers without an SMS handler it may not open anything,
      which is why we also surface the direct text/call links in the side panel.
  */
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  // Coach Tyrell's phone (E.164 format, US +1)
  const COACH_PHONE = '+18574249647';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data    = new FormData(form);
      const name    = (data.get('name')     || '').toString().trim();
      const age     = (data.get('agelevel') || '').toString().trim();
      const message = (data.get('message')  || '').toString().trim();

      // Compose the text body
      const body = [
        `NGUNQ Training Inquiry`,
        `Name: ${name}`,
        `Age / Level: ${age}`,
        ``,
        message
      ].join('\n');

      // iOS uses `&body=`, Android historically used `?body=`.
      // Modern OSes accept the `?body=` form — use that as the broadly compatible default.
      const smsUrl = `sms:${COACH_PHONE}?body=${encodeURIComponent(body)}`;

      window.location.href = smsUrl;
      setStatus('Opening your messages app…', 'is-success');
    });
  }

  function setStatus(msg, cls) {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove('is-success', 'is-error');
    if (cls) status.classList.add(cls);
  }


  /* ---------- 5. LIGHTBOX / GALLERY ---------- */
  /*
    Any <img> with a `data-gallery="<groupname>"` attribute becomes clickable.
    Clicking opens the full image in an overlay; prev/next cycles through
    other images sharing the same group. Keyboard: Esc/← →. Touch: swipe.
  */
  const lightbox      = document.getElementById('lightbox');
  const lbImg         = document.getElementById('lbImg');
  const lbCounter     = document.getElementById('lbCounter');
  const lbClose       = document.getElementById('lbClose');
  const lbPrev        = document.getElementById('lbPrev');
  const lbNext        = document.getElementById('lbNext');

  if (lightbox && lbImg) {

    // Build groups: { groupname: [imgEl, imgEl, ...] }
    const groups = {};
    document.querySelectorAll('img[data-gallery]').forEach((img) => {
      const key = img.dataset.gallery;
      if (!groups[key]) groups[key] = [];
      groups[key].push(img);
    });

    let activeGroup = [];
    let activeIndex = 0;
    let lastTrigger = null;

    const open = (img) => {
      const key = img.dataset.gallery;
      activeGroup = groups[key] || [img];
      activeIndex = activeGroup.indexOf(img);
      if (activeIndex < 0) activeIndex = 0;
      lastTrigger = img;
      render();

      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Move focus into the lightbox for keyboard users
      lbClose.focus({ preventScroll: true });
    };

    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Restore focus to the image that opened the gallery
      if (lastTrigger) {
        try { lastTrigger.focus({ preventScroll: true }); } catch (_) {}
      }
    };

    const render = () => {
      const img = activeGroup[activeIndex];
      if (!img) return;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lbCounter.textContent = `${activeIndex + 1} / ${activeGroup.length}`;

      // Hide arrows when only one image in this group
      const single = activeGroup.length < 2;
      lbPrev.hidden = single;
      lbNext.hidden = single;
    };

    const step = (delta) => {
      if (!activeGroup.length) return;
      activeIndex = (activeIndex + delta + activeGroup.length) % activeGroup.length;
      render();
    };

    // Wire up clicks on every gallery image
    document.querySelectorAll('img[data-gallery]').forEach((img) => {
      // Make focusable for keyboard activation
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');

      img.addEventListener('click', () => open(img));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(img);
        }
      });
    });

    // Controls
    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', () => step(-1));
    lbNext.addEventListener('click', () => step(1));

    // Click on backdrop (outside the image) closes
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape')      close();
      else if (e.key === 'ArrowLeft')  step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });

    // Touch swipe (basic)
    let touchStartX = 0;
    let touchStartY = 0;
    lightbox.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      // Horizontal swipe wins only if clearly more horizontal than vertical
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        step(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  }


  /* ---------- 6. FOOTER YEAR ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
