import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface ParallaxDividerProps {
  src: string;
  imageClassName?: string;
  offsetPx?: number;
  className?: string;
}

export function ParallaxDivider({
  src,
  imageClassName = 'w-8 h-8 object-contain opacity-85',
  offsetPx = 16,
  className = '',
}: ParallaxDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-offsetPx, offsetPx]
  );

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center gap-4 py-2 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px w-20 sm:w-32 bg-[#d6c9b0]" />
      <motion.img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ y }}
        className={`select-none will-change-transform ${imageClassName}`}
      />
      <span className="h-px w-20 sm:w-32 bg-[#d6c9b0]" />
    </div>
  );
}
