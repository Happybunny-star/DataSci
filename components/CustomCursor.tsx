"use client";

import { useEffect, useRef } from "react";

// Elements that should show the "hover" ring state (clickable things).
const HOVER_SELECTOR =
  'a, button, [role="button"], input[type="submit"], input[type="button"], label[for], .cursor-hover';

// Elements where we defer to the browser's native text caret instead of
// drawing our dot/ring on top of it.
const TEXT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

/**
 * A tiny, high-precision dot glued to the real pointer position, paired
 * with a larger ring that eases toward it a frame behind. The ring grows
 * over links/buttons and disappears over form fields so the native text
 * caret still shows there.
 *
 * No-ops entirely on touch devices and when the visitor has asked for
 * reduced motion — the OS cursor is left alone in both cases.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduceMotion) return;

    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    if (!dotEl || !ringEl) return;
    const dot: HTMLDivElement = dotEl;
    const ring: HTMLDivElement = ringEl;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;
    let overText = false;

    function setVisible(visible: boolean) {
      dot.style.opacity = visible && !overText ? "1" : "0";
      ring.style.opacity = visible ? "1" : "0";
    }

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      setVisible(true);
    }

    function onOver(e: MouseEvent) {
      const target = e.target as Element | null;
      overText = !!target?.closest(TEXT_SELECTOR);
      const isHoverTarget = !overText && !!target?.closest(HOVER_SELECTOR);
      ring.dataset.state = isHoverTarget ? "hover" : overText ? "text" : "";
      dot.style.opacity = overText ? "0" : "1";
    }

    function onWindowLeave() {
      setVisible(false);
    }

    function tick() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onWindowLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onWindowLeave);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
