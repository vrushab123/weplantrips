/* ======================================================
   WE PLAN TRIPS — Complete Script
   ====================================================== */

(function () {
    'use strict';
    // ================================================================
    // PAGE LOADER
    // ================================================================
    var loader = document.getElementById('page-loader');
    if (loader) {
        var isFirstVisit = !sessionStorage.getItem('wpt_visited');
        var loaderDelay = isFirstVisit ? 2200 : 800;

        window.addEventListener('load', function () {
            setTimeout(function () {
                loader.classList.add('hidden');
                sessionStorage.setItem('wpt_visited', '1');
            }, loaderDelay);
        });
    }
    // HERO SLIDER
    // ================================================================
    const slides = document.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    let current = 0;
    const total = slides.length;
    const INTERVAL = 3500;
    let timer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    function goToSlide(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = index;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function nextSlide() { goToSlide(current + 1); }
    function prevSlide() { goToSlide(current - 1); }

    function startAutoPlay() { stopAutoPlay(); timer = setInterval(nextSlide, INTERVAL); }
    function stopAutoPlay() { if (timer) { clearInterval(timer); timer = null; } }
    function resetAutoPlay() { stopAutoPlay(); startAutoPlay(); }

    prevBtn.addEventListener('click', function () { prevSlide(); resetAutoPlay(); });
    nextBtn.addEventListener('click', function () { nextSlide(); resetAutoPlay(); });

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            goToSlide(parseInt(this.getAttribute('data-index'), 10));
            resetAutoPlay();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
        else if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
    });

    // Swipe support
    var heroEl = document.getElementById('hero');
    heroEl.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    heroEl.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); resetAutoPlay(); }
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
        document.hidden ? stopAutoPlay() : startAutoPlay();
    });

    startAutoPlay();

    // ================================================================
    // NAVBAR — Scroll Effect & Active Link
    // ================================================================
    var navbar = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.navbar__link:not(.navbar__link--cta)');
    var sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function () {
        // Scrolled state
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link based on scroll position
        var scrollPos = window.scrollY + 200;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ================================================================
    // MOBILE MENU TOGGLE
    // ================================================================
    var toggle = document.getElementById('navbar-toggle');
    var menu = document.getElementById('navbar-menu');

    toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        menu.classList.toggle('open');
    });

    // Close menu on link click
    menu.querySelectorAll('.navbar__link').forEach(function (link) {
        link.addEventListener('click', function () {
            toggle.classList.remove('open');
            menu.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
            toggle.classList.remove('open');
            menu.classList.remove('open');
        }
    });

    // ================================================================
    // DESTINATIONS CAROUSEL — Center-Focused with Drag Support
    // ================================================================
    const destCarousel = document.getElementById('dest-carousel');
    const destTrack = document.getElementById('dest-carousel-track');
    const destCards = document.querySelectorAll('.dest-ccard');

    if (destCarousel && destTrack && destCards.length > 0) {
        let destCurrentIndex = 0;
        let destAutoPlayTimer = null;
        const DEST_AUTO_PLAY_INTERVAL = 4500;

        // Dragging state
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;

        function updateDestCarousel(withTransition = true) {
            destCards.forEach(card => card.classList.remove('active'));
            const activeCard = destCards[destCurrentIndex];
            activeCard.classList.add('active');

            const containerWidth = destCarousel.offsetWidth;
            const cardWidth = activeCard.offsetWidth;
            const cardOffset = activeCard.offsetLeft;

            const targetTranslate = (containerWidth / 2) - (cardOffset + (cardWidth / 2));

            if (withTransition) {
                destTrack.style.transition = 'transform 0.7s cubic-bezier(0.2, 1, 0.3, 1)';
            } else {
                destTrack.style.transition = 'none';
            }

            destTrack.style.transform = `translateX(${targetTranslate}px)`;
            currentTranslate = targetTranslate;
            prevTranslate = targetTranslate;
        }

        function nextDestImage() {
            destCurrentIndex = (destCurrentIndex + 1) % destCards.length;
            updateDestCarousel();
        }

        function startDestAutoPlay() {
            stopDestAutoPlay();
            destAutoPlayTimer = setInterval(nextDestImage, DEST_AUTO_PLAY_INTERVAL);
        }

        function stopDestAutoPlay() {
            if (destAutoPlayTimer) {
                clearInterval(destAutoPlayTimer);
                destAutoPlayTimer = null;
            }
        }

        // Drag/Swipe Logic
        function dragStart(e) {
            isDragging = true;
            startX = getPositionX(e);
            stopDestAutoPlay();
            destTrack.style.transition = 'none';
            destCarousel.classList.add('dragging');
        }

        function dragMove(e) {
            if (!isDragging) return;
            const currentX = getPositionX(e);
            const diff = currentX - startX;
            const translate = prevTranslate + diff;
            destTrack.style.transform = `translateX(${translate}px)`;
            currentTranslate = translate;
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            destCarousel.classList.remove('dragging');

            // Calculate which card is closest to the center
            const containerCenter = destCarousel.offsetWidth / 2;
            let closestIndex = 0;
            let minDistance = Infinity;

            destCards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + (cardRect.width / 2);
                const distance = Math.abs(containerCenter - cardCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            destCurrentIndex = closestIndex;
            updateDestCarousel(true);
            startDestAutoPlay();
        }

        function getPositionX(e) {
            return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        }

        // Event Listeners
        destCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (index !== destCurrentIndex) {
                    e.preventDefault();
                    destCurrentIndex = index;
                    updateDestCarousel();
                    startDestAutoPlay();
                }
            });
        });

        // Mouse Events
        destTrack.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);

        // Touch Events
        destTrack.addEventListener('touchstart', dragStart, { passive: true });
        window.addEventListener('touchmove', dragMove, { passive: false });
        window.addEventListener('touchend', dragEnd);

        // Prevent ghost clicks/drags on images
        destTrack.addEventListener('dragstart', (e) => e.preventDefault());

        // Initialize
        function initDestCarousel() {
            setTimeout(() => {
                updateDestCarousel(false);
                startDestAutoPlay();
            }, 100);
        }

        if (document.readyState === 'complete') {
            initDestCarousel();
        } else {
            window.addEventListener('load', initDestCarousel);
        }

        window.addEventListener('resize', () => updateDestCarousel(false));

        destCarousel.addEventListener('mouseenter', stopDestAutoPlay);
        destCarousel.addEventListener('mouseleave', () => {
            if (!isDragging) startDestAutoPlay();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopDestAutoPlay();
            else startDestAutoPlay();
        });
    }

    // ================================================================
    // STATS COUNTER ANIMATION
    // ================================================================
    var counters = document.querySelectorAll('.stats__number');
    var counterAnimated = false;

    function animateCounters() {
        if (counterAnimated) return;
        counterAnimated = true;

        counters.forEach(function (counter) {
            var target = parseInt(counter.getAttribute('data-target'), 10);
            var duration = 2000;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // Ease out quad
                var eased = 1 - (1 - progress) * (1 - progress);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(step);
        });
    }

    // Trigger counter when stats section is visible
    var statsSection = document.querySelector('.stats');
    var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) statsObserver.observe(statsSection);

    // ================================================================
    // SCROLL REVEAL
    // ================================================================
    var revealElements = document.querySelectorAll(
        '.about__text, .about__visual, .dest-card, .service-card, .testimonial-card, .cta-section__content'
    );

    revealElements.forEach(function (el) {
        el.classList.add('reveal');
    });

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    // Stagger destination cards and service cards
    document.querySelectorAll('.dest-card, .service-card, .testimonial-card').forEach(function (card, i) {
        card.style.transitionDelay = (i % 3) * 0.15 + 's';
    });

})();
