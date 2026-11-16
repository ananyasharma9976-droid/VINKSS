import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  Variants,
} from 'motion/react';
import { ReactNode, useRef } from 'react';

export type ScrollRevealDirection = 'up' | 'fade-in-up' | 'left' | 'right' | 'flip' | 'depth';

interface ScrollReveal3DProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: ScrollRevealDirection;
  stagger?: boolean;
  staggerInterval?: number;
  delayChildren?: number;
}

// Smooth GPU-composited exponential-out easing (avoids rubbery spring wobble & z-clipping jank)
const SMOOTH_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ScrollReveal3D({
  children,
  className = '',
  delay = 0,
  direction = 'fade-in-up',
  stagger = false,
  staggerInterval = 0.075,
  delayChildren = 0.06,
}: ScrollReveal3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.12,
  });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialState = {
    up: { opacity: 0, x: 0, y: 24, rotateX: 6, rotateY: 0, scale: 0.985 },
    'fade-in-up': { opacity: 0, x: 0, y: 28, rotateX: 5, rotateY: 0, scale: 0.985 },
    left: { opacity: 0, x: -20, y: 14, rotateX: 3, rotateY: 7, scale: 0.985 },
    right: { opacity: 0, x: 20, y: 14, rotateX: 3, rotateY: -7, scale: 0.985 },
    flip: { opacity: 0, x: 0, y: 18, rotateX: 10, rotateY: 0, scale: 0.975 },
    depth: { opacity: 0, x: 0, y: 24, rotateX: 7, rotateY: 0, scale: 0.97 },
  }[direction];

  const revealedState = {
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  };

  if (stagger) {
    const containerVariants: Variants = {
      hidden: initialState,
      visible: {
        ...revealedState,
        transition: {
          duration: 0.52,
          delay,
          ease: SMOOTH_EASE,
          when: 'beforeChildren',
          staggerChildren: staggerInterval,
          delayChildren: delay + delayChildren,
        },
      },
    };

    return (
      <div ref={containerRef} style={{ perspective: '1000px' }} className={className}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="h-full will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ perspective: '1000px' }} className={className}>
      <motion.div
        initial={initialState}
        animate={isInView ? revealedState : initialState}
        transition={{
          duration: 0.58,
          delay,
          ease: SMOOTH_EASE,
        }}
        className="h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

export type StaggerItemKind = 'text' | 'media' | 'action';

interface ScrollReveal3DItemProps {
  children: ReactNode;
  className?: string;
  kind?: StaggerItemKind;
}

const ITEM_VARIANTS: Record<StaggerItemKind, Variants> = {
  text: {
    hidden: { opacity: 0, y: 14, rotateX: 5 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.48, ease: SMOOTH_EASE },
    },
  },
  media: {
    hidden: { opacity: 0, y: 12, scale: 0.93, rotateY: 7 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.56, ease: SMOOTH_EASE },
    },
  },
  action: {
    hidden: { opacity: 0, y: 10, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.44, ease: SMOOTH_EASE },
    },
  },
};

export function ScrollReveal3DItem({
  children,
  className = '',
  kind = 'text',
}: ScrollReveal3DItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={ITEM_VARIANTS[kind]}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxFloatProps {
  children: ReactNode;
  className?: string;
  offsetY?: number;
}

export function ParallaxFloat({
  children,
  className = '',
  offsetY = 18,
}: ParallaxFloatProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offsetY, -offsetY]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
