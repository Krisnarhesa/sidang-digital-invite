"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface Props {
  active: boolean;
  variant?: number;
}

export default function CelebrationEffect({ active, variant = 0 }: Props) {
  useEffect(() => {
    if (!active) return;

    const presets = [
      runFireworks,
      runRealistic,
      runStarsBurst,
      runGoldenRain,
      runHeartBurst,
      runCrownBurst,
    ];
    const fn = presets[variant % presets.length];
    fn();
  }, [active, variant]);

  return null;
}

const PALETTE = ["#c9b59c", "#a89072", "#d4af37", "#f0e0c8", "#e8d8c0", "#b8a082", "#fff8e7", "#f9f8f6"];

function runFireworks() {
  const duration = 2500;
  const end = Date.now() + duration;
  const interval = window.setInterval(() => {
    if (Date.now() > end) return clearInterval(interval);
    const particleCount = 50;
    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: { x: Math.random(), y: Math.random() * 0.4 + 0.1 },
      colors: PALETTE,
      gravity: 0.8,
      scalar: 1.1,
      shapes: ["circle", "square"],
    });
  }, 250);
}

function runRealistic() {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, colors: PALETTE };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

function runStarsBurst() {
  const defaults = {
    spread: 360,
    ticks: 80,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: PALETTE,
    shapes: ["star" as const],
  };

  function shoot() {
    confetti({ ...defaults, particleCount: 40, scalar: 1.2 });
    confetti({ ...defaults, particleCount: 10, scalar: 0.75 });
  }
  shoot();
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

function runGoldenRain() {
  const end = Date.now() + 2500;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.4 },
      colors: PALETTE,
      gravity: 1,
      scalar: 1.1,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.4 },
      colors: PALETTE,
      gravity: 1,
      scalar: 1.1,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function runHeartBurst() {
  const heart = confetti.shapeFromText({ text: "✦", scalar: 2.5 });
  const sparkle = confetti.shapeFromText({ text: "❀", scalar: 2 });

  confetti({
    particleCount: 60,
    spread: 100,
    origin: { y: 0.6 },
    shapes: [heart, sparkle],
    scalar: 2,
    colors: PALETTE,
    gravity: 0.6,
  });

  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 160,
      origin: { y: 0.5 },
      colors: PALETTE,
      shapes: ["circle"],
      scalar: 1,
    });
  }, 250);
}

function runCrownBurst() {
  const crown = confetti.shapeFromText({ text: "♛", scalar: 2.5 });
  const star = confetti.shapeFromText({ text: "✧", scalar: 2 });

  const end = Date.now() + 1800;
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 90,
      spread: 360,
      startVelocity: 40,
      origin: { x: 0.5, y: 0.5 },
      shapes: [crown, star],
      scalar: 2,
      colors: PALETTE,
      gravity: 0.5,
      ticks: 200,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  confetti({
    particleCount: 150,
    spread: 360,
    origin: { y: 0.5 },
    colors: PALETTE,
    shapes: ["star", "circle"],
    scalar: 1.2,
  });
}
