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

    const cards = document.querySelectorAll('.card');
    const wishView = document.getElementById('wish-view');
    const wishText = document.getElementById('wishText');
    const backBtn = document.getElementById('backBtn');

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (!wishView || !wishText) return;

            wishText.textContent = wishes[index] || '';
            wishText.classList.remove('animate');
            wishView.style.display = 'flex';

            void wishText.offsetWidth;

            wishText.classList.add('animate');
            wishView.scrollIntoView({ behavior: 'smooth' });
        });
    });

    if (backBtn && gallery) {
        backBtn.addEventListener('click', () => {
            gallery.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                if (wishView) wishView.style.display = 'none';
                if (wishText) wishText.classList.remove('animate');
            }, 600);
        });
    }
});
