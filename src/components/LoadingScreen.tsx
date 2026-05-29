"use client";
import { useState, useEffect } from "react";

interface Props {
  onEnter: () => void;
  guestName?: string;
}

export default function LoadingScreen({ onEnter, guestName }: Props) {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        onEnter();
      });
    } else {
      setHidden(true);
      setTimeout(onEnter, 800);
    }
  };

  if (hidden) {
    return <div className="loading-screen hidden"><div className="loading-content" /></div>;
  }

  return (
    <div className="loading-screen with-cover">
      <div className="loading-cover-bg" aria-hidden />
      <div className="loading-cover-veil" aria-hidden />
      <div className="loading-content">
        <div className="loading-emblem-wrap">
          <div className="logo-circle">
            <img src="/logo_hmti.png" alt="HMTI Udayana" className="loading-logo-img" />
          </div>
        </div>
        {guestName ? (
          <div className="loading-org-label personalized">
            <span className="for-prefix">Untuk</span>
            <span className="for-name">{guestName}</span>
          </div>
        ) : (
          <div className="loading-org-label">Undangan Digital</div>
        )}
        {!ready && (
          <div className="loading-text">
            <span className="bracket">✦</span>
            <span>MEMUAT UNDANGAN</span>
            <span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
            <span className="bracket">✦</span>
          </div>
        )}
        {ready && (
          <>
            <button className="enter-btn" onClick={handleEnter}>
              <span className="btn-glitch">Buka Undangan</span>
            </button>
            <p className="loading-hint">Klik untuk membuka undangan digital</p>
          </>
        )}
      </div>
    </div>
  );
}
