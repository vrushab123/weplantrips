/* ======================================================
   WE PLAN TRIPS — Hero Slider Script
   ====================================================== */

(function () {
    'use strict';

    // ---- DOM References ----
    const slides  = document.querySelectorAll('.hero__slide');
    const dots    = document.querySelectorAll('.hero__dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    let current   = 0;
    const total   = slides.length;
    const INTERVAL = 5000;          // auto-slide every 5 seconds
    let timer     = null;
    let touchStartX = 0;
    let touchEndX   = 0;

    // ---- Core Functions ----
    function goToSlide(index) {
        // Wrap around
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;

        // Update slides
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = index;

        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function nextSlide() {
        goToSlide(current + 1);
    }

    function prevSlide() {
        goToSlide(current - 1);
    }

    // ---- Auto-Play ----
    function startAutoPlay() {
        stopAutoPlay();
        timer = setInterval(nextSlide, INTERVAL);
    }

    function stopAutoPlay() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    // Reset timer on user interaction
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // ---- Event Listeners ----

    // Arrow buttons
    prevBtn.addEventListener('click', function () {
        prevSlide();
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', function () {
        nextSlide();
        resetAutoPlay();
    });

    // Dot navigation
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            const idx = parseInt(this.getAttribute('data-index'), 10);
            goToSlide(idx);
            resetAutoPlay();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });

    // Touch / Swipe support
    const heroEl = document.getElementById('hero');

    heroEl.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroEl.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(diff) < threshold) return;

        if (diff > 0) {
            nextSlide();   // Swipe left → next
        } else {
            prevSlide();   // Swipe right → prev
        }
        resetAutoPlay();
    }

    // Pause on tab hidden, resume on visible
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    // ---- Initialise ----
    startAutoPlay();

})();
