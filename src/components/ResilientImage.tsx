import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  priority?: boolean;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'Sacred Motif',
  priority = false,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center border border-[#d6c9b0] bg-[#f3efe6] text-[#7a684a] p-4 ${className}`}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          aria-hidden="true"
          className="mb-1.5"
        >
          <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1" />
          <path
            d="M18 8C20.5 12 20.5 16 18 20C15.5 16 15.5 12 18 8Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M18 20C22 18.5 25 16 27 13C24.5 17.5 22 20.5 18 22C14 20.5 11.5 17.5 9 13C11 16 14 18.5 18 20Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        <span className="text-xs tracking-wider font-display italic">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
