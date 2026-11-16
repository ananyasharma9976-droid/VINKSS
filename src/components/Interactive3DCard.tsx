import { useReducedMotion } from 'motion/react';
import { PointerEvent, ReactNode, useEffect, useRef } from 'react';

interface Interactive3DCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  disabled?: boolean;
}

// GPU-only rAF-throttled 3D card tilt + specular sheen (zero CSS radial-gradient repaints)
export function Interactive3DCard({
  children,
  className = '',
  maxTilt = 4.5,
  disabled = false,
}: Interactive3DCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ rx: 0, ry: 0, sx: 0, sy: 0, active: false });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (prefersReducedMotion || disabled) {
    return <div className={`h-full ${className}`}>{children}</div>;
  }

  const flushTransform = () => {
    rafRef.current = null;
    const card = cardRef.current;
    const sheen = sheenRef.current;
    const { rx, ry, sx, sy, active } = targetRef.current;
    if (card) {
      card.style.transform = active
        ? `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translate3d(0, -2px, 0)`
        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
    }
    if (sheen) {
      sheen.style.opacity = active ? '0.55' : '0';
      sheen.style.transform = `translate3d(${sx.toFixed(1)}%, ${sy.toFixed(1)}%, 0)`;
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    targetRef.current = {
      rx: -ny * maxTilt * 2,
      ry: nx * maxTilt * 2,
      sx: nx * 36,
      sy: ny * 36,
      active: true,
    };

    if (rafRef.current === null) {
      rafRef.current = window.requestAnimationFrame(flushTransform);
    }
  };

  const handlePointerLeave = () => {
    targetRef.current = { rx: 0, ry: 0, sx: 0, sy: 0, active: false };
    if (rafRef.current === null) {
      rafRef.current = window.requestAnimationFrame(flushTransform);
    }
  };

  return (
    <div className="h-full">
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative h-full overflow-hidden will-change-transform ${className}`}
      >
        {children}
        <div
          ref={sheenRef}
          aria-hidden="true"
          style={{
            opacity: 0,
            transition: 'opacity 220ms ease-out, transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
            background:
              'linear-gradient(125deg, transparent 25%, rgba(247, 222, 156, 0.22) 50%, transparent 75%)',
          }}
          className="pointer-events-none absolute -inset-12 z-10 will-change-transform"
        />
      </div>
    </div>
  );
}
