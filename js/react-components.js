/**
 * PawBuddy Modern 60 FPS Animation & Interactive Suite
 * High-performance UI interactions, reveal observer, parallax, stats counters, ripple FX, preloader & smooth transitions.
 * Full Support for Public Pages + Admin & User Dashboards.
 */

(function () {
  'use strict';

  // State & RequestAnimationFrame throttlers
  let isScrolling = false;
  let lastScrollY = window.scrollY;

  /* ==========================================
     2. Scroll Progress Bar
     ========================================== */
  class ScrollProgress {
    constructor() {
      this.createBar();
    }

    createBar() {
      this.bar = document.getElementById('scroll-progress-bar');
      if (!this.bar) {
        this.bar = document.createElement('div');
        this.bar.id = 'scroll-progress-bar';
        document.body.prepend(this.bar);
      }
    }

    update() {
      if (!this.bar) return;
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      this.bar.style.width = `${scrolled}%`;
    }
  }

  /* ==========================================
     3. Back To Top Button
     ========================================== */
  class BackToTopButton {
    constructor() {
      this.createButton();
    }

    createButton() {
      this.btn = document.getElementById('back-to-top-btn');
      if (!this.btn) {
        this.btn = document.createElement('button');
        this.btn.id = 'back-to-top-btn';
        this.btn.setAttribute('aria-label', 'Back to top');
        this.btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(this.btn);
      }

      this.btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    update() {
      if (!this.btn) return;
      if (window.scrollY > 300) {
        this.btn.classList.add('visible');
      } else {
        this.btn.classList.remove('visible');
      }
    }
  }

  /* ==========================================
     4. Dynamic Header & Sidebar Scrolled State
     ========================================== */
  class HeaderScrollManager {
    constructor() {
      this.header = document.querySelector('.app-header');
      this.dashHeader = document.querySelector('.dashboard-header');
    }

    update() {
      if (this.header) {
        if (window.scrollY > 25) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      }
      if (this.dashHeader) {
        if (window.scrollY > 15) {
          this.dashHeader.classList.add('scrolled');
        } else {
          this.dashHeader.classList.remove('scrolled');
        }
      }
    }
  }

  /* ==========================================
     5. Lightweight GPU Parallax Engine
     ========================================== */
  class ParallaxEngine {
    constructor() {
      this.elements = document.querySelectorAll('.hero-bg-img');
    }

    update() {
      if (!this.elements.length) return;
      const scrollY = window.scrollY;
      if (scrollY > window.innerHeight) return;

      this.elements.forEach(el => {
        const speed = 0.28;
        const translateY = scrollY * speed;
        el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      });
    }
  }

  /* ==========================================
     6. Section, Dashboard Panel & Card Reveal Observer
     ========================================== */
  class RevealObserver {
    constructor() {
      this.init();
    }

    init() {
      const observerOptions = {
        root: null,
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      };

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Add animate-reveal class to target elements (Public + Dashboard)
      const targetSelectors = [
        'section:not(.hero-image-style)',
        '.service-card',
        '.review-card',
        '.pricing-card',
        '.wide-service-card',
        '.hours-table-wrap',
        '.contact-card',
        '.location-card',
        '.story-text',
        '.story-graphics',
        '.stat-card',
        '.dashboard-panel',
        '.profile-card',
        '.form-card',
        '.table-responsive',
        '.modal-content'
      ];

      const elements = document.querySelectorAll(targetSelectors.join(', '));
      elements.forEach(el => {
        if (!el.classList.contains('animate-reveal')) {
          el.classList.add('animate-reveal');
        }
      });

      // Apply stagger delays to grid children (Public + Dashboard)
      const gridContainers = document.querySelectorAll('.services-grid, .cards-grid-3, .features-grid, .pricing-grid, .stats-grid, .sidebar-menu, .grid-2');
      gridContainers.forEach(grid => {
        Array.from(grid.children).forEach((child, index) => {
          const staggerClass = `stagger-${(index % 5) + 1}`;
          child.classList.add(staggerClass);
          if (!child.classList.contains('animate-reveal')) {
            child.classList.add('animate-reveal');
          }
        });
      });

      // Observe all elements
      document.querySelectorAll('.animate-reveal').forEach(el => observer.observe(el));

      // Observe dynamic changes (e.g. table rows or dynamic cards rendered by JS)
      const dynamicObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              if (node.matches('tr, .stat-card, .dashboard-panel, .pet-card, .booking-card')) {
                node.classList.add('animate-reveal');
                setTimeout(() => node.classList.add('revealed'), 50);
              }
            }
          });
        });
      });

      const dynamicContainers = document.querySelectorAll('tbody, #petsGrid, .dashboard-wrapper');
      dynamicContainers.forEach(c => dynamicObserver.observe(c, { childList: true, subtree: true }));
    }
  }

  /* ==========================================
     7. Animated Statistics Counters
     ========================================== */
  class StatsCounter {
    constructor() {
      this.init();
    }

    init() {
      const counters = document.querySelectorAll('.stat-number, [data-counter]');
      if (!counters.length) return;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(el) {
      const targetText = el.getAttribute('data-target') || el.innerText;
      const numericVal = parseInt(targetText.replace(/\D/g, ''), 10);
      const suffix = targetText.replace(/[0-9]/g, '');

      if (isNaN(numericVal)) return;

      const duration = 1600; // ms
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = progress * (2 - progress);
        const currentCount = Math.floor(easedProgress * numericVal);

        el.innerText = `${currentCount.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.innerText = `${numericVal.toLocaleString()}${suffix}`;
        }
      };

      requestAnimationFrame(step);
    }
  }

  /* ==========================================
     8. Button & Action Ripple Effect
     ========================================== */
  class RippleEffect {
    constructor() {
      this.init();
    }

    init() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, .btn-primary, .btn-mint, .btn-hero-shop, .view-more, .btn-icon, .sidebar-link, [class*="btn"]');
        if (btn) {
          this.createRipple(e, btn);
        }
      });
    }

    createRipple(e, btn) {
      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-span');

      const existingRipple = btn.querySelector('.ripple-span');
      if (existingRipple) {
        existingRipple.remove();
      }

      btn.classList.add('btn-ripple');
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    }
  }

  /* ==========================================
     9. Lazy Image & Skeleton Shimmer Loader
     ========================================== */
  class LazySkeletonLoader {
    constructor() {
      this.init();
    }

    init() {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.classList.contains('logo-img') || img.classList.contains('icon') || img.id === 'photoPreview') return;

        img.setAttribute('loading', 'lazy');
        img.classList.add('img-lazy');

        const parent = img.parentElement;
        if (parent && !parent.classList.contains('img-skeleton-wrap')) {
          parent.classList.add('img-skeleton-wrap');
        }

        const handleLoad = () => {
          img.classList.add('loaded');
          if (parent && parent.classList.contains('img-skeleton-wrap')) {
            parent.classList.add('loaded');
          }
        };

        if (img.complete) {
          handleLoad();
        } else {
          img.addEventListener('load', handleLoad);
        }
      });
    }
  }

  /* ==========================================
     10. Page View Transitions API & Smooth Links
     ========================================== */
  class NavigationTransitions {
    constructor() {
      this.init();
    }

    init() {
      document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') {
          return;
        }

        link.addEventListener('click', (e) => {
          if (document.startViewTransition && href.endsWith('.html')) {
            e.preventDefault();
            document.startViewTransition(() => {
              window.location.href = href;
            });
          }
        });
      });
    }
  }

  /* ==========================================
     Master Execution Loop & RAF Scroll Throttler
     ========================================== */
  document.addEventListener('DOMContentLoaded', () => {
    const scrollProgress = new ScrollProgress();
    const backToTop = new BackToTopButton();
    const headerScroll = new HeaderScrollManager();
    const parallax = new ParallaxEngine();
    const reveal = new RevealObserver();
    const stats = new StatsCounter();
    const ripple = new RippleEffect();
    const lazyImages = new LazySkeletonLoader();
    const transitions = new NavigationTransitions();

    // 60 FPS RequestAnimationFrame Scroll Loop
    const onScrollLoop = () => {
      scrollProgress.update();
      backToTop.update();
      headerScroll.update();
      parallax.update();
      isScrolling = false;
    };

    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
      if (!isScrolling) {
        requestAnimationFrame(onScrollLoop);
        isScrolling = true;
      }
    }, { passive: true });

    // Initial trigger
    requestAnimationFrame(onScrollLoop);
    console.log('✨ PawBuddy 60 FPS Public & Dashboard Suite Active');
  });

})();