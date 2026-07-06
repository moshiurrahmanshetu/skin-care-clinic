/* 
   AuraCare Premium Theme System Manager
   Manages Light & Dark transitions natively using Bootstrap 5's data-bs-theme
*/

// Theme initialization - executes immediately to prevent light-theme flashing on dark mode load
(function () {
  const savedTheme = localStorage.getItem('clinic-theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  /**
   * Applies the chosen theme to the document and saves it
   * @param {string} theme - 'light' | 'dark'
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('clinic-theme', theme);
    updateToggleIcons(theme);
  }

  /**
   * Updates toggle button icons based on current theme state
   * @param {string} theme - 'light' | 'dark'
   */
  function updateToggleIcons(theme) {
    themeToggleBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.theme-icon-sun');
      const moonIcon = btn.querySelector('.theme-icon-moon');
      
      if (theme === 'dark') {
        if (sunIcon) sunIcon.classList.remove('d-none');
        if (moonIcon) moonIcon.classList.add('d-none');
      } else {
        if (sunIcon) sunIcon.classList.add('d-none');
        if (moonIcon) moonIcon.classList.remove('d-none');
      }
    });
  }

  // Set initial icon states
  const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
  updateToggleIcons(currentTheme);

  // Setup event listeners for theme togglers
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const activeTheme = document.documentElement.getAttribute('data-bs-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });
});
