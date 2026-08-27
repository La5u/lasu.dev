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
        const resizeSettleDelay = 120;
        const colorStartSpeed = Math.hypot(initialVelocityX, initialVelocityY);

        let width = Math.max(1, container.clientWidth || window.innerWidth);
        let height = Math.max(1, container.clientHeight || window.innerHeight);
        let x = radius + Math.random() * Math.max(0, width - radius * 2);
        let y = radius + Math.random() * Math.max(0, height - radius * 2);
        let dx = initialVelocityX;
        let dy = initialVelocityY;
        let frameCount = 0;
        let randomState = 217165;
        let resizeTimer = null;

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

        function resetAxisIfNeeded(horizontal) {
            if (horizontal && Math.abs(dx) >= speedResetThreshold) {
                dx = Math.sign(dx) * randomResetSpeed();
            } else if (!horizontal && Math.abs(dy) >= speedResetThreshold) {
                dy = Math.sign(dy) * randomResetSpeed();
            }
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

        function resizeCanvas(preserveTrail = true) {
            const nextWidth = Math.max(1, container.clientWidth || window.innerWidth);
            const nextHeight = Math.max(1, container.clientHeight || window.innerHeight);
            const pixelRatio = window.devicePixelRatio || 1;
            const nextBackingWidth = Math.round(nextWidth * pixelRatio);
            const nextBackingHeight = Math.round(nextHeight * pixelRatio);

            if (canvas.width === nextBackingWidth && canvas.height === nextBackingHeight) return;

            let snapshot = null;
            if (preserveTrail && canvas.width && canvas.height) {
                snapshot = document.createElement('canvas');
                snapshot.width = canvas.width;
                snapshot.height = canvas.height;
                snapshot.getContext('2d').drawImage(canvas, 0, 0);
            }

            const widthScale = nextWidth / width;
            const heightScale = nextHeight / height;
            width = nextWidth;
            height = nextHeight;
            x *= widthScale;
            y *= heightScale;

            canvas.width = nextBackingWidth;
            canvas.height = nextBackingHeight;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            context.fillStyle = '#000';
            context.fillRect(0, 0, width, height);

            if (snapshot) {
                context.drawImage(
                    snapshot,
                    0,
                    0,
                    snapshot.width,
                    snapshot.height,
                    0,
                    0,
                    width,
                    height
                );
            }

            x = clamp(x, radius, width - radius);
            y = clamp(y, radius, height - radius);
            draw(false);
        }

        function scheduleResize() {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => resizeCanvas(true), resizeSettleDelay);
        }

        function bounce(horizontal) {
            dx *= bounceMultiplier;
            dy *= bounceMultiplier;

            if (horizontal) dx = -dx;
            else dy = -dy;

            resetAxisIfNeeded(horizontal);
        }

        function resolveAxisCollision(value, min, max, horizontal) {
            if (max <= min) return (min + max) / 2;

            let reflections = 0;
            while ((value < min || value > max) && reflections < 64) {
                if (value < min) value = min + (min - value);
                else value = max - (value - max);

                bounce(horizontal);
                reflections++;
            }

            // Keep the ball visible even after an abnormally large frame jump.
            if (value < min || value > max) {
                value = clamp(value, min, max);
                if (horizontal) dx = value === min ? Math.abs(dx) : -Math.abs(dx);
                else dy = value === min ? Math.abs(dy) : -Math.abs(dy);
                resetAxisIfNeeded(horizontal);
            }

            return value;
        }

        function simulatePhysicsStep() {
            const distanceX = dx * physicsStepScale;
            const distanceY = dy * physicsStepScale;
            const substeps = Math.min(
                64,
                Math.max(1, Math.ceil(Math.max(Math.abs(distanceX), Math.abs(distanceY)) / (radius / 2)))
            );

            for (let i = 0; i < substeps; i++) {
                x += dx * physicsStepScale / substeps;
                y += dy * physicsStepScale / substeps;

                x = resolveAxisCollision(x, radius, width - radius, true);
                y = resolveAxisCollision(y, radius, height - radius, false);
            }
        }

        function update() {
            draw(true);

            for (let i = 0; i < physicsStepsPerDraw; i++) {
                simulatePhysicsStep();
            }
        }

        window.addEventListener('resize', scheduleResize);
        resizeCanvas(false);
        const intervalId = window.setInterval(update, 1000 / drawRate);

        return () => {
            window.clearInterval(intervalId);
            window.clearTimeout(resizeTimer);
            window.removeEventListener('resize', scheduleResize);
            canvas.remove();
        };
    };
})();
