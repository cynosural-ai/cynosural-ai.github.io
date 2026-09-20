"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Graph = { points: Point[]; edges: [number, number][] };

// Applies to every pair of stars, including stars with no connecting edge.
const MIN_STAR_DISTANCE = 0.12;

function seeded(seed: string) {
  let value = 2166136261;
  for (let i = 0; i < seed.length; i++) value = Math.imul(value ^ seed.charCodeAt(i), 16777619);
  return () => ((value = Math.imul(value ^ (value >>> 13), 1274126177)) >>> 0) / 4294967296;
}

function growGraph(random: () => number): Graph {
  const count = 6 + Math.floor(random() * 3);
  const points: Point[] = [{ x: 0, y: 0 }];
  const edges: [number, number][] = [];

  // Each new node grows from an existing node, with a small chance of
  // attaching to a second nearby node. This produces organic graph shapes
  // instead of selecting from a fixed catalogue of patterns.
  for (let index = 1; index < count; index++) {
    let parent = 0;
    let point = { x: 0, y: 0 };

    // Retry until the candidate is separated from every existing star.
    for (let attempt = 0; attempt < 80; attempt++) {
      parent = Math.floor(random() * points.length);
      const source = points[parent];
      const angle = random() * Math.PI * 2;
      const distance = 0.42 + random() * 0.32;
      point = {
        x: source.x + Math.cos(angle) * distance,
        y: source.y + Math.sin(angle) * distance,
      };

      const minimumDistance =
        MIN_STAR_DISTANCE + ((random() - 0.5) * 0.04);

      if (points.every((existing) =>
        Math.hypot(point.x - existing.x, point.y - existing.y) >= minimumDistance
      )) break;
    }

    points.push(point);
    edges.push([parent, index]);

    if (index > 2 && random() < 0.22) {
      const candidate = Math.floor(random() * index);
      if (candidate !== parent) edges.push([candidate, index]);
    }
  }

  const max = Math.max(...points.map((point) => Math.hypot(point.x, point.y)), 1);
  points.forEach((point) => { point.x /= max; point.y /= max; });

  // Recenter after generation so branching asymmetry does not shift the
  // constellation away from the canvas center.
  const center = points.reduce(
    (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }),
    { x: 0, y: 0 },
  );
  center.x /= points.length;
  center.y /= points.length;
  points.forEach((point) => {
    point.x -= center.x;
    point.y -= center.y;
  });

  return { points, edges };
}

export function Constellation({ seed = "constellation", className = "", verticalJitter = 0, size = 1, geometrySize = size, starSize = size }: { seed?: string; className?: string; verticalJitter?: number; size?: number; geometrySize?: number; starSize?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const random = seeded(seed);
    const graph = growGraph(random);
    const angle = (random() * Math.PI * 2) + Number(seed.length) * .01;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const verticalShift = (random() - .5) * verticalJitter;
    const offsets = graph.points.map(() => ({ x: (random() - .5) * .08, y: (random() - .5) * .08 }));
    const stars = graph.points.map((_, index) => ({
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
    // Keep the existing responsive sizing relationship, but make both
    // constellations three times larger in their available area.
    const scale = Math.min(width, height) * (width > 500 ? .23 : .21) * geometrySize * 2;
      const points = graph.points.map(({ x, y }, index) => {
        const px = (x + offsets[index].x) * scale, py = (y + offsets[index].y) * scale;
        return { x: width / 2 + px * cos - py * sin, y: height / 2 + px * sin + py * cos + verticalShift, ...stars[index] };
      });
      context.lineCap = "round";
      graph.edges.forEach(([a, b]) => {
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
