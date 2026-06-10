// Wandering Stars — Open Skies Reading Tool

const PLANETS = [
  {
    id: 'red',
    name: 'The Red One',
    domain: 'Danger',
    color: '#cc3322',
    glowColor: 'rgba(200,50,30,0.35)',
    baseRadius: 5,
    pos: { x: 0.12, y: 0.38 },
    animate: 'pulse',
    desc: 'Deep crimson, almost blood-colored. Pulses faintly on clear nights, as though breathing.'
  },
  {
    id: 'pale',
    name: 'The Pale One',
    domain: 'Hope',
    color: '#c8d4e0',
    glowColor: 'rgba(190,205,220,0.08)',
    baseRadius: 3.5,
    pos: { x: 0.26, y: 0.60 },
    animate: 'steady',
    desc: 'Soft white-silver, gentle and steady. Looks like a distant candle that refuses to go out.'
  },
  {
    id: 'near',
    name: 'The Near One',
    domain: 'Connection',
    color: '#5599ee',
    glowColor: 'rgba(80,145,240,0.32)',
    baseRadius: 14,
    pos: { x: 0.48, y: 0.40 },
    animate: 'steady',
    desc: 'Bright blue-white, unnervingly large for a star. Appears closer than it should, as though watching back.'
  },
  {
    id: 'hidden',
    name: 'The Hidden One',
    domain: 'Change',
    color: '#44aa44',
    glowColor: 'rgba(60,170,60,0.25)',
    baseRadius: 4.5,
    pos: { x: 0.68, y: 0.30 },
    animate: 'fade',
    desc: 'Dim, faintly green. Rarely visible unless you already know where to look. Most mistake it for nothing.'
  },
  {
    id: 'bright',
    name: 'The Bright One',
    domain: 'Truth',
    color: '#ffffff',
    glowColor: 'rgba(255,255,255,0.55)',
    baseRadius: 10,
    pos: { x: 0.82, y: 0.52 },
    animate: 'flare',
    desc: 'Piercing white, almost painful to look at directly. Leaves faint afterimages. The only planet that casts a shadow.'
  },
  {
    id: 'twin',
    name: 'The Twin',
    domain: 'Choice',
    color: '#ff8822',
    glowColor: 'rgba(255,130,30,0.38)',
    baseRadius: 3.5,
    pos: { x: 0.38, y: 0.72 },
    animate: 'twin',
    desc: 'Two small bodies orbiting each other, inseparable. One is always slightly brighter — which one shifts nightly.'
  },
  {
    id: 'wanderer',
    name: 'The Wanderer',
    domain: 'Deception',
    color: '#cc4411',
    glowColor: 'rgba(200,60,15,0.38)',
    baseRadius: 4,
    pos: { x: 0.55, y: 0.22 },
    animate: 'wander',
    desc: 'Shifts between yellow and deep orange. Its position is unreliable — appears where unexpected, vanishes where certain.'
  },
  {
    id: 'dead',
    name: 'The Dead One',
    domain: 'Loss / The Past',
    color: '#7799aa',
    glowColor: 'rgba(110,145,165,0.15)',
    baseRadius: 3.5,
    pos: { x: 0.62, y: 0.68 },
    animate: 'flicker',
    desc: 'Barely visible, a flickering gray-blue, like an ember nearly out. Some nights it disappears entirely.'
  },
  {
    id: 'still',
    name: 'The Still One',
    domain: 'Stability',
    color: '#bb66ff',
    glowColor: 'rgba(180,100,255,0.42)',
    baseRadius: 5.5,
    pos: { x: 0.88, y: 0.26 },
    animate: 'still',
    desc: 'Deep violet, fixed. Unlike every other body in the sky, it never moves — not with the seasons, not the hours.'
  },

  // ── Time ──────────────────────────────────────────────────────────────────
  {
    id: 'gone',
    name: 'The Leaving One',
    domain: 'The Past',
    color: '#8899aa',
    glowColor: 'rgba(120,145,165,0.12)',
    baseRadius: 3,
    pos: { x: 0.45, y: 0.35 },
    animate: 'depart',
    desc: 'Dim and gray, drifting steadily westward across the sky. As it nears the edge it briefly blazes — a pale flash — then vanishes. It does not set. It simply leaves.'
  },
  {
    id: 'little',
    name: 'The Little One',
    domain: 'The Present',
    color: '#ccddbb',
    glowColor: 'rgba(180,210,170,0.28)',
    baseRadius: 2.5,
    pos: { x: 0.35, y: 0.25 },
    animate: 'midorbit',
    desc: 'A tiny pale body orbiting the center of the sky in a slow, unchanging circle. Never seems to go anywhere, yet never stops moving.'
  },
  {
    id: 'coming',
    name: 'The Coming One',
    domain: 'The Future',
    color: '#aaddff',
    glowColor: 'rgba(150,210,255,0.30)',
    baseRadius: 4,
    pos: { x: 0.82, y: 0.35 },
    animate: 'arrive',
    desc: 'Blue-white, entering from the eastern edge with a brief blaze of light before settling into the sky. Whether it approaches or merely passes through, it never stays long.'
  },

  // ── Alignment ─────────────────────────────────────────────────────────────
  {
    id: 'warm',
    name: 'The Warm One',
    domain: 'Friend',
    color: '#ffaa44',
    glowColor: 'rgba(255,165,60,0.25)',
    baseRadius: 1.5,
    pos: { x: 0.74, y: 0.42 },
    animate: 'periodicflare',
    desc: 'A small amber-gold pinpoint, usually quiet. Every few minutes it flares — a brief cross of warm light — then returns to its gentle glow as though nothing happened.'
  },
  {
    id: 'cold',
    name: 'The Cold One',
    domain: 'Foe',
    color: '#88bbee',
    glowColor: 'rgba(120,175,235,0.20)',
    baseRadius: 1.5,
    pos: { x: 0.07, y: 0.15 },
    animate: 'periodicflare',
    desc: 'Pale blue and small, easy to overlook. It flares periodically in a sharp cross of cold light, precise and brief, then goes still again.'
  },
  {
    id: 'even',
    name: 'The Even One',
    domain: 'Neutral',
    color: '#aaaaaa',
    glowColor: 'rgba(160,160,160,0.15)',
    baseRadius: 1.5,
    pos: { x: 0.44, y: 0.62 },
    animate: 'periodicflare',
    desc: 'An undistinguished gray pinpoint. Flares periodically with colorless light — not warm, not cold — then fades back to nothing.'
  },

  // ── Conflict ──────────────────────────────────────────────────────────────
  {
    id: 'driving',
    name: 'The Driving One',
    domain: 'Force',
    color: '#ff6622',
    glowColor: 'rgba(255,95,30,0.38)',
    baseRadius: 5,
    pos: { x: 0.28, y: 0.48 },
    animate: 'drive',
    desc: 'A streak of deep orange that appears suddenly at the edge of the sky and burns toward the center before fading. It does not drift. It charges.'
  },
  {
    id: 'gentle',
    name: 'The Gentle One',
    domain: 'Mercy',
    color: '#88cc99',
    glowColor: 'rgba(120,195,145,0.28)',
    baseRadius: 3.5,
    pos: { x: 0.58, y: 0.55 },
    animate: 'gentleglow',
    desc: 'Soft green, low in the sky. Easy to miss. Its glow expands and contracts slowly, like breathing. Those who find it tend to lower their voices.'
  },
  {
    id: 'receding',
    name: 'The Receding One',
    domain: 'Retreat',
    color: '#6688aa',
    glowColor: 'rgba(95,130,165,0.22)',
    baseRadius: 4,
    pos: { x: 0.12, y: 0.82 },
    animate: 'recede',
    desc: 'A blue-gray streak that tears diagonally across the sky toward the far corner, fading as it goes. Always moving away. Never looking back.'
  },

  // ── Fortune ───────────────────────────────────────────────────────────────
  {
    id: 'rising',
    name: 'The Rising One',
    domain: 'Good Fortune',
    color: '#ffdd44',
    glowColor: 'rgba(255,220,50,0.38)',
    baseRadius: 4.5,
    pos: { x: 0.90, y: 0.72 },
    animate: 'rise',
    desc: 'Bright yellow-gold, drifting visibly upward through the night. Once it passes above the mist line it disappears — then starts again from below.'
  },
  {
    id: 'falling',
    name: 'The Falling One',
    domain: 'Misfortune',
    color: '#cc6633',
    glowColor: 'rgba(200,95,45,0.32)',
    baseRadius: 4,
    pos: { x: 0.32, y: 0.82 },
    animate: 'fall',
    desc: 'A burnt orange body descending steadily as though weighted. It falls until it disappears below the horizon, then returns to fall again.'
  },
  {
    id: 'circling',
    name: 'The Circling One',
    domain: 'Unknown Fortune',
    color: '#cc99ff',
    glowColor: 'rgba(195,145,255,0.32)',
    baseRadius: 3.5,
    pos: { x: 0.44, y: 0.78 },
    animate: 'circle',
    desc: 'Pale violet, looping slowly in a wide arc. It always returns to where it started, which tells you something.'
  },

  // ── Knowledge ─────────────────────────────────────────────────────────────
  {
    id: 'clear',
    name: 'The Clear One',
    domain: 'The Seen',
    color: '#eeeeff',
    glowColor: 'rgba(230,230,255,0.45)',
    baseRadius: 6,
    pos: { x: 0.75, y: 0.88 },
    animate: 'halosteady',
    desc: 'Brilliant near-white with a faint luminous ring hovering around it at a fixed distance. Everything nearby looks dimmer by comparison.'
  },
  {
    id: 'whispered',
    name: 'The Whispered One',
    domain: 'The Heard',
    color: '#99aabb',
    glowColor: 'rgba(145,165,180,0.10)',
    baseRadius: 2.5,
    pos: { x: 0.20, y: 0.90 },
    animate: 'halofade',
    desc: 'So faint it might not be there at all. A barely visible ring circles it at a distance — just enough to confirm something is present. Look directly and both vanish.'
  },
  // ── Singles ───────────────────────────────────────────────────────────────
  {
    id: 'shrouded',
    name: 'The Shrouded One',
    domain: 'Mist',
    color: '#ccddee',
    glowColor: 'rgba(190,210,230,0.15)',
    baseRadius: 4,
    pos: { x: 0.92, y: 0.13 },
    animate: 'shroud',
    desc: 'Pale and haze-covered, its edges lost in a diffuse glow. Small wisps of cloud drift slowly across its face, briefly obscuring it before passing on.'
  },
  {
    id: 'burning',
    name: 'The Burning One',
    domain: 'Flame',
    color: '#ff8833',
    glowColor: 'rgba(255,125,40,0.45)',
    baseRadius: 5,
    pos: { x: 0.73, y: 0.18 },
    animate: 'burn',
    desc: 'A tight cluster of shifting light — orange, red, briefly amber at its hottest — that breathes and flickers like something consuming itself. Not a single body. Several.'
  }
];

