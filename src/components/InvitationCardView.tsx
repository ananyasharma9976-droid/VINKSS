import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { INVITATION_DATA } from '../data/invitationData';
import { getMuhuratCountdown } from '../utils/invitationTools';
import { Interactive3DCard } from './Interactive3DCard';
import { ResilientImage } from './ResilientImage';
import { ScrollReveal3D } from './ScrollReveal3D';

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function PeacockMuhuratReveal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.3,
  });
  const [replayOpen, setReplayOpen] = useState(true);

  const isOpen = prefersReducedMotion ? true : isInView && replayOpen;

  const handleToggleDoor = () => {
    if (prefersReducedMotion) return;
    setReplayOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className="relative my-8 max-w-2xl mx-auto">
      <div
        className="relative mx-auto max-w-lg min-h-[196px] sm:min-h-[214px]"
        style={{ perspective: '1400px' }}
      >
        {/* Revealed Sacred Muhurat Card behind the Peacock Doors */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0.2, scale: 0.92 }}
          animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.92 }}
          transition={{ duration: 0.72, delay: isOpen ? 0.25 : 0, ease: REVEAL_EASE }}
          className="relative z-10 h-full"
        >
          <Interactive3DCard maxTilt={4}>
            <div className="py-6 px-5 sm:px-9 bg-gradient-to-br from-[#7c1d17] via-[#6b1611] to-[#52100c] border-2 border-[#d4a64a] shadow-[0_16px_36px_rgba(107,22,17,0.24)] text-center">
              <p className="font-royal text-[11px] tracking-[0.18em] uppercase text-[#f3d48c] font-semibold">
                Wedding Ceremony · {INVITATION_DATA.muhurat.note}
              </p>

              <div className="mt-3 pt-3 border-t border-[#d4a64a]/35 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="text-center">
                  <span className="font-royal text-[11px] tracking-[0.18em] uppercase text-[#f3d48c] block">
                    Tuesday
                  </span>
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#fff9ed] leading-none tabular-nums">
                    24
                  </span>
                </div>

                <span className="h-10 w-px bg-[#d4a64a]/45 hidden sm:inline-block" aria-hidden="true" />

                <div className="text-center sm:text-left">
                  <p className="font-display text-xl sm:text-2xl font-bold text-[#fff9ed] leading-tight">
                    November 2026
                  </p>
                  <p className="font-royal text-sm sm:text-base font-semibold text-[#f7de9c] mt-0.5 tabular-nums">
                    Muhurat at {INVITATION_DATA.muhurat.timeLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleDoor}
                className="no-print mt-3.5 text-[11px] font-royal tracking-[0.12em] uppercase text-[#f3d48c]/85 hover:text-[#fff8e8] underline underline-offset-4 cursor-pointer transition-colors"
              >
                {isOpen ? 'Close peacock doors' : 'Open peacock doors'}
              </button>
            </div>
          </Interactive3DCard>
        </motion.div>

        {/* Left Peacock Door Panel */}
        <motion.button
          type="button"
          onClick={handleToggleDoor}
          aria-label={isOpen ? 'Close left peacock door' : 'Open left peacock door to reveal muhurat'}
          initial={prefersReducedMotion ? false : { rotateY: 0 }}
          animate={
            isOpen
              ? { rotateY: -104, x: '-8%', opacity: 0.95 }
              : { rotateY: 0, x: '0%', opacity: 1 }
          }
          transition={{ duration: 0.95, ease: REVEAL_EASE }}
          style={{
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
          }}
          className={`no-print absolute inset-y-0 left-0 w-1/2 ${isOpen ? 'z-0 pointer-events-none' : 'z-20'} bg-gradient-to-br from-[#6e1713] via-[#5c120e] to-[#470c09] border-2 border-[#d4a64a] shadow-[6px_12px_28px_rgba(45,10,8,0.34)] flex flex-col items-center justify-center p-3 sm:p-4 cursor-pointer`}
        >
          <ResilientImage
            src="/assets/images/paithani_peacock_border.png"
            alt="Paithani peacock gold zari door left"
            fallbackLabel="Paithani Peacock"
            className="w-16 sm:w-20 h-auto object-contain select-none pointer-events-none"
          />
          <span className="mt-2 font-marathi text-sm sm:text-base text-[#f5dba0] font-semibold">
            ॥ शुभमंगल ॥
          </span>
        </motion.button>

        {/* Right Peacock Door Panel */}
        <motion.button
          type="button"
          onClick={handleToggleDoor}
          aria-label={isOpen ? 'Close right peacock door' : 'Open right peacock door to reveal muhurat'}
          initial={prefersReducedMotion ? false : { rotateY: 0 }}
          animate={
            isOpen
              ? { rotateY: 104, x: '8%', opacity: 0.95 }
              : { rotateY: 0, x: '0%', opacity: 1 }
          }
          transition={{ duration: 0.95, ease: REVEAL_EASE }}
          style={{
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d',
          }}
          className={`no-print absolute inset-y-0 right-0 w-1/2 ${isOpen ? 'z-0 pointer-events-none' : 'z-20'} bg-gradient-to-bl from-[#6e1713] via-[#5c120e] to-[#470c09] border-2 border-[#d4a64a] shadow-[-6px_12px_28px_rgba(45,10,8,0.34)] flex flex-col items-center justify-center p-3 sm:p-4 cursor-pointer`}
        >
          <ResilientImage
            src="/assets/images/paithani_peacock_border.png"
            alt="Paithani peacock gold zari door right"
            fallbackLabel="Paithani Peacock"
            className="w-16 sm:w-20 h-auto object-contain select-none pointer-events-none scale-x-[-1]"
          />
          <span className="mt-2 font-marathi text-sm sm:text-base text-[#f5dba0] font-semibold">
            ॥ मुहूर्त ॥
          </span>
        </motion.button>
      </div>
    </div>
  );
}

