// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      toggle.textContent = navLinks.classList.contains('active') ? '\u2715' : '\u2630';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        toggle.textContent = '\u2630';
      });
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Newsletter form handler
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = this.querySelector('input');
      if (input && input.value) {
        alert('Vielen Dank! Du wirst ab sofort unseren Newsletter erhalten.');
        input.value = '';
      }
    });
  }
});
