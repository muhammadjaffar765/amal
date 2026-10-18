// Hajj and Umrah guide, written in simple words from widely taught steps.
// Details can differ between schools of thought and between groups, so always follow your scholar or guide.

export const HAJJ_TYPES = [
  { id: 'tamattu', name: 'Tamattu', text: 'Perform Umrah first, leave ihram, then enter ihram again for Hajj on the 8th of Dhul Hijjah. This is the most common type, and it needs a sacrifice (qurbani).' },
  { id: 'qiran', name: 'Qiran', text: 'Enter ihram for Umrah and Hajj together and stay in ihram until the 10th of Dhul Hijjah. It also needs a sacrifice.' },
  { id: 'ifrad', name: 'Ifrad', text: 'Perform Hajj only, without Umrah. A sacrifice is not required.' },
];

export const UMRAH_STEPS = [
  {
    id: 'ihram', scene: 'ihram', title: 'Enter ihram',
    points: [
      'Before the miqat (the boundary point), trim nails, make ghusl or at least wudu, and put on ihram clothes.',
      'Men wear two white unsewn cloths and do not cover the head. Women wear normal modest clothes and do not cover the face.',
      'Make the intention for Umrah and begin the talbiyah. Men say it aloud, women quietly.',
    ],
  },
  {
    id: 'tawaf', scene: 'kaaba', title: 'Tawaf: seven rounds around the Kaaba',
    points: [
      'Enter the Haram with the right foot and say the dua for entering the masjid.',
      'Men uncover the right shoulder (idtiba). Start at the Black Stone, point to it and say Allahu Akbar. Keep the Kaaba on your left.',
      'Men walk briskly (raml) in the first three rounds and normally in the other four. You may make any dua, or recite the Quran.',
      'Between the Yemeni Corner and the Black Stone, the sunnah is to say: Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar.',
    ],
  },
  {
    id: 'prayer', scene: 'kaaba', title: 'Two rakat and Zamzam',
    points: [
      'Cover the right shoulder again. Pray two rakat behind the Station of Ibrahim, or anywhere in the Haram.',
      'The sunnah is Surah al-Kafirun in the first rakat and Surah al-Ikhlas in the second.',
      'Drink Zamzam and make dua.',
    ],
  },
  {
    id: 'sai', scene: 'safa', title: 'Sa\'i: seven trips between Safa and Marwah',
    points: [
      'Start at Safa and finish at Marwah. Going from Safa to Marwah is one trip, and Marwah to Safa is the next. Seven trips in all.',
      'At the foot of Safa, recite the verse of Safa and Marwah (see the Duas tab) and make dua facing the Kaaba.',
      'Men walk quickly between the two green lights. Everyone else walks normally.',
    ],
  },
  {
    id: 'halq', scene: 'ihram', title: 'Shave or trim the hair',
    points: [
      'Men shave the whole head (better) or trim the hair evenly. Women cut about a fingertip length from the ends of their hair.',
      'Leave the Haram with the left foot and say the dua for leaving the masjid. Your Umrah is complete and the ihram restrictions end.',
    ],
  },
];

export const HAJJ_DAYS = [
  {
    id: 'd8', scene: 'mina', day: '8th Dhul Hijjah', name: 'Yawm at-Tarwiyah',
    points: [
      'Enter ihram for Hajj from where you are staying, make the intention for Hajj and recite the talbiyah.',
      'Go to Mina after Fajr, preferably in the morning.',
      'Pray Dhuhr, Asr, Maghrib, Isha and the next Fajr in Mina. The four-rakat prayers are shortened to two, each at its own time. Spend the day in worship.',
    ],
  },
  {
    id: 'd9', scene: 'arafah', day: '9th Dhul Hijjah', name: 'Day of Arafah',
    points: [
      'After sunrise, head to Arafah. Arafah is the heart of Hajj: Hajj is not valid without standing there.',
      'Dhuhr and Asr are prayed together and shortened, after the khutbah if you are at Namirah Masjid.',
      'Stand facing the Qiblah with raised hands, make dua, recite the talbiyah and seek forgiveness until sunset. Do not leave Arafah before sunset.',
      'The best dua on this day is: La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa ala kulli shay\'in qadir.',
    ],
  },
  {
    id: 'd9n', scene: 'muzdalifah', day: 'Night of the 9th', name: 'Muzdalifah',
    points: [
      'After sunset, go to Muzdalifah calmly.',
      'Pray Maghrib and Isha together at the time of Isha: Maghrib three rakat, Isha two rakat.',
      'Collect pebbles here or in Mina. About 49 are needed if you leave on the 12th, and 70 if you stay for the 13th. They should be about the size of a chickpea.',
      'Rest and worship until Fajr. Those who are weak may leave after midnight, so follow your group\'s guidance.',
    ],
  },
  {
    id: 'd10', scene: 'jamarat', day: '10th Dhul Hijjah', name: 'Eid al-Adha (Yawm an-Nahr)',
    points: [
      'Pray Fajr in Muzdalifah, then go to Mina.',
      'Stone Jamrat al-Aqabah (the big pillar) with seven pebbles, saying Allahu Akbar with each throw.',
      'Offer the sacrifice (or arrange it through your group), then shave or trim your hair. Most ihram restrictions now end.',
      'Go to Makkah for Tawaf al-Ifadah (a Hajj pillar) followed by sa\'i if it is due, then return to Mina. It can be done up to the 12th, or later with the guidance of a scholar.',
    ],
  },
  {
    id: 'd11', scene: 'jamarat', day: '11th and 12th Dhul Hijjah', name: 'Days of Tashreeq in Mina',
    points: [
      'After the sun passes its highest point (zawal), stone all three pillars, seven pebbles each, in order: the small one, the middle one, then the big one.',
      'After the first and second pillar, step aside, face the Qiblah and make a long dua. After the third, move on without dua.',
      'If you want to leave on the 12th, you must leave Mina before sunset. Otherwise stay for the 13th and stone again.',
    ],
  },
  {
    id: 'dwada', scene: 'kaaba', day: 'Before leaving Makkah', name: 'Tawaf al-Wada (farewell)',
    points: [
      'Perform a farewell tawaf as your last act in Makkah before you travel.',
      'Women with menstruation are excused from the farewell tawaf.',
      'May Allah accept your Hajj. Hajj mabrur.',
    ],
  },
];

