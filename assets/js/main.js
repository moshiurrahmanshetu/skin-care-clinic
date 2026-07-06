/* 
   AuraCare General Layout Manager
   Handles page loader dismissal, scroll indicator, scroll-to-top triggers, 
   sticky headers, and automatic active link highlight.
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Loader Dismissal (Smooth fade out)
  const loader = document.getElementById('page-loader');
  if (loader) {
    // Elegant delay to appreciate loader brand logo
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500); // Wait for CSS transition
    }, 500);
  }

  // 2. Sticky Header Configuration & Dynamic Height Calculation
  const navbar = document.querySelector('.navbar-sticky');
  if (navbar) {
    const updateNavbarHeight = () => {
      const isScrolled = navbar.classList.contains('navbar-scrolled');
      if (isScrolled) {
        navbar.classList.remove('navbar-scrolled');
      }
      const height = navbar.offsetHeight;
      if (isScrolled) {
        navbar.classList.add('navbar-scrolled');
      }
      document.documentElement.style.setProperty('--navbar-height', `${height}px`);
    };

    const handleNavbarScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    };
    
    // Check state on load, resize, and bind to scrolling
    handleNavbarScroll();
    updateNavbarHeight();
    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('resize', updateNavbarHeight);
    window.addEventListener('load', updateNavbarHeight);
    
    // Fallback timings to ensure precise reading after layouts settle
    setTimeout(updateNavbarHeight, 100);
    setTimeout(updateNavbarHeight, 500);
  }

  // 3. Scroll Progress Indicator
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      const scrolledRatio = scrollHeight > 0 ? (currentScroll / scrollHeight) * 100 : 0;
      progressBar.style.width = `${scrolledRatio}%`;
    });
  }

  // 4. Back To Top Action Button
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    });

    scrollToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Automatic Active Navigation Class Allocation
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-menu .dropdown-item');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Get the exact file names for comparisons (fallback to index.html if empty/root)
      const linkFile = href.split('/').pop() || 'index.html';
      const pathFile = currentPath.split('/').pop() || 'index.html';
      
      if (linkFile === pathFile) {
        link.classList.add('active');
        
        // If the active link is inside a nested Bootstrap dropdown menu, light up parent menu
        const parentDropdown = link.closest('.dropdown-menu');
        if (parentDropdown) {
          const parentToggle = parentDropdown.previousElementSibling;
          if (parentToggle && parentToggle.classList.contains('dropdown-toggle')) {
            parentToggle.classList.add('active');
          }
        }
      }
    }
  });
});
