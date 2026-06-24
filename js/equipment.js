// ── Snow & stars canvas ────────────────────────────────────
const canvas = document.getElementById('snow');
const ctx    = canvas ? canvas.getContext('2d') : null;
let W, H, flakes = [], stars = [];

function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

function initStars() {
    stars = [];
    for (let i = 0; i < 130; i++) {
        stars.push({
            x: Math.random() * W,
            y: Math.random() * H * 0.58,
            r: Math.random() * 1.1 + 0.15,
            o: Math.random() * 0.55 + 0.1
        });
    }
}

function initFlakes() {
    flakes = [];
    const n = Math.min(110, Math.floor(W / 14));
    for (let i = 0; i < n; i++) {
        flakes.push({
            x:     Math.random() * W,
            y:     Math.random() * H,
            r:     Math.random() * 2.0 + 0.3,
            speed: Math.random() * 0.55 + 0.12,
            wind:  Math.random() * 0.35 - 0.175,
            o:     Math.random() * 0.42 + 0.08
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(195,218,255,${s.o})`;
        ctx.fill();
    });
    flakes.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.o})`;
        ctx.fill();
        f.y += f.speed;
        f.x += f.wind;
        if (f.y > H) { f.y = -4; f.x = Math.random() * W; }
        if (f.x > W) f.x = 0;
        if (f.x < 0) f.x = W;
    });
    requestAnimationFrame(draw);
}

if (canvas) {
    resize(); initStars(); initFlakes(); draw();
    window.addEventListener('resize', () => { resize(); initStars(); initFlakes(); });
}

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
