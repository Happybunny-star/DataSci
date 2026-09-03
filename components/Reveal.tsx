"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms — pass i * 100 across a list of siblings. */
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts its children into place the first time they scroll into
 * view (a plain CSS transition driven by an IntersectionObserver, not the
 * still-unevenly-supported CSS scroll-timeline spec). Fires once, then
 * disconnects. Reduced-motion visitors just get the content, fully visible,
 * with no animation — see the .reveal rules in globals.css.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion visitors don't need JS at all here — the .reveal rules
    // in globals.css force opacity:1/no-transition regardless of the
    // is-visible class, so this observer is a harmless no-op for them.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <div ref={ref} style={style} className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}

