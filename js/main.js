// ===== Preloader =====
function hidePreloader() {
    const loader = document.getElementById('preloader');
    if (loader && !loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
        setTimeout(() => { loader.style.display = 'none'; }, 600);
    }
}
window.addEventListener('load', () => { setTimeout(hidePreloader, 500); });
setTimeout(hidePreloader, 4000);

// ===== Custom Cursor (Desktop only)
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = (e.clientX - 4) + 'px';
        cursorDot.style.top = (e.clientY - 4) + 'px';
    });
    document.querySelectorAll('a, button, input, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => cursorDot.style.transform = 'scale(2)');
        el.addEventListener('mouseleave', () => cursorDot.style.transform = 'scale(1)');
    });
}

// ===== Scroll to Top =====
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.5) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}, { passive: true });
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Header Scroll Effect =====
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== Mobile Drawer =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileDrawerClose = document.getElementById('mobileDrawerClose');

function openDrawer() {
    mobileDrawer.classList.add('active');
    mobileOverlay.classList.add('active');
    mobileMenuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeDrawer() {
    mobileDrawer.classList.remove('active');
    mobileOverlay.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    document.body.style.overflow = '';
}
mobileMenuBtn.addEventListener('click', openDrawer);
mobileDrawerClose.addEventListener('click', closeDrawer);
mobileOverlay.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
});
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        closeDrawer();
        document.querySelectorAll('.mobile-nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ===== Scroll Reveal =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            let current = '';
            const scrollY = window.scrollY + 120;
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollY >= top && scrollY < top + height) {
                    current = section.id;
                }
            });
            navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});