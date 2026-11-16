import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Interactive3DCard } from './Interactive3DCard';
import { ResilientImage } from './ResilientImage';
import { ScrollReveal3D } from './ScrollReveal3D';

export interface MemoryItem {
  id: string;
  src: string;
  title: string;
  marathiLabel: string;
  chapter: string;
  caption: string;
  aspectClass: string;
  alt: string;
  isPortrait?: boolean;
}

const MEMORIES: MemoryItem[] = [
  {
    id: 'real-couple-portrait',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_15.47.25_9aa9a248.jpeg',
    title: 'Together Forever · Vinayak & Ruchi',
    marathiLabel: 'सहजीवन आरंभ',
    chapter: 'Portrait I · The Couple',
    caption:
      'Radiant smiles together in embroidered sherwani and emerald silk saree, celebrating a lifelong bond.',
    aspectClass: 'aspect-[3/4]',
    alt: 'Vinayak and Ruchi smiling together in traditional wedding celebration attire',
    isPortrait: true,
  },
  {
    id: 'real-groom-portrait',
    src: '/assets/aistudio/Smiling_Groom_in_Embroidered_Sherwani_9290e7f0.png',
    title: 'The Groom · Vinayak',
    marathiLabel: 'वरराज विनायक',
    chapter: 'Portrait II · The Groom',
    caption:
      'Dressed in an olive-gold embroidered bandhgala sherwani, welcoming loved ones with warmth.',
    aspectClass: 'aspect-[3/4]',
    alt: 'Groom Vinayak smiling in an embroidered olive and gold sherwani',
    isPortrait: true,
  },
  {
    id: 'real-bride-portrait',
    src: '/assets/aistudio/BRIDE_427bb806.png',
    title: 'The Bride · Ruchi',
    marathiLabel: 'वधू रूची',
    chapter: 'Portrait III · The Bride',
    caption:
      'Adorned in emerald Paithani zari silk, heirloom temple jewelry, green chooda bangles, and bridal mehndi.',
    aspectClass: 'aspect-[3/4]',
    alt: 'Bride Ruchi in an emerald green gold-bordered Paithani saree with pearl Nath and mehndi',
    isPortrait: true,
  },
  {
    id: 'couple-mandap',
    src: '/assets/aistudio/Watercolour_Wedding_Portrait_Beneath_Marigold_Arch_aa765282.png',
    title: 'Under the Sacred Mandap',
    marathiLabel: 'शुभमंगल मुहूर्त',
    chapter: 'Chapter I · The Promise',
    caption:
      'Hand in hand beneath golden marigold garlands and jasmine torans, radiant in green Paithani silk and embroidered ivory sherwani.',
    aspectClass: 'aspect-[3/4]',
    alt: 'Watercolour portrait of Ruchi and Vinayak smiling together in varmala garlands beneath a marigold wedding arch',
    isPortrait: true,
  },
  {
    id: 'sakhar-puda',
    src: '/assets/images/memory_sakhar_puda.png',
    title: 'Sakhar Puda',
    marathiLabel: 'साखरपुडा',
    chapter: 'Chapter II · Betrothal',
    caption:
      'Golden silk saree drape, ceremonial silver bowl, and green bangles sealing two families together.',
    aspectClass: 'aspect-[4/3]',
    alt: 'Traditional Maharashtrian Sakhar Puda engagement keepsakes on gold zari silk',
  },
  {
    id: 'haldi-hands',
    src: '/assets/aistudio/Traditional_Indian_Wedding_Ceremony_0c2470f0.png',
    title: 'Haldi & Mehndi Blessings',
    marathiLabel: 'हळद समारंभ',
    chapter: 'Chapter III · Joy & Turmeric',
    caption:
      'Golden turmeric on smiling cheeks, fragrant marigold petals, brass samai lamps, and intricate mehndi hands.',
    aspectClass: 'aspect-square',
    alt: 'Vinayak and Ruchi seated together during their Haldi ceremony with turmeric bowls, marigolds, and brass diyas',
    isPortrait: true,
  },
  {
    id: 'saptapadi-fire',
    src: '/assets/aistudio/Traditional_Hindu_Wedding_Ceremony_0ba2b075.png',
    title: 'Seven Steps Around Agni',
    marathiLabel: 'सप्तपदी',
    chapter: 'Chapter IV · Seven Vows',
    caption:
      'Seven sacred rice mounds beside the glowing copper Havan Kund beneath the marigold mandap as two paths become one.',
    aspectClass: 'aspect-[3/4]',
    alt: 'Ruchi and Vinayak taking vows beside the sacred Havan Kund fire and seven Saptapadi rice mounds',
    isPortrait: true,
  },
  {
    id: 'mangalsutra-gajra',
    src: '/assets/images/memory_mangalsutra_gajra.png',
    title: 'Vati Mangalsutra & Mogra',
    marathiLabel: 'मंगळसूत्र व गजरा',
    chapter: 'Chapter V · Heirloom',
    caption:
      'Gold Vati Mangalsutra braided with black beads and fresh white jasmine mogra upon Paithani weave.',
    aspectClass: 'aspect-[4/3]',
    alt: 'Maharashtrian gold Vati Mangalsutra and fresh jasmine mogra resting on crimson Paithani silk',
  },
  {
    id: 'kelvan-feast',
    src: '/assets/images/memory_kelvan_feast.png',
    title: 'Kelvan & Family Feast',
    marathiLabel: 'केळवण स्नेहभोजन',
    chapter: 'Chapter VI · Warmth',
    caption:
      'Saffron shrikhand, crisp modak, and puran poli served on a banana leaf with brass katoris.',
    aspectClass: 'aspect-square',
    alt: 'Traditional Maharashtrian festive Kelvan meal served on a fresh banana leaf with brass bowls',
  },
];

