// ── Snow & stars canvas ────────────────────────────────────
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');
let W, H, flakes = [], stars = [];

function resize() {
    W = canvas.width = window.innerWidth;
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
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 2.0 + 0.3,
            speed: Math.random() * 0.55 + 0.12,
            wind: Math.random() * 0.35 - 0.175,
            o: Math.random() * 0.42 + 0.08
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

resize(); initStars(); initFlakes(); draw();
window.addEventListener('resize', () => { resize(); initStars(); initFlakes(); });

// ── Countdown ─────────────────────────────────────────────
const countdownEl = document.getElementById('countdown');
const TARGET = new Date('2026-12-15T09:00:00');

function tick() {
    if (!countdownEl) return;
    const diff = TARGET - new Date();
    if (diff <= 0) {
        countdownEl.innerHTML = '<p class="countdown-done">Dobrodošli na Štedim!</p>';
        return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('days').textContent    = String(d).padStart(3, '0');
    document.getElementById('hours').textContent   = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}

if (countdownEl) { tick(); setInterval(tick, 1000); }

// ── Email / signup form ────────────────────────────────────
document.getElementById('signup-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.signup-btn');
    const inp = e.target.querySelector('.signup-input');
    btn.textContent = 'Hvala! ✓';
    btn.classList.add('success');
    inp.value = '';
    setTimeout(() => {
        btn.textContent = 'Obavijesti me';
        btn.classList.remove('success');
    }, 3500);
});

// ── Contact form ───────────────────────────────────────────
document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-primary');
    const orig = btn.textContent;
    btn.textContent = 'Poruka poslana ✓';
    btn.style.background = '#4caf82';
    e.target.reset();
    setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
    }, 3500);
});

// ── Nav: dark background on scroll ────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mouse parallax on mountains (homepage only) ────────────
const mtnFar  = document.querySelector('.mtn-far');
const mtnMid  = document.querySelector('.mtn-mid');
const mtnNear = document.querySelector('.mtn-near');

if (mtnFar) {
    document.addEventListener('mousemove', e => {
        const rx = (e.clientX / window.innerWidth  - 0.5) * 2;
        const ry = (e.clientY / window.innerHeight - 0.5) * 2;
        mtnFar.style.transform  = `translate(${rx * -7}px,${ry * -3}px)`;
        mtnMid.style.transform  = `translate(${rx * -15}px,${ry * -6}px)`;
        mtnNear.style.transform = `translate(${rx * -24}px,${ry * -9}px)`;
    });
}
