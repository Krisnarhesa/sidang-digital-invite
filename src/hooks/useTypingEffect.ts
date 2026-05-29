"use client";
import { useState, useEffect } from "react";

export function useTypingEffect(texts: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout: NodeJS.Timeout;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((textIdx + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return display;
}