const GROOM_LETTERS = Array.from('Vinayak');
const BRIDE_LETTERS = Array.from('Ruchi');

function StaggeredGoldName({
  letters,
  wordLabel,
  baseDelay,
  show,
  prefersReducedMotion,
}: {
  letters: string[];
  wordLabel: string;
  baseDelay: number;
  show: boolean;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <span
      aria-label={wordLabel}
      className="inline-flex items-baseline justify-center drop-shadow-[0_3px_10px_rgba(102,17,12,0.16)]"
      style={{ perspective: '900px' }}
    >
      {letters.map((char, idx) => (
        <motion.span
          key={`${wordLabel}-${idx}`}
          aria-hidden="true"
          initial={
            prefersReducedMotion
              ? false
              : { opacity: 0, y: 18, rotateX: 46, scale: 0.9 }
          }
          animate={
            show
              ? { opacity: 1, y: 0, rotateX: 0, scale: 1 }
              : { opacity: 0, y: 18, rotateX: 46, scale: 0.9 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : {
                  delay: baseDelay + idx * 0.055,
                  type: 'spring',
                  stiffness: 220,
                  damping: 20,
                  mass: 0.72,
                  opacity: {
                    duration: 0.42,
                    delay: baseDelay + idx * 0.055,
                    ease: REVEAL_EASE,
                  },
                }
          }
          style={{
            transformOrigin: '50% 65%',
            animationDelay: `${0.55 + (baseDelay + idx * 0.055) * 0.45}s`,
          }}
          className="inline-block text-5xl md:text-6xl lg:text-[4.85rem] leading-[1.38] pt-1 pb-3.5 px-[0.04em] -mx-[0.03em] gold-leaf-letter will-change-transform"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

function CoupleTitleReveal() {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(titleRef, { once: true, amount: 0.15 });
  const show = prefersReducedMotion || isInView;

  return (
    <div ref={titleRef} className="mt-3 mb-7" style={{ perspective: '1200px' }}>
      <div className="mb-1 flex justify-center">
        <ResilientImage
          src="/assets/images/mundavalya_pearls.png"
          alt="Traditional Maharashtrian pearl and ruby Mundavalya forehead ornament"
          priority
          fallbackLabel="Mundavalya"
          className="pointer-events-none select-none w-52 sm:w-72 h-auto object-contain"
        />
      </div>

      {/* Twin expanding gold filigree crest */}
      <div className="flex items-center justify-center gap-3 max-w-md mx-auto my-2" aria-hidden="true">
        <motion.span
          initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
          animate={show ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.75, ease: REVEAL_EASE }}
          style={{ transformOrigin: 'right center' }}
          className="h-[1.5px] flex-1 bg-gradient-to-l from-[#c89b44] to-transparent"
        />
        <motion.span
          initial={prefersReducedMotion ? false : { scale: 0, rotate: -45 }}
          animate={show ? { scale: 1, rotate: 45 } : { scale: 0, rotate: -45 }}
          transition={{ duration: 0.55, delay: 0.1, ease: REVEAL_EASE }}
          className="w-2.5 h-2.5 border border-[#b6791e] bg-[#f7e29c] shrink-0"
        />
        <motion.span
          initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
          animate={show ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.75, ease: REVEAL_EASE }}
          style={{ transformOrigin: 'left center' }}
          className="h-[1.5px] flex-1 bg-gradient-to-r from-[#c89b44] to-transparent"
        />
      </div>

      <h1 className="font-display font-extrabold tracking-[-0.01em] mt-1 mb-2 flex flex-col sm:flex-row items-center sm:items-baseline justify-center gap-0 sm:gap-2 md:gap-3">
        <StaggeredGoldName
          letters={GROOM_LETTERS}
          wordLabel="Vinayak"
          baseDelay={0.08}
          show={show}
          prefersReducedMotion={prefersReducedMotion}
        />

        <motion.span
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.45, rotate: -14 }}
          animate={show ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.45, rotate: -14 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : { type: 'spring', stiffness: 240, damping: 18, delay: 0.44 }
          }
          className="font-script font-normal text-5xl md:text-6xl lg:text-7xl leading-[1.4] py-1 px-4 -my-3 sm:my-0 gold-leaf-ampersand inline-block"
          aria-label="and"
        >
          &amp;
        </motion.span>

        <StaggeredGoldName
          letters={BRIDE_LETTERS}
          wordLabel="Ruchi"
          baseDelay={0.5}
          show={show}
          prefersReducedMotion={prefersReducedMotion}
        />
      </h1>

      <motion.p
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.55, delay: 0.82, ease: REVEAL_EASE }}
        className="font-royal text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#7a4b1d] font-semibold"
      >
        Shubh Vivah · 24 November 2026
      </motion.p>
    </div>
  );
}

