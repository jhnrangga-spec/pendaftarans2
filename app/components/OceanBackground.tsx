"use client";

import { useEffect, useRef } from "react";

export default function OceanBackground() {
  const bubblesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = bubblesRef.current;
    if (!container) return;

    const bubbleData = [
      { size: 8, left: 10, delay: 0, duration: 12 },
      { size: 14, left: 20, delay: 2, duration: 15 },
      { size: 6, left: 35, delay: 4, duration: 10 },
      { size: 18, left: 50, delay: 1, duration: 18 },
      { size: 10, left: 65, delay: 6, duration: 13 },
      { size: 7, left: 75, delay: 3, duration: 11 },
      { size: 12, left: 85, delay: 5, duration: 16 },
      { size: 5, left: 90, delay: 7, duration: 9 },
      { size: 16, left: 45, delay: 8, duration: 20 },
      { size: 9, left: 28, delay: 9, duration: 14 },
    ];

    bubbleData.forEach(({ size, left, delay, duration }) => {
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `;
      container.appendChild(bubble);
    });

    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <>
      <div className="ocean-bg" />
      <div className="bubbles" ref={bubblesRef} />
    </>
  );
}
