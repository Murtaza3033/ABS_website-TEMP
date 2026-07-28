import { useRef, useEffect } from 'react';

/* Partner-network constellation — canvas hub + orbiting nodes with pointer
   interaction. Genuinely imperative (canvas), so it's a useEffect with full
   cleanup. Sizes to and tracks the pointer over `hostRef` (the hero section). */
export default function ConstellationCanvas({ hostRef }) {
  const cvRef = useRef(null);

  useEffect(() => {
    const cv = cvRef.current;
    const host = hostRef.current;
    if (!cv || !host) return undefined;
    const ctx = cv.getContext('2d');
    if (!ctx) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const N = 16;
    let W = 0; let H = 0; let raf = 0; let running = false;
    let nodes = [];
    const hub = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0, active: false };

    const build = () => {
      hub.x = W * 0.6; hub.y = H * 0.46; nodes = [];
      const R = Math.min(Math.max(W, 640), 1180) * 0.5;
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + i * 0.7;
        const rad = R * (0.22 + 0.62 * ((i * 97) % 100) / 100);
        nodes.push({
          x: hub.x + Math.cos(a) * rad, y: hub.y + Math.sin(a) * rad * 0.82,
          vx: (((i * 53) % 20) / 20 - 0.5) * 0.22, vy: (((i * 31) % 20) / 20 - 0.5) * 0.22,
          r: 1.5 + ((i * 17) % 10) / 10 * 2.4, ph: i * 0.9,
        });
      }
    };
    const size = () => {
      const r = host.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr);
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    const step = (t) => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouse.x; const my = mouse.y;
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 8 || p.x > W - 8) p.vx *= -1;
          if (p.y < 8 || p.y > H - 8) p.vy *= -1;
        }
        const near = mouse.active && Math.hypot(p.x - mx, p.y - my) < 150;
        const dh = Math.hypot(p.x - hub.x, p.y - hub.y);
        const alpha = Math.max(0, 0.5 - dh / (Math.max(W, H) * 0.95));
        ctx.strokeStyle = `rgba(26,86,219,${(alpha * (near ? 1 : 0.5)).toFixed(3)})`;
        ctx.lineWidth = near ? 1.2 : 0.7;
        ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]; const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 118) {
            ctx.strokeStyle = `rgba(75,139,255,${(0.16 * (1 - d / 118)).toFixed(3)})`;
            ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const pulse = 0.6 + 0.4 * Math.sin((t || 0) * 0.002 + p.ph);
        ctx.fillStyle = `rgba(26,86,219,${(0.35 + 0.3 * pulse).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      const hp = 0.6 + 0.4 * Math.sin((t || 0) * 0.003);
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26,86,219,${(0.09 + 0.05 * hp).toFixed(3)})`; ctx.fill();
      ctx.lineWidth = 1.4; ctx.strokeStyle = `rgba(26,86,219,${(0.3 + 0.3 * hp).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 10 + 4 * hp, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(26,86,219,.9)'; ctx.fill();
      if (running && !reduce) raf = requestAnimationFrame(step);
    };
    const start = () => { if (running) return; running = true; raf = requestAnimationFrame(step); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };
    const onVis = () => { if (document.hidden) stop(); else start(); };

    size();
    window.addEventListener('resize', size, { passive: true });
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    if (reduce) step(0); else start();

    return () => {
      stop();
      window.removeEventListener('resize', size);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [hostRef]);

  return <canvas ref={cvRef} className="net-canvas" data-net />;
}
