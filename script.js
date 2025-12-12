// ===== CORE UTILITIES =====

// Debounce utility
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

// ===== LOADER FUNCTIONALITY =====

function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    
    // Hide loader after CSS animations complete
    window.addEventListener('load', () => {
        // Wait for terminal typing animations to complete (matches CSS timing)
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                // Enable scrolling after loader is hidden
                document.body.style.overflow = 'visible';
            }, 500);
        }, 3000); // Matches CSS animation timing
    });
}

// ===== MOBILE MENU =====

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    function updateMenuIcon(isActive) {
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            if (isActive) {
                icon.classList.replace('fa-bars', 'fa-times');
                icon.style.color = '#00f5ff';
                icon.style.textShadow = '0 0 10px #00f5ff';
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                icon.style.color = '';
                icon.style.textShadow = '';
            }
        }
    }
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        updateMenuIcon(navLinks.classList.contains('active'));
        
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            updateMenuIcon(false);
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            updateMenuIcon(false);
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            updateMenuIcon(false);
            document.body.style.overflow = '';
        }
    });
}

// ===== ANIMATED COUNTERS =====

class AnimatedCounter {
    constructor(element) {
        this.element = element;
        this.target = parseInt(element.getAttribute('data-count') || '0');
        this.duration = 2000;
        this.startTime = null;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCounting();
                    observer.unobserve(this.element);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '50px'
        });

        observer.observe(this.element);
    }

    startCounting() {
        this.startTime = performance.now();
        this.animateCount();
    }

    animateCount(currentTime = 0) {
        if (!this.startTime) this.startTime = currentTime;
        
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(this.target * easeOutQuart);
        
        this.element.textContent = currentCount.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame((time) => this.animateCount(time));
        } else {
            this.element.textContent = this.target.toLocaleString();
        }
    }
}

// ===== TYPING EFFECT =====

class TypingEffect {
    constructor(element, texts) {
        this.element = element;
        this.texts = texts;
        this.speed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 1500;
        
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        // Start typing after a delay
        setTimeout(() => this.type(), 1000);
    }
    
    type() {
        if (this.isPaused) return;
        
        const currentText = this.texts[this.textIndex];
        let currentSpeed = this.speed;
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            currentSpeed = this.deleteSpeed;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            currentSpeed = this.speed;
        }
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            this.isDeleting = true;
            currentSpeed = this.pauseTime;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            currentSpeed = 500;
        }
        
        setTimeout(() => this.type(), currentSpeed);
    }
}

// ===== SKILL ANIMATIONS =====

function initSkillAnimations() {
    const skillLevels = document.querySelectorAll('.skill-level');
    if (skillLevels.length === 0) return;
    
    skillLevels.forEach(level => {
        const targetWidth = level.getAttribute('data-level') || '0';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class
                    level.classList.add('animating');
                    
                    // Animate skill bar
                    setTimeout(() => {
                        level.style.width = targetWidth + '%';
                        
                        // Animate the percentage display
                        const skillItem = level.closest('.skill-item');
                        if (skillItem) {
                            const percentElement = skillItem.querySelector('.skill-percent');
                            if (percentElement) {
                                let currentPercent = 0;
                                const increment = targetWidth / 30;
                                
                                const interval = setInterval(() => {
                                    currentPercent += increment;
                                    if (currentPercent >= targetWidth) {
                                        currentPercent = targetWidth;
                                        clearInterval(interval);
                                    }
                                    percentElement.textContent = Math.round(currentPercent) + '%';
                                }, 40);
                            }
                        }
                    }, 200);
                    
                    observer.unobserve(level);
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Set initial width to 0 for animation
        level.style.width = '0%';
        observer.observe(level);
    });
}

// ===== SCROLL ANIMATIONS =====

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Handle staggered animations for child elements
                const delays = entry.target.querySelectorAll('.delay-1, .delay-2, .delay-3');
                delays.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('animated');
                    }, index * 200);
                });
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// ===== SMOOTH SCROLLING =====

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                    if (mobileMenuBtn) {
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.replace('fa-times', 'fa-bars');
                        }
                    }
                    document.body.style.overflow = '';
                }
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT =====

function initHeaderScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.background = 'rgba(10, 15, 28, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid rgba(0, 245, 255, 0.3)';
            header.style.boxShadow = '0 4px 30px rgba(0, 245, 255, 0.1)';
        } else {
            header.style.background = 'rgba(10, 15, 28, 0.95)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.borderBottom = '1px solid rgba(0, 245, 255, 0.2)';
            header.style.boxShadow = 'none';
        }
    };
    
    // Use debounce for better performance
    const debouncedScroll = debounce(handleScroll, 10);
    window.addEventListener('scroll', debouncedScroll);
    
    // Initial call
    handleScroll();
}

// ===== HOVER EFFECTS =====

function initHoverEffects() {
    // Hover lift effect
    document.querySelectorAll('.hover-lift').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-10px)';
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
    
    // Hover glow effect
    document.querySelectorAll('.hover-glow').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 15px 35px rgba(0, 245, 255, 0.2)';
        });
        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
        });
    });
    
    // 3D hover effect for project cards
    document.querySelectorAll('.hover-3d').forEach(card => {
        if ('ontouchstart' in window) return; // Skip on touch devices
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ===== VIEWPORT HEIGHT FIX =====

function fixViewportHeight() {
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
}

// ===== MAIN INITIALIZATION =====

function initPortfolio() {
    // Initialize all components
    fixViewportHeight();
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderScrollEffect();
    initSkillAnimations();
    initHoverEffects();
    initLoader();
    
    // Initialize animated counters
    document.querySelectorAll('.number[data-count]').forEach(element => {
        new AnimatedCounter(element);
    });
    
    // Initialize typing effect
    const typingElements = document.querySelectorAll('.typing-text');
    if (typingElements.length > 0) {
        const texts = ['Software Engineer', 'Aspiring Cybersecurity Specialist'];
        new TypingEffect(typingElements[0], texts);
    }
    
    // Console greeting
    console.log(`%c
    ╔══════════════════════════════════════╗
    ║   LUTENDO MAUMELA - PORTFOLIO        ║
    ║                                      ║
    ║   System: ONLINE                    ║
    ║   Status: READY                     ║
    ╚══════════════════════════════════════╝
    `, 'color: #00f5ff; font-family: monospace;');
}

// ===== INJECT ADDITIONAL STYLES =====

function injectAdditionalStyles() {
    const additionalStyles = `
        .skill-level {
            transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        
        .skill-level.animating {
            animation: skillShimmer 2s infinite;
        }
        
        .fade-in.animated {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        .delay-1.animated {
            animation: fadeInUp 0.8s ease 0.2s forwards;
        }
        
        .delay-2.animated {
            animation: fadeInUp 0.8s ease 0.4s forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes skillShimmer {
            0% {
                box-shadow: 0 0 5px rgba(0, 245, 255, 0.3);
            }
            50% {
                box-shadow: 0 0 15px rgba(0, 245, 255, 0.6);
            }
            100% {
                box-shadow: 0 0 5px rgba(0, 245, 255, 0.3);
            }
        }
        
        .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        }
        
        .hover-glow {
            transition: box-shadow 0.3s ease !important;
        }
        
        .hover-3d {
            transition: transform 0.3s ease !important;
        }
        
        /* Ensure smooth transitions */
        * {
            scroll-behavior: smooth;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}

// ===== INITIALIZE EVERYTHING =====

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        injectAdditionalStyles();
        initPortfolio();
    });
} else {
    injectAdditionalStyles();
    initPortfolio();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible again
        fixViewportHeight();
    }
});