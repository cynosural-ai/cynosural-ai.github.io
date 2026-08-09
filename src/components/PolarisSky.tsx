"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  blue: boolean;
  special: boolean;
};

type Comet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
};

/**
 * Lightweight canvas starfield for the home hero:
 * - twinkling stars with depth-based mouse parallax, one of them brighter
 *   and bigger than the rest
 * - periodic shooting stars crossing the sky on random trajectories
 * - `prefers-reduced-motion` falls back to a static, single-frame render
 */
export default function PolarisSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let comet: Comet | null = null;
    let nextCometAt = 0;
    let raf = 0;
    let last = 0;
    const mouse = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(90, Math.min(280, Math.round((width * height) / 8000)));
      stars = Array.from({ length: count }, (_, i) => {
        const special = i === 0;
        return {
          // The standout star sits 10% right of center, a quarter from the top;
          // it keeps mouse parallax (pinned depth for a consistent drift).
          x: special ? width * 0.6 : Math.random() * width,
          y: special ? height * 0.25 : Math.random() * height,
          z: special ? 0.5 : Math.random(),
          // The standout star is bigger and brighter than the rest
          r: special ? 2.6 : 0.4 + Math.random() * 1.4,
          baseAlpha: special ? 1 : 0.2 + Math.random() * 0.65,
          twinkleSpeed: special ? 0.8 : 0.4 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          blue: Math.random() < 0.3,
          special,
        };
      });
    };

    const spawnComet = () => {
      // Random entry and exit edges, so the path crosses the sky at varied
      // angles — some will pass through the title, others elsewhere.
      const entry = Math.floor(Math.random() * 4);
      let exit = Math.floor(Math.random() * 4);
      if (exit === entry) exit = (exit + 2) % 4;

      const pointOnEdge = (edge: number) => {
        if (edge === 0) return { x: Math.random() * width, y: -30 };
        if (edge === 1) return { x: width + 30, y: Math.random() * height };
        if (edge === 2) return { x: Math.random() * width, y: height + 30 };
        return { x: -30, y: Math.random() * height };
      };

      const from = pointOnEdge(entry);
      const to = pointOnEdge(exit);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      const speed = 650 + Math.random() * 450;
      comet = {
        x: from.x,
        y: from.y,
        vx: (dx / len) * speed,
        vy: (dy / len) * speed,
        trail: [],
      };
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      smoothed.x += (mouse.x - smoothed.x) * 0.06;
      smoothed.y += (mouse.y - smoothed.y) * 0.06;
      const px = smoothed.x / Math.max(width, 1);
      const py = smoothed.y / Math.max(height, 1);

      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const x = s.x + px * 40 * (1 - s.z);
        const y = s.y + py * 40 * (1 - s.z);
        const alpha = reduced
          ? s.baseAlpha
          : s.baseAlpha * (0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.phase));
        ctx.globalAlpha = Math.max(0.04, alpha);
        ctx.fillStyle = s.blue ? "#b9d9f6" : "#ffffff";
        if (s.special) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 12);
          glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.5})`);
          glow.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
        }
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (reduced) return;

      if (comet) {
        comet.trail.push({ x: comet.x, y: comet.y });
        if (comet.trail.length > 30) comet.trail.shift();
        comet.x += comet.vx * dt;
        comet.y += comet.vy * dt;
        for (let i = 1; i < comet.trail.length; i++) {
          const p = comet.trail[i];
          const alpha = (i / comet.trail.length) * 0.55;
          ctx.strokeStyle = `rgba(174, 226, 255, ${alpha})`;
          ctx.lineWidth = 0.6 + (i / comet.trail.length) * 2.2;
          ctx.beginPath();
          ctx.moveTo(comet.x, comet.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        const glow = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 16);
        glow.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        glow.addColorStop(1, "rgba(174, 226, 255, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 16, 0, Math.PI * 2);
        ctx.fill();
        if (comet.x < -120 || comet.x > width + 120 || comet.y < -120 || comet.y > height + 120) {
          comet = null;
          nextCometAt = now + 8000 + Math.random() * 10000;
        }
      } else if (now > nextCometAt) {
        spawnComet();
      }
    };

    const loop = (now: number) => {
      draw(now);
      if (!reduced) raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      resize();
      if (reduced) draw(performance.now());
    };

    const onMouse = (e: MouseEvent) => {
      const c = canvas.getBoundingClientRect();
      mouse.x = e.clientX - c.left;
      mouse.y = e.clientY - c.top;
    };

    resize();
    nextCometAt = performance.now() + 5000 + Math.random() * 5000;
    const ro = new ResizeObserver(onResize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener("mousemove", onMouse, { passive: true });
    last = performance.now();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    />
  );
}