interface MasonryTileProps {
  memory: MemoryItem;
  index: number;
  onSelect: (index: number) => void;
}

function MasonryMemoryTile({ memory, index, onSelect }: MasonryTileProps) {
  const tileRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(tileRef, {
    once: true,
    amount: 0.14,
  });

  return (
    <div ref={tileRef} className="break-inside-avoid mb-4 sm:mb-5">
      <Interactive3DCard maxTilt={4}>
        <motion.button
          type="button"
          onClick={() => onSelect(index)}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={
            prefersReducedMotion
              ? undefined
              : isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 18 }
          }
          transition={{
            duration: 0.55,
            delay: (index % 3) * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group w-full text-left bg-[#fffaf0] border border-[#d9be89] shadow-[0_10px_24px_rgba(92,28,20,0.08)] hover:border-[#8b261d] transition-colors cursor-pointer overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d]"
          aria-label={`View memory: ${memory.title}`}
        >
          <div className={`relative w-full ${memory.aspectClass} overflow-hidden bg-[#f4e4c4]`}>
            <motion.div
              className="w-full h-full will-change-transform"
              initial={prefersReducedMotion ? false : { scale: 1.09 }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : isInView
                    ? { scale: 1 }
                    : { scale: 1.09 }
              }
              transition={{
                duration: 0.68,
                delay: (index % 3) * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ResilientImage
                src={memory.src}
                alt={memory.alt}
                fallbackLabel={memory.title}
                className={`w-full h-full object-cover ${
                  memory.isPortrait ? 'object-top' : 'object-center'
                } transition-transform duration-400 ease-out group-hover:scale-104`}
              />
            </motion.div>

            {/* Subtle dark gradient scrim at bottom + expand indicator */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2a0c09]/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center bg-[#fffaf0]/90 border border-[#c89b44] text-[#8b261d] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xs"
            >
              <Expand className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="p-4 border-t border-[#e8d5af]">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-royal text-[11px] font-semibold tracking-[0.12em] text-[#b45309]">
                {memory.chapter}
              </span>
              <span className="font-marathi text-xs font-semibold text-[#8b261d]">
                {memory.marathiLabel}
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1f1b18] mt-1 group-hover:text-[#8b261d] transition-colors">
              {memory.title}
            </h3>
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#5c5346] mt-1">
              {memory.caption}
            </p>
          </div>
        </motion.button>
      </Interactive3DCard>
    </div>
  );
}

export function MemoriesMasonryView() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === null ? null : (prev + 1) % MEMORIES.length));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev - 1 + MEMORIES.length) % MEMORIES.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex]);

  const activeMemory = activeIndex !== null ? MEMORIES[activeIndex] : null;

  return (
    <div>
      <ScrollReveal3D direction="up">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#dfc89e]">
          <div>
            <p className="font-royal text-xs tracking-[0.14em] text-[#b45309] font-semibold">
              Aathvani · Keepsake Gallery
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1f1b18] mt-1">
              Memories &amp; Sacred Moments
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5c5346] max-w-sm">
            From cherished portraits to Sakhar Puda and Saptapadi — tap any frame to inspect up close.
          </p>
        </div>
      </ScrollReveal3D>

      {/* Responsive CSS Masonry Grid */}
      <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5">
        {MEMORIES.map((memory, idx) => (
          <MasonryMemoryTile
            key={memory.id}
            memory={memory}
            index={idx}
            onSelect={setActiveIndex}
          />
        ))}
      </div>

      {/* Interactive 3D Keepsake Lightbox */}
      <AnimatePresence>
        {activeMemory && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="no-print fixed inset-0 z-50 bg-[#1f0a08]/85 p-3 sm:p-6 flex items-center justify-center"
            onClick={() => setActiveIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeMemory.title}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-[#fffaf0] border-2 border-[#d4a64a] shadow-[0_28px_72px_rgba(0,0,0,0.48)] overflow-hidden max-h-[92vh] flex flex-col"
            >
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#751a14] text-[#fff8e8] border-b border-[#d4a64a]">
                <div className="min-w-0">
                  <p className="text-[11px] text-[#f5dba0] font-medium truncate">
                    <span className="font-royal tracking-[0.14em]">{activeMemory.chapter}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span className="font-marathi text-xs">{activeMemory.marathiLabel}</span>
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold truncate">
                    {activeMemory.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  aria-label="Close keepsake viewer"
                  className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center border border-[#d4a64a]/60 bg-[#5c120e] text-[#f7e5b8] hover:bg-[#420c09] cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-[#f6ebd3] p-4 sm:p-6 flex items-center justify-center">
                <ResilientImage
                  src={activeMemory.src}
                  alt={activeMemory.alt}
                  fallbackLabel={activeMemory.title}
                  className="max-h-[54vh] w-auto object-contain border border-[#c89b44] shadow-md"
                />
              </div>

              <div className="px-4 sm:px-6 py-4 bg-[#fffaf0] border-t border-[#e5d2ab] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-[#3b332b] leading-relaxed">
                  {activeMemory.caption}
                </p>
                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((activeIndex - 1 + MEMORIES.length) % MEMORIES.length)
                    }
                    className="inline-flex items-center gap-1 min-h-[40px] px-3 py-1.5 border border-[#c8b288] bg-[#fffaf0] text-xs font-medium text-[#1f1b18] hover:border-[#8b261d] hover:text-[#8b261d] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <span className="text-xs text-[#5c5346] tabular-nums px-1.5">
                    {activeIndex + 1} / {MEMORIES.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((activeIndex + 1) % MEMORIES.length)}
                    className="inline-flex items-center gap-1 min-h-[40px] px-3 py-1.5 border border-[#c8b288] bg-[#fffaf0] text-xs font-medium text-[#1f1b18] hover:border-[#8b261d] hover:text-[#8b261d] cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