export function InvitationCardView() {
  const [countdown, setCountdown] = useState(() => getMuhuratCountdown());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getMuhuratCountdown());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative text-center">
      {/* Full Untrimmed Mandap Scalloped Floral Arch & Flickering Hanging Diyas */}
      <div className="relative w-full px-1 sm:px-3 pt-1 sm:pt-2 bg-gradient-to-b from-[#faedd3]/55 to-transparent overflow-hidden">
        <div className="relative w-full">
          {/* Warm candlelit atmospheric wash inside the arch */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(255, 212, 118, 0.22) 0%, transparent 72%)',
            }}
          />

          {/* Left Hanging Brass Diya — Ambient Wall Wash + Core Flame Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[31.8%] top-[52%] w-[36%] aspect-square z-0 diya-radial-ambient"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[33.3%] top-[51%] w-[16%] aspect-square z-0 diya-radial-core"
          />

          {/* Right Hanging Brass Diya — Offset Phase Ambient Wash + Core Flame Glow */}
          <div
            aria-hidden="true"
            style={{ animationDelay: '-1.6s', animationDuration: '4.6s' }}
            className="pointer-events-none absolute left-[68.2%] top-[52%] w-[36%] aspect-square z-0 diya-radial-ambient"
          />
          <div
            aria-hidden="true"
            style={{ animationDelay: '-1.1s', animationDuration: '3.7s' }}
            className="pointer-events-none absolute left-[66.7%] top-[51%] w-[16%] aspect-square z-0 diya-radial-core"
          />

          <ResilientImage
            src="/assets/images/mandap_floral_arch.png"
            alt="Scalloped gold wedding arch adorned with marigold, jasmine, mango leaves, and hanging brass diyas"
            priority
            fallbackLabel="Sacred Mandap Arch"
            className="pointer-events-none select-none relative z-10 w-full h-auto object-contain mix-blend-multiply block"
          />
        </div>
      </div>

      {/* Content sanctuary */}
      <div className="relative z-20 px-4 sm:px-14 md:px-20 pt-2 sm:pt-3 pb-10 sm:pb-12">
        {/* Sacred Ganesha Emblem */}
        <ScrollReveal3D direction="up" delay={0.04}>
          <div className="flex justify-center mb-3.5">
            <ResilientImage
              src="/assets/aistudio/LALBAUGCHA_RAAJA_080e79d8.png"
              alt="Lalbaugcha Raja Shri Ganesha"
              priority
              fallbackLabel="Shri Ganesh"
              className="w-28 h-auto sm:w-32 object-contain select-none drop-shadow-[0_4px_12px_rgba(112,20,15,0.14)]"
            />
          </div>

          <p className="font-royal text-xs sm:text-[13px] tracking-[0.14em] text-[#6d3d20] font-semibold max-w-md mx-auto text-balance">
            {INVITATION_DATA.blessings}
          </p>

          <p className="mt-3.5 font-display italic text-xl sm:text-2xl text-[#3b332b] max-w-lg mx-auto">
            {INVITATION_DATA.hostInvocation}
          </p>
        </ScrollReveal3D>

        {/* Creative Animated Bold Couple Title */}
        <CoupleTitleReveal />

        {/* Real Couple Portrait Framed in Antique Gold */}
        <ScrollReveal3D direction="depth" delay={0.08} className="max-w-[290px] sm:max-w-[330px] mx-auto mb-8">
          <Interactive3DCard maxTilt={5}>
            <figure className="relative p-2.5 bg-gradient-to-br from-[#fffaf0] via-[#faeccd] to-[#f4dfaf] border-2 border-[#d4a64a] shadow-[0_18px_40px_rgba(92,28,20,0.16)]">
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#8b261d]/45 bg-[#f2dfc0]">
                <ResilientImage
                  src="/assets/aistudio/WhatsApp_Image_2026-11-16_at_15.47.25_9aa9a248.jpeg"
                  alt="Vinayak and Ruchi in traditional Maharashtrian attire"
                  priority
                  fallbackLabel="Vinayak & Ruchi"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <figcaption className="pt-2.5 pb-1 text-center">
                <span className="font-royal text-[11px] tracking-[0.18em] uppercase text-[#8b261d] font-semibold">
                  Vinayak &amp; Ruchi · Mumbai
                </span>
              </figcaption>
            </figure>
          </Interactive3DCard>
        </ScrollReveal3D>

        {/* Peacock Cards Opening to Reveal the Wedding Muhurat */}
        <PeacockMuhuratReveal />

        {/* Groom & Bride 3D Scroll-Reveal Heritage Cards */}
        <div
          id="heritage"
          className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left max-w-3xl mx-auto mt-9 pt-8 border-t border-[#dfc89e]"
        >
          <ScrollReveal3D direction="left">
            <Interactive3DCard maxTilt={4}>
              <div className="h-full p-5 sm:p-6 bg-gradient-to-br from-[#fff7e4] to-[#faecc8] border border-[#dfc38c] shadow-xs flex flex-col items-start">
                <div className="flex items-center gap-4 mb-3.5 w-full">
                  <div className="relative shrink-0">
                    <div className="w-24 h-28 sm:w-28 sm:h-32 overflow-hidden border-2 border-[#d4a64a] bg-[#f4e2bd] shadow-sm">
                      <ResilientImage
                        src="/assets/aistudio/Smiling_Groom_in_Embroidered_Sherwani_9290e7f0.png"
                        alt="Portrait of Groom Vinayak in embroidered sherwani"
                        fallbackLabel="Vinayak"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <ResilientImage
                      src="/assets/images/pheta_turban_motif.png"
                      alt=""
                      fallbackLabel="Pheta"
                      className="w-9 h-9 object-contain absolute -bottom-2 -right-2 bg-[#fffaf0] border border-[#d4a64a] p-0.5 shadow-xs pointer-events-none select-none"
                    />
                  </div>
                  <div>
                    <p className="font-royal text-xs tracking-[0.16em] uppercase text-[#b45309] font-semibold">
                      Groom
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1f1b18] mt-0.5">
                      {INVITATION_DATA.groom.firstName}
                    </h2>
                  </div>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-[#3b332b] mt-1">
                  {INVITATION_DATA.groom.lineage}
                </p>
                <p className="text-sm text-[#5c5346] mt-3 pt-2.5 border-t border-[#e8d5af] w-full">
                  <span className="font-medium text-[#8b261d]">Hometown:</span>{' '}
                  {INVITATION_DATA.groom.hometown}
                </p>
              </div>
            </Interactive3DCard>
          </ScrollReveal3D>

          <ScrollReveal3D direction="right" delay={0.06}>
            <Interactive3DCard maxTilt={4}>
              <div className="h-full p-5 sm:p-6 bg-gradient-to-br from-[#fff5f2] to-[#fbe7e1] border border-[#e3b8ad] shadow-xs flex flex-col items-start">
                <div className="flex items-center gap-4 mb-3.5 w-full">
                  <div className="relative shrink-0">
                    <div className="w-24 h-28 sm:w-28 sm:h-32 overflow-hidden border-2 border-[#d4a64a] bg-[#f7ddd6] shadow-sm">
                      <ResilientImage
                        src="/assets/aistudio/BRIDE_427bb806.png"
                        alt="Portrait of Bride Ruchi in green and gold Paithani saree"
                        fallbackLabel="Ruchi"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <ResilientImage
                      src="/assets/images/bridal_nath_lotus.png"
                      alt=""
                      fallbackLabel="Nath"
                      className="w-9 h-9 object-contain absolute -bottom-2 -right-2 bg-[#fffaf0] border border-[#d4a64a] p-0.5 shadow-xs pointer-events-none select-none"
                    />
                  </div>
                  <div>
                    <p className="font-royal text-xs tracking-[0.16em] uppercase text-[#8b261d] font-semibold">
                      Bride
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1f1b18] mt-0.5">
                      {INVITATION_DATA.bride.firstName}
                    </h2>
                  </div>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-[#3b332b] mt-1">
                  {INVITATION_DATA.bride.lineage}
                </p>
                <p className="text-sm text-[#5c5346] mt-3 pt-2.5 border-t border-[#edd2ca] w-full">
                  <span className="font-medium text-[#8b261d]">Hometown:</span>{' '}
                  {INVITATION_DATA.bride.hometown}
                </p>
              </div>
            </Interactive3DCard>
          </ScrollReveal3D>
        </div>

        {/* Live Wedding Muhurat Countdown positioned after Groom & Bride heritage cards */}
        <ScrollReveal3D direction="flip" className="mt-9 flex flex-col items-center">
          <p className="font-royal text-[11px] tracking-[0.18em] uppercase text-[#8b261d] font-semibold mb-2.5">
            Countdown to Shubhamangal Muhurat
          </p>
          {countdown.status === 'upcoming' ? (
            <div
              className="inline-flex items-center gap-3.5 sm:gap-7 px-4 sm:px-7 py-3 bg-gradient-to-b from-[#fffaf0] to-[#faeccd] border border-[#c89b44] shadow-[0_10px_24px_rgba(139,38,29,0.09)] tabular-nums"
              aria-label="Live countdown to wedding on 24 November 2026"
            >
              {[
                { value: countdown.days, label: 'Days' },
                { value: countdown.hours, label: 'Hours' },
                { value: countdown.minutes, label: 'Minutes' },
                { value: countdown.seconds, label: 'Seconds' },
              ].map((item, idx, arr) => (
                <div key={item.label} className="flex items-center gap-3.5 sm:gap-7">
                  <div className="text-center min-w-[44px] sm:min-w-[54px]">
                    <span className="font-display text-2xl sm:text-3xl font-semibold text-[#8b261d] block leading-none">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] tracking-[0.12em] text-[#5c5346] mt-1 block">
                      {item.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <span className="h-7 w-px bg-[#d6ab56]" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          ) : countdown.status === 'today' ? (
            <div className="inline-block px-5 py-2.5 bg-[#fff8e8] border border-[#c89b44] text-xs sm:text-sm font-medium text-[#8b261d]">
              Today · Auspicious Muhurat at 12:14 p.m.
            </div>
          ) : (
            <div className="inline-block px-5 py-2.5 bg-[#fff8e8] border border-[#c89b44] text-xs sm:text-sm italic font-display text-[#5c5346]">
              Celebrated on 24 November 2026
            </div>
          )}
        </ScrollReveal3D>

        {/* Shehnai & Choughada Mangalvadyam + Request Quote */}
        <ScrollReveal3D direction="flip" className="mt-9">
          <div className="mb-3 flex justify-center">
            <ResilientImage
              src="/assets/images/shehnai_choughada.png"
              alt="Traditional Maharashtrian wedding Shehnai flute and brocade Choughada drum with marigold blossoms"
              fallbackLabel="Shehnai & Choughada"
              className="w-36 sm:w-44 h-auto object-contain select-none pointer-events-none"
            />
          </div>

          <blockquote className="font-display italic text-xl sm:text-2xl leading-relaxed text-[#4f2419] max-w-xl mx-auto text-balance">
            “{INVITATION_DATA.requestNote}”
          </blockquote>
        </ScrollReveal3D>
      </div>
    </div>
  );
}
