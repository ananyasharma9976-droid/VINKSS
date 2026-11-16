export interface CeremonyEvent {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string;
  venueShort: string;
  addressLines: string[];
  mapQuery: string;
  startIso: string;
  endIso: string;
  description: string;
}

export const INVITATION_DATA = {
  blessings:
    'The blessings of Lord Ganesha, Shri Khandoba and Goddess Tulja Bhavani',
  hostInvocation: 'The Walekar Family cordially invites you to celebrate the wedding of',
  groom: {
    firstName: 'Vinayak',
    lineage:
      'Grandson of Late Smt. Parvati and Late Shri Shankar Ramchandra Walekar, and the son of Late Smt. Sunita and Late Shri Chandrakant Shankar Walekar.',
    hometown: 'Poud, Taluka Mulshi, District Pune',
  },
  bride: {
    firstName: 'Ruchi',
    lineage:
      'Youngest daughter of Smt. Rasika and Shri Rajendra Atmaram Surve.',
    hometown: 'Aajivali, Taluka Rajapur, District Ratnagiri',
  },
  muhurat: {
    dateLabel: 'Tuesday, 24 November 2026',
    timeLabel: '12:14 p.m.',
    note: 'Auspicious wedding muhurat',
    isoDateTime: '2026-11-24T12:14:00+05:30',
  },
  requestNote:
    'We humbly request you and your family to grace this joyful occasion with your presence and bless the bride and groom. Your presence will make our celebration even more special.',
  closingNote: 'We look forward to celebrating with you!',
  bestWishesFrom: [
    'Shri Sukhdev Shankar Walekar',
    'Smt. Suman Sukhdev Walekar',
    'Shri Sushant Sukhdev Walekar',
    'Smt. Aparna Sushant Walekar',
    'Shri Prashant Sukhdev Walekar',
    'Smt. Swapnali Prashant Walekar',
    'Shri Shrikant Sukhdev Walekar',
    'Smt. Priti Shrikant Walekar',
  ],
  familyCollective: 'Walekar Family, relatives and friends',
  unclesChildren: [
    'Avighna',
    'Aarohi',
    'Ishani',
    'Shrinika',
    'Ivaan',
    'Malhar',
  ],
  contact: {
    name: 'Prashant Walekar',
    phones: ['9821233696', '7977544804'],
  },
  venues: {
    wedding: {
      label: 'Wedding Venue',
      name: 'Shri Kachhi Lohar Banquet',
      addressLines: [
        '25, Laxmi Narayan Lane,',
        'Near Matunga Central Railway Station,',
        'Mumbai – 400 019.',
      ],
      landmark: 'Steps from Matunga Central Railway Station (CR)',
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=Shri+Kachhi+Lohar+Banquet+25+Laxmi+Narayan+Lane+Matunga+Mumbai+400019',
    },
    residence: {
      label: 'Walekar Residence',
      name: 'Vrundavan-2 / 517',
      addressLines: [
        'Opposite Jaihind Cinema,',
        'Chinchpokli, Lalbaug,',
        'Mumbai – 400 012.',
      ],
      landmark: 'Opposite Jaihind Cinema, Chinchpokli – Lalbaug',
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=Vrundavan+opposite+Jaihind+Cinema+Chinchpokli+Lalbaug+Mumbai+400012',
    },
  },
  events: [
    {
      id: 'haldi',
      title: 'Haldi Ceremony',
      subtitle: 'Traditional turmeric blessings & music',
      dateLabel: 'Sunday, 22 November 2026',
      timeLabel: 'At 7:00 p.m.',
      venueName: 'Walekar Residence',
      venueShort: 'At our residence · Chinchpokli, Lalbaug',
      addressLines: [
        'Vrundavan-2/517, opposite Jaihind Cinema,',
        'Chinchpokli, Lalbaug, Mumbai – 400 012.',
      ],
      mapQuery:
        'https://www.google.com/maps/search/?api=1&query=Vrundavan+opposite+Jaihind+Cinema+Chinchpokli+Lalbaug+Mumbai+400012',
      startIso: '20261122T190000',
      endIso: '20261122T213000',
      description:
        'Haldi Ceremony for Vinayak & Ruchi at the Walekar Residence, Vrundavan-2/517, opposite Jaihind Cinema, Chinchpokli, Lalbaug, Mumbai – 400 012.',
    },
    {
      id: 'wedding',
      title: 'Wedding Ceremony',
      subtitle: 'Auspicious wedding muhurat',
      dateLabel: 'Tuesday, 24 November 2026',
      timeLabel: 'At 12:14 p.m.',
      venueName: 'Shri Kachhi Lohar Banquet',
      venueShort: 'Matunga Central, Mumbai',
      addressLines: [
        '25, Laxmi Narayan Lane,',
        'Near Matunga Central Railway Station,',
        'Mumbai – 400 019.',
      ],
      mapQuery:
        'https://www.google.com/maps/search/?api=1&query=Shri+Kachhi+Lohar+Banquet+25+Laxmi+Narayan+Lane+Matunga+Mumbai+400019',
      startIso: '20261124T121400',
      endIso: '20261124T143000',
      description:
        'Auspicious Wedding Muhurat of Vinayak and Ruchi at Shri Kachhi Lohar Banquet, 25 Laxmi Narayan Lane, Near Matunga Central Railway Station, Mumbai – 400 019.',
    },
    {
      id: 'reception',
      title: 'Dinner & Welcome Reception',
      subtitle: 'Evening feast & warm celebrations',
      dateLabel: 'Tuesday, 24 November 2026',
      timeLabel: '6:30 p.m. to 9:30 p.m.',
      venueName: 'Shri Kachhi Lohar Banquet',
      venueShort: 'Matunga Central, Mumbai',
      addressLines: [
        '25, Laxmi Narayan Lane,',
        'Near Matunga Central Railway Station,',
        'Mumbai – 400 019.',
      ],
      mapQuery:
        'https://www.google.com/maps/search/?api=1&query=Shri+Kachhi+Lohar+Banquet+25+Laxmi+Narayan+Lane+Matunga+Mumbai+400019',
      startIso: '20261124T183000',
      endIso: '20261124T213000',
      description:
        'Dinner & Welcome Reception celebrating Vinayak and Ruchi at Shri Kachhi Lohar Banquet, 25 Laxmi Narayan Lane, Near Matunga Central Railway Station, Mumbai – 400 019.',
    },
    {
      id: 'pooja',
      title: 'Shri Satyanarayan Pooja',
      subtitle: 'Sacred thanksgiving prayer',
      dateLabel: 'Thursday, 26 November 2026',
      timeLabel: 'At our residence',
      venueName: 'Walekar Residence',
      venueShort: 'At our residence · Chinchpokli, Lalbaug',
      addressLines: [
        'Vrundavan-2/517, opposite Jaihind Cinema,',
        'Chinchpokli, Lalbaug, Mumbai – 400 012.',
      ],
      mapQuery:
        'https://www.google.com/maps/search/?api=1&query=Vrundavan+opposite+Jaihind+Cinema+Chinchpokli+Lalbaug+Mumbai+400012',
      startIso: '20261126T100000',
      endIso: '20261126T130000',
      description:
        'Shri Satyanarayan Pooja at the Walekar Residence, Vrundavan-2/517, opposite Jaihind Cinema, Chinchpokli, Lalbaug, Mumbai – 400 012.',
    },
  ] as CeremonyEvent[],
};
