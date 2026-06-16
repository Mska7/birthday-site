document.addEventListener('DOMContentLoaded', () => {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const gallery = document.getElementById('gallery');

    if (surpriseBtn && gallery) {
        surpriseBtn.addEventListener('click', () => {
            gallery.scrollIntoView({ behavior: 'smooth' });
        });
    }

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
        });
    }

    const secretCard = document.getElementById('secretCard');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalMemeVideo = document.getElementById('modalMemeVideo');

    function closeModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (modalMemeVideo) modalMemeVideo.pause();
    }

    if (secretCard && modalOverlay) {
        secretCard.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (modalMemeVideo) {
                modalMemeVideo.currentTime = 0;
                setTimeout(() => {
                    modalMemeVideo.play().catch(error => {
                        console.log("Автоплей со звуком заблокирован браузером:", error)
                        });
                }, 100);
            }
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
