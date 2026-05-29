"use client";
import type { Member } from "@/data/members";

interface Props {
  member: Member | null;
  onClose: () => void;
}

export default function CongratsOverlay({ member, onClose }: Props) {
  if (!member) return null;

  return (
    <div className={`congrats-overlay ${member ? "active" : ""}`} onClick={onClose}>
      <div className="congrats-rays" aria-hidden />
      <div className="congrats-content" onClick={(e) => e.stopPropagation()}>
        <div className="congrats-medal" aria-hidden>
          {member.photoUrl ? (
            <div className="congrats-photo-wrap">
              <img src={member.photoUrl} alt={member.name} className="congrats-photo-img" />
              <svg className="congrats-photo-ring" viewBox="0 0 100 100" width="140" height="140">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e8d8c0" />
                    <stop offset="50%" stopColor="#c9b59c" />
                    <stop offset="100%" stopColor="#a89072" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="none" stroke="url(#ringGrad)" strokeWidth="2" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#fff8e7" strokeWidth="0.5" opacity="0.5" strokeDasharray="2 4" />
              </svg>
            </div>
          ) : (
            <svg viewBox="0 0 100 100" width="120" height="120">
              <defs>
                <linearGradient id="medalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8d8c0" />
                  <stop offset="50%" stopColor="#c9b59c" />
                  <stop offset="100%" stopColor="#a89072" />
                </linearGradient>
                <radialGradient id="medalShine">
                  <stop offset="0%" stopColor="#fff8e7" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#fff8e7" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="url(#medalGrad)" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#fff8e7" strokeWidth="0.5" opacity="0.5" />
              <circle cx="50" cy="50" r="42" fill="url(#medalShine)" />
              <text x="50" y="58" textAnchor="middle" fontSize="22" fill="#3a2e22" fontFamily="'Cinzel', serif" fontWeight="700">★</text>
              <text x="50" y="76" textAnchor="middle" fontSize="6" fill="#3a2e22" letterSpacing="2" fontFamily="'Cinzel', serif">2026</text>
            </svg>
          )}
        </div>
        <div className="congrats-title">CONGRATS!</div>
        <div className="congrats-name">
          {member.name}, <span className="congrats-degree-inline">{member.degree}</span>
        </div>
        <div className="congrats-degree">
          {member.type === "skripsi"
            ? "Berhasil Meraih Gelar Sarjana Komputer"
            : "Berhasil Meraih Gelar Sarjana Komputer"}
        </div>
        <div className="congrats-divider">
          <span>✦</span>
        </div>
        <p className="congrats-message">
          {member.type === "skripsi"
            ? "Sebuah pencapaian luar biasa, semoga ilmu yang diperoleh menjadi berkah dan bermanfaat."
            : "Sebuah pencapaian luar biasa, semoga ilmu yang diperoleh menjadi berkah dan bermanfaat."}
        </p>
        <button className="congrats-close" onClick={onClose}>
          TUTUP
        </button>
      </div>
    </div>
  );
}
