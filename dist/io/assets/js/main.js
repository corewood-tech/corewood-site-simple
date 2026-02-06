// Corewood — main.js

document.addEventListener('DOMContentLoaded', function() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero entrance animation — slide in on page load + scroll split
  if (!prefersReducedMotion) {
    const hero = document.getElementById('hero');
    const heroTitle = document.getElementById('hero-title');
    const heroLeft = document.getElementById('hero-left');
    const heroRight = document.getElementById('hero-right');
    const heroDot = document.getElementById('hero-dot');

    if (hero && heroTitle && heroLeft && heroRight) {
      // Page load entrance — staggered fade/slide in
      setTimeout(function() {
        heroTitle.style.opacity = '1';
      }, 200);

      setTimeout(function() {
        heroLeft.style.transform = 'translateX(0)';
        heroLeft.style.opacity = '1';
      }, 600);

      setTimeout(function() {
        if (heroDot) heroDot.style.opacity = '1';
      }, 900);

      setTimeout(function() {
        heroRight.style.transform = 'translateX(0)';
        heroRight.style.opacity = '1';
      }, 800);

      // Scroll-out — split apart when hero leaves viewport
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            heroLeft.style.transform = 'translateX(-30vw)';
            heroLeft.style.opacity = '0.3';
            heroRight.style.transform = 'translateX(30vw)';
            heroRight.style.opacity = '0.3';
            if (heroDot) heroDot.style.opacity = '0';
          } else {
            heroLeft.style.transform = 'translateX(0)';
            heroLeft.style.opacity = '1';
            heroRight.style.transform = 'translateX(0)';
            heroRight.style.opacity = '1';
            if (heroDot) heroDot.style.opacity = '1';
          }
        });
      }, { threshold: 0.3 });

      heroObserver.observe(hero);
    }
  } else {
    // Reduced motion — just show everything immediately
    var els = ['hero-title', 'hero-left', 'hero-right', 'hero-dot'];
    els.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }

  // Fade-in on scroll
  if (!prefersReducedMotion) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
      fadeObserver.observe(el);
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.getElementById(this.getAttribute('href').substring(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
