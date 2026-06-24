// ── Gallery filters ─────────────────────────────────────────
const filterButtons = document.querySelectorAll('.gallery-filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterButtons.forEach(b => b.classList.toggle('is-active', b === btn));
        galleryItems.forEach(item => {
            const show = filter === 'sve' || item.dataset.filter === filter;
            item.classList.toggle('is-hidden', !show);
        });
    });
});

// ── Gallery lightbox ────────────────────────────────────────
const lightbox        = document.getElementById('gallery-lightbox');
const lightboxBg       = document.getElementById('gallery-lightbox-bg');
const lightboxImg      = document.getElementById('gallery-lightbox-img');
const lightboxCaption  = document.getElementById('gallery-lightbox-caption');
const lightboxX        = document.getElementById('gallery-lightbox-x');
const lightboxPrev     = document.getElementById('gallery-lightbox-prev');
const lightboxNext     = document.getElementById('gallery-lightbox-next');

let currentIndex = 0;

function visibleItems() {
    return Array.from(galleryItems).filter(item => !item.classList.contains('is-hidden'));
}

function showLightboxItem(item) {
    if (!item) return;
    const img = item.querySelector('.gallery-photo');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.caption || '';
}

function openLightbox(item) {
    const items = visibleItems();
    currentIndex = items.indexOf(item);
    showLightboxItem(items[currentIndex]);
    lightbox.classList.add('is-open');
    lightbox.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function stepLightbox(dir) {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = (currentIndex + dir + items.length) % items.length;
    showLightboxItem(items[currentIndex]);
}

if (lightbox) {
    galleryItems.forEach(item => {
        item.addEventListener('click', () => openLightbox(item));
    });

    lightboxBg?.addEventListener('click', closeLightbox);
    lightboxX?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', () => stepLightbox(-1));
    lightboxNext?.addEventListener('click', () => stepLightbox(1));

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') stepLightbox(-1);
        if (e.key === 'ArrowRight') stepLightbox(1);
    });
}
