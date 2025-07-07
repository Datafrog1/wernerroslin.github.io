// Global JavaScript for Werner Roslin Website

// Dark Mode Toggle Functionality
function toggleTheme() {
    const body = document.body;
    const button = document.querySelector('.dark-mode-toggle');
    
    // Cycle through: auto -> dark -> light -> auto
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        button.textContent = '☀️';
        button.title = 'Switch to auto theme';
        localStorage.setItem('theme', 'light');
    } else if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        button.textContent = '🔄';
        button.title = 'Switch to dark theme';
        localStorage.setItem('theme', 'auto');
    } else {
        body.classList.add('dark-mode');
        button.textContent = '🌙';
        button.title = 'Switch to light theme';
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const button = document.querySelector('.dark-mode-toggle');
    
    if (!button) return; // Exit if no toggle button exists
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        button.textContent = '🌙';
        button.title = 'Switch to light theme';
    } else if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        button.textContent = '☀️';
        button.title = 'Switch to auto theme';
    } else {
        button.textContent = '🔄';
        button.title = 'Switch to dark theme';
    }
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add fade-in animation to elements when they come into view
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Observe all sections, blog posts, and portfolio items
    const elements = document.querySelectorAll('section, .blog-post, .portfolio-item');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    observeElements();
    
    // Add any page-specific initializations here
    console.log('Werner Roslin Website - Scripts loaded');
});

// Add click tracking for analytics (optional)
function trackClick(elementName) {
    console.log(`Clicked: ${elementName}`);
    // Here you could add Google Analytics or other tracking
}

// Utility function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + D = Toggle dark mode
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        const button = document.querySelector('.dark-mode-toggle');
        if (button) toggleTheme();
    }
    
    // Alt + H = Go to home
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = 'index.html';
    }
});