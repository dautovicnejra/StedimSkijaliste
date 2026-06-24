// ── Nav: dark background on scroll ────────────────────────
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile hamburger menu ──────────────────────────────────
const hamburger      = document.getElementById('nav-hamburger');
const mobileNav      = document.getElementById('mobile-nav');
const mobileBackdrop = document.getElementById('mobile-nav-backdrop');

function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    mobileBackdrop.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('is-open');
        mobileBackdrop.classList.toggle('is-open', isOpen);
        hamburger.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        mobileNav.setAttribute('aria-hidden', String(!isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMobileNav);
    });

    mobileBackdrop?.addEventListener('click', closeMobileNav);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeMobileNav();
    });
}

// ── Contact form ───────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const cfStatus    = document.getElementById('cf-status');
const cfSubmit    = document.getElementById('cf-submit');

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const name    = contactForm.querySelector('#cf-name').value.trim();
        const email   = contactForm.querySelector('#cf-email').value.trim();
        const message = contactForm.querySelector('#cf-message').value.trim();

        if (!name || !email || !message) {
            cfStatus.textContent = 'Molimo popunite sva obavezna polja.';
            cfStatus.className = 'form-note form-note--error';
            return;
        }

        const origText = cfSubmit.textContent;
        cfSubmit.textContent = 'Slanje...';
        cfSubmit.disabled = true;

        setTimeout(() => {
            cfStatus.textContent = 'Poruka je uspješno poslana! Odgovorićemo vam u roku od 24 sata.';
            cfStatus.className = 'form-note form-note--success';
            contactForm.reset();
            cfSubmit.textContent = origText;
            cfSubmit.disabled = false;

            setTimeout(() => {
                cfStatus.textContent = '';
                cfStatus.className = 'form-note';
            }, 6000);
        }, 900);
    });
}

// ── FAQ accordion ──────────────────────────────────────────
document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const item    = btn.closest('.faq-item');
        const isOpen  = item.classList.contains('is-open');

        document.querySelectorAll('.faq-item.is-open').forEach(open => {
            open.classList.remove('is-open');
            open.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});
