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

        function pickFont(previous) {
            let index;
            do index = Math.floor(Math.random() * fonts.length);
            while (String(index) === previous && fonts.length > 1);
            return index;
        }

        // Each font draws a glyph at its own size and height, so scale and shift every
        // glyph to match how Arial draws it. Keeps the letters' shapes but not their jumps.
        const referenceFont = 'Arial, Helvetica, sans-serif';
        const maxWidthRatio = 1.25;
        const minWidthLimit = 60; // at 100px, so narrow glyphs like i aren't squashed
        const measureContext = document.createElement('canvas').getContext('2d');
        const glyphBoxes = new Map();

        function glyphBox(char, font) {
            const key = `${char}|${font}`;
            if (!glyphBoxes.has(key)) {
                measureContext.font = `bold 100px ${font}`;
                const metrics = measureContext.measureText(char);
                glyphBoxes.set(key, {
                    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
                    descent: metrics.actualBoundingBoxDescent,
                    width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
                });
            }
            return glyphBoxes.get(key);
        }

        function setFont(span, index) {
            const font = fonts[index];
            const target = glyphBox(span.textContent, referenceFont);
            const box = glyphBox(span.textContent, font);
            const scale = Math.min(target.height / box.height, Math.max(target.width * maxWidthRatio, minWidthLimit) / box.width);
            const shift = (target.descent - box.descent * scale) / 100 / scale;
            span.dataset.font = index;
            span.style.fontFamily = font;
            span.style.fontSize = `${scale}em`;
            span.style.transform = `translateY(${shift}em)`;
        }

        function animateName() {
            if (Math.random() < 0.5) {
                // Change one letter at a time, sweeping left to right.
                letters.forEach(span => setFont(span, pickFont()));
                let nextLetter = 0;
                window.setInterval(() => {
                    const span = letters[nextLetter];
                    nextLetter = (nextLetter + 1) % letters.length;
                    setFont(span, pickFont(span.dataset.font));
                }, 150);
            } else {
                // Change the whole name at once every so often.
                const changeAll = () => {
                    const index = pickFont(letters[0].dataset.font);
                    letters.forEach(span => setFont(span, index));
                };
                changeAll();
                window.setInterval(changeAll, 1600);
            }
        }

        // Glyphs can only be measured once their fonts have loaded.
        const fontsLoaded = document.fonts
            ? Promise.all(fonts.map(font => document.fonts.load(`bold 100px ${font}`, 'LasuShin')))
            : Promise.resolve();
        fontsLoaded.catch(() => {}).then(animateName);
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
