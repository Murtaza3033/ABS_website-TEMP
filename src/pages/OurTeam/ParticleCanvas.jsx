import { useRef, useEffect } from 'react';

/* Particle-network backdrop — canvas + requestAnimationFrame loop. This is a
   genuinely imperative concern (canvas drawing), so it lives in a useEffect
   with full cleanup: cancels the rAF, drops the resize/visibility listeners. */
export default function ParticleCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const cv = ref.current;
    if (!cv || !cv.getContext) return undefined;
    const ctx = cv.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const LINK = 130;
    let W; let H; let raf = 0; let running = true;
    const dots = [];

    const resize = () => {
      W = cv.width = window.innerWidth * DPR;
      H = cv.height = window.innerHeight * DPR;
      cv.style.width = `${window.innerWidth}px`;
      cv.style.height = `${window.innerHeight}px`;
    };
    resize();
    const N = Math.max(28, Math.min(66, Math.floor(window.innerWidth / 26)));
    for (let i = 0; i < N; i++) {
      dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.16 * DPR, vy: (Math.random() - 0.5) * 0.16 * DPR, r: (Math.random() * 1.5 + 0.6) * DPR });
    }

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832); ctx.fillStyle = 'rgba(120,167,255,.5)'; ctx.fill();
        for (let j = i + 1; j < dots.length; j++) {
          const e = dots[j];
          const dx = d.x - e.x; const dy = d.y - e.y;
          const dist = Math.sqrt(dx * dx + dy * dy); const lim = LINK * DPR;
          if (dist < lim) {
            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y);
            ctx.strokeStyle = `rgba(75,139,255,${0.16 * (1 - dist / lim)})`;
            ctx.lineWidth = DPR * 0.55; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />;
}
