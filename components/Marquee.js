"use client";
import { useContext, useEffect, useRef, useState } from 'react';
import BrandContext from '../lib/BrandContext';

export default function Marquee({ message }) {
  const brand = useContext(BrandContext);
  const text = message || (brand?.siteName ? `Celebrate Every Occasion in Kerala's purest Elegance` : "Celebrate Every Occasion in Kerala's purest Elegance");

  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // do not auto-run animation

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRunning(true);
          } else {
            setRunning(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="marquee-container" aria-hidden={false}>
      <div ref={trackRef} className={`marquee-track ${running ? 'running' : 'paused'}`}>
        <span className="marquee-item">{text}</span>
      </div>
    </div>
  );
}
