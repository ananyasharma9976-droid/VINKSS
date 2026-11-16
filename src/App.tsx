import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { Lock, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  AkshataBlessingOverlay,
  BlessingPetal,
} from './components/AkshataBlessingOverlay';
import { CeremoniesView } from './components/CeremoniesView';
import { EnvelopeCover } from './components/EnvelopeCover';
import { ExpertMarathiMandap3D } from './components/ExpertMarathiMandap3D';
import { FallingPetals } from './components/FallingPetals';
import { FamilyRsvpView } from './components/FamilyRsvpView';
import { InvitationCardView } from './components/InvitationCardView';
import { MemoriesMasonryView } from './components/MemoriesMasonryView';
import { ParallaxDivider } from './components/ParallaxDivider';
import { ResilientImage } from './components/ResilientImage';
import { ScrollReveal3D } from './components/ScrollReveal3D';
import { VenueDirectionsView } from './components/VenueDirectionsView';
import { INVITATION_DATA } from './data/invitationData';
import { ritualAudio } from './three/ritualAudio';

const BLESSINGS_STORAGE_KEY = 'vinayak_ruchi_akshata_blessings_v1';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [blessingPetals, setBlessingPetals] = useState<BlessingPetal[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [totalBlessings, setTotalBlessings] = useState<number>(() => {
    try {
      const saved = window.localStorage.getItem(BLESSINGS_STORAGE_KEY);
      const parsed = saved ? Number(saved) : 108;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 108;
    } catch {
      return 108;
    }
  });

  const toastTimerRef = useRef<number | null>(null);
  const petalClearTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      if (petalClearTimerRef.current !== null) window.clearTimeout(petalClearTimerRef.current);
    };
  }, []);

  const handleOfferAkshata = () => {
    ritualAudio.playAkshataSparkle();
    const palette = ['#eab308', '#f59e0b', '#dc2626', '#9e1922', '#fef08a'];
    const generated: BlessingPetal[] = Array.from({ length: 42 }, (_, i) => ({
      id: i,
      leftPct: Math.random() * 96 + 2,
      driftX: (Math.random() - 0.5) * 140,
      duration: 2.3 + Math.random() * 1.4,
      delay: Math.random() * 0.45,
      color: palette[i % palette.length],
      size: 10 + Math.round(Math.random() * 8),
      rotation: Math.round(Math.random() * 180),
    }));

    setBlessingPetals(generated);
    setBurstKey((k) => k + 1);
    setToastVisible(true);

    setTotalBlessings((prev) => {
      const next = prev + 1;
      try {
        window.localStorage.setItem(BLESSINGS_STORAGE_KEY, String(next));
      } catch {
        // Ignore storage failure
      }
      return next;
    });

    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastVisible(false), 3800);

    if (petalClearTimerRef.current !== null) window.clearTimeout(petalClearTimerRef.current);
    petalClearTimerRef.current = window.setTimeout(() => setBlessingPetals([]), 4200);
  };

  return (
    <div className="min-h-screen w-full py-4 px-2.5 sm:py-10 sm:px-6 flex flex-col items-center justify-center overflow-x-clip">
      {/* Thin, elegant metallic-gold scroll progress bar at the very top of the screen */}
      {isOpened && (
        <div
          className="no-print fixed top-0 left-0 right-0 z-50 h-[3.5px] bg-[#5c1612]/25 pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-full origin-left gold-shimmer-bar"
            style={{ scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress }}
          />
        </div>
      )}

      <AkshataBlessingOverlay
        burstKey={burstKey}
        petals={blessingPetals}
        toastVisible={toastVisible}
        totalBlessings={totalBlessings}
      />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <EnvelopeCover key="envelope" onOpen={() => setIsOpened(true)} />
        ) : (
          <motion.main
            key="folio"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[980px] mx-auto"
          >
            <FallingPetals />

            {/* Minimal Paithani Maroon & Antique Gold Top Bar */}
            <header className="no-print sticky top-2 z-40 mb-4 bg-gradient-to-r from-[#781b17] via-[#681511] to-[#781b17] border border-[#d4a64a] shadow-[0_10px_24px_rgba(62,15,12,0.22)]">
              <div className="flex items-center justify-between gap-3 px-3.5 sm:px-5 py-2">
                <span className="font-display font-bold text-lg sm:text-xl text-[#f5dba0] whitespace-nowrap">
                  Vinayak <span className="font-script font-normal text-xl sm:text-2xl text-[#f7de9c] px-0.5">&amp;</span> Ruchi
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    type="button"
                    onClick={handleOfferAkshata}
                    aria-label="Shower Akshata blessings on the couple"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { scale: [1, 1.055, 1] }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 2.2,
                            ease: 'easeInOut',
                          }
                    }
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.07 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                    className="inline-flex items-center gap-1.5 min-h-[36px] px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-[#d4a64a] to-[#f1d17c] border border-[#f7e29c] text-xs font-semibold text-[#3a120d] shadow-[0_0_12px_rgba(241,209,124,0.28)] hover:brightness-105 transition-[filter] whitespace-nowrap shrink-0 cursor-pointer will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5dba0]"
                  >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Akshata</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setIsOpened(false)}
                    aria-label="Close and re-seal envelope"
                    className="inline-flex items-center gap-1.5 min-h-[36px] px-3 sm:px-3.5 py-1.5 bg-[#53100d] border border-[#c89b44]/70 text-xs font-medium text-[#f5dfb0] hover:bg-[#3f0b09] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5dba0]"
                  >
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Seal</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Continuous Scroll-Down Ceremonial Marathi Wedding Scroll */}
            <div className="paper-cotton heirloom-floral-folio print-card border-2 border-[#c89b44] shadow-[0_24px_60px_rgba(78,24,18,0.16)] p-3.5 sm:p-8">
              <div className="relative z-10 border border-[#d6ab56]">
                <section id="invitation" className="scroll-mt-24">
                  <InvitationCardView />
                </section>

                <div className="px-3.5 sm:px-8 pb-8 sm:pb-10 space-y-12 sm:space-y-16">
                  <ParallaxDivider
                    src="/assets/images/floral_toran_arch.png"
                    imageClassName="w-40 sm:w-56 h-auto object-contain opacity-95"
                    offsetPx={12}
                    className="pt-4"
                  />

                  <section id="memories" className="scroll-mt-24">
                    <MemoriesMasonryView />
                  </section>

                  <div className="flex items-center justify-center gap-4 py-2" aria-hidden="true">
                    <span className="h-px w-24 sm:w-36 bg-[#d6c9b0]" />
                    <span className="w-2 h-2 rotate-45 border border-[#c89b44] bg-[#f7e5b8]" />
                    <span className="h-px w-24 sm:w-36 bg-[#d6c9b0]" />
                  </div>

                  <section id="mandap-3d" className="scroll-mt-24">
                    <ExpertMarathiMandap3D />
                  </section>

                  <ParallaxDivider
                    src="/assets/aistudio/LALBAUGCHA_RAAJA_080e79d8.png"
                    imageClassName="w-20 h-auto object-contain opacity-95"
                    offsetPx={10}
                  />

                  <section id="ceremonies" className="scroll-mt-24">
                    <CeremoniesView />
                  </section>

                  <ParallaxDivider
                    src="/assets/images/floral_toran_arch.png"
                    imageClassName="w-40 sm:w-56 h-auto object-contain opacity-95 scale-y-[-1]"
                    offsetPx={12}
                  />

                  <section id="venues" className="scroll-mt-24">
                    <VenueDirectionsView />
                  </section>

                  <ParallaxDivider
                    src="/assets/aistudio/LALBAUGCHA_RAAJA_080e79d8.png"
                    imageClassName="w-20 h-auto object-contain opacity-95"
                    offsetPx={10}
                  />

                  <section id="family" className="scroll-mt-24">
                    <FamilyRsvpView />
                  </section>

                  <ScrollReveal3D direction="flip">
                    <div className="pt-8 border-t border-[#dfc89e] flex flex-col items-center text-center">
                      <ResilientImage
                        src="/assets/images/wax_seal_crest.png"
                        alt="Lotus wax seal crest"
                        fallbackLabel="V & R"
                        className="w-16 h-16 object-contain opacity-95"
                      />
                      <p className="font-display italic text-lg sm:text-xl text-[#8b261d] mt-2">
                        {INVITATION_DATA.closingNote}
                      </p>
                      <button
                        type="button"
                        onClick={handleOfferAkshata}
                        className="no-print mt-4 inline-flex items-center gap-2 min-h-[42px] px-5 py-2 bg-[#8b261d] text-[#fff8e8] text-xs sm:text-sm font-medium hover:bg-[#731e17] transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#f1d17c]" aria-hidden="true" />
                        Offer Akshata Blessings
                      </button>
                    </div>
                  </ScrollReveal3D>
                </div>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
