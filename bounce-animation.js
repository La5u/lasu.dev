(() => {
    window.startBounceAnimation = function startBounceAnimation(container) {
        const canvas = document.createElement('canvas');
        canvas.className = 'bounce-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        container.replaceChildren(canvas);

        const context = canvas.getContext('2d');
        const radius = 30;
        const ballColor = 'rainbow';
        const initialComponentSpeed = 50;
        const initialSpeed = Math.SQRT2 * initialComponentSpeed;
        const startAngle = Math.random() * Math.PI * 2;
        const initialVelocityX = Math.cos(startAngle) * initialSpeed;
        const initialVelocityY = Math.sin(startAngle) * initialSpeed;
        const bounceMultiplier = 1.04;
        const speedResetThreshold = 3700;
        const resetSpeedMin = 15;
        const resetSpeedMax = 150;
        const trailFade = 0.015;
        const drawRate = 120;
        const physicsStepsPerReferenceFrame = 8;
        const physicsStepsPerDraw = 1;
        const physicsStepScale = 1 / physicsStepsPerReferenceFrame;
        const colorBurnInterval = 4;
        const colorStartSpeed = Math.hypot(initialVelocityX, initialVelocityY);

        let width = window.innerWidth;
        let height = window.innerHeight;
        let x = radius + Math.random() * Math.max(0, width - radius * 2);
        let y = radius + Math.random() * Math.max(0, height - radius * 2);
        let dx = initialVelocityX;
        let dy = initialVelocityY;
        let frameCount = 0;
        let randomState = 217165;

        function clamp(value, min, max) {
            if (max < min) return (min + max) / 2;
            return Math.max(min, Math.min(max, value));
        }

        function seededRandom() {
            randomState = (randomState + 0x6d2b79f5) | 0;
            let value = randomState;
            value = Math.imul(value ^ (value >>> 15), value | 1);
            value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
            return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
        }

        function randomResetSpeed() {
            return resetSpeedMin * (resetSpeedMax / resetSpeedMin) ** seededRandom();
        }

        function getBallColor() {
            if (ballColor !== 'rainbow') return ballColor;

            const speed = Math.hypot(dx, dy);
            const progress = Math.max(
                0,
                Math.min(
                    1,
                    Math.log(Math.max(speed, colorStartSpeed) / colorStartSpeed) /
                        Math.log(speedResetThreshold / colorStartSpeed)
                )
            );

            return `hsl(${240 + 120 * progress}, 100%, 50%)`;
        }

        function draw(fadeTrail) {
            if (fadeTrail) {
                context.fillStyle = `rgba(0, 0, 0, ${trailFade})`;
                context.fillRect(0, 0, width, height);

                if (++frameCount % colorBurnInterval === 0) {
                    context.globalCompositeOperation = 'color-burn';
                    context.fillStyle = 'rgb(254, 254, 254)';
                    context.fillRect(0, 0, width, height);
                    context.globalCompositeOperation = 'source-over';
                }
            }

            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fillStyle = getBallColor();
            context.fill();
        }

        function resizeCanvas() {
            const pixelRatio = window.devicePixelRatio || 1;

            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            context.fillStyle = '#000';
            context.fillRect(0, 0, width, height);

            x = clamp(x, 0, width);
            y = clamp(y, 0, height);
            draw(false);
        }

        function bounce(horizontal) {
            dx *= bounceMultiplier;
            dy *= bounceMultiplier;

            if (horizontal) {
                dx = -dx;
                if (Math.abs(dx) >= speedResetThreshold) {
                    dx = Math.sign(dx) * randomResetSpeed();
                }
            } else {
                dy = -dy;
                if (Math.abs(dy) >= speedResetThreshold) {
                    dy = Math.sign(dy) * randomResetSpeed();
                }
            }
        }

        function simulatePhysicsStep() {
            x += dx * physicsStepScale;
            y += dy * physicsStepScale;

            if ((x - radius <= 0 && dx < 0) || (x + radius >= width && dx > 0)) {
                if (x < 0) x = -x;
                else if (x > width) x = width * 2 - x;
                bounce(true);
            }

            if ((y - radius <= 0 && dy < 0) || (y + radius >= height && dy > 0)) {
                if (y < 0) y = -y;
                else if (y > height) y = height * 2 - y;
                bounce(false);
            }
        }

        function update() {
            draw(true);

            for (let i = 0; i < physicsStepsPerDraw; i++) {
                simulatePhysicsStep();
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        const intervalId = window.setInterval(update, 1000 / drawRate);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener('resize', resizeCanvas);
            canvas.remove();
        };
    };
})();
