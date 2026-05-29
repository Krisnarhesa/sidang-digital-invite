"use client";
import { useState } from "react";
import type { Member } from "@/data/members";

interface Props {
  member: Member;
  onReveal: (member: Member) => void;
}

export default function DegreeRevealCard({ member, onReveal }: Props) {
  const [revealed, setRevealed] = useState(false);

  const handleClick = () => {
    if (revealed) return;
    setRevealed(true);
    onReveal(member);
  };

  return (
    <div className="reveal-card">
      <div className="reveal-photo">
        <div className="reveal-photo-inner">
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.name} className="reveal-photo-img" />
          ) : (
            <span className="reveal-photo-emoji">{member.emoji}</span>
          )}
        </div>
      </div>
      <div className="reveal-name-container">
        <span className="reveal-name-text">{member.name}</span>
        {!revealed && " "}
        <span
          className={`degree-plester ${revealed ? "revealed" : ""}`}
          onClick={handleClick}
          title={revealed ? "" : "Klik untuk melepas plester!"}
        >
          <span className="degree-text">{revealed ? ", " : ""}{member.degree}</span>
          {!revealed && (
            <span className="plester-label">▶ KLIK UNTUK BUKA</span>
          )}
        </span>
      </div>
      <div className="member-nim">NIM: {member.nim}</div>
      <div className="reveal-judul">&ldquo;{member.topic}&rdquo;</div>
      <span className={`member-badge ${member.type === "skripsi" ? "badge-skripsi" : "badge-proposal"}`}>
        {member.type === "skripsi" ? "SIDANG SKRIPSI" : "SEMINAR PROPOSAL"}
      </span>
    </div>
  );
}
