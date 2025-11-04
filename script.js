// Mobile menu toggle with animation
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Animate hamburger icon
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Enhanced typing effect with multiple elements
class TypingEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 1000;
        this.loop = options.loop !== false;
        
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.type();
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
            
            if (!this.loop && this.textIndex === 0) {
                this.isPaused = true;
                return;
            }
        }
        
        setTimeout(() => this.type(), currentSpeed);
    }
}

// Initialize typing effects
const typingTexts = document.querySelectorAll('.typing-text');
if (typingTexts.length > 0) {
    const texts = ['Software Engineer', 'Cybersecurity Enthusiast', 'Problem Solver', 'Full-Stack Developer'];
    new TypingEffect(typingTexts[0], texts, { pauseTime: 1500 });
}

// Enhanced scroll animations with GSAP-like effects
const scrollObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Add staggered animations for child elements
            const animatableChildren = entry.target.querySelectorAll('.delay-1, .delay-2, .delay-3');
            animatableChildren.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('fade-in');
                }, index * 200);
            });
        }
    });
}, scrollObserverOptions);

// Observe all sections and animatable elements
document.querySelectorAll('section, .animate-on-scroll').forEach(element => {
    scrollObserver.observe(element);
});

// Smooth scrolling for navigation links with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced header background on scroll with parallax effect
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollY = window.scrollY;
    
    // Background color change
    if (scrollY > 100) {
        header.style.backgroundColor = 'var(--background)';
        header.style.backdropFilter = 'blur(15px)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = 'none';
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero && scrollY < window.innerHeight) {
        const scrolled = scrollY / window.innerHeight;
        hero.style.transform = `translateY(${scrolled * 50}px)`;
        hero.style.opacity = `${1 - scrolled * 0.5}`;
    }
    
    lastScrollY = scrollY;
});

// 3D Tilt Effect for Project Cards
class TiltEffect {
    constructor(element) {
        this.element = element;
        this.width = element.offsetWidth;
        this.height = element.offsetHeight;
        this.rotation = 10;
        
        element.addEventListener('mousemove', this.handleMouseMove.bind(this));
        element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    }
    
    handleMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * this.rotation;
        const rotateX = ((centerY - y) / centerY) * this.rotation;
        
        this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        
        // Add shine effect
        const shineX = (x / this.width) * 100;
        const shineY = (y / this.height) * 100;
        this.element.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.1) 0%, transparent 50%)`;
    }
    
    handleMouseLeave() {
        this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        this.element.style.background = '';
        setTimeout(() => {
            this.element.style.transition = 'transform 0.5s ease, background 0.3s ease';
        }, 50);
    }
    
    handleMouseEnter() {
        this.element.style.transition = 'transform 0.1s ease, background 0.1s ease';
    }
}

// Initialize tilt effects
document.querySelectorAll('.project-card').forEach(card => {
    new TiltEffect(card);
});

// Particle System for Animated Background
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        
        this.init();
    }
    
    init() {
        this.canvas.id = 'particles-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        document.body.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    createParticles() {
        const particleCount = Math.min(50, window.innerWidth / 20);
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(37, 99, 235, ${Math.random() * 0.3 + 0.1})`
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Mouse interaction
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.x += Math.cos(angle) * force * 2;
                particle.y += Math.sin(angle) * force * 2;
            }
            
            // Normal movement with boundary check
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            // Draw particle
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }
}

// Initialize particle system
const particleSystem = new ParticleSystem();

// Custom Cursor with Interactive Effects
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.follower = document.createElement('div');
        this.posX = 0;
        this.posY = 0;
        this.followerX = 0;
        this.followerY = 0;
        
        this.init();
    }
    
    init() {
        // Create cursor elements
        this.cursor.className = 'custom-cursor';
        this.follower.className = 'cursor-follower';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.follower);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                width: 8px;
                height: 8px;
                background: var(--primary);
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
                transition: transform 0.15s ease;
            }
            
            .cursor-follower {
                width: 24px;
                height: 24px;
                border: 2px solid var(--accent);
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9998;
                transition: all 0.1s ease;
            }
            
            .custom-cursor.hover, .cursor-follower.hover {
                transform: scale(1.5);
            }
            
            .cursor-follower.hover {
                background: var(--accent);
                opacity: 0.3;
            }
        `;
        document.head.appendChild(style);
        
        // Event listeners
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.animate();
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.handleHover(true));
            el.addEventListener('mouseleave', () => this.handleHover(false));
        });
    }
    
    handleMouseMove(e) {
        this.posX = e.clientX;
        this.posY = e.clientY;
    }
    
    handleHover(isHovering) {
        if (isHovering) {
            this.cursor.classList.add('hover');
            this.follower.classList.add('hover');
        } else {
            this.cursor.classList.remove('hover');
            this.follower.classList.remove('hover');
        }
    }
    
    animate() {
        this.followerX += (this.posX - this.followerX) * 0.1;
        this.followerY += (this.posY - this.followerY) * 0.1;
        
        this.cursor.style.left = `${this.posX - 4}px`;
        this.cursor.style.top = `${this.posY - 4}px`;
        
        this.follower.style.left = `${this.followerX - 12}px`;
        this.follower.style.top = `${this.followerY - 12}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize custom cursor
