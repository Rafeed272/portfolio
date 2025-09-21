// router.js - Client-side routing for SPA
class Router {
    constructor() {
        this.routes = {
            '/': 'home',
            '/about': 'about',
            '/highlights': 'highlights',
            '/projects': 'projects',
            '/research': 'research'
        };
        
        this.init();
    }
    
    init() {
        // Load navbar and footer first
        this.loadNavbar();
        this.loadFooter();
        
        // Handle initial route
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigate(route);
            }
        });
        
        // Initial route handling
        this.handleRoute();
    }
    
    async loadNavbar() {
        try {
            const response = await fetch('components/navbar.html');
            const data = await response.text();
            document.getElementById('navbar-container').innerHTML = data;
            
            // Update nav links to use data-route attribute
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const route = href.substring(1);
                    link.setAttribute('data-route', route);
                    link.removeAttribute('href');
                }
            });
            
            // Add event listeners for mobile menu
            const hamburger = document.querySelector(".hamburger");
            const navMenu = document.querySelector(".nav-menu");
            
            if (hamburger && navMenu) {
                hamburger.addEventListener("click", () => {
                    hamburger.classList.toggle("active");
                    navMenu.classList.toggle("active");
                });
                
                navLinks.forEach(n => n.addEventListener("click", () => {
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                }));
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }
    
    async loadFooter() {
        try {
            const response = await fetch('components/footer.html');
            const data = await response.text();
            document.getElementById('footer-container').innerHTML = data;
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }
    
    async loadSection(section) {
        try {
            const response = await fetch(`components/${section}.html`);
            const data = await response.text();
            document.getElementById('main-content').innerHTML = data;
            
            // Update active nav link
            this.updateActiveNavLink(section);
            
            // Initialize any section-specific scripts
            this.initSectionScripts(section);
            
            // Scroll to top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(`Error loading ${section}:`, error);
        }
    }
    
    updateActiveNavLink(section) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            if (linkRoute === section) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    initSectionScripts(section) {
        // Initialize skill bars if on skills page
        if (section === 'skills') {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }
        
        // Initialize contact form if on contact page
        if (section === 'contact') {
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const message = document.getElementById('message').value;
                    
                    alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
                    contactForm.reset();
                });
            }
        }
    }
    
    navigate(route) {
        const path = route === 'home' ? '/' : `/${route}`;
        window.history.pushState({}, '', path);
        this.handleRoute();
    }
    
    handleRoute() {
        const path = window.location.pathname;
        const section = this.routes[path] || 'home';
        this.loadSection(section);
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Router();
});