/**
 * =================================================================
 *  W. SANCHEZ PORTFOLIO SCRIPTS (Vanilla JS / ES6+)
 * =================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM READY & HERO LOAD ANIMATION
    initHeroLoadAnimation();

    // 2. STICKY NAV + SCROLL CLASS
    initStickyNav();

    // 3. ACTIVE NAV LINK VIA INTERSECTION OBSERVER
    initActiveNavLinkObserver();

    // 4. SCROLL REVEAL ANIMATION VIA INTERSECTION OBSERVER
    initScrollRevealObserver();

    // 5. HAMBURGER MOBILE MENU
    initMobileMenu();

    // 6. SMOOTH SCROLL
    initSmoothScroll();

    // 7. CURRENT YEAR IN FOOTER
    initCurrentYear();

    // Extra: Cursor Glow Effect
    initCursorGlow();
});

/**
 * 1. DOM READY & HERO LOAD ANIMATION
 * Triggers hero section animations by adding .loaded class to body
 */
function initHeroLoadAnimation() {
    // Small delay to ensure smooth initial paint
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

/**
 * 2. STICKY NAV + SCROLL CLASS
 * Adds .nav--scrolled to header on scroll
 */
function initStickyNav() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('nav--scrolled');
        } else {
            header.classList.remove('nav--scrolled');
        }
    }, { passive: true });
}

/**
 * 3. ACTIVE NAV LINK VIA INTERSECTION OBSERVER
 * Highlights the nav link corresponding to the section in view
 */
function initActiveNavLinkObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const observerOptions = {
        threshold: 0.45,
        rootMargin: '-80px 0px 0px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * 4. SCROLL REVEAL ANIMATION VIA INTERSECTION OBSERVER
 * Animates elements into view based on direction and delay attributes
 */
function initScrollRevealObserver() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    // Initial setup in JS as requested
    revealElements.forEach(el => {
        // Skip hero elements as they are handled by .loaded class
        if (el.closest('.hero')) return;

        const direction = el.getAttribute('data-reveal-direction');
        el.style.opacity = '0';
        
        let initialTransform = 'translateY(32px)';
        if (direction === 'left') initialTransform = 'translateX(-40px)';
        if (direction === 'right') initialTransform = 'translateX(40px)';
        
        el.style.transform = initialTransform;
        el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    });

    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Hero elements reveal instantly with body.loaded
                if (el.closest('.hero')) {
                    observer.unobserve(el);
                    return;
                }

                const delay = el.getAttribute('data-delay') || 0;
                
                el.style.transitionDelay = `${delay}ms`;
                el.style.opacity = '1';
                el.style.transform = 'translate(0, 0)';
                
                // Stop observing after reveal
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/**
 * 5. HAMBURGER MOBILE MENU
 * Handles opening/closing of the mobile menu and scroll locking
 */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

    const toggleMenu = () => {
        header.classList.toggle('menu--open');
        mobileMenu.classList.toggle('menu--open');
        
        const isOpen = mobileMenu.classList.contains('menu--open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('menu--open')) {
                toggleMenu();
            }
        });
    });
}

/**
 * 6. SMOOTH SCROLL
 * Intercepts anchor clicks and scrolls to target with header offset
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Allow default behavior for empty hash or links that aren't section anchors
            if (href === '#' || !href.startsWith('#')) return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = 80; // Approximate header height
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // If target not found, scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

/**
 * 7. CURRENT YEAR IN FOOTER
 * Automatically updates the copyright year
 */
function initCurrentYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Extra: Cursor Glow Effect
 * Smoothly follows mouse movement with lerp
 */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    const animate = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;

        requestAnimationFrame(animate);
    };

    animate();
}
