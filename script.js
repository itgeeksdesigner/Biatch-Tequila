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
     4. PRODUCT TRACK — scroll + dots + prev/next arrows
     ============================================================ */
  function initProductTrack() {
    var track    = qs('#productTrack');
    var dots     = qsa('.dot', qs('#productDots'));
    var prevBtn  = qs('#productPrev');
    var nextBtn  = qs('#productNext');

    if (!track) return;

    function cardWidth() {
      var cards = qsa('.product-card', track);
      return cards[0] ? cards[0].offsetWidth + 24 : 0;
    }

    function updateDots() {
      if (!dots.length) return;
      var activeIndex = Math.round(track.scrollLeft / (cardWidth() || 1));
      dots.forEach(function (dot, i) {
        var isActive = i === activeIndex;
        dot.classList.toggle('dot--active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    }

    // Prev / Next arrows
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
      });
    }

    // Click dot to scroll
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(dot.getAttribute('data-index'), 10);
        track.scrollTo({ left: index * cardWidth(), behavior: 'smooth' });
      });
    });

    track.addEventListener('scroll', updateDots, { passive: true });
    updateDots();

    // Tap-to-flip for touch devices (no hover support)
    var cards = qsa('.product-card', track);
    cards.forEach(function (card) {
      var startX = 0;
      card.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });

      card.addEventListener('touchend', function (e) {
        var dx = Math.abs(e.changedTouches[0].clientX - startX);
        if (dx < 10) {
          // It's a tap, not a swipe — toggle flip
          var isFlipped = card.classList.contains('is-flipped');
          // Unflip all others first
          cards.forEach(function (c) { c.classList.remove('is-flipped'); });
          if (!isFlipped) card.classList.add('is-flipped');
        }
      }, { passive: true });

      // Close button on back face
      var closeBtn = qs('.product-card__close-btn', card);
      if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          card.classList.remove('is-flipped');
        });
      }

      // Flip hint button on front
      var flipHint = qs('.product-card__flip-hint', card);
      if (flipHint) {
        flipHint.addEventListener('click', function (e) {
          e.stopPropagation();
          cards.forEach(function (c) { c.classList.remove('is-flipped'); });
          card.classList.add('is-flipped');
        });
      }
    });
  }

  /* ============================================================
     5. RECIPE MODAL — open / close
     ============================================================ */
  function initRecipeModal() {
    var modal        = qs('#recipeModal');
    var closeBtn     = qs('#modalClose');
    var backdrop     = qs('#modalBackdrop');
    var tagEl        = qs('#modalTag');
    var titleEl      = qs('#modalTitle');
    var metaEl       = qs('#modalMeta');
    var ingredList   = qs('#modalIngredients');
    var instructList = qs('#modalInstructions');
    var videoWrap    = qs('#modalVideoWrap');
    var videoEl      = qs('#modalVideo');
    var cards        = qsa('.recipe-card');

    if (!modal || !cards.length) return;

    function openModal(card) {
      var title        = card.getAttribute('data-title') || '';
      var tag          = card.getAttribute('data-tag') || '';
      var spirit       = card.getAttribute('data-spirit') || '';
      var time         = card.getAttribute('data-time') || '';
      var servings     = card.getAttribute('data-servings') || '';
      var videoSrc     = card.getAttribute('data-video') || '';
      var ingredients  = JSON.parse(card.getAttribute('data-ingredients') || '[]');
      var instructions = JSON.parse(card.getAttribute('data-instructions') || '[]');

      // Populate
      if (tagEl)   tagEl.textContent  = tag;
      titleEl.textContent = title;
      if (metaEl)  metaEl.textContent = [spirit, time, servings].filter(Boolean).join(' · ');

      ingredList.innerHTML = ingredients.map(function (ing) {
        return '<li>' + ing + '</li>';
      }).join('');

      instructList.innerHTML = instructions.map(function (step) {
        return '<li>' + step + '</li>';
      }).join('');

      // Video
      if (videoSrc && videoEl && videoWrap) {
        videoEl.src = videoSrc;
        videoWrap.style.display = 'block';
        videoEl.play();
      } else if (videoWrap) {
        videoWrap.style.display = 'none';
      }

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

      // Stop video
      if (videoEl) {
        videoEl.pause();
        videoEl.src = '';
      }
      if (videoWrap) {
        videoWrap.style.display = 'none';
      }
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
     11. AGE VERIFICATION GATE
     ============================================================ */
  function initAgeGate() {
    var gate = qs('#ageGate');
    var yesBtn = qs('#ageYes');
    var noBtn = qs('#ageNo');

    if (!gate) return;

    // If already verified this session, hide immediately
    if (sessionStorage.getItem('biatch_age_verified')) {
      gate.classList.add('is-hidden');
      gate.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      return;
    }

    // Lock scroll while gate is visible
    document.body.classList.add('is-locked');

    function verifyAge() {
      sessionStorage.setItem('biatch_age_verified', '1');
      gate.classList.add('is-hidden');
      gate.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
    }

    function denyAge() {
      window.location.href = 'https://www.google.com';
    }

    if (yesBtn) yesBtn.addEventListener('click', verifyAge);
    if (noBtn) noBtn.addEventListener('click', denyAge);
  }

  /* ============================================================
     12. REVIEW TRACK — prev/next arrows
     ============================================================ */
  function initReviewTrack() {
    var track    = qs('#reviewTrack');
    var prevBtn  = qs('#reviewPrev');
    var nextBtn  = qs('#reviewNext');
    var dotsWrap = qs('#reviewDots');

    if (!track) return;

    function vpWidth() {
      var vp = qs('.reviews__viewport');
      return vp ? vp.offsetWidth : 300;
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var vp = qs('.reviews__viewport');
      if (!vp || !track.scrollWidth) return;
      var pages = Math.max(1, Math.ceil(track.scrollWidth / vp.offsetWidth));
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('span');
        dot.className = 'reviews__dot' + (i === 0 ? ' reviews__dot--active' : '');
        (function (idx) {
          dot.addEventListener('click', function () {
            track.scrollTo({ left: idx * vpWidth(), behavior: 'smooth' });
          });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      var w = vpWidth() || 1;
      var activeIdx = Math.round(track.scrollLeft / w);
      qsa('.reviews__dot', dotsWrap).forEach(function (d, i) {
        d.classList.toggle('reviews__dot--active', i === activeIdx);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -vpWidth(), behavior: 'smooth' });
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: vpWidth(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateDots, { passive: true });
    setTimeout(buildDots, 150);
  }

  /* ============================================================
     13. RECIPE TRACK — prev/next arrows
     ============================================================ */
  function initRecipeTrack() {
    var track   = qs('#recipeTrack');
    var prevBtn = qs('#recipePrev');
    var nextBtn = qs('#recipeNext');

    if (!track) return;

    function cardWidth() {
      var cards = qsa('.recipe-card', track);
      return cards[0] ? cards[0].offsetWidth + 24 : 0;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
      });
    }
  }

  /* ============================================================
     HERO CAROUSEL — auto-rotating slides
     ============================================================ */
  function initHeroCarousel() {
    var slides = qsa('.hero__slide');
    var dots = qsa('.hero__dot');
    if (slides.length < 2) return;

    var current = 0;
    var interval = 5000; // 5 seconds per slide
    var timer;

    function goTo(index) {
      slides[current].classList.remove('hero__slide--active');
      dots[current].classList.remove('hero__dot--active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('hero__slide--active');
      dots[current].classList.add('hero__dot--active');
    }

    function startAuto() {
      timer = setInterval(function () {
        goTo(current + 1);
      }, interval);
    }

    function resetAuto() {
      clearInterval(timer);
      startAuto();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-slide'), 10);
        goTo(idx);
        resetAuto();
      });
    });

    startAuto();
  }

  /* ============================================================
     INIT — DOMContentLoaded
     ============================================================ */
  /* ============================================================
     BRAND STORY TABS
     ============================================================ */
  function initBrandStoryTabs() {
    var tabs = qsa('.brand-story__tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-tab');

        // Deactivate all tabs and panels
        tabs.forEach(function (t) {
          t.classList.remove('brand-story__tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        qsa('.brand-story__panel').forEach(function (p) {
          p.classList.remove('brand-story__panel--active');
          p.hidden = true;
        });

        // Activate clicked tab and its panel
        tab.classList.add('brand-story__tab--active');
        tab.setAttribute('aria-selected', 'true');
        var panel = qs('#storyPanel-' + target);
        if (panel) {
          panel.classList.add('brand-story__panel--active');
          panel.hidden = false;
        }
      });
    });
  }

  /* ============================================================
     AWARDS CAROUSEL
     ============================================================ */
  function initAwardsCarousel() {
    // Use querySelectorAll since element may be inside a hidden tab
    var carousels = qsa('.awards-carousel');
    carousels.forEach(function (carousel) {
      var track = qs('.awards-carousel__track', carousel);
      var prevBtn = qs('.awards-carousel__arrow--prev', carousel);
      var nextBtn = qs('.awards-carousel__arrow--next', carousel);
      var scrollAmt = 200;

      if (prevBtn && track) {
        prevBtn.addEventListener('click', function () {
          track.scrollBy({ left: -scrollAmt, behavior: 'smooth' });
        });
      }
      if (nextBtn && track) {
        nextBtn.addEventListener('click', function () {
          track.scrollBy({ left: scrollAmt, behavior: 'smooth' });
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileNav();
    initHeroCarousel();
    initScrollReveal();
    initProductTrack();
    initRecipeModal();
    initRecipeTrack();
    initReviewTrack();
    initEmailForm();
    initAnchorNav();
    initStoryVideo();
    initSearchDrawer();
    initCartDrawer();
    initAgeGate();
    initBrandStoryTabs();
    initAwardsCarousel();
  });

})();
