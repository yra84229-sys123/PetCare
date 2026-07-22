/**
 * PawBuddy React Components
 * Interactive and Amazing Features
 */

// Smooth Scroll Animation on Page Load
class SmoothScrollObserver {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
    this.init();
  }

  init() {
    // Observe all sections with animation class
    document.querySelectorAll('section, .service-card, .review-card, .hours-table-wrap').forEach(el => {
      el.classList.add('scroll-animate');
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// Interactive Button Effects
class ButtonInteractive {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('button, .btn-primary, .btn-mint, [class*="btn"]').forEach(btn => {
      btn.addEventListener('mouseenter', (e) => this.addRipple(e));
      btn.addEventListener('click', (e) => this.handleClick(e));
    });
  }

  addRipple(e) {
    const btn = e.target.closest('button, .btn-primary, .btn-mint, [class*="btn"]');
    if (!btn) return;

    btn.style.transform = 'scale(0.98)';
    btn.style.transition = 'all 0.3s ease';
  }

  handleClick(e) {
    const btn = e.target.closest('button, .btn-primary, .btn-mint, [class*="btn"]');
    if (!btn) return;

    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 100);
  }
}

// Card Hover Effects
class CardHoverEffect {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('.service-card, .review-card, [class*="card"]').forEach(card => {
      card.addEventListener('mouseenter', () => this.elevateCard(card));
      card.addEventListener('mouseleave', () => this.resetCard(card));
    });
  }

  elevateCard(card) {
    card.style.transform = 'translateY(-8px)';
    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  resetCard(card) {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'var(--shadow-md)';
  }
}

// Navigation Active State
class NavActiveState {
  constructor() {
    this.init();
  }

  init() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}

// Scroll Progress Bar
class ScrollProgress {
  constructor() {
    this.createProgressBar();
    this.init();
  }

  createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #76e3d4, #1e4d8c);
      width: 0%;
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.insertBefore(progressBar, document.body.firstChild);
  }

  init() {
    window.addEventListener('scroll', () => this.updateProgress());
  }

  updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + '%';
  }
}

// Back to Top Button
class BackToTopButton {
  constructor() {
    this.createButton();
    this.init();
  }

  createButton() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #1e4d8c;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 20px;
      display: none;
      z-index: 999;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(30, 77, 140, 0.3);
    `;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.boxShadow = '0 8px 25px rgba(30, 77, 140, 0.5)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 15px rgba(30, 77, 140, 0.3)';
    });
    document.body.appendChild(btn);
  }

  init() {
    window.addEventListener('scroll', () => this.toggleVisibility());
  }

  toggleVisibility() {
    const btn = document.getElementById('back-to-top');
    if (window.scrollY > 300) {
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
    } else {
      btn.style.display = 'none';
    }
  }
}

// Lazy Load Images
class LazyLoadImages {
  constructor() {
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
  }
}

// Smooth Navigation Links
class SmoothNavigation {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href*="#"]').forEach(link => {
      link.addEventListener('click', (e) => this.smoothScroll(e));
    });
  }

  smoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}

// Loading State on Links
class LinkLoadingState {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a:not([href*="#"]):not([target="_blank"])').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.href && !link.href.includes('javascript:')) {
          link.style.opacity = '0.6';
          link.style.pointerEvents = 'none';
        }
      });
    });
  }
}

// Text Animation on Scroll
class TextAnimationOnScroll {
  constructor() {
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInText 0.8s ease forwards';
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('h1, h2, h3, .intro-description').forEach(el => {
      observer.observe(el);
    });
  }
}

// Add CSS for animations
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInText {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .scroll-animate {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .scroll-animate.animate-visible {
      opacity: 1;
      transform: translateY(0);
    }

    a {
      transition: color 0.3s ease, opacity 0.3s ease;
    }

    button, [class*="btn"] {
      position: relative;
      overflow: hidden;
    }

    img {
      transition: opacity 0.3s ease;
    }

    img.loaded {
      animation: fadeInImage 0.5s ease;
    }

    @keyframes fadeInImage {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  addAnimationStyles();
  new SmoothScrollObserver();
  new ButtonInteractive();
  new CardHoverEffect();
  new NavActiveState();
  new ScrollProgress();
  new BackToTopButton();
  new LazyLoadImages();
  new SmoothNavigation();
  new LinkLoadingState();
  new TextAnimationOnScroll();

  console.log('✨ PawBuddy React Components Loaded - Your site is now amazing!');
});

// Export for modular use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SmoothScrollObserver,
    ButtonInteractive,
    CardHoverEffect,
    NavActiveState,
    ScrollProgress,
    BackToTopButton,
    LazyLoadImages,
    SmoothNavigation,
    LinkLoadingState,
    TextAnimationOnScroll
  };
}