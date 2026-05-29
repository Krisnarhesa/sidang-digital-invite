import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const baseProps = (size = 18, props: IconProps = {}): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...props,
});

export function CalendarIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <rect x="3" y="4.5" width="18" height="17" rx="3" />
      <path d="M3 9h18" />
      <path d="M8 2.5v4M16 2.5v4" />
      <circle cx="8" cy="14" r="0.6" fill="currentColor" />
      <circle cx="12" cy="14" r="0.6" fill="currentColor" />
      <circle cx="16" cy="14" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function ClockIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2.5" />
    </svg>
  );
}

export function PinIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9.5" r="2.6" />
    </svg>
  );
}

export function CapIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5z" />
      <path d="M6 11.2v4.5c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
      <path d="M21.5 9.5v4.5" />
    </svg>
  );
}

export function MailIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function MusicIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  );
}

export function MusicMutedIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

export function MouseScrollIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <rect x="8" y="3" width="8" height="14" rx="4" />
      <path d="M12 6.5v3" />
    </svg>
  );
}

export function StarIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="m12 3 2.5 5.5L20 9.5l-4 3.8 1 5.7-5-2.7-5 2.7 1-5.7-4-3.8 5.5-1z" />
    </svg>
  );
}

export function SparkleIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <path d="m6 6 3 3M15 15l3 3M6 18l3-3M15 9l3-3" />
    </svg>
  );
}

export function LaurelLeftIcon({ size = 80, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)} viewBox="0 0 80 120">
      <path d="M40 10 C 25 30, 18 50, 22 80 C 24 95, 30 105, 40 110" />
      <path d="M30 30 C 22 32, 18 38, 16 44" />
      <path d="M27 45 C 19 47, 15 53, 13 59" />
      <path d="M25 60 C 17 62, 13 68, 12 74" />
      <path d="M26 75 C 19 78, 15 83, 14 88" />
      <path d="M30 88 C 24 91, 21 96, 21 100" />
    </svg>
  );
}

export function LaurelRightIcon({ size = 80, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)} viewBox="0 0 80 120">
      <path d="M40 10 C 55 30, 62 50, 58 80 C 56 95, 50 105, 40 110" />
      <path d="M50 30 C 58 32, 62 38, 64 44" />
      <path d="M53 45 C 61 47, 65 53, 67 59" />
      <path d="M55 60 C 63 62, 67 68, 68 74" />
      <path d="M54 75 C 61 78, 65 83, 66 88" />
      <path d="M50 88 C 56 91, 59 96, 59 100" />
    </svg>
  );
}

export function CrownEmblem({ size = 80, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" strokeWidth="0.6" opacity="0.4" />
      <circle cx="50" cy="50" r="36" strokeWidth="0.4" strokeDasharray="2 4" opacity="0.4" />
      <path d="M30 58 L30 44 L40 50 L50 38 L60 50 L70 44 L70 58 Z" strokeWidth="1" />
      <circle cx="50" cy="38" r="1.5" fill="currentColor" />
      <circle cx="30" cy="44" r="1.2" fill="currentColor" />
      <circle cx="70" cy="44" r="1.2" fill="currentColor" />
      <path d="M30 58 L70 58" strokeWidth="1.2" />
      <text x="50" y="74" textAnchor="middle" fontSize="6" fill="currentColor" letterSpacing="2" style={{ fontFamily: "'Cinzel', serif" }}>2026</text>
    </svg>
  );
}

export function EditIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M4 20h4l10-10-4-4L4 16v4z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

export function TrashIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function LinkIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1.5 1.5" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1.5-1.5" />
    </svg>
  );
}

export function PlusIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function EyeIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function CheckIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

export function ChevronDownIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronUpIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

export function PowerIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M12 4v8" />
      <path d="M16.5 7a7 7 0 1 1-9 0" />
    </svg>
  );
}

export function CameraIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H8l1.5-2h5L16 6h2.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function GearIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

export function UsersIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17" cy="9" r="2.8" />
      <path d="M17 13.5a4.5 4.5 0 0 1 4.5 4.5" />
    </svg>
  );
}

export function SaveIcon({ size, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)}>
      <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M7 4v5h9V4" />
      <rect x="7" y="13" width="10" height="7" />
    </svg>
  );
}

export function ScrollIcon({ size = 64, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)} viewBox="0 0 64 64">
      <path d="M14 10h32a4 4 0 0 1 4 4v36a4 4 0 0 0 4 4H22a8 8 0 0 1-8-8V10z" />
      <path d="M14 10a4 4 0 0 0-4 4v4h8" />
      <path d="M22 22h22M22 30h22M22 38h16" />
      <circle cx="32" cy="48" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function QuillIcon({ size = 64, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)} viewBox="0 0 64 64">
      <path d="M52 8 C 32 12, 18 22, 12 38 L 12 52 L 26 52 C 42 46, 52 32, 56 12 Z" />
      <path d="M12 52 L 30 34" />
      <path d="M44 18 C 36 22, 28 28, 22 38" strokeWidth="0.8" opacity="0.6" />
      <path d="M48 14 C 40 18, 32 24, 26 32" strokeWidth="0.8" opacity="0.6" />
      <path d="M52 8 L 56 12" />
    </svg>
  );
}

export function CapTasselIcon({ size = 64, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)} viewBox="0 0 64 64">
      <path d="M4 24 L 32 12 L 60 24 L 32 36 Z" />
      <path d="M14 28 L 14 42 C 14 46, 22 50, 32 50 C 42 50, 50 46, 50 42 L 50 28" />
      <path d="M60 24 L 60 38" />
      <circle cx="60" cy="40" r="3" fill="currentColor" />
      <path d="M60 43 L 58 50 M60 43 L 60 51 M60 43 L 62 50" strokeWidth="1" />
    </svg>
  );
}

export function OliveBranchIcon({ size = 64, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)} viewBox="0 0 64 64">
      <path d="M32 4 C 26 18, 22 36, 24 56" />
      <ellipse cx="22" cy="14" rx="4" ry="2" transform="rotate(-30 22 14)" />
      <ellipse cx="20" cy="22" rx="4" ry="2" transform="rotate(-30 20 22)" />
      <ellipse cx="20" cy="32" rx="4" ry="2" transform="rotate(-20 20 32)" />
      <ellipse cx="20" cy="42" rx="4" ry="2" transform="rotate(-15 20 42)" />
      <ellipse cx="42" cy="14" rx="4" ry="2" transform="rotate(30 42 14)" />
      <ellipse cx="44" cy="22" rx="4" ry="2" transform="rotate(30 44 22)" />
      <ellipse cx="44" cy="32" rx="4" ry="2" transform="rotate(20 44 32)" />
      <ellipse cx="44" cy="42" rx="4" ry="2" transform="rotate(15 44 42)" />
    </svg>
  );
}

export function DiamondIcon({ size = 64, ...p }: IconProps) {
  return (
    <svg {...baseProps(size, p)} viewBox="0 0 64 64">
      <path d="M16 22 L 32 6 L 48 22 L 32 56 Z" />
      <path d="M16 22 L 48 22" />
      <path d="M32 6 L 24 22 L 32 56" strokeWidth="0.8" opacity="0.6" />
      <path d="M32 6 L 40 22 L 32 56" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}
