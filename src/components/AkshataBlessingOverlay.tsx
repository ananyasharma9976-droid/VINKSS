import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export interface BlessingPetal {
  id: number;
  leftPct: number;
  driftX: number;
  duration: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
}

interface AkshataBlessingOverlayProps {
  burstKey: number;
  petals: BlessingPetal[];
  toastVisible: boolean;
  totalBlessings: number;
}

export function AkshataBlessingOverlay({
  burstKey,
  petals,
  toastVisible,
  totalBlessings,
}: AkshataBlessingOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* Full-viewport Akshata & rose-petal shower layer */}
      {!prefersReducedMotion && petals.length > 0 && (
        <div
          key={burstKey}
          aria-hidden="true"
          className="no-print pointer-events-none fixed inset-0 z-50 overflow-hidden"
        >
          {petals.map((p) => (
            <motion.span
              key={p.id}
              initial={{
                y: -24,
                x: 0,
                opacity: 0.95,
                rotate: p.rotation,
                scale: 0.9,
              }}
              animate={{
                y: '105vh',
                x: p.driftX,
                opacity: [0.95, 1, 0.85, 0],
                rotate: p.rotation + 320,
                scale: [0.9, 1.08, 0.95],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'fixed',
                left: `${p.leftPct}%`,
                top: 0,
                width: `${p.size}px`,
                height: `${Math.round(p.size * 0.65)}px`,
                backgroundColor: p.color,
                borderRadius: '60% 40% 65% 35%',
                boxShadow: '0 1px 4px rgba(139,38,29,0.2)',
              }}
            />
          ))}
        </div>
      )}

      {/* Celebratory Blessing Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.28 }}
            role="status"
            aria-live="polite"
            className="no-print fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm z-50 bg-[#681511] border-2 border-[#d4a64a] text-[#fff8e8] px-4 py-3 shadow-[0_14px_34px_rgba(31,10,8,0.42)]"
          >
            <p className="text-xs font-semibold text-[#f7de9c]">
              <span className="font-marathi text-sm">॥ शुभमंगल सावधान ॥</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="font-royal tracking-[0.08em]">Akshata Offered</span>
            </p>
            <p className="text-xs sm:text-[13px] text-[#fff8e8]/95 mt-1">
              Your warm blessings for Vinayak &amp; Ruchi have been showered ({totalBlessings.toLocaleString()} total blessings offered).
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
