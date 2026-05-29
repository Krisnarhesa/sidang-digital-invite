"use client";
import { useEffect, useRef, useCallback } from "react";

interface ConfettiPiece {
  x: number; y: number; vx: number; vy: number;
  size: number; color: string; rotation: number; rotationSpeed: number;
  shape: "rect" | "circle" | "star";
  gravity: number; opacity: number;
}

export default function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const animRef = useRef<number>(0);

  const colors = ["#c9b59c", "#a89072", "#d9cfc7", "#efe9e3", "#e8d8c0", "#b8a082", "#d4af37", "#f0e0c8"];

  const launch = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 200; i++) {
      const shapes: ("rect" | "circle" | "star")[] = ["rect", "circle", "star"];
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 400,
        y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 15,
        vy: -(Math.random() * 18 + 8),
        size: Math.random() * 10 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: shapes[Math.floor(Math.random() * 3)],
        gravity: 0.15 + Math.random() * 0.1,
        opacity: 1,
      });
    }
    piecesRef.current = pieces;
  }, []);

  useEffect(() => {
    if (!active) return;
    launch();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pieces = piecesRef.current;
      let alive = false;

      pieces.forEach((p) => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.99;
        if (p.y > canvas.height + 50) { p.opacity -= 0.02; }
        if (p.opacity <= 0) return;
        alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = j === 0 ? p.size : p.size;
            const method = j === 0 ? "moveTo" : "lineTo";
            ctx[method](Math.cos(angle) * r * 0.5, Math.sin(angle) * r * 0.5);
            const innerAngle = angle + (2 * Math.PI) / 10;
            ctx.lineTo(Math.cos(innerAngle) * r * 0.2, Math.sin(innerAngle) * r * 0.2);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      if (alive) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [active, launch]);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}
