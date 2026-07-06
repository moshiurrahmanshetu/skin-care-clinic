/* 
   AuraCare Animations Engine
   Handles AOS initialization, GSAP visual reveals, and custom UI interactive effects
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-quad',
      delay: 50,
      offset: 100
    });
  }

  // 2. GSAP Entrance Animations (For luxury displays and text staggers)
  if (typeof gsap !== 'undefined') {
    // Reveal main page headings and content elegantly
    gsap.from('.hero-title-reveal', {
      y: 40,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 0.5
    });

    // Elegant fade-in for subtexts and action buttons
    gsap.from('.hero-fade-reveal', {
      opacity: 0,
      y: 20,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.9
    });
  }

  // 3. Button Ripple Effect (Standard for .btn-ripple buttons)
  const rippleButtons = document.querySelectorAll('.btn-ripple');
  rippleButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      button.appendChild(ripple);
      
      // Clear ripple after animation completes
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // 4. Card Interactive 3D Tilt Hover
  const tiltCards = document.querySelectorAll('.card-tilt');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation offset based on mouse position relative to center
      const xc = width / 2;
      const yc = height / 2;
      const dx = x - xc;
      const dy = y - yc;
      
      // Maximum degrees to tilt
      const maxTilt = 6;
      const tiltX = -(dy / yc) * maxTilt;
      const tiltY = (dx / xc) * maxTilt;
      
      // Apply smooth transition values
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Return card to its absolute rest state smoothly
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 5. Universal Luxury Counter Animation System (Vanilla JS & Intersection Observer)
  const initCounters = () => {
    const counterSelectors = '.stat-counter, .trust-stat-num, .stat-number, #detail-stat-satisfaction, #detail-stat-completed, [data-target]';
    const elements = document.querySelectorAll(counterSelectors);
    
    if (elements.length === 0) return;

    // Helper to initialize element (extract final target and set starting layout to 0)
    const initCounterElement = (el) => {
      if (el.dataset.counterInitialized) return true;
      
      const targetVal = el.getAttribute('data-target') || el.innerText || el.textContent;
      if (!targetVal) return false;
      
      // Parse targetVal (supports formats like "15+", "12K+", "99.8%", "4,800+")
      const match = targetVal.trim().match(/^([^0-9\-\+]*)([\d,.]+)(.*)$/);
      if (!match) return false; // Skip purely non-numeric values like "Board" or "Custom"
      
      const prefix = match[1];
      const numStr = match[2];
      const suffix = match[3];
      
      const cleanNumStr = numStr.replace(/,/g, '');
      const endVal = parseFloat(cleanNumStr);
      if (isNaN(endVal)) return false;
      
      el.setAttribute('data-target', targetVal);
      el.dataset.counterInitialized = "true";
      el.innerText = prefix + "0" + suffix;
      return true;
    };

    // Smoothly animate counting
    const startCounterAnimation = (el) => {
      const targetVal = el.getAttribute('data-target');
      if (!targetVal) return;
      
      const match = targetVal.trim().match(/^([^0-9\-\+]*)([\d,.]+)(.*)$/);
      if (!match) return;
      
      const prefix = match[1];
      const numStr = match[2];
      const suffix = match[3];
      
      const cleanNumStr = numStr.replace(/,/g, '');
      const endVal = parseFloat(cleanNumStr);
      
      const decimalMatch = numStr.match(/\.(\d+)/);
      const decimalPlaces = decimalMatch ? decimalMatch[1].length : 0;
      const hasComma = numStr.includes(',');
      
      const duration = 1800; // Smooth 1.8s duration
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Premium Ease-out Cubic easing curve
        const progressMinusOne = progress - 1;
        const easedProgress = progressMinusOne * progressMinusOne * progressMinusOne + 1;
        const currentVal = endVal * easedProgress;
        
        let formattedVal = "";
        if (decimalPlaces > 0) {
          formattedVal = currentVal.toFixed(decimalPlaces);
        } else {
          formattedVal = Math.round(currentVal).toString();
        }
        
        // Preserve original comma formats (e.g. 4,800)
        if (hasComma) {
          const parts = formattedVal.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          formattedVal = parts.join('.');
        }
        
        el.innerText = prefix + formattedVal + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.innerText = targetVal; // Lock to exact final target value
        }
      };
      
      requestAnimationFrame(updateCounter);
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (initCounterElement(el)) {
            startCounterAnimation(el);
          }
          obs.unobserve(el); // Run only once
        }
      });
    }, observerOptions);

    // Filter and observe each eligible counter element
    elements.forEach(el => {
      const targetVal = el.getAttribute('data-target') || el.innerText || el.textContent;
      if (targetVal) {
        const match = targetVal.trim().match(/^([^0-9\-\+]*)([\d,.]+)(.*)$/);
        if (match) {
          observer.observe(el);
        }
      }
    });
  };

  // Safe timeout allows other dynamic, client-side data scripts to finish populating before parsing
  setTimeout(initCounters, 150);
});
