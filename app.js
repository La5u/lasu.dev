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

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }
        });
    });

    projectCards.forEach(card => observer.observe(card));

    const username = 'la5u';

    document.querySelectorAll('.github-link[data-repo]').forEach(link => {
        const repo = link.getAttribute('data-repo');
        link.href = `https://github.com/${username}/${repo}`;
    });
});
