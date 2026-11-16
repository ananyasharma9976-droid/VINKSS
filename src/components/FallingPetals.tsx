import type { CSSProperties } from 'react';

interface PetalSpec {
  left: string;
  size: number;
  duration: string;
  delay: string;
  sway: string;
  opacity: number;
  color: string;
}

// Lightweight 8-petal GPU-composited array so scroll stays silky at 60fps
const PETALS: PetalSpec[] = [
  { left: '7%', size: 12, duration: '17s', delay: '-2s', sway: '24px', opacity: 0.34, color: '#D9822B' },
  { left: '19%', size: 11, duration: '21s', delay: '-8s', sway: '-22px', opacity: 0.28, color: '#9E2A22' },
  { left: '33%', size: 13, duration: '19s', delay: '-13s', sway: '28px', opacity: 0.3, color: '#C99B3B' },
  { left: '48%', size: 10, duration: '23s', delay: '-5s', sway: '-18px', opacity: 0.25, color: '#D9822B' },
  { left: '62%', size: 12, duration: '18s', delay: '-11s', sway: '22px', opacity: 0.3, color: '#9E2A22' },
  { left: '75%', size: 13, duration: '22s', delay: '-16s', sway: '-26px', opacity: 0.28, color: '#C99B3B' },
  { left: '86%', size: 11, duration: '20s', delay: '-7s', sway: '20px', opacity: 0.32, color: '#D9822B' },
  { left: '94%', size: 10, duration: '24s', delay: '-14s', sway: '-20px', opacity: 0.26, color: '#C99B3B' },
];

export function FallingPetals() {
  return (
    <div className="falling-petals-layer" aria-hidden="true">
      {PETALS.map((petal, idx) => {
        const style = {
          left: petal.left,
          '--petal-duration': petal.duration,
          '--petal-delay': petal.delay,
          '--petal-sway': petal.sway,
          '--petal-opacity': petal.opacity,
        } as CSSProperties;

        return (
          <svg
            key={idx}
            width={petal.size}
            height={petal.size}
            viewBox="0 0 20 20"
            fill="none"
            className="petal-item"
            style={style}
          >
            <path
              d="M10 1.5C13.8 4.8 16 8.8 14.5 13.5C13.4 16.9 11.4 18.5 10 18.5C8.6 18.5 6.6 16.9 5.5 13.5C4 8.8 6.2 4.8 10 1.5Z"
              fill={petal.color}
              fillOpacity="0.82"
            />
          </svg>
        );
      })}
    </div>
  );
}
