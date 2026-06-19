document.addEventListener('DOMContentLoaded', () => {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const gallery = document.getElementById('gallery');

    function playGalleryVideos() {
        const galleryVideos = document.querySelectorAll('.gallery-grid video');
        galleryVideos.forEach(video => {
            video.play().catch(error => {
                console.log('Автовоспроизведение видео в галерее заблокировано браузером:', error);
            });
        });
    }

    function createConfetti(button) {
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const container = document.createElement('div');
        container.className = 'confetti-container';
        container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(container);

        const colors = [
            { main: '#003366', shine: '#1A73E8' }, // navy blue
            { main: '#46b8da', shine: '#B3E5FC' }, // cyan
            { main: '#FFD700', shine: '#FFFACD' }  // gold
        ];
        const shapes = ['circle', 'strip'];
        const particleCount = 140;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 14 + 12;

            particle.className = `confetti-particle ${shape}`;
            if (shape === 'strip') {
                particle.style.width = `${size * 0.7}px`;
                particle.style.height = `${size * 2.4}px`;
            } else {
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
            }
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.background = `linear-gradient(${Math.random() * 360}deg, ${color.main} 0%, ${color.shine} 40%, ${color.main} 100%)`;
            particle.style.boxShadow = `0 0 8px ${color.main}99`;

            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.7;
            const velocity = Math.random() * 320 + 180;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - Math.random() * 100;
            const rot = Math.random() * 1080 - 540;
            const duration = Math.random() * 0.5 + 0.9;
            const delay = Math.random() * 0.1;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.setProperty('--rot', `${rot}deg`);
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s, 0.35s`;

            container.appendChild(particle);
        }

        setTimeout(() => {
            container.remove();
        }, 1600);
    }

    if (surpriseBtn && gallery) {
        surpriseBtn.addEventListener('click', () => {
            createConfetti(surpriseBtn);
            gallery.style.display = 'block';
            gallery.scrollIntoView({ behavior: 'smooth' });
            surpriseBtn.classList.add('collapsing');
            setTimeout(() => {
                surpriseBtn.style.display = 'none';
            }, 300);
            playGalleryVideos();
        });
    }

    // --- Background music ---
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isMusicPlaying = false;
    let hasUserInteracted = false;
    let musicWasPlayingBeforeModal = false;

    function updateMusicToggleIcon() {
        if (musicToggle) {
            musicToggle.textContent = isMusicPlaying ? '🔊' : '🔇';
            musicToggle.classList.toggle('muted', !isMusicPlaying);
            musicToggle.setAttribute('aria-label', isMusicPlaying ? 'Выключить музыку' : 'Включить музыку');
        }
    }

    function playMusic() {
        if (!bgMusic) return;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicToggleIcon();
        }).catch(error => {
            console.log('Автовоспроизведение музыки заблокировано браузером:', error);
            isMusicPlaying = false;
            updateMusicToggleIcon();
        });
    }

    function pauseMusic() {
        if (!bgMusic) return;
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicToggleIcon();
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // Start music after the first user interaction with the page
    function onFirstUserInteraction() {
        if (hasUserInteracted) return;
        hasUserInteracted = true;
        playMusic();
        document.removeEventListener('click', onFirstUserInteraction);
        document.removeEventListener('touchstart', onFirstUserInteraction);
        document.removeEventListener('keydown', onFirstUserInteraction);
    }

    document.addEventListener('click', onFirstUserInteraction);
    document.addEventListener('touchstart', onFirstUserInteraction);
    document.addEventListener('keydown', onFirstUserInteraction);

    const wishes = [
        "Каждый день рядом с тобой — это маленькое чудо. Спасибо, что ты есть, мой самый родной человек.",
        "Твоя улыбка освещает всё вокруг. Пусть в твоей жизни будет столько же света, сколько ты даришь другим.",
        "Неважно, что будет впереди — я хочу пройти этот путь только с тобой. Ты мой дом и моё спокойствие.",
        "Моя любовь к тебе безгранична, как небо над нами. Ты — лучшее, что случилось в моей жизни.",
        "Даже самые обычные дни с тобой становятся волшебными. Я благодарна за каждую минуту, проведённую рядом.",
        "Желаю, чтобы в твоих глазах всегда горел огонёк радости, а сердце было полно любви и тепла."
    ];

    const galleryCards = document.querySelectorAll('.gallery-grid .card');
    const wishModalOverlay = document.getElementById('wishModalOverlay');
    const wishView = document.getElementById('wish-view');
    const wishText = document.getElementById('wishText');
    const backBtn = document.getElementById('backBtn');
    const floatingBg = document.getElementById('floatingBg');
    const showSecretBtn = document.getElementById('show-secret-btn');
    const emojis = ['❤️', '🎉', '💋', '✨', '🎂'];
    let emojiInterval = null;

    function createFloatingEmoji() {
        if (!floatingBg) return;
        const span = document.createElement('span');
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.className = 'floating-emoji';
        span.style.left = Math.random() * 100 + '%';
        span.style.fontSize = (Math.random() * 20 + 20) + 'px';
        const duration = Math.random() * 7 + 8;
        span.style.animationDuration = duration + 's';
        floatingBg.appendChild(span);

        setTimeout(() => {
            if (span.parentNode) span.remove();
        }, duration * 1000);
    }

    function startFloatingEmojis() {
        if (emojiInterval) return;
        createFloatingEmoji();
        emojiInterval = setInterval(createFloatingEmoji, 700);
    }

    function stopFloatingEmojis() {
        if (emojiInterval) {
            clearInterval(emojiInterval);
            emojiInterval = null;
        }
        if (floatingBg) floatingBg.innerHTML = '';
    }

    galleryCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (!wishText || !wishModalOverlay) return;

            wishText.textContent = wishes[index] || '';
            wishText.classList.remove('animate');

            void wishText.offsetWidth;

            wishText.classList.add('animate');
            wishModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            startFloatingEmojis();
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            stopFloatingEmojis();
            if (wishText) wishText.classList.remove('animate');
            if (wishModalOverlay) wishModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    const memeBtn = document.getElementById('memeBtn');
    const memeSection = document.getElementById('memeSection');

    if (memeBtn && memeSection) {
        memeBtn.addEventListener('click', () => {
            memeSection.style.display = 'block';
            memeSection.scrollIntoView({ behavior: 'smooth' });
            memeBtn.classList.add('hidden');
        });
    }

    const secretCard = document.getElementById('secretCard');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalMemeVideo = document.getElementById('modalMemeVideo');

    function openModal() {
        if (modalOverlay) modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Pause background music while the meme video is playing
        musicWasPlayingBeforeModal = isMusicPlaying;
        if (isMusicPlaying) {
            pauseMusic();
        }

        if (modalMemeVideo) {
            modalMemeVideo.currentTime = 0;
            modalMemeVideo.muted = false;
            modalMemeVideo.play().catch(error => {
                console.log("Автовоспроизведение видео со звуком заблокировано браузером:", error)
            });
        }
    }

    function closeModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (modalMemeVideo) modalMemeVideo.pause();

        // Show the button that opens the secret section again
        if (showSecretBtn) showSecretBtn.classList.remove('hidden');

        // Resume background music if it was playing before the modal opened
        if (musicWasPlayingBeforeModal) {
            playMusic();
            musicWasPlayingBeforeModal = false;
        }
    }

    if (secretCard && modalOverlay) {
        secretCard.addEventListener('click', openModal);
    }

    if (showSecretBtn) {
        showSecretBtn.addEventListener('click', () => {
            openModal();
            showSecretBtn.classList.add('hidden');
        });
    }

    if (modalClose && modalOverlay) {
        modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
});
