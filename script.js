/* ============================================================
   BIATCH TEQUILA — SCRIPT.JS
   All JavaScript functionality for the homepage.
   Modules: Header, Mobile Nav, Scroll Reveal,
            Product Dots, Recipe Modal, Form, Smooth Nav
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     UTILITY
     ============================================================ */
  function qs(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }

  function qsa(selector, ctx) {
    return Array.from((ctx || document).querySelectorAll(selector));
  }

  /* ============================================================
     1. HEADER — scroll state
     ============================================================ */
  function initHeader() {
    var header = qs('#siteHeader');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 20) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     2. MOBILE NAV — open / close
     ============================================================ */
  function initMobileNav() {
    var toggle   = qs('#menuToggle');
    var nav      = qs('#mobileNav');
    var closeBtn = qs('#mobileNavClose');
    var backdrop = qs('#navBackdrop');

    if (!toggle || !nav) return;

    function openNav() {
      nav.classList.add('is-open');
      nav.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('is-visible');
      document.body.classList.add('is-locked');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('is-visible');
      document.body.classList.remove('is-locked');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    backdrop.addEventListener('click', closeNav);

    // Close on any mobile nav link click
    qsa('.mobile-nav__link', nav).forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ============================================================
     3. SCROLL REVEAL — intersection observer
     ============================================================ */
  function initScrollReveal() {
    var elements = qsa('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      elements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger delay based on siblings
          var siblings = qsa('.reveal', entry.target.parentElement);
          var idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = (idx * 60) + 'ms';
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold:  0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     4. PRODUCT TRACK — scroll + dots sync
     ============================================================ */
  function initProductTrack() {
    var track = qs('#productTrack');
    var dots  = qsa('.dot', qs('#productDots'));

    if (!track || !dots.length) return;

    function updateDots() {
      var cards       = qsa('.product-card', track);
      var scrollLeft  = track.scrollLeft;
      var cardWidth   = cards[0] ? cards[0].offsetWidth + 24 : 1; // card width + gap
      var activeIndex = Math.round(scrollLeft / cardWidth);

      dots.forEach(function (dot, i) {
        var isActive = i === activeIndex;
        dot.classList.toggle('dot--active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    }

    // Click dot to scroll
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index     = parseInt(dot.getAttribute('data-index'), 10);
        var cards     = qsa('.product-card', track);
        var cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
        track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      });
    });

    track.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
  }

  /* ============================================================
     5. RECIPE MODAL — open / close
     ============================================================ */
  function initRecipeModal() {
    var modal        = qs('#recipeModal');
    var closeBtn     = qs('#modalClose');
    var backdrop     = qs('#modalBackdrop');
    var titleEl      = qs('#modalTitle');
    var posterEl     = qs('#modalPoster');
    var ingredList   = qs('#modalIngredients');
    var instructList = qs('#modalInstructions');
    var cards        = qsa('.recipe-card');

    if (!modal || !cards.length) return;

    function openModal(card) {
      var title       = card.getAttribute('data-title') || '';
      var videoPoster = card.getAttribute('data-video-poster') || '';
      var ingredients = JSON.parse(card.getAttribute('data-ingredients') || '[]');
      var instructions = JSON.parse(card.getAttribute('data-instructions') || '[]');

      // Populate
      titleEl.textContent = title;
      posterEl.src        = videoPoster;
      posterEl.alt        = title + ' cocktail recipe video';

      ingredList.innerHTML = ingredients.map(function (ing) {
        return '<li>' + ing + '</li>';
      }).join('');

      instructList.innerHTML = instructions.map(function (step) {
        return '<li>' + step + '</li>';
      }).join('');

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');

      // Focus management
      setTimeout(function () { closeBtn.focus(); }, 50);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () { openModal(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
      // Make cards keyboard-accessible
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'View recipe: ' + (card.getAttribute('data-title') || ''));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Close modal CTA links should also close modal
    var ctaBtn = qs('#modalShopBtn', modal);
    if (ctaBtn) {
      ctaBtn.addEventListener('click', closeModal);
    }
  }

  /* ============================================================
     6. EMAIL FORM — basic validation
     ============================================================ */
  function initEmailForm() {
    var form  = qs('#consumerForm');
    var input = qs('#consumerEmail');

    if (!form || !input) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = input.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailPattern.test(email)) {
        input.style.borderColor = '#FF7579';
        input.focus();
        return;
      }

      input.style.borderColor = '';

      // Success state — replace form with confirmation
      var panel = form.closest('.email-capture__panel');
      var note  = document.createElement('p');
      note.className = 'email-capture__note';
      note.style.color = '#D6A432';
      note.style.fontSize = '15px';
      note.textContent = "You're in. Welcome to the club.";
      form.replaceWith(note);
    });

    // Clear error state on input
    input.addEventListener('input', function () {
      input.style.borderColor = '';
    });
  }

  /* ============================================================
     7. SMOOTH ANCHOR NAV — close mobile nav on link click
     ============================================================ */
  function initAnchorNav() {
    qsa('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;

        var target = qs(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================================
     8. STORY VIDEO PLAY — placeholder interaction
     ============================================================ */
  function initStoryVideo() {
    var frames = qsa('.story-video__frame');

    frames.forEach(function (frame) {
      var playBtn = qs('.story-video__play', frame);
      if (!playBtn) return;

      playBtn.addEventListener('click', function () {
        // Placeholder: in production, this would swap in an <iframe> or <video>
        var poster = qs('.story-video__poster', frame);
        if (poster) {
          poster.style.opacity = '0.3';
        }
        playBtn.style.display = 'none';

        var placeholder = document.createElement('div');
        placeholder.style.cssText = [
          'position: absolute',
          'inset: 0',
          'display: flex',
          'align-items: center',
          'justify-content: center',
          'color: rgba(255,255,255,0.5)',
          'font-family: Helvetica Neue, sans-serif',
          'font-size: 14px',
          'letter-spacing: 2px',
          'text-transform: uppercase'
        ].join(';');
        placeholder.textContent = 'Video coming soon';
        frame.appendChild(placeholder);
      });
    });
  }

  /* ============================================================
     9. SEARCH DRAWER — open / close
     ============================================================ */
  function initSearchDrawer() {
    var drawer   = qs('#searchDrawer');
    var openBtn  = qs('#searchBtn');
    var closeBtn = qs('#searchClose');
    var backdrop = qs('#searchBackdrop');
    var input    = qs('#searchInput');
    var form     = qs('#searchForm');

    if (!drawer || !openBtn) return;

    function openSearch() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      openBtn.setAttribute('aria-expanded', 'true');
      // Auto-focus input after transition
      setTimeout(function () {
        if (input) input.focus();
      }, 300);
    }

    function closeSearch() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    }

    openBtn.addEventListener('click', openSearch);
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    if (backdrop) backdrop.addEventListener('click', closeSearch);

    // Close on tag link click
    qsa('.search-drawer__tag', drawer).forEach(function (tag) {
      tag.addEventListener('click', closeSearch);
    });

    // Prevent form submit default (static page)
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input && input.value.trim()) {
          closeSearch();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeSearch();
      }
    });
  }

  /* ============================================================
     10. CART DRAWER — open / close
     ============================================================ */
  function initCartDrawer() {
    var drawer   = qs('#cartDrawer');
    var openBtn  = qs('#cartBtn');
    var closeBtn = qs('#cartClose');
    var backdrop = qs('#cartBackdrop');

    if (!drawer || !openBtn) return;

    function openCart() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      openBtn.setAttribute('aria-expanded', 'true');
      setTimeout(function () {
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    function closeCart() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    }

    openBtn.addEventListener('click', openCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (backdrop) backdrop.addEventListener('click', closeCart);

    // Close mobile nav shop links should close cart too
    var shopBtn = qs('.cart-drawer__checkout', drawer);
    if (shopBtn) shopBtn.addEventListener('click', closeCart);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeCart();
      }
    });
  }

  /* ============================================================
     11. CART POPUP — timed welcome notification
     ============================================================ */
  function initCartPopup() {
    var popup    = qs('#cartPopup');
    var closeBtn = qs('#cartPopupClose');
    var ctaBtn   = qs('#cartPopupCta');

    if (!popup) return;

    // Only show once per session
    if (sessionStorage.getItem('biatch_popup_seen')) return;

    var showTimer   = null;
    var dismissTimer = null;

    function showPopup() {
      popup.classList.add('is-visible');
      popup.setAttribute('aria-hidden', 'false');
      sessionStorage.setItem('biatch_popup_seen', '1');

      // Auto-dismiss after 7 seconds
      dismissTimer = setTimeout(hidePopup, 7000);
    }

    function hidePopup() {
      popup.classList.remove('is-visible');
      popup.setAttribute('aria-hidden', 'true');
      clearTimeout(dismissTimer);
    }

    // Show after 3.5 seconds
    showTimer = setTimeout(showPopup, 3500);

    if (closeBtn) closeBtn.addEventListener('click', hidePopup);

    // Hide when CTA is clicked
    if (ctaBtn) {
      ctaBtn.addEventListener('click', function () {
        hidePopup();
      });
    }

    // Clean up if user leaves the page quickly
    window.addEventListener('beforeunload', function () {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    });
  }

  /* ============================================================
     INIT — DOMContentLoaded
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileNav();
    initScrollReveal();
    initProductTrack();
    initRecipeModal();
    initEmailForm();
    initAnchorNav();
    initStoryVideo();
    initSearchDrawer();
    initCartDrawer();
    initCartPopup();
  });

})();
