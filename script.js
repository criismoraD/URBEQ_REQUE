// ============================================
// URBEQ - Interactive Features
// ============================================

// ============================================
// 1. Mobile Menu Toggle
// ============================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.btn-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// ============================================
// 2. Smooth Scroll for Navigation Links
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ============================================
// 3. Testimonials Carousel (CSS-only marquee)
// ============================================
// The testimonials carousel is now handled purely via CSS animation
// (@keyframes marquee-scroll). No JavaScript is needed.
function initTestimonialsCarousel() {
    // CSS-only — nothing to do here
}

// ============================================
// 4. Form Validation
// ============================================
function initFormValidation() {
    const form = document.querySelector('.contact-form form');

    if (!form) return;

    const inputs = {
        name: form.querySelector('input[type="text"]:first-of-type'),
        dni: form.querySelectorAll('input[type="text"]')[1],
        email: form.querySelector('input[type="email"]'),
        phone: form.querySelector('input[type="tel"]'),
        project: form.querySelector('select')
    };

    // Validation rules
    const validators = {
        name: (value) => {
            if (!value || value.trim().length < 3) {
                return 'El nombre debe tener al menos 3 caracteres';
            }
            return null;
        },
        dni: (value) => {
            const dniPattern = /^\d{8}$/;
            if (!dniPattern.test(value)) {
                return 'DNI debe tener 8 dígitos';
            }
            return null;
        },
        email: (value) => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                return 'Correo electrónico inválido';
            }
            return null;
        },
        phone: (value) => {
            const phonePattern = /^(\+51)?\s?\d{9}$/;
            if (!phonePattern.test(value.replace(/\s/g, ''))) {
                return 'Teléfono debe tener 9 dígitos';
            }
            return null;
        }
    };

    // Show error message
    function showError(input, message) {
        // Remove existing error
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (message) {
            input.style.borderBottom = '2px solid #ba1a1a';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ba1a1a';
            errorDiv.style.fontSize = '0.75rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            input.parentElement.appendChild(errorDiv);
        } else {
            input.style.borderBottom = '2px solid #16a34a';
        }
    }

    // Validate field
    function validateField(fieldName, value) {
        const validator = validators[fieldName];
        if (validator) {
            const error = validator(value);
            showError(inputs[fieldName], error);
            return error === null;
        }
        return true;
    }

    // Add blur validation
    Object.keys(inputs).forEach(fieldName => {
        const input = inputs[fieldName];
        if (input && validators[fieldName]) {
            input.addEventListener('blur', () => {
                validateField(fieldName, input.value);
            });

            input.addEventListener('input', () => {
                if (input.style.borderBottom) {
                    validateField(fieldName, input.value);
                }
            });
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate all fields
        Object.keys(inputs).forEach(fieldName => {
            const input = inputs[fieldName];
            if (input && validators[fieldName]) {
                const valid = validateField(fieldName, input.value);
                if (!valid) isValid = false;
            }
        });

        if (isValid) {
            // Show success message
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '✓ Solicitud Enviada';
            submitBtn.style.background = '#16a34a';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                form.reset();

                // Clear validation styles
                Object.values(inputs).forEach(input => {
                    if (input) {
                        input.style.borderBottom = '';
                        const error = input.parentElement.querySelector('.error-message');
                        if (error) error.remove();
                    }
                });
            }, 3000);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ============================================
// 5. Scroll Animations (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.project-card, .testimonial-card, .education-card, .feature, .why-us-image, .stats-card'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ============================================
// 6. Project Filters
// ============================================
function initProjectFilters() {
    const projectsSection = document.querySelector('.featured-projects');
    if (!projectsSection) return;

    // Create filter buttons
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    `;

    const filters = [
        { label: 'Todos', value: 'all' },
        { label: 'Pimentel', value: 'pimentel' },
        { label: 'Reque', value: 'reque' },
        { label: 'Lambayeque', value: 'lambayeque' }
    ];

    filters.forEach(filter => {
        const btn = document.createElement('button');
        btn.textContent = filter.label;
        btn.className = 'filter-btn';
        btn.dataset.filter = filter.value;
        btn.style.cssText = `
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            border: 2px solid rgba(149, 74, 0, 0.2);
            background: ${filter.value === 'all' ? 'var(--primary)' : 'transparent'};
            color: ${filter.value === 'all' ? 'var(--on-primary)' : 'var(--primary)'};
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
        `;

        btn.addEventListener('click', () => {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.style.background = 'transparent';
                b.style.color = 'var(--primary)';
            });
            btn.style.background = 'var(--primary)';
            btn.style.color = 'var(--on-primary)';

            // Filter projects
            filterProjects(filter.value);
        });

        filterContainer.appendChild(btn);
    });

    const projectsGrid = projectsSection.querySelector('.projects-grid');
    projectsSection.insertBefore(filterContainer, projectsGrid);

    // Add data attributes to project cards
    const projectCards = projectsGrid.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        const location = card.querySelector('.project-location').textContent.toLowerCase();
        if (location.includes('pimentel')) {
            card.dataset.location = 'pimentel';
        } else if (location.includes('reque')) {
            card.dataset.location = 'reque';
        } else if (location.includes('lambayeque')) {
            card.dataset.location = 'lambayeque';
        }
    });

    function filterProjects(filterValue) {
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.dataset.location === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// 7. Floating WhatsApp Button with Tooltip
// ============================================
function initFloatingButton() {
    const floatingBtn = document.querySelector('.floating-btn');

    if (floatingBtn) {
        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = '¿Necesitas ayuda? Chatea con nosotros';
        tooltip.style.cssText = `
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            background: var(--on-surface);
            color: var(--surface);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            white-space: nowrap;
            margin-right: 1rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        `;

        floatingBtn.style.position = 'relative';
        floatingBtn.appendChild(tooltip);

        floatingBtn.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });

        floatingBtn.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        // Update href for WhatsApp
        floatingBtn.href = 'https://wa.me/51987654321?text=Hola%20URBEQ,%20quiero%20información%20sobre%20los%20lotes';
        floatingBtn.target = '_blank';
    }
}

// ============================================
// 8. Search Bar Functionality
// ============================================
function initSearchBar() {
    const searchBtn = document.querySelector('.btn-search');
    const searchQueryInput = document.getElementById('searchQuery');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const location = document.querySelector('.search-field select').value;
            const queryValue = searchQueryInput && searchQueryInput.value.trim()
                ? searchQueryInput.value.trim()
                : 'Sin término específico';

            // Scroll to projects section
            const projectsSection = document.querySelector('.featured-projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Show notification
            showNotification(`Ubicación: ${location} | Búsqueda: ${queryValue}`);
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: var(--primary);
        color: var(--on-primary);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-popular);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// ============================================
// 9. Sticky Navigation Background
// ============================================
function initStickyNav() {
    const nav = document.querySelector('.top-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.backgroundColor = 'rgba(250, 248, 246, 0.95)';
            nav.style.boxShadow = '0 4px 20px -5px rgba(149, 74, 0, 0.2)';
        } else {
            nav.style.backgroundColor = 'rgba(250, 248, 246, 0.8)';
            nav.style.boxShadow = '0 4px 20px -10px rgba(149, 74, 0, 0.1)';
        }
    });
}

// ============================================
// Initialize All Features
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏘️ URBEQ - Initializing...');

    initMobileMenu();
    initSmoothScroll();
    initTestimonialsCarousel();
    initFormValidation();
    initScrollAnimations();
    initProjectFilters();
    initFloatingButton();
    initSearchBar();
    initStickyNav();

    console.log('✅ URBEQ - All features loaded!');
});

// Optional: Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
