
// Star Fiber Interactive Scripts
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.querySelector('i').classList.toggle('fa-bars');
            mobileToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileToggle.querySelector('i').classList.add('fa-bars');
                    mobileToggle.querySelector('i').classList.remove('fa-times');
                }
            }
        });
    });

    // 3. Contact Form Handling (Backend Integrated)
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Redirecting...';
            submitBtn.disabled = true;

            const formData = {
                name: leadForm.querySelector('input[type="text"]').value,
                mobile: leadForm.querySelector('input[type="tel"]').value,
                area: leadForm.querySelector('select').value
            };

            // 1. Open WhatsApp Immediately (Primary Action)
            // This ensures the lead is captured even if the backend server is offline
            const waMessage = `*New Connection Request*%0a---------------------------%0a*Name:* ${formData.name}%0a*Mobile:* ${formData.mobile}%0a*Area:* ${formData.area}%0a---------------------------%0aPlease call me back!`;
            window.open(`https://wa.me/917010034321?text=${waMessage}`, '_blank');

            // 2. Try Backend Sync in Background (Optional)
            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    console.log('Backend sync successful');
                } else {
                    console.warn('Backend sync failed');
                }
            } catch (error) {
                // Silently fail if backend is offline. We already opened WhatsApp.
                console.warn('Backend server offline. Data sent via WhatsApp only.');
            }

            // 3. Reset UI
            alert('Thank you! We have opened WhatsApp for you to send the details.');
            leadForm.reset();

            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
    }

    // 4. Particle Network Animation
    const canvas = document.getElementById('particles-js');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationFrameId;

        // Configuration - Adaptive based on screen size
        let particleCount = window.innerWidth < 768 ? 30 : 80;
        const connectionDistance = window.innerWidth < 768 ? 100 : 150;
        const speed = 0.5;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Update particle count on resize
            particleCount = window.innerWidth < 768 ? 30 : 80;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * speed;
                this.vy = (Math.random() - 0.5) * speed;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 243, 255, 0.5)'; // Cyan particles
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 102, 255, ${1 - dist / connectionDistance})`; // Blue connections fading out
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        // Initialize
        window.addEventListener('resize', () => {
            resize();
            initParticles(); // Re-scatter on resize
        });

        // Optimization: Stop animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate();
            }
        });

        resize();
        initParticles();
        animate();
    }
});
