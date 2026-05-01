(function () {
  'use strict';

  var GRID_SIZE = 20;
  var STEP_DURATION = 0.3;

  function buildPixelGrid(container) {
    container.innerHTML = '';
    var size = 100 / GRID_SIZE;
    for (var row = 0; row < GRID_SIZE; row++) {
      for (var col = 0; col < GRID_SIZE; col++) {
        var pixel = document.createElement('div');
        pixel.className = 'card-author-pixel';
        pixel.style.width = size + '%';
        pixel.style.height = size + '%';
        pixel.style.left = (col * size) + '%';
        pixel.style.top = (row * size) + '%';
        container.appendChild(pixel);
      }
    }
  }

  function initCardAuthorPixelTransition() {
    var cards = document.querySelectorAll('.card-info:not([data-pixel-inited])');
    cards.forEach(function (card) {
      var pixelGrid = card.querySelector('.card-author-pixels');
      var coverOverlay = card.querySelector('.card-author-cover-overlay');
      // 没有封面图则不挂载特效
      if (!pixelGrid || !coverOverlay) return;

      card.dataset.pixelInited = '1';
      buildPixelGrid(pixelGrid);

      // coverRevealed: true = 封面遮罩已隐藏（卡片内容可见）
      var coverRevealed = false;
      var delayedCall = null;
      var isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;

      // activate=true: 像素消除封面，露出卡片
      // activate=false: 像素重新盖上封面
      function animatePixels(activate) {
        coverRevealed = activate;
        var pixels = pixelGrid.querySelectorAll('.card-author-pixel');
        gsap.killTweensOf(pixels);
        if (delayedCall) delayedCall.kill();

        gsap.set(pixels, { display: 'none' });
        var staggerDuration = STEP_DURATION / pixels.length;

        gsap.to(pixels, {
          display: 'block',
          duration: 0,
          stagger: { each: staggerDuration, from: 'random' }
        });

        delayedCall = gsap.delayedCall(STEP_DURATION, function () {
          coverOverlay.style.display = activate ? 'none' : 'block';
        });

        gsap.to(pixels, {
          display: 'none',
          duration: 0,
          delay: STEP_DURATION,
          stagger: { each: staggerDuration, from: 'random' }
        });
      }

      if (isTouchDevice) {
        card.addEventListener('click', function () {
          animatePixels(!coverRevealed);
        });
      } else {
        card.addEventListener('mouseenter', function () {
          if (!coverRevealed) animatePixels(true);
        });
        card.addEventListener('mouseleave', function () {
          if (coverRevealed) animatePixels(false);
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initCardAuthorPixelTransition);
  document.addEventListener('pjax:success', function () {
    document.querySelectorAll('.card-info[data-pixel-inited]').forEach(function (el) {
      delete el.dataset.pixelInited;
    });
    initCardAuthorPixelTransition();
  });
})();

