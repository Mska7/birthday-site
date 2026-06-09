document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('surpriseBtn');
    const gallery = document.getElementById('gallery');

    if (btn && gallery) {
        btn.addEventListener('click', () => {
            gallery.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
