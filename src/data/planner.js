// Content for the Umrah and Hajj planners. Suggestions are general and optional; rules and permits
// change from year to year, so always follow your group leader and official announcements.

export const UMRAH_STEPS_SHORT = [
  'Put on ihram before the miqat, and make the intention for Umrah',
  'Tawaf: seven rounds around the Kaaba, then two rakat',
  "Sa'i: seven trips between Safa and Marwah",
  'Shave or trim the hair. Your Umrah is complete',
];

export const UMRAH_PACK = [
  { group: 'Documents', items: ['Passport and visa (and photocopies)', 'Flight tickets and hotel bookings', 'Vaccination papers', 'Emergency contacts written on paper'] },
  { group: 'Ihram and clothes', items: ['Two sets of ihram (men)', 'Modest loose clothes and a scarf (women)', 'Comfortable open sandals', 'Ihram belt and a small bag'] },
  { group: 'Health and care', items: ['Medicines, with prescription', 'Unscented soap and toiletries', 'Sunscreen, lip balm and a hat or umbrella', 'Small first-aid kit'] },
  { group: 'Worship and daily use', items: ['Small Quran or this app, and a list of duas', 'Prayer mat and a small tasbeeh', 'Reusable water bottle', 'Power bank, charger and a local SIM or roaming'] },
];

export const HAJJ_PACK = [
  { group: 'Documents', items: ['Passport, Hajj visa and Nusuk or group papers', 'Vaccination papers (keep copies)', 'Tent (Mina and Arafah) number and group leader contact', 'Emergency contacts written on paper'] },
  { group: 'Ihram and clothes', items: ['Two sets of ihram (men)', 'Modest loose clothes (women) and spare scarves', 'Easy-to-remove sandals for ihram', 'Light clothes for the heat, and a small bag or belt bag'] },
  { group: 'Health and care', items: ['Medicines, with prescription', 'Unscented soap, toiletries and wet wipes', 'Sunscreen and an umbrella', 'Electrolyte or rehydration salts'] },
  { group: 'Mina, Arafah and Muzdalifah', items: ['Small bag for pebbles (about 49 to 70)', 'Sleeping mat and a light blanket', 'Torch and earplugs', 'Power bank and a small prayer mat'] },
];

export const HAJJ_STAGES = [
  { id: 'arrive', title: 'Arrive and settle in', note: 'Rest, learn the route to the Haram, and attend your group briefing.' },
  { id: 'umrah', title: 'Umrah (for Tamattu)', note: 'Perform Umrah, then leave ihram until the 8th. Skip this stage for Ifrad.', tamattu: true },
  { id: 'd8', title: '8 Dhul Hijjah: Tarwiyah', note: 'Enter ihram for Hajj and go to Mina.', day: 0 },
  { id: 'd9', title: '9 Dhul Hijjah: Arafah', note: 'Stand in Arafah until sunset. This is the heart of Hajj.', day: 1 },
  { id: 'd9n', title: 'Night of the 9th: Muzdalifah', note: 'Pray Maghrib and Isha together, collect pebbles, rest until Fajr.', day: 1 },
  { id: 'd10', title: '10 Dhul Hijjah: Eid', note: 'Stone Jamrat al-Aqabah, sacrifice, shave or trim, then Tawaf al-Ifadah.', day: 2 },
  { id: 'd11', title: '11 Dhul Hijjah: Mina', note: 'Stone the three Jamarat after midday.', day: 3 },
  { id: 'd12', title: '12 Dhul Hijjah: Mina', note: 'Stone the three Jamarat. Leave Mina before sunset, or stay for the 13th.', day: 4 },
  { id: 'd13', title: '13 Dhul Hijjah (if you stay)', note: 'Stone the three Jamarat again, then leave Mina.', day: 5, optional: true },
  { id: 'wada', title: 'Farewell Tawaf', note: 'Your last act in Makkah before you travel.' },
  { id: 'depart', title: 'Travel home', note: 'Hajj mabrur. Return safely.' },
];
