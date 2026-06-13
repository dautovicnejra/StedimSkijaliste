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

// ── Real-time weather (Open-Meteo, no API key) ────────────
const WMO_LABELS = {
    0: 'Vedro', 1: 'Pretežno vedro', 2: 'Djelimično oblačno', 3: 'Oblačno',
    45: 'Magla', 48: 'Ledena magla',
    51: 'Rosulja', 53: 'Rosulja', 55: 'Jaka rosulja',
    61: 'Kiša', 63: 'Obilna kiša', 65: 'Jaka kiša',
    71: 'Snijeg', 73: 'Snijeg', 75: 'Jak snijeg', 77: 'Snježne pahulje',
    80: 'Pljuskovi', 81: 'Obilni pljuskovi', 82: 'Jaki pljuskovi',
    85: 'Snježni pljuskovi', 86: 'Jaki snježni pljuskovi',
    95: 'Grmljavina', 96: 'Grmljavina s gradom', 99: 'Grmljavina s gradom'
};

const WMO_ICONS = {
    0: '☀️', 1: '🌤', 2: '⛅', 3: '☁️',
    45: '🌫', 48: '🌫',
    51: '🌦', 53: '🌦', 55: '🌧',
    61: '🌧', 63: '🌧', 65: '🌧',
    71: '🌨', 73: '❄️', 75: '❄️', 77: '❄️',
    80: '🌦', 81: '🌧', 82: '🌧',
    85: '🌨', 86: '❄️',
    95: '⛈', 96: '⛈', 99: '⛈'
};

async function loadWeather() {
    const condIcon = document.getElementById('cond-icon');
    if (!condIcon) return;
    try {
        const url = 'https://api.open-meteo.com/v1/forecast' +
            '?latitude=42.85&longitude=20.17&elevation=2100' +
            '&current=temperature_2m,weathercode,windspeed_10m,snow_depth,relative_humidity_2m' +
            '&timezone=Europe%2FBelgrade';
        const res  = await fetch(url);
        const data = await res.json();
        const c    = data.current;

        const code = c.weathercode;
        document.getElementById('cond-icon').textContent    = WMO_ICONS[code]  ?? '❄️';
        document.getElementById('cond-temp').textContent    = Math.round(c.temperature_2m);
        document.getElementById('cond-desc').textContent    = WMO_LABELS[code] ?? 'Nepoznato';
        document.getElementById('cond-wind').textContent    = Math.round(c.windspeed_10m) + ' km/h';
        const snowCm = c.snow_depth != null ? Math.round(c.snow_depth * 100) : null;
        document.getElementById('cond-snow').textContent    = snowCm != null ? snowCm + ' cm' : 'N/A';
        document.getElementById('cond-humidity').textContent = Math.round(c.relative_humidity_2m) + ' %';

        const now = new Date();
        document.getElementById('cond-time').textContent =
            now.toLocaleTimeString('bs', { hour: '2-digit', minute: '2-digit' });
    } catch (_) {
        document.getElementById('cond-desc').textContent = 'Podaci trenutno nedostupni';
    }
}

loadWeather();

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
