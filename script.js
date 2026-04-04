/* ============================================
   BIATCH TEQUILA — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── MOBILE DRAWER ── */
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawerClose = document.querySelector('.drawer-close');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', function () {
    closeDrawer();
    closeSearch();
    closeCart();
  });

  /* ── SEARCH DRAWER ── */
  var searchToggle = document.querySelector('.search-toggle');
  var searchDrawer = document.querySelector('.search-drawer');
  var searchClose = document.querySelector('.search-drawer-close');

  function openSearch() {
    searchDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    var input = searchDrawer.querySelector('input');
    if (input) input.focus();
  }

  function closeSearch() {
    if (searchDrawer) searchDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  /* ── CART DRAWER ── */
  var cartToggle = document.querySelector('.cart-toggle');
  var cartDrawer = document.querySelector('.cart-drawer');
  var cartClose = document.querySelector('.cart-drawer-close');

  function openCart() {
    cartDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);

  /* Cart shop btn closes drawer */
  var cartShopBtn = document.querySelector('.cart-shop-btn');
  if (cartShopBtn) {
    cartShopBtn.addEventListener('click', closeCart);
  }

  /* ── HERO SLIDESHOW ── */
  const heroWrapper = document.querySelector('.hero-slides-wrapper');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrevBtn = document.querySelector('.hero-arrow-prev');
  const heroNextBtn = document.querySelector('.hero-arrow-next');
  const heroPauseBtn = document.querySelector('.hero-pause');
  let heroIndex = 0;
  let heroAutoplay = null;
  let heroIsPaused = false;

  function goToHeroSlide(index) {
    if (index < 0) index = heroSlides.length - 1;
    if (index >= heroSlides.length) index = 0;
    heroIndex = index;
    heroWrapper.style.transform = 'translateX(-' + (heroIndex * 100) + '%)';
    heroDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === heroIndex);
    });
  }

  function startHeroAutoplay() {
    heroAutoplay = setInterval(function () {
      goToHeroSlide(heroIndex + 1);
    }, 5000);
  }

  function stopHeroAutoplay() {
    clearInterval(heroAutoplay);
  }

  if (heroSlides.length > 0) {
    startHeroAutoplay();

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', function () {
        goToHeroSlide(heroIndex - 1);
        stopHeroAutoplay();
        if (!heroIsPaused) startHeroAutoplay();
      });
    }

    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', function () {
        goToHeroSlide(heroIndex + 1);
        stopHeroAutoplay();
        if (!heroIsPaused) startHeroAutoplay();
      });
    }

    heroDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToHeroSlide(i);
        stopHeroAutoplay();
        if (!heroIsPaused) startHeroAutoplay();
      });
    });

    if (heroPauseBtn) {
      heroPauseBtn.addEventListener('click', function () {
        heroIsPaused = !heroIsPaused;
        if (heroIsPaused) {
          stopHeroAutoplay();
          heroPauseBtn.innerHTML = '<i class="ph ph-play"></i>';
        } else {
          startHeroAutoplay();
          heroPauseBtn.innerHTML = '<i class="ph ph-pause"></i>';
        }
      });
    }
  }

  /* ── PRODUCT CARD FLIP ── */
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(function (card) {
    var flipIcon = card.querySelector('.product-flip-icon');
    var closeBtn = card.querySelector('.tasting-close');
    var inner = card.querySelector('.product-card-image-inner');

    function flipCard(e) {
      e.preventDefault();
      e.stopPropagation();
      if (inner) {
        var isFlipped = card.classList.contains('flipped');
        if (isFlipped) {
          inner.style.transform = 'rotateY(0deg)';
          card.classList.remove('flipped');
        } else {
          inner.style.transform = 'rotateY(180deg)';
          card.classList.add('flipped');
        }
      }
    }

    function unflipCard(e) {
      e.preventDefault();
      e.stopPropagation();
      if (inner) {
        inner.style.transform = 'rotateY(0deg)';
        card.classList.remove('flipped');
      }
    }

    if (flipIcon) flipIcon.addEventListener('click', flipCard);
    if (closeBtn) closeBtn.addEventListener('click', unflipCard);
  });

  /* ── BRAND STORY TABS ── */
  var storyTabs = document.querySelectorAll('.brand-story-tab');
  var storyPanels = document.querySelectorAll('.brand-story-panel');

  storyTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');

      storyTabs.forEach(function (t) {
        t.classList.remove('brand-story-tab-active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('brand-story-tab-active');
      this.setAttribute('aria-selected', 'true');

      storyPanels.forEach(function (panel) {
        if (panel.id === 'storyPanel-' + target) {
          panel.hidden = false;
          panel.classList.add('brand-story-panel-active');
        } else {
          panel.hidden = true;
          panel.classList.remove('brand-story-panel-active');
        }
      });
    });
  });

  /* ── RECIPE SLIDER ── */
  var recipeTrack = document.getElementById('recipeTrack');
  var recipeCards = recipeTrack ? recipeTrack.querySelectorAll('.recipe-card') : [];
  var recipePrevBtn = document.getElementById('recipePrev');
  var recipeNextBtn = document.getElementById('recipeNext');
  var recipeDots = document.querySelectorAll('#recipeDots .slider-dot');
  var recipeIdx = 0;

  function getRecipePerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4;
  }

  function updateRecipeDots() {
    recipeDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === recipeIdx);
    });
  }

  function updateRecipeSlider() {
    if (!recipeTrack || recipeCards.length === 0) return;
    var perView = getRecipePerView();
    var maxIdx = Math.max(0, recipeCards.length - perView);
    if (recipeIdx > maxIdx) recipeIdx = maxIdx;
    var cardWidth = recipeCards[0].offsetWidth;
    var gap = parseInt(getComputedStyle(recipeTrack).gap) || 24;
    recipeTrack.style.transform = 'translateX(-' + (recipeIdx * (cardWidth + gap)) + 'px)';
    updateRecipeDots();
  }

  if (recipePrevBtn) {
    recipePrevBtn.addEventListener('click', function () {
      recipeIdx = Math.max(0, recipeIdx - 1);
      updateRecipeSlider();
    });
  }

  if (recipeNextBtn) {
    recipeNextBtn.addEventListener('click', function () {
      var perView = getRecipePerView();
      var maxIdx = Math.max(0, recipeCards.length - perView);
      recipeIdx = Math.min(maxIdx, recipeIdx + 1);
      updateRecipeSlider();
    });
  }

  recipeDots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      recipeIdx = i;
      updateRecipeSlider();
    });
  });

  window.addEventListener('resize', updateRecipeSlider);

  /* ── RECIPE MODAL ── */
  var recipeModal = document.getElementById('recipeModal');
  var recipeModalBackdrop = document.getElementById('recipeModalBackdrop');
  var recipeModalClose = document.getElementById('recipeModalClose');
  var recipeModalVideo = document.getElementById('recipeModalVideo');
  var recipeModalVideoWrap = document.getElementById('recipeModalVideoWrap');
  var recipeModalTag = document.getElementById('recipeModalTag');
  var recipeModalTitle = document.getElementById('recipeModalTitle');
  var recipeModalMeta = document.getElementById('recipeModalMeta');
  var recipeModalIngredients = document.getElementById('recipeModalIngredients');
  var recipeModalInstructions = document.getElementById('recipeModalInstructions');
  var recipeModalShare = document.getElementById('recipeModalShare');
  var recipeModalPrint = document.getElementById('recipeModalPrint');

  function openRecipeModal(card) {
    if (!recipeModal) return;
    var title = card.getAttribute('data-title') || '';
    var tag = card.getAttribute('data-tag') || '';
    var spirit = card.getAttribute('data-spirit') || '';
    var time = card.getAttribute('data-time') || '';
    var servings = card.getAttribute('data-servings') || '';
    var videoSrc = card.getAttribute('data-video') || '';
    var ingredients = [];
    var instructions = [];

    try { ingredients = JSON.parse(card.getAttribute('data-ingredients') || '[]'); } catch (e) {}
    try { instructions = JSON.parse(card.getAttribute('data-instructions') || '[]'); } catch (e) {}

    recipeModalTag.textContent = tag;
    recipeModalTitle.textContent = title;
    recipeModalMeta.textContent = spirit + ' \u00B7 ' + time + ' \u00B7 ' + servings;

    if (videoSrc && recipeModalVideo) {
      recipeModalVideo.src = videoSrc;
      recipeModalVideoWrap.style.display = 'block';
    } else {
      recipeModalVideoWrap.style.display = 'none';
    }

    recipeModalIngredients.innerHTML = '';
    ingredients.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      recipeModalIngredients.appendChild(li);
    });

    recipeModalInstructions.innerHTML = '';
    instructions.forEach(function (step) {
      var li = document.createElement('li');
      li.textContent = step;
      recipeModalInstructions.appendChild(li);
    });

    recipeModal.classList.add('open');
    recipeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (recipeModalVideo && videoSrc) {
      recipeModalVideo.play().catch(function () {});
    }
  }

  function closeRecipeModal() {
    if (!recipeModal) return;
    recipeModal.classList.remove('open');
    recipeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (recipeModalVideo) {
      recipeModalVideo.pause();
      recipeModalVideo.src = '';
    }
  }

  recipeCards.forEach(function (card) {
    card.addEventListener('click', function () {
      openRecipeModal(card);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') openRecipeModal(card);
    });
  });

  if (recipeModalClose) recipeModalClose.addEventListener('click', closeRecipeModal);
  if (recipeModalBackdrop) recipeModalBackdrop.addEventListener('click', closeRecipeModal);

  if (recipeModalShare) {
    recipeModalShare.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: recipeModalTitle.textContent, url: window.location.href });
      }
    });
  }

  if (recipeModalPrint) {
    recipeModalPrint.addEventListener('click', function () {
      window.print();
    });
  }

  /* ── SIGHTINGS SLIDER DOTS ── */
  var sightingsGrid = document.querySelector('.sightings-grid');
  var sightingsDots = document.querySelectorAll('.sightings-slider-controls .slider-dot');

  if (sightingsGrid && sightingsDots.length > 0) {
    sightingsGrid.addEventListener('scroll', function () {
      var scrollLeft = sightingsGrid.scrollLeft;
      var cardWidth = sightingsGrid.children[0].offsetWidth + 16;
      var activeIndex = Math.round(scrollLeft / cardWidth);
      sightingsDots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === activeIndex);
      });
    });

    sightingsDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        var card = sightingsGrid.children[i];
        if (card) {
          sightingsGrid.scrollTo({ left: card.offsetLeft - sightingsGrid.offsetLeft, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── RECIPES SLIDER DOTS ── */
  var recipesGrid = document.querySelector('.recipes-grid');
  var recipesDots = document.querySelectorAll('.recipes-slider-controls .slider-dot');

  if (recipesGrid && recipesDots.length > 0) {
    recipesGrid.addEventListener('scroll', function () {
      var scrollLeft = recipesGrid.scrollLeft;
      var cardWidth = recipesGrid.children[0].offsetWidth + 16;
      var activeIndex = Math.round(scrollLeft / cardWidth);
      recipesDots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === activeIndex);
      });
    });

    recipesDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        var card = recipesGrid.children[i];
        if (card) {
          recipesGrid.scrollTo({ left: card.offsetLeft - recipesGrid.offsetLeft, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── MULTICOLUMN SLIDER DOTS ── */
  var multiGrid = document.querySelector('.multicolumn-grid');
  var multiDots = document.querySelectorAll('.multicolumn-slider-controls .slider-dot');

  if (multiGrid && multiDots.length > 0) {
    multiGrid.addEventListener('scroll', function () {
      var scrollLeft = multiGrid.scrollLeft;
      var cardWidth = multiGrid.children[0].offsetWidth;
      var activeIndex = Math.round(scrollLeft / cardWidth);
      multiDots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === activeIndex);
      });
    });

    multiDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        var card = multiGrid.children[i];
        if (card) {
          multiGrid.scrollTo({ left: card.offsetLeft - multiGrid.offsetLeft, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── REVIEWS CAROUSEL ── */
  const reviewsTrack = document.querySelector('.reviews-carousel-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewPrev = document.querySelector('.reviews-prev');
  const reviewNext = document.querySelector('.reviews-next');
  let reviewIndex = 0;

  function getReviewsPerView() {
    if (window.innerWidth <= 768) return 1;
    return 2;
  }

  function updateReviewCarousel() {
    if (!reviewsTrack || reviewCards.length === 0) return;
    var perView = getReviewsPerView();
    var maxIndex = Math.max(0, reviewCards.length - perView);
    if (reviewIndex > maxIndex) reviewIndex = maxIndex;
    var cardWidth = reviewCards[0].offsetWidth;
    var gap = parseInt(getComputedStyle(reviewsTrack).gap) || 24;
    reviewsTrack.style.transform = 'translateX(-' + (reviewIndex * (cardWidth + gap)) + 'px)';
  }

  if (reviewPrev) {
    reviewPrev.addEventListener('click', function () {
      reviewIndex = Math.max(0, reviewIndex - 1);
      updateReviewCarousel();
    });
  }

  if (reviewNext) {
    reviewNext.addEventListener('click', function () {
      var perView = getReviewsPerView();
      var maxIndex = Math.max(0, reviewCards.length - perView);
      reviewIndex = Math.min(maxIndex, reviewIndex + 1);
      updateReviewCarousel();
    });
  }

  window.addEventListener('resize', updateReviewCarousel);

  /* ── REVIEWS BADGES AUTO-SLIDE (Mobile) ── */
  var reviewBadgesTrack = document.querySelector('.reviews-badges-track');
  var reviewBadgesGroups = document.querySelectorAll('.reviews-badges-group');
  var reviewBadgesIndex = 0;

  function autoSlideReviewBadges() {
    if (!reviewBadgesTrack || reviewBadgesGroups.length < 2) return;
    if (window.innerWidth > 768) {
      reviewBadgesTrack.style.transform = 'translateX(0)';
      reviewBadgesIndex = 0;
      return;
    }
    reviewBadgesIndex = (reviewBadgesIndex + 1) % reviewBadgesGroups.length;
    reviewBadgesTrack.style.transform = 'translateX(-' + (reviewBadgesIndex * 100) + '%)';
  }

  setInterval(autoSlideReviewBadges, 3000);

  /* ── AWARDS BADGES SLIDER ── */
  var awardsTrack = document.querySelector('.awards-track');
  var awardsBadges = awardsTrack ? awardsTrack.querySelectorAll('img') : [];
  var awardsPrev = document.querySelector('.awards-prev');
  var awardsNext = document.querySelector('.awards-next');
  var awardsIndex = 0;

  function getAwardsMaxIndex() {
    if (!awardsTrack || awardsBadges.length === 0) return 0;
    var badgeWidth = awardsBadges[0].offsetWidth;
    var gap = parseInt(getComputedStyle(awardsTrack).gap) || 16;
    var visibleWidth = awardsTrack.parentElement.offsetWidth;
    var visibleCount = Math.floor((visibleWidth + gap) / (badgeWidth + gap));
    return Math.max(0, awardsBadges.length - visibleCount);
  }

  function updateAwardsSlider() {
    if (!awardsTrack || awardsBadges.length === 0) return;
    var badgeWidth = awardsBadges[0].offsetWidth;
    var gap = parseInt(getComputedStyle(awardsTrack).gap) || 16;
    var offset = awardsIndex * (badgeWidth + gap);
    awardsTrack.style.transform = 'translateX(-' + offset + 'px)';
  }

  if (awardsPrev) {
    awardsPrev.addEventListener('click', function () {
      awardsIndex = Math.max(0, awardsIndex - 1);
      updateAwardsSlider();
    });
  }

  if (awardsNext) {
    awardsNext.addEventListener('click', function () {
      var maxIdx = getAwardsMaxIndex();
      awardsIndex = Math.min(maxIdx, awardsIndex + 1);
      updateAwardsSlider();
    });
  }

  /* Auto-slide every 3s */
  setInterval(function () {
    if (!awardsTrack || awardsBadges.length === 0) return;
    var maxIdx = getAwardsMaxIndex();
    if (maxIdx <= 0) return;
    awardsIndex = awardsIndex >= maxIdx ? 0 : awardsIndex + 1;
    updateAwardsSlider();
  }, 3000);

  /* ── PRODUCT SLIDER CONTROLS (Mobile) ── */
  const productsGrid = document.querySelector('.products-grid');
  const productSliderDots = document.querySelectorAll('.products-slider-controls .slider-dot');
  const productSliderPrev = document.querySelector('.products-slider-prev');
  const productSliderNext = document.querySelector('.products-slider-next');

  function scrollProductTo(index) {
    if (!productsGrid || productCards.length === 0) return;
    var card = productsGrid.children[index];
    if (card) {
      productsGrid.scrollTo({
        left: card.offsetLeft - productsGrid.offsetLeft,
        behavior: 'smooth'
      });
    }
    productSliderDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  var productScrollIndex = 0;
  if (productSliderPrev) {
    productSliderPrev.addEventListener('click', function () {
      productScrollIndex = Math.max(0, productScrollIndex - 1);
      scrollProductTo(productScrollIndex);
    });
  }

  if (productSliderNext) {
    productSliderNext.addEventListener('click', function () {
      productScrollIndex = Math.min(productsGrid.children.length - 1, productScrollIndex + 1);
      scrollProductTo(productScrollIndex);
    });
  }

  productSliderDots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      productScrollIndex = i;
      scrollProductTo(i);
    });
  });

  /* ── FLOATING REVIEWS TAB ── */
  const floatingTab = document.querySelector('.floating-reviews-tab');
  if (floatingTab) {
    floatingTab.addEventListener('click', function () {
      var reviewsSection = document.querySelector('.reviews-section');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ── SMOOTH SCROLL FOR NAV LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          closeDrawer();
        }
      }
    });
  });

  /* ── HEADER SCROLL SHADOW ── */
  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
    }
  });

  /* ── AGE VERIFICATION GATE ── */
  var ageGate = document.getElementById('ageGate');
  var ageYes = document.getElementById('ageYes');
  var ageNo = document.getElementById('ageNo');

  if (ageGate) {
    var ageVerified = sessionStorage.getItem('biatch_age_verified');
    if (ageVerified === 'true') {
      ageGate.classList.add('hidden');
      ageGate.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }

    if (ageYes) {
      ageYes.addEventListener('click', function () {
        sessionStorage.setItem('biatch_age_verified', 'true');
        ageGate.classList.add('hidden');
        ageGate.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    }

    if (ageNo) {
      ageNo.addEventListener('click', function () {
        window.location.href = 'https://www.responsibility.org/';
      });
    }
  }

});