const customCursor = new CustomCursor();

// Voice Command Integration
class VoiceCommands {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        
        if ('webkitSpeechRecognition' in window) {
            this.init();
        }
    }
    
    init() {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            this.handleVoiceCommand(command);
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateButtonState();
        };
        
        this.createButton();
    }
    
    createButton() {
        this.button = document.createElement('button');
        this.button.innerHTML = '🎤';
        this.button.className = 'voice-command-btn';
        this.button.title = 'Voice Commands: Try saying "go to about" or "show projects"';
        this.button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary);
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        
        this.button.addEventListener('click', () => this.toggleListening());
        document.body.appendChild(this.button);
    }
    
    toggleListening() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
            this.isListening = true;
            this.updateButtonState();
            this.showFeedback('Listening... Say a command like "go to about"');
        }
    }
    
    updateButtonState() {
        if (this.isListening) {
            this.button.style.background = 'var(--accent)';
            this.button.style.transform = 'scale(1.1)';
        } else {
            this.button.style.background = 'var(--primary)';
            this.button.style.transform = 'scale(1)';
        }
    }
    
    handleVoiceCommand(command) {
        const sections = {
            'home': '#home',
            'about': '#about',
            'skills': '#skills',
            'projects': '#projects',
            'contact': '#contact'
        };
        
        for (const [key, value] of Object.entries(sections)) {
            if (command.includes(key)) {
                this.navigateToSection(value);
                this.showFeedback(`Navigating to ${key} section`);
                return;
            }
        }
        
        this.showFeedback('Command not recognized. Try "go to about" or "show projects"');
    }
    
    navigateToSection(sectionId) {
        const target = document.querySelector(sectionId);
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    showFeedback(message) {
        // Create or update feedback element
        let feedback = document.querySelector('.voice-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'voice-feedback';
            feedback.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: var(--card-bg);
                color: var(--text);
                padding: 10px 15px;
                border-radius: 5px;
                border: 1px solid var(--card-border);
                z-index: 1000;
                font-size: 0.9rem;
                max-width: 200px;
            `;
            document.body.appendChild(feedback);
        }
        
        feedback.textContent = message;
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }
}

// Initialize voice commands
const voiceCommands = new VoiceCommands();

// Theme Toggle System
class ThemeToggle {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.createToggle();
    }
    
    createToggle() {
        this.button = document.createElement('button');
        this.button.className = 'theme-toggle';
        this.button.innerHTML = this.currentTheme === 'dark' ? '🌙' : '☀️';
        this.button.title = 'Toggle theme';
        this.button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 80px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            cursor: pointer;
            z-index: 1001;
            transition: all 0.3s ease;
            font-size: 1.2rem;
        `;
        
        this.button.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(this.button);
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(this.currentTheme);
        this.button.innerHTML = this.currentTheme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', this.currentTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'light') {
            document.documentElement.style.setProperty('--background', '#f8fafc');
            document.documentElement.style.setProperty('--text', '#0f172a');
            document.documentElement.style.setProperty('--text-muted', '#475569');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            document.documentElement.style.setProperty('--card-border', '#e2e8f0');
            document.documentElement.style.setProperty('--secondary', '#f1f5f9');
        } else {
            // Reset to dark theme
            document.documentElement.style.setProperty('--background', '#0f172a');
            document.documentElement.style.setProperty('--text', '#f8fafc');
            document.documentElement.style.setProperty('--text-muted', '#cbd5e1');
            document.documentElement.style.setProperty('--card-bg', '#1e293b');
            document.documentElement.style.setProperty('--card-border', '#334155');
            document.documentElement.style.setProperty('--secondary', '#0f172a');
        }
    }
}

// Initialize theme toggle
const themeToggle = new ThemeToggle();

// Skill Progress Animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillLevel = bar.getAttribute('data-level');
                    bar.style.width = skillLevel;
                    bar.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(bar);
    });
}

// Initialize skill bars if they exist
if (document.querySelector('.skill-bar')) {
    animateSkillBars();
}

// Page Load Animations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loading animation removal
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// Utility function for debouncing
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

// Enhanced resize handler with debouncing
const handleResize = debounce(() => {
    particleSystem.resize();
}, 250);

window.addEventListener('resize', handleResize);

// Console greeting (optional)
console.log(`%cWelcome to Lutendo Maumela's Portfolio! 🚀`, 
    'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log(`%cBuilt with passion for Software Engineering & Cybersecurity`, 
    'color: #10b981; font-size: 14px;');