export const IHRAM_RULES = {
  both: ['Using perfume or scented soap', 'Cutting hair or nails', 'Hunting or harming animals, and cutting plants of the Haram', 'Marital relations and marriage contracts'],
  men: ['Wearing sewn clothing, such as shirts and trousers', 'Covering the head'],
  women: ['Covering the face with a niqab and wearing gloves (the face may be covered from men by other means)'],
};

export const HAJJ_CHECKLIST = [
  'Pay your debts and return what you owe people',
  'Write your will and tell your family where your papers are',
  'Learn the steps of Hajj with a trusted guide or teacher',
  'Make sure your money for Hajj is lawful',
  'Passport, visa and vaccination papers (keep copies)',
  'Two sets of ihram for men, and modest loose clothing for women',
  'Unscented soap, toiletries and a small bag for the pebbles',
  'Comfortable, open footwear that is easy to take on and off',
  'Medicines you need, with the prescription',
  'A small Quran or phone with this app, and a list of duas',
  'A water bottle, a hat or umbrella (for non-ihram days) and sun protection',
  'Patience, good manners and a clean intention',
];

export const HAJJ_DUAS = [
  {
    id: 'niyyah-umrah', title: 'Intention for Umrah', arabic: 'لَبَّيْكَ اللَّهُمَّ بِعُمْرَةٍ',
    translit: "Labbayk Allahumma bi-umrah.", en: 'Here I am, O Allah, performing Umrah.', ur: 'اے اللہ! میں عمرے کے لیے حاضر ہوں۔',
  },
  {
    id: 'niyyah-hajj', title: 'Intention for Hajj', arabic: 'لَبَّيْكَ اللَّهُمَّ بِحَجٍّ',
    translit: "Labbayk Allahumma bi-hajj.", en: 'Here I am, O Allah, performing Hajj.', ur: 'اے اللہ! میں حج کے لیے حاضر ہوں۔',
  },
  {
    id: 'talbiyah', title: 'The Talbiyah', arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    translit: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
    en: 'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Indeed all praise, grace and sovereignty belong to You. You have no partner.',
    ur: 'میں حاضر ہوں اے اللہ! میں حاضر ہوں۔ میں حاضر ہوں، تیرا کوئی شریک نہیں، میں حاضر ہوں۔ بے شک ساری تعریف، نعمت اور بادشاہی تیری ہے۔ تیرا کوئی شریک نہیں۔',
  },
  {
    id: 'tawaf-dua', title: 'Between the Yemeni Corner and the Black Stone', quran: [{ s: 2, from: 201, to: 201 }],
    en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    ur: 'اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے، اور ہمیں آگ کے عذاب سے بچا۔',
  },
  {
    id: 'safa-verse', title: 'At the foot of Safa', quran: [{ s: 2, from: 158, to: 158 }],
    en: 'Indeed, Safa and Marwah are among the symbols of Allah. So whoever makes Hajj to the House or performs Umrah, there is no blame on him for walking between them.',
    ur: 'بے شک صفا اور مروہ اللہ کی نشانیوں میں سے ہیں۔ پس جو بیت اللہ کا حج یا عمرہ کرے تو اس پر ان دونوں کے درمیان سعی کرنے میں کوئی گناہ نہیں۔',
  },
  {
    id: 'sai-dhikr', title: 'On Safa and Marwah', arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ. لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ. لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
    translit: "Allahu akbar, Allahu akbar, Allahu akbar. La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa ala kulli shay'in qadir. La ilaha illallahu wahdah, anjaza wa'dah, wa nasara abdah, wa hazamal-ahzaba wahdah.",
    en: 'Allah is the Greatest (three times). There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is able to do all things. There is no god but Allah alone. He fulfilled His promise, helped His servant and defeated the confederates alone.',
    ur: 'اللہ سب سے بڑا ہے (تین بار)۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف ہے، اور وہ ہر چیز پر قادر ہے۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس نے اپنا وعدہ پورا کیا، اپنے بندے کی مدد کی اور تنہا لشکروں کو شکست دی۔',
  },
  {
    id: 'arafah-dua', title: 'Dua of the Day of Arafah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translit: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa ala kulli shay'in qadir.",
    en: 'There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is able to do all things.',
    ur: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف ہے، اور وہ ہر چیز پر قادر ہے۔',
  },
  {
    id: 'jamarat-takbir', title: 'At each stone thrown', arabic: 'اللَّهُ أَكْبَرُ', translit: 'Allahu akbar.', en: 'Allah is the Greatest.', ur: 'اللہ سب سے بڑا ہے۔',
  },
  {
    id: 'masjid-leave', title: 'Leaving the Haram', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', translit: "Allahumma inni as'aluka min fadlik.",
    en: 'O Allah, I ask You of Your bounty.', ur: 'اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔',
  },
];
