"use client";
import { useRef, useState, useEffect } from "react";

const AUDIO_SOURCES = [
  "/audio/sidang-music.mp3",
  "https://cdn.pixabay.com/audio/2024/02/05/audio_7c3a09bbcf.mp3",
  "https://cdn.pixabay.com/audio/2024/11/28/audio_3e3d8e9e0c.mp3",
];

export default function AudioPlayer({ autoPlay }: { autoPlay: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play().then(() => {
        setMuted(false);
      }).catch(() => {
        setMuted(true);
      });
    }
  }, [autoPlay]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (muted) {
      a.play().catch(() => {});
      setMuted(false);
    } else {
      a.pause();
      setMuted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        {AUDIO_SOURCES.map((src) => (
          <source key={src} src={src} type="audio/mpeg" />
        ))}
      </audio>
      <button
        className={`audio-toggle ${muted ? "muted" : ""}`}
        onClick={toggle}
        aria-label="Toggle Music"
      >
        <span className="audio-icon playing">♪</span>
        <span className="audio-icon muted">♪̸</span>
        <span className="audio-pulse" />
      </button>
    </>
  );
}
