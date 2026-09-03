/* ===================================
   SpendPulse — Background Animations
   Particles, Aurora, Floating Symbols,
   Mouse Effects & Confetti
   =================================== */

(function () {
  'use strict';

  let particleCanvas, pCtx;
  let confettiCanvas, cCtx;
  let floatingContainer, mouseGlow;

  let particles = [];
  let confettiPieces = [];
  let confettiActive = false;

  let mouseX = -1000, mouseY = -1000;
  let glowX = 0, glowY = 0;
  let targetGlowX = 0, targetGlowY = 0;

  const PARTICLE_COUNT = 120;
  const CONNECTION_DIST = 140;
  const MOUSE_RADIUS = 300;

  const PARTICLE_COLORS = [
    '#6366f1', // electric indigo
    '#a855f7', // neon purple
    '#ec4899', // hot pink
    '#0ea5e9', // vivid sky blue
    '#10b981', // bright emerald
    '#f59e0b', // glowing amber
    '#00f2fe', // cyan pop
  ];

  function resizeParticleCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      const w = particleCanvas ? particleCanvas.width : window.innerWidth;
      const h = particleCanvas ? particleCanvas.height : window.innerHeight;
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 4 + 2;
      this.baseSize = this.size;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.4;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.shape = Math.random() > 0.6 ? 'diamond' : 'circle';
    }

    update(time) {
      if (!particleCanvas) return;
      // Mouse interaction
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * 0.6;
        this.vy += Math.sin(angle) * force * 0.6;
        this.size = this.baseSize + force * 3;
      } else {
        this.size += (this.baseSize - this.size) * 0.05;
      }

      // Pulse alpha
      this.alpha = 0.3 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.25;

      // Move
      this.x += this.vx;
      this.y += this.vy;

      // Friction
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Wrap around
      if (this.x < -20) this.x = particleCanvas.width + 20;
      if (this.x > particleCanvas.width + 20) this.x = -20;
      if (this.y < -20) this.y = particleCanvas.height + 20;
      if (this.y > particleCanvas.height + 20) this.y = -20;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

      if (this.shape === 'diamond') {
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections(ctx) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.4;
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseConnections(ctx) {
    if (mouseX < 0) return;
    particles.forEach(p => {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const alpha = (1 - dist / MOUSE_RADIUS) * 0.45;
        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });
  }

  let animTime = 0;
  function animateParticles() {
    if (!particleCanvas || !pCtx) return;
    animTime++;
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach(p => p.update(animTime));
    drawConnections(pCtx);
    drawMouseConnections(pCtx);
    particles.forEach(p => p.draw(pCtx));

    requestAnimationFrame(animateParticles);
  }

  // ─── Floating Currency Symbols ───────
  const SYMBOLS = ['₹', '$', '€', '£', '¥', '₩', '₿', '💰', '💎', '✨', '🪙', '💵', '📊', '📈'];

  function createFloatingSymbol() {
    if (!floatingContainer) return;
    const el = document.createElement('div');
    el.className = 'float-symbol';
    el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    const startX = Math.random() * 100;
    const duration = 12 + Math.random() * 18;
    const delay = Math.random() * 8;
    const size = 20 + Math.random() * 26;
    const drift = (Math.random() - 0.5) * 240;

    el.style.cssText = `
      left: ${startX}%;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --drift: ${drift}px;
      opacity: 0;
    `;

    floatingContainer.appendChild(el);

    setTimeout(() => {
      el.remove();
      createFloatingSymbol();
    }, (duration + delay) * 1000);
  }

  function initFloatingSymbols() {
    if (!floatingContainer) return;
    floatingContainer.innerHTML = '';
    for (let i = 0; i < 35; i++) {
      createFloatingSymbol();
    }
  }

  // ─── Mouse Glow Effect ───────────────
  function updateMouseGlow() {
    if (mouseGlow) {
      glowX += (targetGlowX - glowX) * 0.08;
      glowY += (targetGlowY - glowY) * 0.08;
      mouseGlow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
    }
    requestAnimationFrame(updateMouseGlow);
  }

  // ─── Confetti System ─────────────────
  const CONFETTI_COLORS = [
    '#6366f1', '#a855f7', '#ec4899', '#f43f5e',
    '#10b981', '#f59e0b', '#0ea5e9', '#22d3ee',
    '#f97316', '#8b5cf6',
  ];

  class ConfettiPiece {
    constructor(x, y) {
      const w = confettiCanvas ? confettiCanvas.width : window.innerWidth;
      this.x = x || Math.random() * w;
      this.y = y || -20;
      this.size = Math.random() * 8 + 4;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.vx = (Math.random() - 0.5) * 8;
      this.vy = Math.random() * -6 - 4;
      this.gravity = 0.15;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 12;
      this.alpha = 1;
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
      this.wobble = Math.random() * 10;
      this.wobbleSpeed = Math.random() * 0.1 + 0.05;
    }

    update() {
      const maxH = confettiCanvas ? confettiCanvas.height : window.innerHeight;
      this.vy += this.gravity;
      this.vx *= 0.99;
      this.x += this.vx + Math.sin(this.wobble) * 0.5;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.wobble += this.wobbleSpeed;
      this.alpha -= 0.005;
      return this.alpha > 0 && this.y < maxH + 50;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function launchConfetti(originX, originY) {
    if (!confettiCanvas) return;
    confettiActive = true;
    const count = 60;
    for (let i = 0; i < count; i++) {
      confettiPieces.push(new ConfettiPiece(
        originX || confettiCanvas.width / 2,
        originY || confettiCanvas.height / 3
      ));
    }
  }

  function animateConfetti() {
    if (!confettiCanvas || !cCtx) return;
    if (!confettiActive && confettiPieces.length === 0) {
      requestAnimationFrame(animateConfetti);
      return;
    }

    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter(p => {
      p.draw(cCtx);
      return p.update();
    });

    if (confettiPieces.length === 0) {
      confettiActive = false;
    }

    requestAnimationFrame(animateConfetti);
  }

  window.launchConfetti = launchConfetti;

  // ─── Sparkle Trail on Click ──────────
  function createSparkle(x, y) {
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 20 + Math.random() * 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      sparkle.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        --tx: ${tx}px;
        --ty: ${ty}px;
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 600);
    }
  }

  // ─── Event Listeners ─────────────────
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    targetGlowX = e.clientX;
    targetGlowY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  document.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
  });

  // ─── Main Init ───────────────────────
  function initAnimations() {
    particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) pCtx = particleCanvas.getContext('2d');

    confettiCanvas = document.getElementById('confetti-canvas');
    if (confettiCanvas) cCtx = confettiCanvas.getContext('2d');

    floatingContainer = document.getElementById('floating-symbols');
    mouseGlow = document.getElementById('mouse-glow');

    resizeParticleCanvas();
    resizeConfettiCanvas();
    initParticles();
    initFloatingSymbols();
    animateParticles();
    animateConfetti();
    updateMouseGlow();
  }

  window.addEventListener('resize', () => {
    resizeParticleCanvas();
    resizeConfettiCanvas();
    initParticles();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
