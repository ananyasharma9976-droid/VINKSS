import { motion, useReducedMotion } from 'motion/react';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import { INVITATION_DATA } from '../data/invitationData';
import { ritualAudio } from '../three/ritualAudio';
import { ResilientImage } from './ResilientImage';

interface EnvelopeCoverProps {
  onOpen: () => void;
}

export function EnvelopeCover({ onOpen }: EnvelopeCoverProps) {
  const prefersReducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isOpening, setIsOpening] = useState(false);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const triggerOpen = () => {
    if (isOpening) return;
    ritualAudio.playBrassBell();
    if (prefersReducedMotion) {
      onOpen();
      return;
    }
    setIsOpening(true);
    setTilt({ rx: 0, ry: 0 });
    timerRef.current = window.setTimeout(() => {
      onOpen();
    }, 1750);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isOpening || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = window.requestAnimationFrame(() => {
      setTilt({
        rx: Number((-ny * 4.5).toFixed(2)),
        ry: Number((nx * 5.5).toFixed(2)),
      });
    });
  };

  const handlePointerLeave = () => {
    if (!isOpening) setTilt({ rx: 0, ry: 0 });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[520px] mx-auto px-1 pt-8 sm:pt-10"
      style={{ perspective: '1600px' }}
      aria-label="Sealed Wedding Invitation Envelope"
    >
      {/* Minimalist Royal Paithani Maroon & Gold 3D Envelope */}
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={
          prefersReducedMotion
            ? undefined
            : {
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
              }
        }
        className="relative bg-gradient-to-b from-[#7a1b17] via-[#661410] to-[#4b0d0a] border-2 border-[#d4a64a] shadow-[0_28px_64px_rgba(62,15,12,0.36)] p-3 sm:p-4"
      >
        {/* Envelope Outer Frame */}
        <div className="relative border border-[#d6ab56]/75 bg-[#450b09]">
          {/* Emerging Inner Ivory Patrika tucked inside pocket until flap lifts */}
          <motion.div
            aria-hidden="true"
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={
              isOpening
                ? { y: -76, opacity: 1, scale: 1 }
                : { y: 20, opacity: 0, scale: 0.96 }
            }
            transition={{
              delay: 0.58,
              duration: 0.92,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="pointer-events-none absolute inset-x-4 sm:inset-x-7 top-3 bottom-5 z-20 paper-cotton border-2 border-[#c89b44] shadow-[0_18px_36px_rgba(31,27,24,0.32)] flex flex-col items-center justify-start pt-5 px-5 text-center"
          >
            <ResilientImage
              src="/assets/aistudio/LALBAUGCHA_RAAJA_080e79d8.png"
              alt=""
              priority
              fallbackLabel="Shri Ganesh"
              className="w-14 h-auto object-contain mb-1.5"
            />
            <p className="font-marathi text-xs text-[#8b261d] font-semibold">
              ॥ श्री गणेशाय नमः ॥
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#8b261d] mt-1">
              Vinayak <span className="font-script text-[#b6791e] font-normal mx-0.5">&amp;</span> Ruchi
            </p>
            <p className="text-[11px] text-[#5c5346] mt-0.5">
              {INVITATION_DATA.muhurat.dateLabel} · {INVITATION_DATA.muhurat.timeLabel}
            </p>
          </motion.div>

          {/* 3D Hinged Top Triangular Envelope Flap (below the wax seal at z-40) */}
          <div
            className={`relative w-full ${isOpening ? 'z-10' : 'z-30'}`}
            style={{ perspective: '1400px' }}
          >
            <motion.div
              initial={{ rotateX: 0 }}
              animate={isOpening ? { rotateX: -178 } : { rotateX: 0 }}
              transition={{
                delay: 0.16,
                duration: 0.95,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full h-[140px] sm:h-[168px] pointer-events-none"
            >
              {/* Front Outer Crimson-Gold Flap */}
              <div
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  backfaceVisibility: 'hidden',
                }}
                className="absolute inset-0 bg-gradient-to-b from-[#8b261d] via-[#751a14] to-[#5d120d] flex flex-col items-center justify-start pt-5 sm:pt-6"
              >
                <p className="font-marathi text-sm sm:text-base text-[#f5dba0] font-semibold">
                  ॥ निमंत्रण ॥
                </p>
                <div className="w-16 h-px bg-[#d6ab56]/60 mt-2" />
              </div>

              {/* Inner Gold-Silk Lining Revealed as Flap Opens */}
              <div
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
                className="absolute inset-0 bg-gradient-to-b from-[#f6e3b5] via-[#ebd093] to-[#d4a64a]"
              />
            </motion.div>
          </div>

          {/* Front Pocket Body — Wax Seal sits ABOVE the upper flap at z-40 */}
          <div className="relative z-40 -mt-12 sm:-mt-14 pt-1 pb-9 sm:pb-10 px-5 sm:px-8 text-center flex flex-col items-center">
            {/* Background pocket surface at z-0 inside this block so seal at z-20 always sits IN FRONT of the upper flap */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-12 sm:top-14 bottom-0 z-0 bg-gradient-to-b from-[#6d1713] via-[#5e120e] to-[#4e0e0b] border-t border-[#d6ab56]/40"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#f1d17c]/70 z-10"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#f1d17c]/70 z-10"
            />

            {/* Central Crimson & Gold Lotus Wax Seal Crest sitting cleanly OVER the upper flap tip */}
            <motion.button
              type="button"
              onClick={triggerOpen}
              animate={
                isOpening
                  ? { scale: 0.72, y: -16, opacity: 0 }
                  : { scale: 1, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Break wax seal and open wedding invitation"
              className="group relative z-20 inline-flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5dba0]"
            >
              <ResilientImage
                src="/assets/images/wax_seal_crest.png"
                alt="Crimson and gold lotus wax seal"
                priority
                fallbackLabel="V & R Seal"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95 drop-shadow-[0_14px_22px_rgba(0,0,0,0.48)]"
              />
            </motion.button>

            <motion.div
              animate={isOpening ? { opacity: 0.4 } : { opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex flex-col items-center"
            >
              <p className="font-royal mt-3 text-[11px] tracking-[0.22em] uppercase text-[#e6c37a]/95 font-medium">
                Shubhamangal Patrika
              </p>

              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#fff7e6] mt-1.5 text-balance">
                Vinayak <span className="font-script text-[#f1d17c] font-normal mx-1 text-4xl sm:text-5xl">&amp;</span> Ruchi
              </h1>

              <p className="text-xs sm:text-sm text-[#f3dfb1]/90 mt-2 tracking-wide">
                24 November 2026 <span className="mx-1.5 text-[#d4a64a]">·</span> Mumbai
              </p>

              <button
                type="button"
                onClick={triggerOpen}
                disabled={isOpening}
                className="font-royal mt-6 inline-flex items-center justify-center min-h-[44px] px-8 py-2.5 bg-gradient-to-r from-[#d4a64a] via-[#f1d17c] to-[#d4a64a] text-[#3a120d] text-xs sm:text-sm font-bold tracking-[0.08em] uppercase hover:brightness-105 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.3)] disabled:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5dba0]"
              >
                {isOpening ? 'Unfolding Patrika...' : 'Open Invitation'}
              </button>

              <p className="mt-3 text-[11px] italic text-[#f3dfb1]/80">
                Tap the wax seal to unfold
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
