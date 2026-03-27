/* ============================================================
   BIATCH TEQUILA — PRODUCT PAGE JS
   Handles: thumbnail gallery, variant selector, price update,
   review carousel with dots.
   ============================================================ */

(function () {
  'use strict';

  /* ---- Thumbnail Gallery (Image + Video support) ---- */
  const mainImg = document.getElementById('pdpMainImg');
  const mainVideo = document.getElementById('pdpMainVideo');
  const thumbs = document.querySelectorAll('.pdp-hero__thumb');
  const thumbPrev = document.getElementById('thumbPrev');
  const thumbNext = document.getElementById('thumbNext');
  const thumbsContainer = document.getElementById('pdpThumbs');

  function showImage(src) {
    if (mainVideo) { mainVideo.pause(); mainVideo.style.display = 'none'; }
    if (mainImg) { mainImg.style.display = ''; mainImg.src = src; }
  }

  function showVideo(src) {
    if (mainImg) mainImg.style.display = 'none';
    if (mainVideo) {
      mainVideo.src = src;
      mainVideo.style.display = '';
      mainVideo.play();
    }
  }

  if (mainImg && thumbs.length) {
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.classList.remove('pdp-hero__thumb--active'); });
        this.classList.add('pdp-hero__thumb--active');

        var type = this.getAttribute('data-type');
        if (type === 'video') {
          var videoSrc = this.getAttribute('data-video');
          if (videoSrc) showVideo(videoSrc);
        } else {
          var imgSrc = this.getAttribute('data-img');
          if (imgSrc) showImage(imgSrc);
        }
      });
    });
  }

  /* Thumbnail arrow scroll */
  if (thumbPrev && thumbNext && thumbsContainer) {
    var scrollAmount = 92; // thumb width + gap
    thumbPrev.addEventListener('click', function () {
      thumbsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    thumbNext.addEventListener('click', function () {
      thumbsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  /* Zoom — hover to zoom, follow mouse position */
  var mainImageWrap = document.querySelector('.pdp-hero__main-image');
  if (mainImageWrap && mainImg) {
    mainImageWrap.addEventListener('mousemove', function (e) {
      var rect = mainImageWrap.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImg.style.transformOrigin = x + '% ' + y + '%';
    });

    mainImageWrap.addEventListener('mouseleave', function () {
      mainImg.style.transformOrigin = 'center center';
    });
  }

  /* ---- Variant Selector + Price/Total Update ---- */
  const variants = document.querySelectorAll('.pdp-hero__variant');
  const priceEl = document.getElementById('pdpPrice');
  const totalEl = document.getElementById('pdpTotal');
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');

  function getUnitPrice() {
    var active = document.querySelector('.pdp-hero__variant--active');
    return active ? parseFloat(active.getAttribute('data-price')) : 63.00;
  }

  function updateTotal() {
    var qty = parseInt(qtyInput.value) || 1;
    var unit = getUnitPrice();
    var total = (unit * qty).toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total + ' USD';
  }

  if (variants.length && priceEl) {
    variants.forEach(function (btn) {
      btn.addEventListener('click', function () {
        variants.forEach(function (v) { v.classList.remove('pdp-hero__variant--active'); });
        this.classList.add('pdp-hero__variant--active');
        var price = this.getAttribute('data-price');
        if (price) {
          priceEl.textContent = '$' + price + ' USD';
        }
        updateTotal();
      });
    });
  }

  /* ---- Quantity Selector ---- */
  if (qtyInput && qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', function () {
      var val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
      updateTotal();
    });

    qtyPlus.addEventListener('click', function () {
      var val = parseInt(qtyInput.value) || 1;
      if (val < 99) qtyInput.value = val + 1;
      updateTotal();
    });

    qtyInput.addEventListener('change', function () {
      var val = parseInt(this.value) || 1;
      if (val < 1) val = 1;
      if (val > 99) val = 99;
      this.value = val;
      updateTotal();
    });
  }

  /* ---- PDP Review Carousel ---- */
  const track = document.getElementById('pdpReviewTrack');
  const prevBtn = document.getElementById('pdpReviewPrev');
  const nextBtn = document.getElementById('pdpReviewNext');
  const dotsWrap = document.getElementById('pdpReviewDots');

  if (track && prevBtn && nextBtn) {
    var cards = track.querySelectorAll('.pdp-review-card');
    var currentSlide = 0;

    function getCardsPerView() {
      return window.innerWidth <= 768 ? 1 : 2;
    }

    function getTotalSlides() {
      var perView = getCardsPerView();
      return Math.max(1, cards.length - perView + 1);
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var total = getTotalSlides();
      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.className = 'dot' + (i === currentSlide ? ' dot--active' : '');
        dot.setAttribute('data-index', i);
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', function () {
          currentSlide = parseInt(this.getAttribute('data-index'));
          slideTo(currentSlide);
        });
        dotsWrap.appendChild(dot);
      }
    }

    function slideTo(index) {
      var perView = getCardsPerView();
      var maxSlide = getTotalSlides() - 1;
      currentSlide = Math.max(0, Math.min(index, maxSlide));

      if (cards.length === 0) return;
      var card = cards[0];
      var cardWidth = card.offsetWidth;
      var gap = 24;
      var offset = currentSlide * (cardWidth + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';

      // Update dots
      if (dotsWrap) {
        var dots = dotsWrap.querySelectorAll('.dot');
        dots.forEach(function (d, i) {
          d.classList.toggle('dot--active', i === currentSlide);
        });
      }
    }

    prevBtn.addEventListener('click', function () {
      slideTo(currentSlide - 1);
    });

    nextBtn.addEventListener('click', function () {
      slideTo(currentSlide + 1);
    });

    buildDots();
    window.addEventListener('resize', function () {
      buildDots();
      slideTo(currentSlide);
    });
  }

  /* ---- Lounge Recipe Track: scroll arrows via drag ---- */
  var loungeTrack = document.getElementById('pdpRecipeTrack');
  if (loungeTrack) {
    var isDown = false;
    var startX;
    var scrollLeft;

    loungeTrack.parentElement.addEventListener('mousedown', function (e) {
      isDown = true;
      startX = e.pageX - this.offsetLeft;
      scrollLeft = this.scrollLeft;
    });

    loungeTrack.parentElement.addEventListener('mouseleave', function () { isDown = false; });
    loungeTrack.parentElement.addEventListener('mouseup', function () { isDown = false; });
    loungeTrack.parentElement.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - this.offsetLeft;
      var walk = (x - startX) * 2;
      this.scrollLeft = scrollLeft - walk;
    });
  }

})();
