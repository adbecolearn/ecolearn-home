/**
 * 🏠 EcoLearn Home JavaScript
 * Green business intelligence landing page functionality
 */

// Import EcoLearn Shared Libraries
import {
    carbonTracker,
    authUtils
} from 'https://adbecolearn.github.io/ecolearn-shared/index.js';

// Home App Class
class HomeApp {
    constructor() {
        this.isNavOpen = false;
        this.currentSection = 'home';
        this.scrollPosition = 0;
        
        this.init();
    }

    /**
     * Initialize home app
     */
    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.setupScrollSpy();
        this.setupCarbonTracking();
        this.checkAuthStatus();

        carbonTracker.track('home_page_load', {
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });

        console.log('🏠 EcoLearn Home initialized');
    }

    /**
     * Setup DOM references
     */
    setupDOM() {
        // Navigation elements
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Action buttons
        this.loginBtn = document.getElementById('loginBtn');
        this.registerBtn = document.getElementById('registerBtn');
        this.heroGetStarted = document.getElementById('heroGetStarted');
        this.heroLearnMore = document.getElementById('heroLearnMore');
        this.ctaGetStarted = document.getElementById('ctaGetStarted');
        this.ctaLearnMore = document.getElementById('ctaLearnMore');
        
        // Carbon tracker elements
        this.carbonIndicator = document.querySelector('.carbon-indicator');
        this.carbonText = document.querySelector('.carbon-text');
        this.footerCarbonValue = document.getElementById('footerCarbonValue');
        
        // Sections for scroll spy
        this.sections = document.querySelectorAll('section[id]');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleNavigation());
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Auth buttons
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => {
                console.log('🔐 Login button clicked');
                this.redirectToAuth('login');
            });
        }

        if (this.registerBtn) {
            this.registerBtn.addEventListener('click', () => {
                console.log('📝 Register button clicked');
                this.redirectToAuth('register');
            });
        }

        // Hero buttons
        if (this.heroGetStarted) {
            this.heroGetStarted.addEventListener('click', () => {
                console.log('🚀 Get Started button clicked');
                this.handleGetStarted();
            });
        }

        if (this.heroLearnMore) {
            this.heroLearnMore.addEventListener('click', () => {
                console.log('📖 Learn More button clicked');
                this.handleLearnMore();
            });
        }

        // CTA buttons
        if (this.ctaGetStarted) {
            this.ctaGetStarted.addEventListener('click', () => this.handleGetStarted());
        }
        
        if (this.ctaLearnMore) {
            this.ctaLearnMore.addEventListener('click', () => this.scrollToSection('features'));
        }

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());

        // Feature cards hover effects
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => this.trackFeatureHover(card));
        });

        // Suggestion buttons in hero card
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSuggestionClick(e));
        });

        // Contact form
        const contactForm = document.querySelector('.contact-form .form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    /**
     * Setup scroll spy for navigation
     */
    setupScrollSpy() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNavLink(entry.target.id);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Setup carbon tracking updates
     */
    setupCarbonTracking() {
        // Update carbon display every 3 seconds
        setInterval(() => {
            this.updateCarbonDisplay();
        }, 3000);
        
        // Initial update
        this.updateCarbonDisplay();
    }

    /**
     * Check authentication status
     */
    checkAuthStatus() {
        if (authUtils.isAuthenticated()) {
            const user = authUtils.getCurrentUser();
            
            // Update navigation for authenticated users
            if (this.loginBtn) {
                this.loginBtn.textContent = `Hi, ${user.firstName}`;
                this.loginBtn.onclick = () => this.redirectToDashboard(user.role);
            }
            
            if (this.registerBtn) {
                this.registerBtn.textContent = 'Dashboard';
                this.registerBtn.onclick = () => this.redirectToDashboard(user.role);
            }
        }
    }

    /**
     * Toggle mobile navigation
     */
    toggleNavigation() {
        this.isNavOpen = !this.isNavOpen;
        
        // Toggle nav classes (would need mobile nav implementation)
        this.navToggle.classList.toggle('active', this.isNavOpen);
        
        carbonTracker.track('nav_toggle', {
            isOpen: this.isNavOpen
        });
    }

    /**
     * Handle navigation link clicks
     * @param {Event} e Click event
     */
    handleNavClick(e) {
        e.preventDefault();
        
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            this.scrollToSection(sectionId);
            
            carbonTracker.track('nav_click', {
                section: sectionId
            });
        }
    }

    /**
     * Scroll to section smoothly
     * @param {string} sectionId Section ID to scroll to
     */
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Update active navigation link
     * @param {string} sectionId Current section ID
     */
    updateActiveNavLink(sectionId) {
        this.currentSection = sectionId;
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${sectionId}`;
            link.classList.toggle('active', isActive);
        });
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Update navbar background on scroll
        if (currentScroll > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        this.scrollPosition = currentScroll;
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile nav on resize to desktop
        if (window.innerWidth > 768 && this.isNavOpen) {
            this.toggleNavigation();
        }
        
        carbonTracker.track('window_resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    /**
     * Redirect to authentication page
     * @param {string} tab Tab to open (login/register)
     */
    redirectToAuth(tab = 'login') {
        console.log(`🔗 Redirecting to auth: ${tab}`);

        carbonTracker.track('auth_redirect', {
            tab,
            from: 'home_page'
        });

        const authUrl = 'https://adbecolearn.github.io/ecolearn-auth/';
        const urlWithTab = `${authUrl}#${tab}`;

        console.log(`🌐 Redirecting to: ${urlWithTab}`);
        window.location.href = urlWithTab;
    }

    /**
     * Redirect to user dashboard
     * @param {string} role User role
     */
    redirectToDashboard(role) {
        const dashboardUrls = {
            student: 'https://adbecolearn.github.io/ecolearn-student/',
            educator: 'https://adbecolearn.github.io/ecolearn-educator/',
            admin: 'https://adbecolearn.github.io/ecolearn-admin/'
        };
        
        const dashboardUrl = dashboardUrls[role] || dashboardUrls.student;
        
        carbonTracker.track('dashboard_redirect', {
            role,
            from: 'home_page'
        });
        
        window.location.href = dashboardUrl;
    }

    /**
     * Handle get started button clicks
     */
    handleGetStarted() {
        if (authUtils.isAuthenticated()) {
            const user = authUtils.getCurrentUser();
            this.redirectToDashboard(user.role);
        } else {
            this.redirectToAuth('register');
        }
        
        carbonTracker.track('get_started_click', {
            authenticated: authUtils.isAuthenticated()
        });
    }

    /**
     * Handle learn more button clicks
     */
    handleLearnMore() {
        this.scrollToSection('features');
        
        carbonTracker.track('learn_more_click', {
            currentSection: this.currentSection
        });
    }

    /**
     * Track feature card hover
     * @param {HTMLElement} card Feature card element
     */
    trackFeatureHover(card) {
        const featureTitle = card.querySelector('.feature-title')?.textContent;
        
        carbonTracker.track('feature_hover', {
            feature: featureTitle
        });
    }

    /**
     * Handle suggestion button clicks in hero card
     * @param {Event} e Click event
     */
    handleSuggestionClick(e) {
        const suggestion = e.target.textContent;
        
        carbonTracker.track('hero_suggestion_click', {
            suggestion
        });
        
        // Animate button click
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Update carbon footprint display
     */
    updateCarbonDisplay() {
        const metrics = carbonTracker.getMetrics();
        const budget = carbonTracker.getCarbonBudget();
        
        // Update carbon text
        const carbonValue = `${metrics.totalCarbonGrams.toFixed(3)}g CO2`;
        
        if (this.carbonText) {
            this.carbonText.textContent = carbonValue;
        }
        
        if (this.footerCarbonValue) {
            this.footerCarbonValue.textContent = carbonValue;
        }
        
        // Update carbon indicator color
        if (this.carbonIndicator) {
            this.carbonIndicator.className = 'carbon-indicator';
            if (budget.status === 'warning') {
                this.carbonIndicator.classList.add('warning');
            } else if (budget.status === 'critical') {
                this.carbonIndicator.classList.add('critical');
            }
        }
    }

    /**
     * Handle contact form submission
     * @param {Event} e Form submit event
     */
    handleContactSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const contactData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        console.log('📧 Contact form submitted:', contactData);

        // Track contact form submission
        carbonTracker.track('contact_form_submit', {
            hasName: !!contactData.name,
            hasEmail: !!contactData.email,
            hasSubject: !!contactData.subject,
            messageLength: contactData.message.length
        });

        // Show success message
        alert('Terima kasih! Pesan Anda telah dikirim. Tim kami akan segera menghubungi Anda.');

        // Reset form
        form.reset();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomeApp();
});

// Also initialize immediately for module loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HomeApp();
    });
} else {
    new HomeApp();
}
