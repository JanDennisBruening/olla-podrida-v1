/**
 * Olla Podrida – Artwork Gallery Slider Engine
 * Full-featured Vanilla ES6 Implementation
 */

(function () {
  'use strict';

  function initGallery() {
    const root = document.getElementById('op-gallery-app');
    if (!root) return;

    const data = window.OP_Gallery_Data || {};
    const musicians = data.musicians || [];
    const settings = data.settings || {};

    if (!musicians.length) return;

    // State Variables
    let currentIndex = 0;
    let isPlaying = root.dataset.autoplay !== '0';
    let durationMs = parseInt(root.dataset.speed, 10) || 5000;
    let isHovered = false;
    let soundEnabled = false;
    let showStudio = false;
    let lightboxScale = 1;

    // Timer & Animation State
    let animFrameId = null;
    let startTime = Date.now();
    let elapsedBeforePause = 0;
    let touchStartX = null;
    let audioCtx = null;
    let currentCustomAudio = null;

    // Roman Numerals
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

    // Load or initialize Lighting Settings
    let lightingSettings = {};
    try {
      const saved = localStorage.getItem('op_gallery_lighting');
      if (saved) lightingSettings = JSON.parse(saved);
    } catch (e) {
      lightingSettings = {};
    }

    musicians.forEach((m) => {
      if (!lightingSettings[m.id]) {
        lightingSettings[m.id] = {
          color: m.lighting_color || '#d4af37',
          intensity: parseInt(m.lighting_intensity, 10) || 45,
          blur: parseInt(m.lighting_blur, 10) || 32,
          ambient: parseInt(m.lighting_ambient, 10) || 35,
          pulse: Boolean(m.lighting_pulse),
        };
      }
    });

    function saveLighting() {
      try {
        localStorage.setItem('op_gallery_lighting', JSON.stringify(lightingSettings));
      } catch (e) {}
    }

    function hexToRgba(hex, alpha) {
      const clean = hex.replace('#', '');
      if (clean.length === 6) {
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return hex;
    }

    // DOM References
    const dom = {
      bgAtmosphere: document.getElementById('op-bg-atmosphere'),
      haloGlow: document.getElementById('op-halo-glow'),
      slideContainer: document.getElementById('op-slide-container'),
      progressBar: document.getElementById('op-progress-bar'),
      romanNumeral: document.getElementById('op-roman-numeral'),
      indexCounter: document.getElementById('op-index-counter'),
      currentName: document.getElementById('op-current-name'),
      currentInstrument: document.getElementById('op-current-instrument'),
      currentRole: document.getElementById('op-current-role'),
      currentQuote: document.getElementById('op-current-quote'),
      thumbStrip: document.getElementById('op-thumb-strip'),
      btnPrev: document.getElementById('op-btn-prev'),
      btnNext: document.getElementById('op-btn-next'),
      btnPlayPause: document.getElementById('op-btn-play-pause'),
      playPauseIcon: document.getElementById('op-play-pause-icon'),
      playPauseLabel: document.getElementById('op-play-pause-label'),
      btnAutoplay: document.getElementById('op-btn-autoplay-toggle'),
      autoplayDot: document.getElementById('op-autoplay-dot'),
      autoplayLabel: document.getElementById('op-autoplay-label'),
      btnSound: document.getElementById('op-btn-sound'),
      soundLabel: document.getElementById('op-sound-label'),
      btnStudioToggle: document.getElementById('op-btn-studio-toggle'),
      lightingStudio: document.getElementById('op-lighting-studio'),
      studioMemberLabel: document.getElementById('op-studio-member-label'),
      btnCloseStudio: document.getElementById('op-btn-close-studio'),
      btnApplyAll: document.getElementById('op-btn-apply-all'),
      btnResetLighting: document.getElementById('op-btn-reset-lighting'),
      scColor: document.getElementById('op-sc-color'),
      scColorHex: document.getElementById('op-sc-color-hex'),
      scIntensity: document.getElementById('op-sc-intensity'),
      scIntensityVal: document.getElementById('op-sc-intensity-val'),
      scBlur: document.getElementById('op-sc-blur'),
      scBlurVal: document.getElementById('op-sc-blur-val'),
      scAmbient: document.getElementById('op-sc-ambient'),
      scAmbientVal: document.getElementById('op-sc-ambient-val'),
      scPulseToggle: document.getElementById('op-sc-pulse-toggle'),
      scPresets: document.getElementById('op-sc-presets'),
      // Grid Modal
      btnOpenGrid: document.getElementById('op-btn-open-grid'),
      gridModal: document.getElementById('op-grid-modal'),
      btnCloseGrid: document.getElementById('op-btn-close-grid'),
      gridCards: document.getElementById('op-grid-cards'),
      // Lightbox Modal
      btnOpenLightbox: document.getElementById('op-btn-open-lightbox'),
      lightboxModal: document.getElementById('op-lightbox-modal'),
      btnCloseLightbox: document.getElementById('op-btn-close-lightbox'),
      lbImg: document.getElementById('op-lb-img'),
      lbTitle: document.getElementById('op-lb-title'),
      lbCaption: document.getElementById('op-lb-caption'),
      lbZoomIn: document.getElementById('op-lb-zoom-in'),
      lbZoomOut: document.getElementById('op-lb-zoom-out'),
      lbZoomReset: document.getElementById('op-lb-zoom-reset'),
      lbZoomLevel: document.getElementById('op-lb-zoom-level'),
      stage: document.querySelector('.op-stage-main'),
    };

    // Render Active Slide
    function renderActiveSlide() {
      const m = musicians[currentIndex] || musicians[0];
      const light = lightingSettings[m.id] || {
        color: m.lighting_color || '#d4af37',
        intensity: 45,
        blur: 32,
        ambient: 35,
        pulse: false,
      };

      // 1. Atmosphere Radial Gradient
      if (dom.bgAtmosphere) {
        dom.bgAtmosphere.style.background = `radial-gradient(ellipse at 50% 28%, ${hexToRgba(
          light.color,
          light.ambient / 100
        )} 0%, rgba(9, 9, 11, 0.95) 60%, #09090b 100%)`;
      }

      // 2. Halo Glow
      if (dom.haloGlow) {
        dom.haloGlow.style.backgroundColor = light.color;
        dom.haloGlow.style.opacity = light.intensity / 100;
        dom.haloGlow.style.filter = `blur(${light.blur}px)`;
        if (light.pulse) {
          dom.haloGlow.classList.add('op-pulse-active');
        } else {
          dom.haloGlow.classList.remove('op-pulse-active');
        }
      }

      // 3. Center Portrait
      if (dom.slideContainer) {
        dom.slideContainer.innerHTML = '';
        if (m.image_url) {
          const img = document.createElement('img');
          img.src = m.image_url;
          img.alt = `Olla Podrida: ${m.name}`;
          img.className = 'op-slide-img op-slide-reveal';
          img.onerror = () => {
            img.style.display = 'none';
          };
          dom.slideContainer.appendChild(img);
        } else {
          const placeholder = document.createElement('div');
          placeholder.className = 'op-theatrical-placeholder op-slide-reveal';
          placeholder.innerHTML = `
            <div class="op-placeholder-badge">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <h3 class="op-placeholder-name">${m.name}</h3>
            <p class="op-placeholder-inst">${m.instrument}</p>
          `;
          dom.slideContainer.appendChild(placeholder);
        }
      }

      // 4. Texts
      if (dom.romanNumeral) dom.romanNumeral.textContent = romanNumerals[currentIndex] || 'I';
      if (dom.indexCounter) dom.indexCounter.textContent = `0${currentIndex + 1} / 0${musicians.length}`;
      if (dom.currentName) dom.currentName.textContent = m.name;
      if (dom.currentInstrument) dom.currentInstrument.textContent = m.instrument;
      if (dom.currentRole) dom.currentRole.textContent = m.role;
      if (dom.currentQuote) dom.currentQuote.textContent = m.quote || '';

      // 5. Thumbnails active highlight
      if (dom.thumbStrip) {
        const btns = dom.thumbStrip.querySelectorAll('.op-thumb-btn');
        btns.forEach((btn, idx) => {
          if (idx === currentIndex) {
            btn.classList.add('active');
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } else {
            btn.classList.remove('active');
          }
        });
      }

      // 6. Update Studio inputs if open
      updateStudioUI(m, light);

      // 7. Sound trigger if enabled
      if (soundEnabled) {
        playMusicianSound(m);
      }
    }

    // Build Thumbnail Strip
    function renderThumbnails() {
      if (!dom.thumbStrip) return;
      dom.thumbStrip.innerHTML = '';

      musicians.forEach((m, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `op-thumb-btn ${idx === currentIndex ? 'active' : ''}`;
        btn.title = `${m.name} – ${m.instrument}`;

        const avatar = document.createElement('div');
        avatar.className = 'op-thumb-avatar';

        if (m.image_url) {
          const img = document.createElement('img');
          img.src = m.image_url;
          img.alt = m.name;
          avatar.appendChild(img);
        }

        const info = document.createElement('div');
        info.className = 'op-thumb-info';
        info.innerHTML = `
          <span class="op-thumb-name">${m.name}</span>
          <span class="op-thumb-inst">${m.instrument.split(' ')[0]}</span>
        `;

        btn.appendChild(avatar);
        btn.appendChild(info);

        btn.addEventListener('click', () => {
          goToSlide(idx);
        });

        dom.thumbStrip.appendChild(btn);
      });
    }

    // Build Grid Modal Cards
    function renderGridCards() {
      if (!dom.gridCards) return;
      dom.gridCards.innerHTML = '';

      musicians.forEach((m, idx) => {
        const card = document.createElement('div');
        card.className = 'op-grid-card';
        card.innerHTML = `
          <div class="op-gc-media">
            ${m.image_url ? `<img src="${m.image_url}" alt="${m.name}" />` : ''}
          </div>
          <div class="op-gc-info">
            <span class="op-gc-num">0${idx + 1}</span>
            <h4 class="op-gc-name">${m.name}</h4>
            <p class="op-gc-inst">${m.instrument}</p>
          </div>
        `;

        card.addEventListener('click', () => {
          goToSlide(idx);
          closeGridModal();
        });

        dom.gridCards.appendChild(card);
      });
    }

    // Slide Navigation
    function goToSlide(idx) {
      currentIndex = (idx + musicians.length) % musicians.length;
      resetTimer();
      renderActiveSlide();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    // Autoplay Timer Loop
    function resetTimer() {
      elapsedBeforePause = 0;
      startTime = Date.now();
      if (dom.progressBar) dom.progressBar.style.width = '0%';
    }

    function tickTimer() {
      if (!isPlaying || isHovered) {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / durationMs) * 100);

      if (dom.progressBar) {
        dom.progressBar.style.width = `${progress}%`;
      }

      if (elapsed >= durationMs) {
        resetTimer();
        nextSlide();
      } else {
        animFrameId = requestAnimationFrame(tickTimer);
      }
    }

    function startAutoplay() {
      isPlaying = true;
      startTime = Date.now() - elapsedBeforePause;
      updatePlayPauseUI();
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(tickTimer);
    }

    function pauseAutoplay() {
      isPlaying = false;
      elapsedBeforePause = Date.now() - startTime;
      updatePlayPauseUI();
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }

    function toggleAutoplay() {
      if (isPlaying) {
        pauseAutoplay();
      } else {
        startAutoplay();
      }
    }

    function updatePlayPauseUI() {
      if (dom.playPauseLabel) {
        dom.playPauseLabel.textContent = isPlaying ? 'Pause' : 'Play';
      }
      if (dom.playPauseIcon) {
        dom.playPauseIcon.innerHTML = isPlaying
          ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>`
          : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;
      }
      if (dom.btnAutoplay) {
        if (isPlaying) {
          dom.btnAutoplay.classList.add('active');
          if (dom.autoplayDot) dom.autoplayDot.className = 'op-dot-active';
          if (dom.autoplayLabel) dom.autoplayLabel.textContent = 'Autoplay An';
        } else {
          dom.btnAutoplay.classList.remove('active');
          if (dom.autoplayDot) dom.autoplayDot.className = '';
          if (dom.autoplayLabel) dom.autoplayLabel.textContent = 'Autoplay Aus';
        }
      }
    }

    // Audio & Web Audio Synthesizer
    function playMusicianSound(m) {
      // 1. If custom audio URL exists, play that
      if (m.custom_audio_url) {
        if (currentCustomAudio) {
          currentCustomAudio.pause();
          currentCustomAudio = null;
        }
        currentCustomAudio = new Audio(m.custom_audio_url);
        currentCustomAudio.play().catch(() => {});
        return;
      }

      // 2. Otherwise Web Audio Oscillator Synthesizer
      try {
        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        const type = m.sound_type || 'drum';
        const freq = parseFloat(m.sound_freq) || 440;

        osc.type = type === 'drum' ? 'sine' : type === 'bagpipe' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } catch (e) {}
    }

    // Studio UI sync
    function updateStudioUI(m, light) {
      if (dom.studioMemberLabel) {
        dom.studioMemberLabel.textContent = `Lichtregie & Atmosphäre · ${m.name}`;
      }
      if (dom.scColor) dom.scColor.value = light.color;
      if (dom.scColorHex) dom.scColorHex.textContent = light.color;
      if (dom.scIntensity) dom.scIntensity.value = light.intensity;
      if (dom.scIntensityVal) dom.scIntensityVal.textContent = `${light.intensity}%`;
      if (dom.scBlur) dom.scBlur.value = light.blur;
      if (dom.scBlurVal) dom.scBlurVal.textContent = `${light.blur}px`;
      if (dom.scAmbient) dom.scAmbient.value = light.ambient;
      if (dom.scAmbientVal) dom.scAmbientVal.textContent = `${light.ambient}%`;
      if (dom.scPulseToggle) {
        if (light.pulse) {
          dom.scPulseToggle.classList.add('active');
          dom.scPulseToggle.textContent = 'Pulsieren An';
        } else {
          dom.scPulseToggle.classList.remove('active');
          dom.scPulseToggle.textContent = 'Pulsieren Aus';
        }
      }
    }

    function updateActiveLighting(partial) {
      const m = musicians[currentIndex];
      if (!m) return;
      lightingSettings[m.id] = Object.assign({}, lightingSettings[m.id], partial);
      saveLighting();
      renderActiveSlide();
    }

    // Modal Handlers
    function openGridModal() {
      renderGridCards();
      if (dom.gridModal) dom.gridModal.style.display = 'flex';
    }

    function closeGridModal() {
      if (dom.gridModal) dom.gridModal.style.display = 'none';
    }

    function openLightbox() {
      const m = musicians[currentIndex];
      if (!m || !m.image_url) return;
      lightboxScale = 1;
      updateLightboxZoom();
      if (dom.lbImg) dom.lbImg.src = m.image_url;
      if (dom.lbTitle) dom.lbTitle.textContent = `${m.name} – ${m.instrument}`;
      if (dom.lbCaption) dom.lbCaption.textContent = m.quote || '';
      if (dom.lightboxModal) dom.lightboxModal.style.display = 'flex';
    }

    function closeLightbox() {
      if (dom.lightboxModal) dom.lightboxModal.style.display = 'none';
    }

    function updateLightboxZoom() {
      if (dom.lbImg) dom.lbImg.style.transform = `scale(${lightboxScale})`;
      if (dom.lbZoomLevel) dom.lbZoomLevel.textContent = `Zoom: ${Math.round(lightboxScale * 100)}%`;
    }

    // EVENT LISTENERS
    if (dom.btnPrev) dom.btnPrev.addEventListener('click', prevSlide);
    if (dom.btnNext) dom.btnNext.addEventListener('click', nextSlide);
    if (dom.btnPlayPause) dom.btnPlayPause.addEventListener('click', toggleAutoplay);
    if (dom.btnAutoplay) dom.btnAutoplay.addEventListener('click', toggleAutoplay);

    // Speed selector
    const speedButtons = root.querySelectorAll('.op-speed-btn');
    speedButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        speedButtons.forEach((b) => b.classList.remove('op-speed-active'));
        btn.classList.add('op-speed-active');
        durationMs = parseInt(btn.dataset.speed, 10);
        resetTimer();
        if (isPlaying) {
          if (animFrameId) cancelAnimationFrame(animFrameId);
          animFrameId = requestAnimationFrame(tickTimer);
        }
      });
    });

    // Sound toggle
    if (dom.btnSound) {
      dom.btnSound.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
          dom.btnSound.classList.add('active');
          if (dom.soundLabel) dom.soundLabel.textContent = 'Hörprobe An';
          playMusicianSound(musicians[currentIndex]);
        } else {
          dom.btnSound.classList.remove('active');
          if (dom.soundLabel) dom.soundLabel.textContent = 'Hörprobe';
          if (currentCustomAudio) {
            currentCustomAudio.pause();
            currentCustomAudio = null;
          }
        }
      });
    }

    // Studio Toggle
    if (dom.btnStudioToggle) {
      dom.btnStudioToggle.addEventListener('click', () => {
        showStudio = !showStudio;
        if (dom.lightingStudio) dom.lightingStudio.style.display = showStudio ? 'block' : 'none';
        dom.btnStudioToggle.classList.toggle('active', showStudio);
      });
    }
    if (dom.btnCloseStudio) {
      dom.btnCloseStudio.addEventListener('click', () => {
        showStudio = false;
        if (dom.lightingStudio) dom.lightingStudio.style.display = 'none';
        if (dom.btnStudioToggle) dom.btnStudioToggle.classList.remove('active');
      });
    }

    // Studio Sliders
    if (dom.scColor) {
      dom.scColor.addEventListener('input', (e) => {
        updateActiveLighting({ color: e.target.value });
      });
    }
    if (dom.scPresets) {
      dom.scPresets.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          updateActiveLighting({ color: btn.dataset.color });
        });
      });
    }
    if (dom.scIntensity) {
      dom.scIntensity.addEventListener('input', (e) => {
        updateActiveLighting({ intensity: parseInt(e.target.value, 10) });
      });
    }
    if (dom.scBlur) {
      dom.scBlur.addEventListener('input', (e) => {
        updateActiveLighting({ blur: parseInt(e.target.value, 10) });
      });
    }
    if (dom.scAmbient) {
      dom.scAmbient.addEventListener('input', (e) => {
        updateActiveLighting({ ambient: parseInt(e.target.value, 10) });
      });
    }
    if (dom.scPulseToggle) {
      dom.scPulseToggle.addEventListener('click', () => {
        const m = musicians[currentIndex];
        const currentPulse = lightingSettings[m.id]?.pulse || false;
        updateActiveLighting({ pulse: !currentPulse });
      });
    }
    if (dom.btnApplyAll) {
      dom.btnApplyAll.addEventListener('click', () => {
        const m = musicians[currentIndex];
        const cur = lightingSettings[m.id];
        musicians.forEach((other) => {
          lightingSettings[other.id] = Object.assign({}, cur);
        });
        saveLighting();
        renderActiveSlide();
      });
    }
    if (dom.btnResetLighting) {
      dom.btnResetLighting.addEventListener('click', () => {
        const m = musicians[currentIndex];
        lightingSettings[m.id] = {
          color: m.lighting_color || '#d4af37',
          intensity: parseInt(m.lighting_intensity, 10) || 45,
          blur: parseInt(m.lighting_blur, 10) || 32,
          ambient: parseInt(m.lighting_ambient, 10) || 35,
          pulse: Boolean(m.lighting_pulse),
        };
        saveLighting();
        renderActiveSlide();
      });
    }

    // Modal triggers
    if (dom.btnOpenGrid) dom.btnOpenGrid.addEventListener('click', openGridModal);
    if (dom.btnCloseGrid) dom.btnCloseGrid.addEventListener('click', closeGridModal);
    if (dom.btnOpenLightbox) dom.btnOpenLightbox.addEventListener('click', openLightbox);
    if (dom.btnCloseLightbox) dom.btnCloseLightbox.addEventListener('click', closeLightbox);

    // Lightbox Zoom
    if (dom.lbZoomIn) {
      dom.lbZoomIn.addEventListener('click', () => {
        lightboxScale = Math.min(3, lightboxScale + 0.25);
        updateLightboxZoom();
      });
    }
    if (dom.lbZoomOut) {
      dom.lbZoomOut.addEventListener('click', () => {
        lightboxScale = Math.max(1, lightboxScale - 0.25);
        updateLightboxZoom();
      });
    }
    if (dom.lbZoomReset) {
      dom.lbZoomReset.addEventListener('click', () => {
        lightboxScale = 1;
        updateLightboxZoom();
      });
    }

    // Hover Pause
    if (root.dataset.hoverPause !== '0' && dom.stage) {
      dom.stage.addEventListener('mouseenter', () => {
        isHovered = true;
      });
      dom.stage.addEventListener('mouseleave', () => {
        isHovered = false;
        if (isPlaying) {
          startTime = Date.now() - elapsedBeforePause;
          if (animFrameId) cancelAnimationFrame(animFrameId);
          animFrameId = requestAnimationFrame(tickTimer);
        }
      });
    }

    // Touch Swipe
    if (dom.stage) {
      dom.stage.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      dom.stage.addEventListener('touchend', (e) => {
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }
        touchStartX = null;
      }, { passive: true });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't intercept if an input is focused
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'g' || e.key === 'G') {
        if (dom.gridModal && dom.gridModal.style.display === 'flex') {
          closeGridModal();
        } else {
          openGridModal();
        }
      } else if (e.key === 'l' || e.key === 'L') {
        if (dom.btnStudioToggle) dom.btnStudioToggle.click();
      } else if (e.key === 'Escape') {
        closeGridModal();
        closeLightbox();
      }
    });

    // Initial Render & Start
    renderThumbnails();
    renderActiveSlide();
    if (isPlaying) {
      startAutoplay();
    } else {
      updatePlayPauseUI();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
