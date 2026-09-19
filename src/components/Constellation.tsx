"use client";

import { useEffect, useRef } from "react";

type Point = [number, number];
type Pattern = { points: Point[]; edges: [number, number][] };

const patterns: Pattern[] = [
  { points: [[-1,.2],[-.5,-.15],[0,.05],[.48,-.28],[1,.1]], edges: [[0,1],[1,2],[2,3],[3,4]] },
  { points: [[-1,-.35],[-.55,.45],[-.1,-.25],[.45,.5],[1,-.2]], edges: [[0,1],[1,2],[2,3],[3,4]] },
  { points: [[-1,.4],[-.68,-.05],[-.28,-.38],[.2,-.42],[.66,-.1],[1,.38]], edges: [[0,1],[1,2],[2,3],[3,4],[4,5]] },
  { points: [[-1,.1],[-.7,-.35],[-.32,.3],[.02,-.28],[.38,.35],[.72,-.2],[1,.2]], edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]] },
  { points: [[-1,-.45],[-.52,-.08],[0,.48],[.48,-.02],[1,-.38]], edges: [[0,1],[1,2],[2,3],[3,4]] },
  { points: [[0,.05],[-.85,-.7],[-.35,-.25],[.72,-.72],[.32,-.24],[0,.9]], edges: [[0,2],[2,4],[4,3],[0,5],[0,1]] },
  { points: [[0,-.75],[.72,-.25],[.5,.65],[-.45,.72],[-.8,-.12]], edges: [[0,1],[1,2],[2,3],[3,4],[4,0]] },
  { points: [[-.6,-.75],[-.6,0],[-.6,.75],[.6,-.75],[.6,0],[.6,.75]], edges: [[0,1],[1,2],[3,4],[4,5],[0,3],[1,4],[2,5]] },
  { points: [[-.55,0],[-.1,-.55],[.45,0],[-.08,.55],[.82,.12],[1,.45]], edges: [[0,1],[1,2],[2,3],[3,0],[2,4],[4,5]] },
  { points: [[-.95,.12],[-.5,-.52],[.02,-.18],[.42,-.68],[.82,-.08],[.55,.6],[-.1,.7]], edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,2],[2,4]] },
];

function seeded(seed: string) {
  let value = 2166136261;
  for (let i = 0; i < seed.length; i++) value = Math.imul(value ^ seed.charCodeAt(i), 16777619);
  return () => ((value = Math.imul(value ^ (value >>> 13), 1274126177)) >>> 0) / 4294967296;
}

export function Constellation({ seed = "constellation", className = "", verticalJitter = 0, size = 1, geometrySize = size, starSize = size }: { seed?: string; className?: string; verticalJitter?: number; size?: number; geometrySize?: number; starSize?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const random = seeded(seed);
    const pattern = patterns[Math.floor(random() * patterns.length)];
    const angle = (random() * Math.PI * 2) + Number(seed.length) * .01;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const verticalShift = (random() - .5) * verticalJitter;
    const offsets = pattern.points.map(() => ({ x: (random() - .5) * .08, y: (random() - .5) * .08 }));
    const stars = pattern.points.map((_, index) => ({
      bright: index === 0 || random() < .22,
      twinkleSpeed: .4 + random() * 1.4,
      phase: random() * Math.PI * 2,
    }));
    let frame = 0;

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      const height = rect.height;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr; canvas.height = height * dpr;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      const scale = Math.min(width, height) * (width > 500 ? .23 : .21) * geometrySize;
      const points = pattern.points.map(([x, y], index) => {
        const px = (x + offsets[index].x) * scale, py = (y + offsets[index].y) * scale;
        return { x: width / 2 + px * cos - py * sin, y: height / 2 + px * sin + py * cos + verticalShift, ...stars[index] };
      });
      context.lineCap = "round";
      pattern.edges.forEach(([a, b]) => {
        context.beginPath(); context.moveTo(points[a].x, points[a].y); context.lineTo(points[b].x, points[b].y);
        context.strokeStyle = "rgba(160,190,255,.30)"; context.lineWidth = 1; context.shadowColor = "rgba(100,145,255,.35)"; context.shadowBlur = 7; context.stroke();
      });
      points.forEach((point, index) => {
        const pulse = 1 + Math.sin(time * point.twinkleSpeed + point.phase) * .035;
        const radius = (1.6 + (point.bright ? 2.5 : 1) * pulse) * starSize;
        const glowRadius = (point.bright ? 22 : 13) * starSize;
        const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowRadius);
        glow.addColorStop(0, "rgba(235,243,255,.75)"); glow.addColorStop(.2, "rgba(155,185,255,.18)"); glow.addColorStop(1, "rgba(100,140,255,0)");
        context.beginPath(); context.arc(point.x, point.y, glowRadius, 0, Math.PI * 2); context.fillStyle = glow; context.fill();
        context.beginPath(); context.arc(point.x, point.y, radius, 0, Math.PI * 2); context.fillStyle = "#eef4ff"; context.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [seed]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
