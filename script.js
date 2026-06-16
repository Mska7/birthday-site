document.addEventListener('DOMContentLoaded', () => {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const gallery = document.getElementById('gallery');

    if (surpriseBtn && gallery) {
        surpriseBtn.addEventListener('click', () => {
            gallery.scrollIntoView({ behavior: 'smooth' });
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
            if (!wishView || !wishText) return;

            wishText.textContent = wishes[index] || '';
            wishText.classList.remove('animate');
            wishView.style.display = 'flex';

            void wishText.offsetWidth;

            wishText.classList.add('animate');
            wishView.scrollIntoView({ behavior: 'smooth' });
            startFloatingEmojis();
        });
    });

    if (backBtn && gallery) {
        backBtn.addEventListener('click', () => {
            stopFloatingEmojis();
            gallery.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                if (wishView) wishView.style.display = 'none';
                if (wishText) wishText.classList.remove('animate');
            }, 600);
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
            setTimeout(() => {
                modalMemeVideo.play().catch(error => {
                    console.log("Автоплей со звуком заблокирован браузером:", error)
                    });
            }, 100);
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
