/**
 * PawBuddy Purrfect Care - Central Public JS (app.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  const authLink = Array.from(document.querySelectorAll(".header-icon-link")).find(el => el.querySelector("i.fa-user"));
  if (authLink) {
    if (window.PetCareDB) {
      window.PetCareDB.auth.getCurrentUser().then(user => {
        if (user) {
          authLink.innerHTML = '<i class="far fa-user"></i> <span>Account</span>';
          authLink.href = user.role === "admin" ? "admin/dashboard.html" : "user/dashboard.html";
        } else {
          authLink.innerHTML = '<i class="far fa-user"></i> <span>Account</span>';
          authLink.href = "login.html";
        }
      });
    }
  }

  // Mobile Hamburger Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const container = document.querySelector(".secondary-nav-container");
      if (container) container.classList.toggle("active");
      const icon = hamburger.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      }
    });

    const container = document.querySelector(".secondary-nav-container");
    if (container) {
      container.addEventListener("click", (e) => {
        if (e.target === container) {
          navLinks.classList.remove("active");
          container.classList.remove("active");
          const icon = hamburger.querySelector("i");
          if (icon) {
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-times");
          }
        }
      });
    }
  }

  // Scroll Animations (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });

  // Toast System
  window.showToast = function(message, type = "success") {
    // Check if container exists, else create it
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    // Choose icon based on type
    let iconClass = "fa-check-circle";
    if (type === "error") iconClass = "fa-exclamation-circle";
    if (type === "warning") iconClass = "fa-exclamation-triangle";

    toast.innerHTML = `
      <i class="fas ${iconClass}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Fade out after 4 seconds
    setTimeout(() => {
      toast.style.animation = "slide-in 0.3s reverse forwards";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  };

  // Contact Form Handling
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !subject || !message) {
        showToast("Please fill in all required fields.", "error");
        return;
      }

      try {
        const currentUser = await window.PetCareDB.auth.getCurrentUser();
        if (!window.PetCareDB || !currentUser) {
          showToast("You must be logged in to send a message.", "error");
          return;
        }
        
        await window.PetCareDB.messages.create({
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
        });

        showToast("Thank you! Your message has been sent successfully.");
        contactForm.reset();
      } catch (err) {
        showToast(err.message || "An error occurred.", "error");
      }
    });
  }

  // Active Navigation link highlighting
  const currentPath = window.location.pathname;
  const navAnchors = document.querySelectorAll(".nav-links a");
  navAnchors.forEach(anchor => {
    if (currentPath.includes(anchor.getAttribute("href"))) {
      anchor.classList.add("active");
    }
  });

  // Section Scroll Animation (like location & hours)
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-animate-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply to all major sections across pages
  document.querySelectorAll('section').forEach(section => {
    if (!section.classList.contains('hero-image-style')) {
      section.classList.add('section-animate-hidden');
      sectionObserver.observe(section);
    }
  });

  // Handle Lazy Load Images
  document.querySelectorAll('img').forEach(img => {
    if (!img.complete) {
      img.setAttribute('loading', 'lazy');
      img.addEventListener('load', () => img.classList.add('loaded'));
    } else {
      img.classList.add('loaded');
    }
  });

  // Apply animations to individual cards/elements
  document.querySelectorAll('.wide-service-card, .service-card, .review-card, .pricing-card').forEach((el, index) => {
    el.classList.add('animate-scale-up');
    el.classList.add(`stagger-${(index % 4) + 1}`);
    sectionObserver.observe(el);
  });

  // Dashboard Sidebar Responsive Toggle
  const sidebarEl = document.querySelector('.sidebar');
  const burgerBtn = document.getElementById('dashboardHamburger') || document.querySelector('.dashboard-hamburger');
  if (burgerBtn && sidebarEl) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebarEl.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (sidebarEl.classList.contains('active') && !sidebarEl.contains(e.target) && !burgerBtn.contains(e.target)) {
        sidebarEl.classList.remove('active');
      }
    });
  }
});
