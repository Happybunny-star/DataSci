"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type Attributes,
  type CSSProperties,
  type ReactElement,
  type Ref,
} from "react";

type MagneticChildProps = {
  style?: CSSProperties;
};

type MagneticProps = {
  /** A single button/link element — it gets a ref and an inline transform. */
  children: ReactElement<MagneticChildProps>;
  /** 0..1 — how far the element travels relative to the cursor offset. */
  strength?: number;
  /** Extra pull radius (px) beyond the element's own edges. */
  radius?: number;
};

/**
 * Wraps a single interactive element (button/link) and gently pulls it
 * toward the cursor as the pointer nears it, springing back on mouseleave.
 * No-ops on touch devices and with reduced-motion preferences.
 */
export default function Magnetic({ children, strength = 0.35, radius = 50 }: MagneticProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!el) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduceMotion) return;

    let frameId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const maxDist = Math.max(rect.width, rect.height) / 2 + radius;

      if (Math.hypot(dx, dy) < maxDist) {
        targetX = dx * strength;
        targetY = dy * strength;
      } else {
        targetX = 0;
        targetY = 0;
      }
    }

    function reset() {
      targetX = 0;
      targetY = 0;
    }

    function tick() {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      el!.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      frameId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", reset);
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
      cancelAnimationFrame(frameId);
      el.style.transform = "";
    };
  }, [el, strength, radius]);

  if (!isValidElement(children)) return children;

  const cloneProps: Partial<MagneticChildProps> & Attributes & { ref?: Ref<HTMLElement> } = {
    ref: setEl,
    style: { ...children.props.style, willChange: "transform" },
  };

  return cloneElement(children, cloneProps);
}

