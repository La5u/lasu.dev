document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;

    if (!prefersReducedMotion && !saveData) {
        const animationContainer = document.getElementById('particles-js');
        if (Math.random() < 0.5 && animationContainer && window.startBounceAnimation) {
            window.startBounceAnimation(animationContainer);
        } else if (animationContainer && window.particlesConfig) {
            const script = document.createElement('script');
            script.src = 'assets/vendor/particles.min.js';
            script.onload = () => {
                window.particlesConfig.particles.number.value = window.innerWidth < 768 ? 40 : 70;
                particlesJS('particles-js', window.particlesConfig);
            };
            document.head.append(script);
        }
    }

    const fonts = ['Impact', 'Courier New', 'Times New Roman', 'Arial', 'Verdana', 'Roboto'];
    const nameElement = document.getElementById('name');

    function randomizeFont() {
        const randomIndex = Math.floor(Math.random() * fonts.length);
        nameElement.style.fontFamily = fonts[randomIndex];
    }

    if (!prefersReducedMotion && nameElement) {
        randomizeFont();
        window.setInterval(randomizeFont, 1600);
    }

    document.querySelectorAll('[data-current-year]').forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    const projectCards = document.querySelectorAll('.project-card');
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        projectCards.forEach(card => card.classList.add('project-card--pending'));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('project-card--visible');
                    observer.unobserve(entry.target);
                }
            });
        });

        projectCards.forEach(card => observer.observe(card));
    }
});
