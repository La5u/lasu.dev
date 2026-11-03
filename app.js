document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;

    if (!prefersReducedMotion && !saveData) {
        const animationContainer = document.getElementById('particles-js');
        if (Math.random() < 0.5 && animationContainer && window.startBounceAnimation) {
            window.startBounceAnimation(animationContainer);
            window.bounceAnimationRunning = true;
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

    // Each entry ends in a different generic family so letters still differ where the named font is missing.
    const fonts = [
        'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
        '"Courier New", Courier, monospace',
        '"Times New Roman", Times, serif',
        'Georgia, "DejaVu Serif", serif',
        '"Palatino Linotype", Palatino, "URW Palladio L", serif',
        'Garamond, "EB Garamond", serif',
        'Arial, Helvetica, sans-serif',
        'Verdana, "DejaVu Sans", sans-serif',
        '"Trebuchet MS", "Fira Sans", sans-serif',
        '"Gill Sans", "Gill Sans MT", Calibri, sans-serif',
        '"Lucida Console", "DejaVu Sans Mono", monospace',
        'Consolas, "Liberation Mono", monospace',
        '"Comic Sans MS", "Comic Neue", cursive',
        '"Brush Script MT", "Segoe Script", cursive',
        'Papyrus, fantasy',
        '"Copperplate", "Copperplate Gothic Light", fantasy',
        'system-ui, sans-serif',
        'ui-rounded, "SF Pro Rounded", sans-serif'
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
        let lastChange = 0;
        function changeNextLetter() {
            const now = performance.now();
            if (now - lastChange < 45) return;
            lastChange = now;
            const span = letters[nextLetter];
            nextLetter = (nextLetter + 1) % letters.length;
            let font;
            do font = fonts[Math.floor(Math.random() * fonts.length)];
            while (font === span.style.fontFamily && fonts.length > 1);
            span.style.fontFamily = font;
        }

        letters.forEach(span => {
            span.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
        });

        if (window.bounceAnimationRunning) {
            // Each wall bounce changes a letter, so the title speeds up with the ball.
            window.addEventListener('ballbounce', changeNextLetter);
        } else {
            window.setInterval(changeNextLetter, 400);
        }
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
