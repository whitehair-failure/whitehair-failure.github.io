(function () {
  'use strict';

  // Guard against duplicate bindings under PJAX or repeated script execution.
  if (window.__SMOOTH_SCROLL_INJECT__) {
    document.addEventListener('pjax:complete', function () {
      if (window.__SMOOTH_SCROLL_INJECT__ && typeof window.__SMOOTH_SCROLL_INJECT__.init === 'function') {
        window.__SMOOTH_SCROLL_INJECT__.init();
      }
    });
    return;
  }

  var state = {
    isBound: false,
    rafId: 0,
    currentY: 0,
    targetY: 0,
    lastTickTime: 0,
    maxDelta: 180,
    wheelScale: 1.0,
    desktopMinWidth: 992,
    minLineStep: 16,
    friction: 0.12,
    epsilon: 0.4
  };

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isDesktop() {
    var coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return window.innerWidth >= state.desktopMinWidth && !coarsePointer;
  }

  function canUseCustomScroll() {
    if (!isDesktop()) return false;
    if (prefersReducedMotion()) return false;
    if (document.documentElement.scrollHeight <= window.innerHeight + 2) return false;
    return true;
  }

  function getScrollRoot() {
    return document.scrollingElement || document.documentElement;
  }

  function getMaxScrollY() {
    var root = getScrollRoot();
    return Math.max(0, root.scrollHeight - window.innerHeight);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function isEditableTarget(target) {
    if (!target || target.nodeType !== 1) return false;
    if (target.isContentEditable) return true;
    var tag = target.tagName;
    if (tag === 'TEXTAREA') return true;
    if (tag === 'SELECT') return true;
    if (tag === 'INPUT') {
      var type = (target.type || '').toLowerCase();
      return type !== 'button' && type !== 'checkbox' && type !== 'radio' && type !== 'range';
    }
    return !!target.closest('[contenteditable="true"], textarea, select, input');
  }

  function normalizeDeltaY(event) {
    var deltaY = event.deltaY;
    if (event.deltaMode === 1) {
      deltaY *= state.minLineStep;
    } else if (event.deltaMode === 2) {
      deltaY *= window.innerHeight;
    }
    deltaY = clamp(deltaY, -state.maxDelta, state.maxDelta);
    return deltaY * state.wheelScale;
  }

  function stopAnimation() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
    state.lastTickTime = 0;
  }

  function tick(now) {
    var maxY = getMaxScrollY();
    state.targetY = clamp(state.targetY, 0, maxY);

    if (!state.lastTickTime) state.lastTickTime = now;
    var dt = Math.max(1, now - state.lastTickTime);
    state.lastTickTime = now;

    var lerp = 1 - Math.pow(1 - state.friction, dt / 16.6667);
    state.currentY += (state.targetY - state.currentY) * lerp;

    if (Math.abs(state.targetY - state.currentY) <= state.epsilon) {
      state.currentY = state.targetY;
      window.scrollTo(0, state.currentY);
      stopAnimation();
      return;
    }

    window.scrollTo(0, state.currentY);
    state.rafId = requestAnimationFrame(tick);
  }

  function ensureAnimationRunning() {
    if (!state.rafId) {
      state.lastTickTime = 0;
      state.rafId = requestAnimationFrame(tick);
    }
  }

  function onWheel(event) {
    if (!canUseCustomScroll()) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (isEditableTarget(event.target)) return;

    var currentNativeY = window.scrollY || window.pageYOffset || 0;

    if (!state.rafId) {
      state.currentY = currentNativeY;
      state.targetY = currentNativeY;
    }

    var deltaY = normalizeDeltaY(event);
    if (!deltaY) return;

    var nextTarget = state.targetY + deltaY;
    var maxY = getMaxScrollY();
    state.targetY = clamp(nextTarget, 0, maxY);

    // If already at boundary and trying to go further, keep native behavior untouched.
    if ((currentNativeY <= 0 && deltaY < 0) || (currentNativeY >= maxY && deltaY > 0)) {
      return;
    }

    event.preventDefault();
    ensureAnimationRunning();
  }

  function onResize() {
    if (!canUseCustomScroll()) {
      stopAnimation();
      return;
    }

    var maxY = getMaxScrollY();
    state.currentY = clamp(window.scrollY || 0, 0, maxY);
    state.targetY = clamp(state.targetY || state.currentY, 0, maxY);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      state.currentY = window.scrollY || 0;
      state.targetY = state.currentY;
      stopAnimation();
    }
  }

  function bind() {
    if (state.isBound) return;
    state.isBound = true;

    state.currentY = window.scrollY || 0;
    state.targetY = state.currentY;

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange, false);
  }

  function init() {
    bind();
    onResize();
  }

  window.__SMOOTH_SCROLL_INJECT__ = {
    init: init
  };

  document.addEventListener('DOMContentLoaded', init, { once: true });
  document.addEventListener('pjax:complete', init);
  if (document.readyState !== 'loading') init();
})();
