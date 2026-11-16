import { Check, Copy, ExternalLink, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { INVITATION_DATA } from '../data/invitationData';
import { Interactive3DCard } from './Interactive3DCard';
import { ResilientImage } from './ResilientImage';
import { ScrollReveal3D, ScrollReveal3DItem } from './ScrollReveal3D';

export function VenueDirectionsView() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(null);
    }
  };

  const venues = [
    {
      key: 'wedding-venue',
      ...INVITATION_DATA.venues.wedding,
      occasions: 'Wedding Ceremony (12:14 p.m.) · Dinner & Welcome Reception (6:30 p.m. – 9:30 p.m.)',
      cardTint: 'bg-gradient-to-br from-[#fff5f2] to-[#fbe4dd] border-[#dfaba0]',
      direction: 'left' as const,
    },
    {
      key: 'residence-venue',
      ...INVITATION_DATA.venues.residence,
      occasions: 'Haldi Ceremony (22 Nov, 7:00 p.m.) · Shri Satyanarayan Pooja (26 Nov)',
      cardTint: 'bg-gradient-to-br from-[#fff8e4] to-[#faebc4] border-[#dec17c]',
      direction: 'right' as const,
    },
  ];

  return (
    <div>
      <ScrollReveal3D direction="up" stagger staggerInterval={0.075} delayChildren={0.04}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dfc89e]">
          <div className="flex items-center gap-5">
            <ScrollReveal3DItem kind="media" className="shrink-0">
              <ResilientImage
                src="/assets/images/rangoli_lotus_diya.png"
                alt="Traditional Maharashtrian Sanskar Bharati Rangoli mandala with glowing brass diya"
                fallbackLabel="Welcome Rangoli"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0 select-none"
              />
            </ScrollReveal3DItem>
            <ScrollReveal3DItem kind="text">
              <p className="font-royal text-xs tracking-[0.14em] text-[#b45309] font-semibold">
                Venues &amp; Travel Guide
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1f1b18] mt-1">
                Locations &amp; Family Contact
              </h2>
            </ScrollReveal3DItem>
          </div>
        </div>
      </ScrollReveal3D>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-stretch">
        {venues.map((venue, idx) => {
          const fullAddress = `${venue.name}, ${venue.addressLines.join(' ')}`;
          return (
            <ScrollReveal3D
              key={venue.key}
              direction={venue.direction}
              delay={idx * 0.06}
              stagger
              staggerInterval={0.07}
              delayChildren={0.05}
            >
              <Interactive3DCard maxTilt={4}>
                <section
                  className={`h-full flex flex-col justify-between p-5 sm:p-6 border shadow-xs ${venue.cardTint}`}
                >
                  <div>
                    <ScrollReveal3DItem kind="text">
                      <p className="font-royal text-xs tracking-[0.12em] text-[#8b261d] font-semibold">
                        {venue.label}
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1f1b18] mt-1">
                        {venue.name}
                      </h3>
                      <p className="text-xs text-[#5c5346] mt-1.5">{venue.occasions}</p>
                    </ScrollReveal3DItem>

                    <ScrollReveal3DItem kind="text">
                      <address className="not-italic text-sm sm:text-[15px] text-[#2e2822] leading-relaxed mt-4 pt-4 border-t border-[#dfc89e]">
                        {venue.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>

                      <p className="text-xs text-[#5c5346] mt-3">
                        Landmark: {venue.landmark}
                      </p>
                    </ScrollReveal3DItem>
                  </div>

                  <ScrollReveal3DItem
                    kind="action"
                    className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-[#dfc89e]"
                  >
                    <a
                      href={venue.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 bg-[#8b261d] text-[#faf7f0] text-xs font-medium hover:bg-[#731e17] transition-colors whitespace-nowrap shrink-0"
                    >
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      Open in Maps
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(venue.key, fullAddress)}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 border border-[#c8b288] bg-[#fffaf0]/90 text-[#1f1b18] text-xs font-medium hover:border-[#8b261d] hover:text-[#8b261d] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d]"
                    >
                      {copiedKey === venue.key ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#8b261d]" aria-hidden="true" />
                          Copied Address
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          Copy Address
                        </>
                      )}
                    </button>
                  </ScrollReveal3DItem>
                </section>
              </Interactive3DCard>
            </ScrollReveal3D>
          );
        })}
      </div>

      <ScrollReveal3D direction="up" delay={0.08} stagger staggerInterval={0.07} delayChildren={0.05}>
        <section className="mt-8 p-5 sm:p-6 bg-[#f7ecd5] border border-[#dfc38c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ScrollReveal3DItem kind="media" className="shrink-0">
              <ResilientImage
                src="/assets/images/samai_brass_lamp.png"
                alt="Engraved brass Samai lamp with marigold garland"
                fallbackLabel="Brass Samai"
                className="w-12 h-auto object-contain shrink-0 select-none"
              />
            </ScrollReveal3DItem>
            <ScrollReveal3DItem kind="text">
              <p className="font-royal text-xs tracking-[0.12em] text-[#b45309] font-semibold">
                Invitation From &amp; Guest Assistance
              </p>
              <p className="font-display text-2xl font-semibold text-[#1f1b18] mt-1">
                {INVITATION_DATA.contact.name}
              </p>
              <p className="text-xs text-[#5c5346] mt-0.5">
                For directions, arrival assistance, or family inquiries
              </p>
            </ScrollReveal3DItem>
          </div>

          <ScrollReveal3DItem kind="action" className="flex flex-wrap items-center gap-3">
            {INVITATION_DATA.contact.phones.map((phone) => (
              <div key={phone} className="inline-flex items-center border border-[#c8b288] bg-[#fffaf0]">
                <a
                  href={`tel:+91${phone}`}
                  className="inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 text-sm font-medium text-[#1f1b18] hover:text-[#8b261d] tabular-nums whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 text-[#8b261d]" aria-hidden="true" />
                  {phone}
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(phone, phone)}
                  aria-label={`Copy phone number ${phone}`}
                  className="min-h-[40px] px-2.5 border-l border-[#c8b288] text-[#5c5346] hover:text-[#8b261d] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#8b261d]"
                >
                  {copiedKey === phone ? (
                    <Check className="w-3.5 h-3.5 text-[#8b261d]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>
            ))}
          </ScrollReveal3DItem>
        </section>
      </ScrollReveal3D>
    </div>
  );
}
