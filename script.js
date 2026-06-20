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
        if (!button || typeof confetti !== 'function') return;

        const rect = button.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 200,
            spread: 80,
            origin: { x, y },
            colors: ['#003366', '#46b8da', '#FFD700'],
            shapes: ['circle', 'square'],
            scalar: 1.8,
            gravity: 0.85,
            ticks: 280,
            disableForReducedMotion: true
        });
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
            ensureMusicPlaying();
        });
    }

    // --- Starry sky background ---
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load('tsparticles', {
            fullScreen: { enable: false },
            particles: {
                number: {
                    value: 75,
                    density: { enable: false }
                },
                color: {
                    value: ['#FFD700', '#FFFFFF']
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: { min: 0.3, max: 0.9 },
                    animation: {
                        enable: true,
                        speed: 0.5,
                        minimumValue: 0.2,
                        sync: false
                    }
                },
                size: {
                    value: { min: 1, max: 3 }
                },
                shadow: {
                    enable: true,
                    color: '#FFD700',
                    blur: 10,
                    offset: { x: 0, y: 0 }
                },
                move: {
                    enable: true,
                    speed: 0.3,
                    direction: 'none',
                    random: true,
                    straight: false,
                    outModes: {
                        default: 'out'
                    }
                }
            },
            interactivity: {
                detectsOn: 'canvas',
                events: {
                    onHover: { enable: false },
                    onClick: { enable: false },
                    resize: true
                }
            },
            detectRetina: true
        }).catch(error => {
            console.log('Ошибка инициализации звездного неба:', error);
        });
    }

    // --- Background music ---
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isMusicPlaying = false;
    let hasUserInteracted = false;
    let musicWasPlayingBeforeModal = false;
    const MUSIC_ENABLED_KEY = 'hb-music-enabled';

    function getMusicEnabled() {
        try {
            const value = localStorage.getItem(MUSIC_ENABLED_KEY);
            // First visit: default to true; otherwise use stored preference
            return value === null ? true : value === 'true';
        } catch (e) {
            return true;
        }
    }

    function setMusicEnabled(value) {
        try {
            localStorage.setItem(MUSIC_ENABLED_KEY, value ? 'true' : 'false');
        } catch (e) {
            // ignore
        }
    }

    function updateMusicToggleIcon() {
        if (musicToggle) {
            musicToggle.textContent = isMusicPlaying ? '🔊' : '🔇';
            musicToggle.classList.toggle('muted', !isMusicPlaying);
            musicToggle.setAttribute('aria-label', isMusicPlaying ? 'Выключить музыку' : 'Включить музыку');
        }
    }

    function playMusic() {
        if (!bgMusic) return Promise.resolve();
        return bgMusic.play().then(() => {
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
        hasUserInteracted = true;
        const willPlay = !isMusicPlaying;
        setMusicEnabled(willPlay);
        if (willPlay) {
            playMusic();
        } else {
            pauseMusic();
        }
    }

    // Keep music playing after section transitions / user interactions
    function ensureMusicPlaying() {
        if (!bgMusic) return;
        if (getMusicEnabled() && bgMusic.paused && !musicWasPlayingBeforeModal) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                updateMusicToggleIcon();
            }).catch(() => {});
        }
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // First interaction: start music on any button click or touch
    function handleFirstInteraction(e) {
        // React to buttons and action buttons, but ignore the music toggle (it handles itself)
        const target = e.target.closest('button, .action-button');
        if (!target || target === musicToggle || target.closest('#music-toggle')) return;

        if (!hasUserInteracted) {
            hasUserInteracted = true;
            playMusic().then(() => {
                setMusicEnabled(true);
            });
        } else {
            ensureMusicPlaying();
        }
    }

    document.body.addEventListener('click', handleFirstInteraction);
    document.body.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    // Initialize icon state
    updateMusicToggleIcon();

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
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            startFloatingEmojis();
            ensureMusicPlaying();
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            stopFloatingEmojis();
            if (wishText) wishText.classList.remove('animate');
            if (wishModalOverlay) wishModalOverlay.classList.remove('active');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            ensureMusicPlaying();
        });
    }

    const memeBtn = document.getElementById('memeBtn');
    const memeSection = document.getElementById('memeSection');

    if (memeBtn && memeSection) {
        memeBtn.addEventListener('click', () => {
            memeSection.style.display = 'block';
            memeSection.scrollIntoView({ behavior: 'smooth' });
            memeBtn.classList.add('hidden');
            ensureMusicPlaying();
        });
    }

    const secretCard = document.getElementById('secretCard');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalMemeVideo = document.getElementById('modalMemeVideo');

    function openModal() {
        if (modalOverlay) modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
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
        document.body.classList.remove('modal-open');
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
