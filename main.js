// Konzept-O Website - Main JavaScript File
// All dynamic elements and interactions

class KonzeptOWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupFloatingElements();
        this.setupTypingEffect();
        this.setupProgressBars();
        this.setupChartInteractions();
        this.setupFeatureCardInteractions();
        this.setupParallaxEffects();
        this.setupLoadingAnimations();
        this.setupResponsiveMenu();
        this.setupHolographicEffects();
        this.createMatrixRain();
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Enhanced scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Trigger progress bar animations
                    if (entry.target.classList.contains('feature-card')) {
                        this.animateProgressBar(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    // Create floating geometric elements in hero section
    setupFloatingElements() {
        const container = document.getElementById('floatingElements');
        if (!container) return;

        const shapes = ['square', 'circle', 'triangle'];
        const createFloatingElement = () => {
            const element = document.createElement('div');
            element.className = 'floating-element';
            
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const size = Math.random() * 30 + 10;
            
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.left = `${Math.random() * 100}%`;
            element.style.animationDuration = `${15 + Math.random() * 10}s`;
            element.style.animationDelay = `${Math.random() * 5}s`;
            
            if (shape === 'circle') {
                element.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                element.style.width = '0';
                element.style.height = '0';
                element.style.borderLeft = `${size/2}px solid transparent`;
                element.style.borderRight = `${size/2}px solid transparent`;
                element.style.borderBottom = `${size}px solid rgba(255,255,255,0.1)`;
                element.style.border = 'none';
            }
            
            container.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 20000);
        };

        // Create initial elements
        for (let i = 0; i < 5; i++) {
            setTimeout(createFloatingElement, i * 1000);
        }

        // Continue creating elements
        setInterval(createFloatingElement, 3000);
    }

    // Typing effect for hero title
    setupTypingEffect() {
        const title = document.getElementById('heroTitle');
        if (!title) return;

        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid white';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    title.style.borderRight = 'none';
                }, 1000);
            }
        };

        // Start typing after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Animate progress bars
    animateProgressBar(card) {
        const progressFill = card.querySelector('.progress-fill');
        if (!progressFill) return;

        const progress = progressFill.getAttribute('data-progress');
        setTimeout(() => {
            progressFill.style.width = `${progress}%`;
        }, 500);
    }

    // Setup progress bars for all feature cards
    setupProgressBars() {
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateProgressBar(card);
            });
        });
    }

    // Interactive chart with tooltips
    setupChartInteractions() {
        const chartBars = document.querySelectorAll('.chart-bar');
        const tooltip = document.getElementById('chartTooltip');
        
        if (!tooltip) return;

        chartBars.forEach(bar => {
            bar.addEventListener('mouseenter', (e) => {
                const year = bar.getAttribute('data-year');
                const value = bar.getAttribute('data-value');
                
                tooltip.textContent = `${year}: ${value}`;
                tooltip.style.opacity = '1';
                
                // Position tooltip
                const rect = bar.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 40}px`;
            });

            bar.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });

            // Click effect
            bar.addEventListener('click', () => {
                bar.style.transform = 'scaleY(1.1) scaleX(1.05)';
                setTimeout(() => {
                    bar.style.transform = 'scaleY(1) scaleX(1)';
                }, 200);
            });
        });
    }

    // Feature card advanced interactions
    setupFeatureCardInteractions() {
        document.querySelectorAll('.feature-card').forEach(card => {
            const feature = card.getAttribute('data-feature');
            
            card.addEventListener('click', () => {
                this.showFeatureDetails(feature);
            });

            // Particle effect on hover
            card.addEventListener('mouseenter', () => {
                this.createParticleEffect(card);
            });
        });

        // Team member card interactions
        document.querySelectorAll('.member-card').forEach(card => {
            const member = card.getAttribute('data-member');
            
            card.addEventListener('click', () => {
                this.showMemberDetails(member);
            });

            // Photo hover effect enhancement
            card.addEventListener('mouseenter', () => {
                this.enhanceMemberCard(card);
            });

            card.addEventListener('mouseleave', () => {
                this.resetMemberCard(card);
            });
        });
    }

    // Show feature details (placeholder for future expansion)
    showFeatureDetails(feature) {
        const details = {
            kyushu: '福岡、長崎、佐賀エリアでの対面サービスに特化',
            europe: 'ドイツ、オーストリア、ポーランド、ハンガリー、セルビアに展開',
            sme: '中小企業向けの柔軟で効率的なソリューション'
        };
        
        // Simple alert for now - can be expanded to modal
        alert(details[feature] || 'More details coming soon!');
    }

    // Show member details
    showMemberDetails(member) {
        const details = {
            saito: '代表取締役 齋藤健人 - ドイツ在住10年以上の経験を活かし、日欧間のビジネス架け橋として活動',
            zenin: '共同代表取締役 禅院昭 - 福岡を拠点とし、九州地域の中小企業をヨーロッパ市場へと導く',
            nagahori: 'CMO 永堀佑樹 - トリリンガルの能力を活かし、多言語マーケティング戦略を牽引'
        };
        
        alert(details[member] || 'More details coming soon!');
    }

    // Enhance member card on hover
    enhanceMemberCard(card) {
        const photo = card.querySelector('.member-photo');
        const info = card.querySelector('.member-info');
        
        if (photo) {
            photo.style.transform = 'scale(1.05)';
            photo.style.filter = 'grayscale(0%) brightness(1.1)';
        }
        
        if (info) {
            info.style.transform = 'translateY(-5px)';
        }
    }

    // Reset member card
    resetMemberCard(card) {
        const photo = card.querySelector('.member-photo');
        const info = card.querySelector('.member-info');
        
        if (photo) {
            photo.style.transform = 'scale(1)';
            photo.style.filter = 'grayscale(100%)';
        }
        
        if (info) {
            info.style.transform = 'translateY(0)';
        }
    }

    // Create particle effect
    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#000';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            const startX = rect.left + Math.random() * rect.width;
            const startY = rect.top + Math.random() * rect.height;
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            document.body.appendChild(particle);
            
            // Animate particle
            const animation = particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { 
                    transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => particle.remove();
        }
    }

    // Parallax scrolling effects
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-bg');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });

            // Header background opacity
            const header = document.querySelector('header');
            if (header) {
                const opacity = Math.min(0.95, 0.7 + (scrolled / 300) * 0.25);
                header.style.background = `rgba(0, 0, 0, ${opacity})`;
            }
        });
    }

    // Loading animations for stats
    setupLoadingAnimations() {
        const animateNumber = (element, target, duration = 2000) => {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (element.textContent.includes('M¥')) {
                    element.textContent = `${Math.floor(current)}M¥`;
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        };

        // Animate stat numbers when they come into view
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber && !statNumber.classList.contains('animated')) {
                        statNumber.classList.add('animated');
                        
                        const text = statNumber.textContent;
                        if (text === '6') animateNumber(statNumber, 6);
                        else if (text === '2021') animateNumber(statNumber, 2021);
                        else if (text === '3') animateNumber(statNumber, 3);
                        else if (text === '100M¥') animateNumber(statNumber, 100);
                        
                        // Add cyber glow effect
                        setTimeout(() => {
                            statNumber.style.textShadow = '0 0 20px currentColor';
                        }, 1000);
                    }
                }
            });
        });

        document.querySelectorAll('.stat-card').forEach(card => {
            statObserver.observe(card);
        });

        // Advanced chart interactions with cyber effects
        this.setupCyberChartEffects();
    }

    // Cyber chart effects
    setupCyberChartEffects() {
        const chartBars = document.querySelectorAll('.chart-bar');
        
        chartBars.forEach((bar, index) => {
            // Random glow pulse
            setInterval(() => {
                if (Math.random() > 0.7) {
                    bar.style.filter = 'brightness(1.3) saturate(1.5)';
                    setTimeout(() => {
                        bar.style.filter = 'none';
                    }, 200);
                }
            }, 2000 + index * 500);

            // Data stream effect
            bar.addEventListener('click', () => {
                this.createDataStream(bar);
            });
        });
    }

    // Create data stream effect
    createDataStream(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '2px';
            particle.style.height = '10px';
            particle.style.background = `hsl(${180 + Math.random() * 60}, 100%, 50%)`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.boxShadow = '0 0 10px currentColor';
            
            const startX = rect.left + rect.width / 2;
            const startY = rect.bottom;
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            document.body.appendChild(particle);
            
            // Animate data stream
            const animation = particle.animate([
                { 
                    transform: 'translateY(0) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translateY(-${100 + Math.random() * 100}px) scale(0.5)`, 
                    opacity: 0 
                }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => particle.remove();
        }
    }

    // Enhanced member card interactions with cyber effects
    enhanceMemberCard(card) {
        const photo = card.querySelector('.member-photo');
        const info = card.querySelector('.member-info');
        const name = card.querySelector('.member-name');
        
        if (photo) {
            photo.style.transform = 'scale(1.05)';
            photo.style.filter = 'grayscale(0%) brightness(1.1) saturate(1.2)';
            photo.style.boxShadow = '0 0 30px rgba(0,255,255,0.5)';
        }
        
        if (info) {
            info.style.transform = 'translateY(-5px)';
        }
        
        if (name) {
            name.style.textShadow = '0 0 10px rgba(0,255,255,0.8)';
        }
        
        // Add cyber border effect
        card.style.borderImage = 'linear-gradient(45deg, #00ffff, #ff00ff, #00ff00) 1';
    }

    // Reset member card
    resetMemberCard(card) {
        const photo = card.querySelector('.member-photo');
        const info = card.querySelector('.member-info');
        const name = card.querySelector('.member-name');
        
        if (photo) {
            photo.style.transform = 'scale(1)';
            photo.style.filter = 'grayscale(100%)';
            photo.style.boxShadow = 'none';
        }
        
        if (info) {
            info.style.transform = 'translateY(0)';
        }
        
        if (name) {
            name.style.textShadow = 'none';
        }
        
        card.style.borderImage = 'none';
    }

    // Matrix rain effect (optional)
    createMatrixRain() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.1';
        
        document.body.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const charArray = chars.split('');
        
        const columns = canvas.width / 20;
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff00';
            ctx.font = '15px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);
                
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        // Uncomment to enable matrix rain
        // setInterval(draw, 33);
    }

    // Holographic effect for company info
    setupHolographicEffects() {
        const infoItems = document.querySelectorAll('.info-item-modern');
        
        infoItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.background = 'linear-gradient(45deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1))';
                item.style.transform = 'scale(1.02) rotateY(5deg)';
                item.style.boxShadow = '0 20px 40px rgba(0,255,255,0.3)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = 'rgba(0,0,0,0.8)';
                item.style.transform = 'scale(1) rotateY(0deg)';
                item.style.boxShadow = 'none';
            });
        });
    }

    // Responsive menu (for future mobile menu)
    setupResponsiveMenu() {
        // Placeholder for mobile menu functionality
        // Can be expanded when mobile menu is added
        
        // Dynamic CTA button text
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (button.textContent === '相談する！') {
                    button.textContent = 'CONTACT US!';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (button.textContent === 'CONTACT US!') {
                    button.textContent = '相談する！';
                }
            });
        });
    }

    // Mouse trail effect
    setupMouseTrail() {
        let mouseTrail = [];
        
        document.addEventListener('mousemove', (e) => {
            mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            // Keep only recent positions
            mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 1000);
        });

        // Create trail visualization (optional - can be enabled)
        // setInterval(() => {
        //     // Trail rendering logic here
        // }, 16);
    }

    // Initialize advanced interactions
    initAdvancedFeatures() {
        // Easter egg: Konami code
        let konamiCode = [];
        const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.keyCode);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                this.activateEasterEgg();
            }
        });
    }

    // Easter egg activation
    activateEasterEgg() {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        
        alert('🎉 Hidden feature activated! Konzept-O appreciates curious minds!');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new KonzeptOWebsite();
    website.initAdvancedFeatures();
});

// Performance monitoring
window.addEventListener('load', () => {
    console.log('Konzept-O website loaded successfully!');
    console.log(`Page load time: ${performance.now()}ms`);
});
