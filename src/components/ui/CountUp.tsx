"use client";

import { useEffect, useState, useRef } from 'react';

export default function CountUp({ end, duration = 2000 }: { end: number | string, duration?: number }) {
  const numericEnd = Number(end) || 0;
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // using easeOutQuad for a smoother stop
            const easeOutProgress = progress * (2 - progress);
            setCount(Math.floor(easeOutProgress * numericEnd));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(numericEnd);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    const currentRef = nodeRef.current;
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [numericEnd, duration, hasAnimated]);

  // Ensure we never return NaN as children
  const displayCount = isNaN(count) ? 0 : count;

  return <span ref={nodeRef}>{displayCount}</span>;
}
