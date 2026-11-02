'use client';

import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '@/lib/motion';

const COLORS = ['#2EF5B0', '#26C6FF', '#8B5CF6', '#E8F1FF'];
const POOL = 60;
const LIFE = 700; // ms
const SPAWN_EVERY_PX = 14;
const INTERACTIVE = 'a, button, summary, [role="tab"], [role="radio"], [data-cursor]';

interface Star {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  born: number;
  color: string;
  rot: number;
}

function drawStar(ctx: CanvasRenderingContext2D, s: Star, t: number) {
  const k = 1 - t; // 1 → 0
  const r = s.size * (0.6 + 0.4 * k);
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.rot);
  ctx.globalAlpha = k * k;
  ctx.fillStyle = s.color;
  ctx.shadowColor = s.color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  // estrella de 4 puntas con lados cóncavos
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.quadraticCurveTo(0, 0, 0, r);
  ctx.quadraticCurveTo(0, 0, -r, 0);
  ctx.quadraticCurveTo(0, 0, 0, -r);
  ctx.fill();
  ctx.restore();
}

function StarCursorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    document.documentElement.classList.add('has-star-cursor');

    const stars: Star[] = Array.from({ length: POOL }, () => ({
      alive: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      born: 0,
      color: COLORS[0],
      rot: 0,
    }));
    let next = 0;
    let raf = 0;
    let running = false;
    let last = { x: -1, y: -1 };
    let mouse = { x: -100, y: -100 };
    let ringPos = { x: -100, y: -100 };
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (x: number, y: number, now: number) => {
      const s = stars[next];
      next = (next + 1) % POOL;
      s.alive = true;
      s.x = x + (Math.random() - 0.5) * 6;
      s.y = y + (Math.random() - 0.5) * 6;
      s.vx = (Math.random() - 0.5) * 0.04;
      s.vy = 0.01 + Math.random() * 0.03;
      s.size = 2 + Math.random() * 4;
      s.born = now;
      s.color = COLORS[(Math.random() * COLORS.length) | 0];
      s.rot = Math.random() * Math.PI;
    };

    let prev = performance.now();
    const frame = (now: number) => {
      const dt = now - prev;
      prev = now;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      let alive = 0;
      for (const s of stars) {
        if (!s.alive) continue;
        const t = (now - s.born) / LIFE;
        if (t >= 1) {
          s.alive = false;
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        drawStar(ctx, s, t);
        alive++;
      }
      ringPos.x += (mouse.x - ringPos.x) * 0.2;
      ringPos.y += (mouse.y - ringPos.y) * 0.2;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      const settled = Math.abs(mouse.x - ringPos.x) + Math.abs(mouse.y - ringPos.y) < 0.5;
      if (alive > 0 || !settled) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (last.x < 0) {
        last = { ...mouse };
        ringPos = { ...mouse };
      }
      const dist = Math.hypot(mouse.x - last.x, mouse.y - last.y);
      if (dist >= SPAWN_EVERY_PX) {
        const now = performance.now();
        const n = Math.min(3, Math.floor(dist / SPAWN_EVERY_PX));
        for (let i = 0; i < n; i++) spawn(mouse.x, mouse.y, now);
        last = { ...mouse };
      }
      kick();
    };
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      ring.dataset.hover = el?.closest?.(INTERACTIVE) ? 'true' : 'false';
    };
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('resize', resize);
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.documentElement.addEventListener('pointerenter', onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('resize', resize);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeEventListener('pointerenter', onEnter);
      document.documentElement.classList.remove('has-star-cursor');
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="star-cursor__canvas"
        aria-hidden="true"
        data-testid="star-cursor"
      />
      <div ref={dotRef} className="star-cursor__dot" aria-hidden="true" />
      <div ref={ringRef} className="star-cursor__ring" aria-hidden="true" />
    </>
  );
}

/** Rastro de estrellas + cursor punto/anillo. Solo con ratón y sin "reducir movimiento". */
export function StarCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  if (!fine || reduced) return null;
  return <StarCursorCanvas />;
}
