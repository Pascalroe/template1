document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initGSAP();
    initScrollProgress();
    initNavigation();
    initFAQ();
    initBlogCards();
    initFormEffects();
    initParallax();
});

function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.registerPlugin(ScrollTrigger);
}

function initGSAP() {
    gsap.config({ nullTargetWarn: false });

    const tl = gsap.timeline();

    tl.from('nav', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    const heroElements = document.querySelectorAll('h1, .hero-content > *');
    if (heroElements.length > 0) {
        tl.from(heroElements, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.4');
    }

    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index === 0) return;
        
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    const cards = document.querySelectorAll('.blog-card, .glass-card, [class*="bg-gradient-to-br rounded-2xl"]');
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    const bentoCards = document.querySelectorAll('[class*="bg-gradient-to-br from-secondary"]');
    bentoCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'back.out(1.7)'
        });
    });

    const statNumbers = document.querySelectorAll('[class*="text-3xl"][class*="font-bold"]');
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        if (!isNaN(parseFloat(text))) {
            const num = parseFloat(text.replace(/[^0-9.]/g, ''));
            const suffix = text.replace(/[0-9.]/g, '');
            
            gsap.fromTo(stat, 
                { textContent: 0 },
                {
                    textContent: num,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 0.1 },
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 85%'
                    }
                }
            );
        }
    });

    gsap.to('.gradient-orbs', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        },
        y: 200,
        ease: 'none'
    });

    gsap.from('.gsap-reveal', {
        scrollTrigger: {
            trigger: '.gsap-reveal',
            start: 'top 80%'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });
}

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    gsap.to(progressBar, {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        },
        scaleX: 1,
        ease: 'none'
    });
}

function initNavigation() {
    const nav = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('bg-primary/95');
            nav.classList.add('backdrop-blur-xl');
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            nav.classList.remove('bg-primary/95');
            nav.style.boxShadow = 'none';
        }

        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        const content = item.querySelector('div:not(.hidden)');
        
        if (button && content) {
            button.addEventListener('click', () => {
                const isOpen = !content.classList.contains('hidden');
                
                faqItems.forEach(otherItem => {
                    const otherContent = otherItem.querySelector('div:not(.hidden)');
                    if (otherContent && otherItem !== item) {
                        otherContent.classList.add('hidden');
                    }
                });
                
                content.classList.toggle('hidden');
                
                gsap.fromTo(content, 
                    { opacity: 0, height: 0 },
                    { opacity: 1, height: 'auto', duration: 0.3, ease: 'power2.out' }
                );
            });
        }
    });
}

function initBlogCards() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('bg-accent-blue/20');
                b.classList.remove('text-accent-cyan');
                b.classList.add('text-gray-400');
                b.classList.add('bg-white/5');
            });
            
            btn.classList.add('active');
            btn.classList.add('bg-accent-blue/20');
            btn.classList.add('text-accent-cyan');
            btn.classList.remove('text-gray-400');
            btn.classList.remove('bg-white/5');
            
            const category = btn.textContent.trim();
            
            blogCards.forEach(card => {
                gsap.to(card, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    onComplete: () => {
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            duration: 0.3
                        });
                    }
                });
            });
        });
    });
    
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

function initFormEffects() {
    const glassInputs = document.querySelectorAll('.glass-input');
    
    glassInputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                borderColor: 'rgba(79, 140, 255, 0.5)',
                boxShadow: '0 0 0 3px rgba(79, 140, 255, 0.15)',
                duration: 0.3
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input, {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: 'none',
                duration: 0.3
            });
        });
    });
    
    const form = document.querySelector('.glass-form form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            gsap.to(btn, {
                scale: 0.95,
                duration: 0.1,
                onComplete: () => {
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.1
                    });
                }
            });
            
            btn.textContent = 'Sending...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = '✓ Message Sent!';
                btn.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }
}

function initParallax() {
    const parallaxElements = document.querySelectorAll('[class*="blur-3xl"]');
    
    parallaxElements.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -100,
            ease: 'none'
        });
    });
}

class Lenis {
    constructor(options = {}) {
        this.options = {
            duration: options.duration || 1.2,
            easing: options.easing || ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
            orientation: options.orientation || 'vertical',
            gestureOrientation: options.gestureOrientation || 'vertical',
            smooth: options.smooth !== undefined ? options.smooth : true,
            smoothTouch: options.smoothTouch || false,
            touchMultiplier: options.touchMultiplier || 2,
            wheelMultiplier: options.wheelMultiplier || 1,
            ...options
        };
        
        this rafId = null;
        this.isRunning = false;
        this.target = 0;
        this.current = 0;
        this.velocity = 0;
        this.max = 0;
        
        this.init();
    }
    
    init() {
        this.onWindowResize();
        window.addEventListener('resize', () => this.onWindowResize());
        
        if (this.options.smooth || this.options.smoothTouch) {
            this.bindScroll();
        }
    }
    
    onWindowResize() {
        this.max = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        ) - window.innerHeight;
    }
    
    bindScroll() {
        let scrollTimeout;
        
        window.addEventListener('wheel', (e) => {
            if (!this.options.smooth) return;
            
            this.velocity += e.deltaY * this.options.wheelMultiplier * 0.001;
        }, { passive: true });
        
        window.addEventListener('touchstart', (e) => {
            if (!this.options.smoothTouch) return;
            this.touchStart = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('touchmove', (e) => {
            if (!this.options.smoothTouch) return;
            
            const delta = e.touches[0].clientY - this.touchStart;
            this.velocity += delta * 0.01 * this.options.touchMultiplier;
            this.touchStart = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('scroll', () => {
            if (!this.isRunning) {
                this.onScroll();
            }
        }, { passive: true });
    }
    
    onScroll() {
        this.target = window.scrollY;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.raf();
    }
    
    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
    
    raf() {
        if (!this.isRunning) return;
        
        this.velocity *= 0.9;
        
        const diff = this.target - this.current;
        const delta = diff * 0.1;
        
        this.current += delta + this.velocity * 0.1;
        
        if (Math.abs(diff) < 0.1) {
            this.velocity = 0;
        }
        
        this.current = Math.max(0, Math.min(this.current, this.max));
        
        window.scrollTo(0, this.current);
        
        this.rafId = requestAnimationFrame(() => this.raf());
    }
    
    scrollTo(target, options = {}) {
        const offset = options.offset || 0;
        
        if (typeof target === 'number') {
            this.target = target + offset;
        } else {
            const rect = target.getBoundingClientRect();
            this.target = rect.top + window.scrollY + offset;
        }
    }
}

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

lenis.on('scroll', (e) => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80 });
        }
    });
});

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

document.body.style.opacity = '0';