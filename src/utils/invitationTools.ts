import { CeremonyEvent, INVITATION_DATA } from '../data/invitationData';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: 'upcoming' | 'today' | 'celebrated';
}

export function getMuhuratCountdown(now: Date = new Date()): CountdownState {
  const target = new Date(INVITATION_DATA.muhurat.isoDateTime).getTime();
  const current = now.getTime();
  const diff = target - current;

  if (diff <= 0) {
    const endOfWeddingDay = new Date('2026-11-24T23:59:59+05:30').getTime();
    if (current <= endOfWeddingDay) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'today' };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'celebrated' };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, status: 'upcoming' };
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function downloadEventsIcs(events: CeremonyEvent[], filename: string): void {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Walekar Family//Vinayak and Ruchi Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Vinayak & Ruchi Wedding',
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  for (const event of events) {
    const location = `${event.venueName}, ${event.addressLines.join(' ')}`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}-vinayak-ruchi-2026@walekar.invitation`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART;TZID=Asia/Kolkata:${event.startIso}`,
      `DTEND;TZID=Asia/Kolkata:${event.endIso}`,
      `SUMMARY:${escapeIcsText(`${event.title} — Vinayak & Ruchi`)}`,
      `DESCRIPTION:${escapeIcsText(event.description)}`,
      `LOCATION:${escapeIcsText(location)}`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  triggerBlobDownload(blob, filename);
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function fetchImageAsDataUrl(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    if (!response.ok) return '';
    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch {
    return '';
  }
}

export async function downloadStandaloneHtmlInvitation(): Promise<void> {
  const [
    archDataUrl,
    ganeshaDataUrl,
    sealDataUrl,
    phetaDataUrl,
    nathDataUrl,
    kalashDataUrl,
    mundavalyaDataUrl,
    shehnaiDataUrl,
    rangoliDataUrl,
  ] = await Promise.all([
    fetchImageAsDataUrl('/assets/images/mandap_floral_arch.png'),
    fetchImageAsDataUrl('/assets/aistudio/LALBAUGCHA_RAAJA_080e79d8.png'),
    fetchImageAsDataUrl('/assets/images/wax_seal_crest.png'),
    fetchImageAsDataUrl('/assets/images/pheta_turban_motif.png'),
    fetchImageAsDataUrl('/assets/images/bridal_nath_lotus.png'),
    fetchImageAsDataUrl('/assets/images/mangal_kalash_diya.png'),
    fetchImageAsDataUrl('/assets/images/mundavalya_pearls.png'),
    fetchImageAsDataUrl('/assets/images/shehnai_choughada.png'),
    fetchImageAsDataUrl('/assets/images/rangoli_lotus_diya.png'),
  ]);

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vinayak & Ruchi — Wedding Invitation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px 16px;
      background: #f2dfb9;
      background-image: radial-gradient(circle at 15% 15%, rgba(255,248,228,0.85), transparent 50%), radial-gradient(circle at 85% 85%, rgba(139,38,29,0.14), transparent 50%);
      color: #1f1b18;
      font-family: "Plus Jakarta Sans", system-ui, sans-serif;
      line-height: 1.65;
    }
    .gold-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      width: 0%;
      z-index: 99;
      background: linear-gradient(90deg, #8d6620, #e7c675, #b88933, #f3da98);
      box-shadow: 0 1px 8px rgba(180,131,44,0.45);
    }
    .folio {
      max-width: 860px;
      margin: 0 auto;
      background: #fffaf0;
      border: 2px solid #c89b44;
      box-shadow: 0 28px 64px rgba(78, 24, 18, 0.16);
      padding: 28px;
      position: relative;
    }
    .inner-frame {
      border: 1px solid #d6ab56;
      padding: 0 36px 44px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .arch-hero { width: calc(100% + 72px); margin: 0 -36px; height: auto; display: block; pointer-events: none; }
    .hero-body { position: relative; z-index: 2; margin-top: -120px; }
    .countdown-top {
      display: inline-flex;
      align-items: center;
      gap: 20px;
      padding: 10px 24px;
      background: linear-gradient(180deg, #fffaf0, #faeccd);
      border: 1px solid #c89b44;
      margin-bottom: 18px;
      font-variant-numeric: tabular-nums;
    }
    .cd-val { font-family: "Cormorant Garamond", Georgia, serif; font-size: 26px; font-weight: 600; color: #8b261d; display: block; line-height: 1; }
    .cd-lbl { font-size: 11px; color: #5c5346; letter-spacing: 0.08em; }
    .ganesha { width: 112px; height: auto; object-fit: contain; display: block; margin: 0 auto 14px; }
    .mundavalya { width: 250px; height: auto; object-fit: contain; display: block; margin: 8px auto -4px; }
    .seal { width: 68px; height: 68px; object-fit: contain; display: block; margin: 20px auto 8px; }
    .serif { font-family: "Cormorant Garamond", Georgia, serif; }
    .kicker { font-size: 13px; letter-spacing: 0.08em; color: #6d3d20; margin: 0 0 12px; }
    .names { font-family: "Cormorant Garamond", Georgia, serif; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 600; color: #8b261d; margin: 8px 0 12px; line-height: 1.08; }
    .amp { font-style: italic; font-weight: 400; color: #b6791e; font-size: 0.72em; margin: 0 10px; }
    .divider { width: 140px; height: 1px; background: #d6ab56; margin: 26px auto; border: 0; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 28px; text-align: left; margin-top: 24px; }
    .block-title { font-family: "Cormorant Garamond", Georgia, serif; font-size: 22px; font-weight: 600; color: #1f1b18; margin: 0 0 8px; }
    .muted { color: #5c5346; font-size: 14px; margin: 4px 0; }
    .muhurat-box { background: linear-gradient(135deg, #7c1d17, #52100c); color: #fff9ed; border: 2px solid #d4a64a; padding: 20px 26px; margin: 22px auto; max-width: 520px; }
    .motif-sm { height: 76px; width: 76px; object-fit: contain; margin-bottom: 10px; }
    .btn { display: inline-block; margin: 8px 6px 0; padding: 10px 18px; border: 1px solid #8b261d; color: #8b261d; text-decoration: none; font-size: 13px; font-weight: 500; }
    .btn-fill { background: #8b261d; color: #faf7f0; }
    @media print { body { background: #fff; padding: 0; } .folio { box-shadow: none; } .no-print, .gold-progress { display: none; } }
  </style>
</head>
<body>
  <div class="gold-progress" id="gp"></div>
  <main class="folio">
    <div class="inner-frame">
      ${archDataUrl ? `<img class="arch-hero" src="${archDataUrl}" alt="Marigold and jasmine wedding arch" />` : ''}
      <div class="hero-body">
        <div class="countdown-top" id="cd"></div>
        ${ganeshaDataUrl ? `<img class="ganesha" src="${ganeshaDataUrl}" alt="Lord Ganesha sacred emblem" />` : ''}
        <p class="kicker">${INVITATION_DATA.blessings}</p>
        <p class="muted">${INVITATION_DATA.hostInvocation}</p>
        ${mundavalyaDataUrl ? `<img class="mundavalya" src="${mundavalyaDataUrl}" alt="Maharashtrian pearl Mundavalya" />` : ''}
        <h1 class="names">Vinayak <span class="amp">&amp;</span> Ruchi</h1>
      </div>
      <div class="muhurat-box">
        <div class="serif" style="font-size:22px;font-weight:600;color:#fff9ed;">${INVITATION_DATA.muhurat.dateLabel}</div>
        <div style="font-size:15px;color:#f7de9c;font-weight:600;margin-top:4px;">At ${INVITATION_DATA.muhurat.timeLabel} · ${INVITATION_DATA.muhurat.note}</div>
      </div>
      <div class="grid-2">
        <div>
          ${phetaDataUrl ? `<img class="motif-sm" src="${phetaDataUrl}" alt="Royal Maharashtrian Pheta" />` : ''}
          <h2 class="block-title">Groom · Vinayak</h2>
          <p class="muted">${INVITATION_DATA.groom.lineage}</p>
          <p class="muted"><strong>Hometown:</strong> ${INVITATION_DATA.groom.hometown}</p>
        </div>
        <div>
          ${nathDataUrl ? `<img class="motif-sm" src="${nathDataUrl}" alt="Traditional Maharashtrian Pearl Nath" />` : ''}
          <h2 class="block-title">Bride · Ruchi</h2>
          <p class="muted">${INVITATION_DATA.bride.lineage}</p>
          <p class="muted"><strong>Hometown:</strong> ${INVITATION_DATA.bride.hometown}</p>
        </div>
      </div>
      <hr class="divider" />
      ${shehnaiDataUrl ? `<img style="height:104px;width:auto;margin:0 auto 12px;display:block;" src="${shehnaiDataUrl}" alt="Shehnai and Choughada" />` : ''}
      <p class="serif" style="font-size:19px;font-style:italic;max-width:560px;margin:0 auto;color:#2e2822;">${INVITATION_DATA.requestNote}</p>
      <hr class="divider" />
      ${kalashDataUrl ? `<img style="height:110px;width:auto;margin:0 auto 14px;display:block;" src="${kalashDataUrl}" alt="Brass Mangal Kalash" />` : ''}
      <div class="grid-2">
        ${INVITATION_DATA.events
          .map(
            (ev) => `<div>
          <h3 class="block-title" style="font-size:19px;">${ev.title}</h3>
          <p class="muted"><strong>${ev.dateLabel}</strong> · ${ev.timeLabel}</p>
          <p class="muted">${ev.venueName} — ${ev.addressLines.join(' ')}</p>
        </div>`
          )
          .join('')}
      </div>
      <hr class="divider" />
      ${rangoliDataUrl ? `<img style="height:88px;width:auto;margin:0 auto 14px;display:block;" src="${rangoliDataUrl}" alt="Sanskar Bharati Rangoli" />` : ''}
      <div class="grid-2">
        <div>
          <h3 class="block-title" style="font-size:19px;">With Best Wishes From</h3>
          <p class="muted">${INVITATION_DATA.bestWishesFrom.join('<br/>')}<br/><em>${INVITATION_DATA.familyCollective}</em></p>
        </div>
        <div>
          <h3 class="block-title" style="font-size:19px;">Warm Invitation</h3>
          <p class="muted">From the groom's uncles' children:<br/>${INVITATION_DATA.unclesChildren.slice(0, -1).join(', ')} and ${INVITATION_DATA.unclesChildren.slice(-1)[0]}.</p>
          <p class="muted" style="margin-top:12px;"><strong>From:</strong> ${INVITATION_DATA.contact.name}<br/>${INVITATION_DATA.contact.phones.join(' / ')}</p>
        </div>
      </div>
      <div class="no-print" style="margin-top:24px;">
        <a class="btn btn-fill" href="${INVITATION_DATA.venues.wedding.mapUrl}" target="_blank" rel="noopener noreferrer">Wedding Venue Map</a>
        <a class="btn" href="${INVITATION_DATA.venues.residence.mapUrl}" target="_blank" rel="noopener noreferrer">Residence Map</a>
      </div>
      ${sealDataUrl ? `<img class="seal" src="${sealDataUrl}" alt="Lotus wax seal crest" />` : ''}
      <p class="serif" style="font-size:18px;font-style:italic;color:#5c5346;margin-top:8px;">${INVITATION_DATA.closingNote}</p>
    </div>
  </main>
  <script>
    (function(){
      var target = new Date("${INVITATION_DATA.muhurat.isoDateTime}").getTime();
      var el = document.getElementById("cd");
      function tick(){
        var diff = Math.max(0, target - Date.now());
        var s = Math.floor(diff/1000), d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60);
        el.innerHTML = [[d,"Days"],[h,"Hours"],[m,"Minutes"]].map(function(x){
          return '<div><span class="cd-val">' + String(x[0]).padStart(2,"0") + '</span><span class="cd-lbl">' + x[1] + '</span></div>';
        }).join("");
      }
      tick(); setInterval(tick, 15000);
      var gp = document.getElementById("gp");
      function updateScroll(){
        var h = document.documentElement.scrollHeight - window.innerHeight;
        gp.style.width = (h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0) + "%";
      }
      window.addEventListener("scroll", updateScroll, { passive: true });
      updateScroll();
    })();
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  triggerBlobDownload(blob, 'Vinayak_Ruchi_Wedding_Invitation.html');
}
