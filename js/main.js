/* ============================================================
   MAIN JAVASCRIPT - Navigation & Statistics Animation
   ============================================================ */

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.style.opacity = navMenu.classList.contains('active') ? '0.7' : '1';
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Statistics Counter Animation
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString('ar-SA');
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target.toLocaleString('ar-SA');
            }
        };

        updateCount();
    });
}

// Trigger animation when element comes into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            animateCounter();
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.statistics');
if (statsSection) {
    observer.observe(statsSection);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    }
});
