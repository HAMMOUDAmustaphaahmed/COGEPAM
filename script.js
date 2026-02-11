// ============================================
// COGEPAM - GLOBAL SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initNavigation();
    initScrollTop();
    initStatsCounter();
    initSmoothScroll();
});



// ============================================
// LOADER ANIMATION
// ============================================

function initLoader() {
    const loader = document.getElementById('pageLoader');
    const progressBar = document.querySelector('.progress-bar');
    
    if (!loader) return;
    
    // Simuler la progression de chargement
    let progress = 0;
    const minLoadTime = 2500; // Temps minimum d'affichage (2.5s)
    const startTime = Date.now();
    
    // Fonction pour masquer le loader
    const hideLoader = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        // Attendre que le temps minimum soit écoulé
        setTimeout(() => {
            // Compléter la barre de progression
            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.style.transition = 'width 0.3s ease';
            }
            
            // Masquer le loader avec animation
            setTimeout(() => {
                loader.classList.add('hidden');
                
                // Supprimer du DOM après l'animation
                setTimeout(() => {
                    loader.remove();
                    // Déclencher l'animation des stats si visibles
                    triggerStatsAnimation();
                }, 600);
            }, 300);
            
        }, remainingTime);
    };
    
    // Attendre que tout soit chargé
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
    
    // Fallback: masquer après 5s maximum (si problème de chargement)
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            hideLoader();
        }
    }, 5000);
}

// Fonction pour déclencher l'animation des stats après le loader
function triggerStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (stats.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}
// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.add('active');
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close menu
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }
    
    function closeMenu() {
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Close all dropdowns
        dropdowns.forEach(d => d.classList.remove('active'));
    }
    
    // Dropdown toggles (pour Produits, Interventions, Langue)
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Fermer les autres dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });
                
                // Toggle le dropdown actuel
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Fermer les dropdowns quand on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });
    
    // Gestion des sous-menus (Chambres Froides, Équipements, Accessoires)
    const submenus = document.querySelectorAll('.nav-dropdown-submenu .has-submenu');
    submenus.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const parent = trigger.closest('.nav-dropdown-submenu');
            
            // Toggle active sur le parent
            parent.classList.toggle('active');
            
            // Fermer les autres sous-menus au même niveau
            const siblings = parent.parentElement.querySelectorAll('.nav-dropdown-submenu');
            siblings.forEach(sibling => {
                if (sibling !== parent) {
                    sibling.classList.remove('active');
                }
            });
        });
    });
    
    // Language switcher
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.dataset.lang;
            const navFlag = document.getElementById('navFlag');
            const navLang = document.getElementById('navLang');
            
            // Update active state
            langOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update flag and label
            const flags = {
                fr: 'https://flagcdn.com/w40/fr.png',
                en: 'https://flagcdn.com/w40/gb.png',
                ar: 'https://flagcdn.com/w40/tn.png'
            };
            const labels = { fr: 'FR', en: 'EN', ar: 'AR' };
            
            if (navFlag) navFlag.src = flags[lang];
            if (navLang) navLang.textContent = labels[lang];
            
            // Close dropdown
            const langDropdown = document.querySelector('.lang-dropdown');
            if (langDropdown) langDropdown.classList.remove('active');
            
            // Store preference
            localStorage.setItem('cogepam-lang', lang);
        });
    });
    
    // Load saved language
    const savedLang = localStorage.getItem('cogepam-lang');
    if (savedLang) {
        const option = document.querySelector(`.lang-option[data-lang="${savedLang}"]`);
        if (option) {
            // Simuler un clic sans déclencher l'événement
            const lang = savedLang;
            const navFlag = document.getElementById('navFlag');
            const navLang = document.getElementById('navLang');
            const flags = {
                fr: 'https://flagcdn.com/w40/fr.png',
                en: 'https://flagcdn.com/w40/gb.png',
                ar: 'https://flagcdn.com/w40/tn.png'
            };
            const labels = { fr: 'FR', en: 'EN', ar: 'AR' };
            
            document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            if (navFlag) navFlag.src = flags[lang];
            if (navLang) navLang.textContent = labels[lang];
        }
    }
}

// ============================================
// SCROLL TO TOP
// ============================================

function initScrollTop() {
    const scrollTop = document.getElementById('scrollTop');
    if (!scrollTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });
    
    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (stats.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (target > 100 ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// FORM VALIDATION
// ============================================

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add shake animation
            field.style.animation = 'shake 0.5s';
            setTimeout(() => {
                field.style.animation = '';
            }, 500);
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// Shake animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .error {
        border-color: var(--danger) !important;
        background: rgba(239, 68, 68, 0.05) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// LAZY LOADING IMAGES
// ============================================

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
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// PERFORMANCE: DEBOUNCE FUNCTION
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScroll = debounce(() => {
    // Scroll-based animations here
}, 16);

window.addEventListener('scroll', optimizedScroll);