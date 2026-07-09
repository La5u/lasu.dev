document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;

    if (!prefersReducedMotion && !saveData && window.particlesJS && window.particlesConfig) {
        const particleCount = window.innerWidth < 768 ? 40 : 70;
        window.particlesConfig.particles.number.value = particleCount;
        particlesJS('particles-js', window.particlesConfig);
    }

    const fonts = [
        'Impact',
        'Courier New',
        'Times New Roman',
        'Arial',
        'Verdana',
        'Roboto'
    ];
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
