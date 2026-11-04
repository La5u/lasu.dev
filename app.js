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

    // Self-hosted fonts (assets/fonts) so every device sees the same distinct set.
    const fonts = [
        '"Title Bebas Neue", sans-serif',
        '"Title Pacifico", sans-serif',
        '"Title Press Start 2P", sans-serif',
        '"Title UnifrakturMaguntia", sans-serif',
        '"Title Monoton", sans-serif',
        '"Title Lobster", sans-serif',
        '"Title Space Mono", sans-serif',
        '"Title Playfair Display", sans-serif',
        '"Title Bungee", sans-serif',
        '"Title Caveat", sans-serif',
        '"Title Abril Fatface", sans-serif',
        '"Title Orbitron", sans-serif',
        '"Title Special Elite", sans-serif',
        '"Title Cinzel", sans-serif',
        '"Title Creepster", sans-serif',
        '"Title Fredoka", sans-serif',
        '"Title Major Mono Display", sans-serif',
        '"Times New Roman", Times, serif',
        '"Courier New", Courier, monospace',
        'Arial, Helvetica, sans-serif'
    ];
    const nameElement = document.getElementById('name');

    if (!prefersReducedMotion && nameElement) {
        const text = nameElement.textContent;
        nameElement.setAttribute('aria-label', text);
        nameElement.textContent = '';
        const letters = [];
        for (const char of text) {
            const span = document.createElement('span');
            span.setAttribute('aria-hidden', 'true');
            span.textContent = char;
            nameElement.append(span);
            if (char.trim()) letters.push(span);
        }

        // Change one letter at a time, sweeping left to right.
        let nextLetter = 0;
        function changeNextLetter() {
            const span = letters[nextLetter];
            nextLetter = (nextLetter + 1) % letters.length;
            let index;
            do index = Math.floor(Math.random() * fonts.length);
            while (String(index) === span.dataset.font && fonts.length > 1);
            span.dataset.font = index;
            span.style.fontFamily = fonts[index];
        }

        fonts.forEach(font => document.fonts && document.fonts.load(`56px ${font}`, 'LasuShin'));

        letters.forEach(span => {
            span.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
        });

        window.setInterval(changeNextLetter, 150);
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