// Background stars generated once
const BG_STARS = Array.from({ length: 160 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 0.9 + 0.2,
  baseAlpha: Math.random() * 0.4 + 0.2,
  phase: Math.random() * Math.PI * 2
}));

// Per-planet runtime state
const state = {};
for (const p of PLANETS) {
  state[p.id] = { flickerAlpha: 0.6, wanderX: p.pos.x, wanderY: p.pos.y, lastSlot: -1 };
}

const activePlanets = new Set();
let lastFlicker = 0;

const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

function resizeCanvas() {
  const maxW = 560;
  const w = Math.min(canvas.parentElement.getBoundingClientRect().width, maxW);
  canvas.width = w;
  canvas.height = w; // square
}

function drawBgStars(t) {
  for (const s of BG_STARS) {
    const a = s.baseAlpha + Math.sin(t * 0.0009 + s.phase) * 0.12;
    ctx.fillStyle = `rgba(210,225,240,${Math.max(0, a)})`;
    ctx.beginPath();
    ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCircle(x, y, radius, color, glowColor, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;

  // Glow halo
  const grd = ctx.createRadialGradient(x, y, 0, x, y, radius * 3.5);
  grd.addColorStop(0, glowColor);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(x, y, radius * 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Core dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawPlanet(planet, t) {
  const W = canvas.width;
  const H = canvas.height;
  let x = planet.pos.x * W;
  let y = planet.pos.y * H;
  let r = planet.baseRadius;
  let alpha = 1;
  const s = state[planet.id];

  switch (planet.animate) {
    case 'pulse':
      r += Math.sin(t * 0.0022) * 0.6;
      break;

    case 'drift':
      // Slow rightward drift, loops back
      x = ((planet.pos.x * W + t * 0.008) % (W * 1.05));
      break;

    case 'fade':
      alpha = 0.05 + Math.abs(Math.sin(t * 0.0007)) * 0.40;
      break;

    case 'periodicflare': {
      // Steady core that periodically bursts into a soft flare; phase offset by position
      const raw = Math.sin(t * 0.0009 + planet.pos.x * Math.PI * 3);
      const flareStrength = Math.max(0, raw) ** 2; // zero for half the cycle, eased peak
      if (flareStrength > 0.02) {
        const sfLen = W * 0.065;
        const sfA = flareStrength * 0.55;
        const hex = planet.color.replace('#', '');
        const pr = parseInt(hex.slice(0, 2), 16);
        const pg = parseInt(hex.slice(2, 4), 16);
        const pb = parseInt(hex.slice(4, 6), 16);
        ctx.save();
        ctx.lineCap = 'round';
        for (let i = 0; i < 4; i++) {
          const ang = (i / 4) * Math.PI;
          const g = ctx.createLinearGradient(
            x - Math.cos(ang) * sfLen, y - Math.sin(ang) * sfLen,
            x + Math.cos(ang) * sfLen, y + Math.sin(ang) * sfLen
          );
          g.addColorStop(0,    `rgba(${pr},${pg},${pb},0)`);
          g.addColorStop(0.45, `rgba(${pr},${pg},${pb},${sfA})`);
          g.addColorStop(0.5,  `rgba(${pr},${pg},${pb},${sfA * 1.8})`);
          g.addColorStop(0.55, `rgba(${pr},${pg},${pb},${sfA})`);
          g.addColorStop(1,    `rgba(${pr},${pg},${pb},0)`);
          ctx.globalAlpha = 1;
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = g;
          ctx.beginPath();
          ctx.moveTo(x - Math.cos(ang) * sfLen, y - Math.sin(ang) * sfLen);
          ctx.lineTo(x + Math.cos(ang) * sfLen, y + Math.sin(ang) * sfLen);
          ctx.stroke();
        }
        ctx.restore();
      }
      drawCircle(x, y, r, planet.color, planet.glowColor, alpha);
      return;
    }

    case 'flare': {
      // Stable large core + lens flare spikes
      const spikeLen = W * 0.28;
      const spikeAlpha = 0.18 + Math.sin(t * 0.0008) * 0.06;
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineCap = 'round';
      // 4 main cross spikes
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI;
        const grad = ctx.createLinearGradient(
          x - Math.cos(ang) * spikeLen, y - Math.sin(ang) * spikeLen,
          x + Math.cos(ang) * spikeLen, y + Math.sin(ang) * spikeLen
        );
        grad.addColorStop(0,   `rgba(255,255,255,0)`);
        grad.addColorStop(0.45, `rgba(255,255,255,${spikeAlpha})`);
        grad.addColorStop(0.5,  `rgba(255,255,255,${spikeAlpha * 2})`);
        grad.addColorStop(0.55, `rgba(255,255,255,${spikeAlpha})`);
        grad.addColorStop(1,   `rgba(255,255,255,0)`);
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(ang) * spikeLen, y - Math.sin(ang) * spikeLen);
        ctx.lineTo(x + Math.cos(ang) * spikeLen, y + Math.sin(ang) * spikeLen);
        ctx.stroke();
      }
      // 4 shorter diagonal spikes
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI + Math.PI / 8;
        const len = spikeLen * 0.5;
        ctx.lineWidth = 0.6;
        ctx.globalAlpha = spikeAlpha * 0.6;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(ang) * len, y - Math.sin(ang) * len);
        ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
        ctx.stroke();
      }
      // Ghost circles along horizontal axis
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#aaccff';
      [0.4, 0.65, 0.85].forEach(d => {
        const gx = x + spikeLen * d;
        const gr = r * (0.5 - d * 0.3);
        ctx.beginPath(); ctx.arc(gx, y, Math.max(2, gr), 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
      break;
    }

    case 'twin': {
      const orbitR = 18;
      const angle = t * 0.003;
      const brighter = Math.sin(angle) > 0;
      const x1 = x + Math.cos(angle) * orbitR;
      const y1 = y + Math.sin(angle) * orbitR;
      const x2 = x + Math.cos(angle + Math.PI) * orbitR;
      const y2 = y + Math.sin(angle + Math.PI) * orbitR;
      drawCircle(x1, y1, r * (brighter ? 1.35 : 0.75), planet.color, planet.glowColor, 1);
      drawCircle(x2, y2, r * (brighter ? 0.75 : 1.35), planet.color, planet.glowColor, 1);
      return;
    }

    case 'wander': {
      const slot = Math.floor(t / 2800);
      if (slot !== s.lastSlot) {
        s.lastSlot = slot;
        s.wanderX = ((slot * 173 + 37) % 78) / 100 + 0.06;
        s.wanderY = ((slot * 97 + 53) % 64) / 100 + 0.10;
      }
      x = s.wanderX * W;
      y = s.wanderY * H;
      break;
    }

    case 'flicker':
      alpha = s.flickerAlpha;
      break;

    case 'depart': {
      // Drifts left off-screen; bloom fires as a ~1s burst exactly as it crosses the left edge
      const depCycle = (t * 0.040) % (W * 0.85);
      x = planet.pos.x * W - depCycle;
      // Fully visible on-screen, quickly fades once off-screen left
      alpha = Math.max(0, Math.min(1, (x + W * 0.06) / (W * 0.06)));
      // Bloom: symmetric window centred on x=0 (the left edge), ~1.1s duration at this speed
      const depBloom = Math.max(0, 1 - Math.abs(x) / (W * 0.045)) * Math.min(1, alpha * 3);
      if (depBloom > 0.01) {
        const hex = planet.color.replace('#', '');
        const pr = parseInt(hex.slice(0, 2), 16);
        const pg = parseInt(hex.slice(2, 4), 16);
        const pb = parseInt(hex.slice(4, 6), 16);
        ctx.save();
        const bloomR = W * 0.28;
        const bg = ctx.createRadialGradient(x, y, 0, x, y, bloomR);
        bg.addColorStop(0,   `rgba(${pr},${pg},${pb},${depBloom * 0.55})`);
        bg.addColorStop(0.4, `rgba(${pr},${pg},${pb},${depBloom * 0.15})`);
        bg.addColorStop(1,   `rgba(${pr},${pg},${pb},0)`);
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(x, y, bloomR, 0, Math.PI * 2);
        ctx.fill();
        const spikeLen = W * 0.32;
        const sg = ctx.createLinearGradient(x - spikeLen, y, x + spikeLen, y);
        sg.addColorStop(0,    `rgba(${pr},${pg},${pb},0)`);
        sg.addColorStop(0.42, `rgba(${pr},${pg},${pb},${depBloom * 0.35})`);
        sg.addColorStop(0.5,  `rgba(${pr},${pg},${pb},${depBloom * 0.65})`);
        sg.addColorStop(0.58, `rgba(${pr},${pg},${pb},${depBloom * 0.35})`);
        sg.addColorStop(1,    `rgba(${pr},${pg},${pb},0)`);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = sg;
        ctx.beginPath();
        ctx.moveTo(x - spikeLen, y);
        ctx.lineTo(x + spikeLen, y);
        ctx.stroke();
        ctx.restore();
      }
      drawCircle(x, y, r, planet.color, planet.glowColor, alpha);
      return;
    }

    case 'arrive': {
      // Enters from off-screen right, stays on right side; bloom fires ~1s as it crosses right edge
      const travelDist = W * (1.08 - planet.pos.x) + W * 0.15;
      const arrCycle = (t * 0.040) % travelDist;
      x = W * 1.08 - arrCycle;
      y = planet.pos.y * H;
      const fadeIn  = Math.max(0, Math.min(1, (W * 1.08 - x) / (W * 0.06)));
      const fadeOut = Math.max(0, Math.min(1, (travelDist - arrCycle) / (W * 0.12)));
      alpha = Math.min(fadeIn, fadeOut);
      // Bloom: symmetric window centred on x=W (the right edge), ~1.1s duration
      const arrBloom = Math.max(0, 1 - Math.abs(W - x) / (W * 0.045)) * Math.min(1, alpha * 3);
      if (arrBloom > 0.01) {
        const hex = planet.color.replace('#', '');
        const pr = parseInt(hex.slice(0, 2), 16);
        const pg = parseInt(hex.slice(2, 4), 16);
        const pb = parseInt(hex.slice(4, 6), 16);
        ctx.save();
        const bloomR = W * 0.28;
        const bg = ctx.createRadialGradient(x, y, 0, x, y, bloomR);
        bg.addColorStop(0,   `rgba(${pr},${pg},${pb},${arrBloom * 0.55})`);
        bg.addColorStop(0.4, `rgba(${pr},${pg},${pb},${arrBloom * 0.15})`);
        bg.addColorStop(1,   `rgba(${pr},${pg},${pb},0)`);
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(x, y, bloomR, 0, Math.PI * 2);
        ctx.fill();
        const spikeLen = W * 0.32;
        const sg = ctx.createLinearGradient(x - spikeLen, y, x + spikeLen, y);
        sg.addColorStop(0,    `rgba(${pr},${pg},${pb},0)`);
        sg.addColorStop(0.42, `rgba(${pr},${pg},${pb},${arrBloom * 0.35})`);
        sg.addColorStop(0.5,  `rgba(${pr},${pg},${pb},${arrBloom * 0.65})`);
        sg.addColorStop(0.58, `rgba(${pr},${pg},${pb},${arrBloom * 0.35})`);
        sg.addColorStop(1,    `rgba(${pr},${pg},${pb},0)`);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = sg;
        ctx.beginPath();
        ctx.moveTo(x - spikeLen, y);
        ctx.lineTo(x + spikeLen, y);
        ctx.stroke();
        ctx.restore();
      }
      drawCircle(x, y, r, planet.color, planet.glowColor, alpha);
      return;
    }

    case 'midorbit': {
      // Smaller orbit around the center of the canvas (The Little One)
      const midR = W * 0.14;
      const angle = t * 0.0015;
      x = W * 0.5 + Math.cos(angle) * midR;
      y = H * 0.5 + Math.sin(angle) * midR;
      break;
    }

    case 'orbit': {
      // Tight circular orbit around base position
      const orbitR = W * 0.04;
      const angle = t * 0.003;
      x = planet.pos.x * W + Math.cos(angle) * orbitR;
      y = planet.pos.y * H + Math.sin(angle) * orbitR;
      break;
    }

    case 'circle': {
      // Wide slow orbit around base position (The Circling One)
      const circleR = W * 0.09;
      const angle = t * 0.0008;
      x = planet.pos.x * W + Math.cos(angle) * circleR;
      y = planet.pos.y * H + Math.sin(angle) * circleR;
      break;
    }

    case 'rise': {
      // Continuously drifts upward, fades off the top edge and loops
      const riseCycle = (t * 0.007) % (H * 1.1);
      y = planet.pos.y * H - riseCycle;
      alpha = Math.max(0, Math.min(1, (y + H * 0.06) / (H * 0.06)));
      break;
    }

    case 'fall': {
      // Continuously drifts downward, fades off the bottom edge and loops
      const fallCycle = (t * 0.007) % (H * 1.1);
      y = planet.pos.y * H + fallCycle;
      alpha = Math.max(0, Math.min(1, (H * 1.06 - y) / (H * 0.06)));
      break;
    }

    case 'recede': {
      // Fast diagonal rush toward the bottom-right corner, fades and loops
      const cycle = (t * 0.110) % (W * 1.1);
      x = planet.pos.x * W + cycle;
      y = planet.pos.y * H + cycle * 0.40;
      alpha = Math.max(0, 1 - cycle / (W * 0.65));
      break;
    }

    case 'drive': {
      // Fast burst from top-left corner toward canvas center, loops
      const driveLen = W * 0.72;
      const cycle = (t * 0.018) % driveLen;
      const progress = cycle / driveLen;
      x = progress * W * 0.52;
      y = progress * H * 0.52;
      alpha = progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);
      break;
    }

    case 'gentleglow': {
      // Soft radial bloom that ebbs and flows slowly (The Gentle One)
      const pulse = 0.5 + Math.sin(t * 0.0014) * 0.5;
      const hex = planet.color.replace('#', '');
      const pr = parseInt(hex.slice(0, 2), 16);
      const pg = parseInt(hex.slice(2, 4), 16);
      const pb = parseInt(hex.slice(4, 6), 16);
      ctx.save();
      const bloomR = W * 0.22;
      const bg = ctx.createRadialGradient(x, y, 0, x, y, bloomR);
      bg.addColorStop(0,    `rgba(${pr},${pg},${pb},${pulse * 0.28})`);
      bg.addColorStop(0.45, `rgba(${pr},${pg},${pb},${pulse * 0.08})`);
      bg.addColorStop(1,    `rgba(${pr},${pg},${pb},0)`);
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(x, y, bloomR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      drawCircle(x, y, r, planet.color, planet.glowColor, alpha);
      return;
    }

    case 'halosteady': {
      // Steady core with a glowing halo ring (The Clear One)
      const hRing = r * 4.8 + Math.sin(t * 0.0008) * r * 0.3;
      ctx.save();
      ctx.strokeStyle = planet.color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.38 + Math.sin(t * 0.0008) * 0.10;
      ctx.beginPath();
      ctx.arc(x, y, hRing, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(x, y, hRing * 0.92, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      drawCircle(x, y, r, planet.color, planet.glowColor, alpha);
      return;
    }

    case 'halofade': {
      // Fading core with a faint halo ring (The Whispered One)
      alpha = 0.05 + Math.abs(Math.sin(t * 0.0007)) * 0.40;
      const wRing = r * 6.5 + Math.sin(t * 0.0007) * r * 0.6;
      ctx.save();
      ctx.strokeStyle = planet.color;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = alpha * 0.45;
      ctx.beginPath();
      ctx.arc(x, y, wRing, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      drawCircle(x, y, r, planet.color, planet.glowColor, alpha);
      return;
    }

    case 'burn': {
      // Cluster of overlapping dots shifting orange→red with flickering size (The Burning One)
      ctx.save();
      // Glow underneath
      const bGrd = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
      bGrd.addColorStop(0, 'rgba(255,100,20,0.40)');
      bGrd.addColorStop(0.5, 'rgba(200,50,0,0.12)');
      bGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bGrd;
      ctx.beginPath();
      ctx.arc(x, y, r * 4.5, 0, Math.PI * 2);
      ctx.fill();
      // 6 flickering dots
      for (let i = 0; i < 6; i++) {
        const phase = i * 1.047;
        const flicker = Math.sin(t * 0.019 + phase * 2.7) * 0.5 + 0.5;
        const dotR = r * (0.35 + flicker * 1.0);
        const ox = Math.sin(t * 0.002 + phase) * r * 0.08;
        const oy = Math.cos(t * 0.002 + phase * 1.5) * r * 0.07;
        const g = Math.floor(Math.pow(flicker, 2.5) * 160);
        ctx.fillStyle = `rgba(255,${g},0,${0.55 + flicker * 0.45})`;
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    case 'shroud': {
      // Large misty halo + small core + drifting cloud puffs in front (The Shrouded One)
      const haloR = r * 10 + Math.sin(t * 0.0006) * r * 2;
      const haloA = 0.04 + Math.sin(t * 0.0006) * 0.02;
      ctx.save();
      const hGrd = ctx.createRadialGradient(x, y, r, x, y, haloR);
      hGrd.addColorStop(0, `rgba(190,210,230,${haloA * 4})`);
      hGrd.addColorStop(0.5, `rgba(190,210,230,${haloA})`);
      hGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hGrd;
      ctx.beginPath();
      ctx.arc(x, y, haloR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // Draw core
      drawCircle(x, y, r, planet.color, planet.glowColor, alpha);
      // Cloud puffs drawn in front of the core
      ctx.save();
      const cloudDefs = [
        { ox: -1.4, oy:  0.6, phase: 0.0 },
        { ox:  1.2, oy: -0.7, phase: 2.1 },
        { ox:  1.8, oy:  0.5, phase: 4.2 },
        { ox: -0.6, oy: -1.3, phase: 1.0 },
      ];
      for (const c of cloudDefs) {
        const drift = Math.sin(t * 0.0004 + c.phase) * r * 0.6;
        const cx = x + c.ox * r * 1.2 + drift;
        const cy = y + c.oy * r * 1.2;
        const puffA = 0.20 + Math.sin(t * 0.00025 + c.phase) * 0.07;
        for (const [dx, dy, ds] of [[-0.5, 0, 1.0], [0.55, -0.3, 0.85], [0.15, 0.45, 0.72]]) {
          ctx.fillStyle = `rgba(190,210,230,${puffA})`;
          ctx.beginPath();
          ctx.arc(cx + dx * r * 1.2, cy + dy * r * 1.2, ds * r * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      return;
    }

    case 'still':
    default:
      break;
  }

  drawCircle(x, y, r, planet.color, planet.glowColor, alpha);
}

function render(t) {
  // Throttle flicker updates to ~8fps feel
  if (t - lastFlicker > 130) {
    for (const p of PLANETS) {
      if (p.animate === 'flicker') {
        state[p.id].flickerAlpha = Math.random() < 0.12 ? 0.02 : 0.08 + Math.random() * 0.22;
      }
    }
    lastFlicker = t;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Night sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#030810');
  sky.addColorStop(1, '#0b1220');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBgStars(t);

  for (const p of PLANETS) {
    if (activePlanets.has(p.id)) drawPlanet(p, t);
  }

  requestAnimationFrame(render);
}

// ─── Export / Copy ──────────────────────────────────────────────────────────

async function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function exportGif() {
  const btn = document.getElementById('export-btn');
  btn.disabled = true;

  try {
    btn.textContent = 'Loading…';
    await loadScript('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js');

    // Fetch worker as blob — avoids CORS restriction on web workers
    const workerBlob = await fetch('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js').then(r => r.blob());
    const workerURL = URL.createObjectURL(workerBlob);

    const FPS = 12;
    const FRAMES = 60; // ~5 seconds
    const DELAY = Math.round(1000 / FPS);

    const gif = new GIF({ workers: 2, quality: 1, dither: false, workerScript: workerURL, width: canvas.width, height: canvas.height });

    // Pass ImageData directly — avoids gif.js creating intermediate canvas (fixes willReadFrequently warning)
    let frame = 0;
    btn.textContent = `Capturing… 0/${FRAMES}`;
    function captureNext() {
      if (frame >= FRAMES) {
        btn.textContent = 'Encoding…';
        gif.render();
        return;
      }
      gif.addFrame(canvas, { copy: true, delay: DELAY });
      frame++;
      btn.textContent = `Capturing… ${frame}/${FRAMES}`;
      setTimeout(captureNext, DELAY);
    }
    captureNext();

    gif.on('finished', async blob => {
      URL.revokeObjectURL(workerURL);
      const url = URL.createObjectURL(blob);

      // Show inline — right-click to copy or drag into Telegram/Discord
      const preview = document.getElementById('gif-preview');
      preview.src = url;
      preview.style.display = 'block';

      // Try clipboard too
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/gif': blob })]);
        btn.textContent = 'Copied!';
      } catch {
        btn.textContent = 'Ready ↓';
      }

      btn.disabled = false;
      setTimeout(() => { btn.textContent = 'Export GIF'; }, 3000);
    });

  } catch (err) {
    console.error('GIF export failed:', err);
    btn.textContent = 'Failed'; btn.disabled = false;
    setTimeout(() => { btn.textContent = 'Export GIF'; }, 2000);
  }
}

async function copyFrame() {
  const btn = document.getElementById('copy-btn');
  try {
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    btn.textContent = 'Copied!';
  } catch {
    btn.textContent = 'Failed';
  }
  setTimeout(() => { btn.textContent = 'Copy Frame'; }, 2000);
}

function initButtons() {
  const grid = document.getElementById('planet-grid');
  for (const planet of PLANETS) {
    const btn = document.createElement('button');
    btn.className = 'planet-btn';
    btn.dataset.id = planet.id;

    const dot = planet.id === 'twin'
      ? `<span class="planet-dot-wrap"><span class="planet-dot" style="background:${planet.color};width:8px;height:8px;"></span><span class="planet-dot" style="background:${planet.color};width:8px;height:8px;opacity:0.6;"></span></span>`
      : `<span class="planet-dot" style="background:${planet.color};"></span>`;

    btn.innerHTML = `
      ${dot}
      <span class="planet-info">
        <span class="planet-name">${planet.name}</span>
        <span class="planet-domain">${planet.domain}</span>
        <span class="planet-desc">${planet.desc}</span>
      </span>
    `;

    btn.addEventListener('click', () => {
      if (activePlanets.has(planet.id)) {
        activePlanets.delete(planet.id);
        btn.classList.remove('active');
      } else {
        activePlanets.add(planet.id);
        btn.classList.add('active');
      }
    });

    grid.appendChild(btn);
  }

  document.getElementById('clear-btn').addEventListener('click', () => {
    activePlanets.clear();
    document.querySelectorAll('.planet-btn').forEach(b => b.classList.remove('active'));
  });
  document.getElementById('export-btn').addEventListener('click', exportGif);
  document.getElementById('copy-btn').addEventListener('click', copyFrame);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initButtons();
requestAnimationFrame(render);
