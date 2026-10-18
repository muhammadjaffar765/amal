// Content for the Kids Corner. Everything stays on the device: no accounts, no ads, no tracking.

// Arabic letters: [letter, Arabic name (spoken), simple English name]
export const QAIDA_LETTERS = [
  ['ا', 'ألف', 'Alif'], ['ب', 'باء', 'Ba'], ['ت', 'تاء', 'Ta'], ['ث', 'ثاء', 'Tha'], ['ج', 'جيم', 'Jeem'], ['ح', 'حاء', 'Ha'],
  ['خ', 'خاء', 'Kha'], ['د', 'دال', 'Dal'], ['ذ', 'ذال', 'Dhal'], ['ر', 'راء', 'Ra'], ['ز', 'زاي', 'Zay'], ['س', 'سين', 'Seen'],
  ['ش', 'شين', 'Sheen'], ['ص', 'صاد', 'Saad'], ['ض', 'ضاد', 'Daad'], ['ط', 'طاء', 'Taa'], ['ظ', 'ظاء', 'Zaa'], ['ع', 'عين', 'Ayn'],
  ['غ', 'غين', 'Ghayn'], ['ف', 'فاء', 'Fa'], ['ق', 'قاف', 'Qaf'], ['ك', 'كاف', 'Kaf'], ['ل', 'لام', 'Lam'], ['م', 'ميم', 'Meem'],
  ['ن', 'نون', 'Noon'], ['ه', 'هاء', 'Haa'], ['و', 'واو', 'Waw'], ['ء', 'همزة', 'Hamza'], ['ي', 'ياء', 'Ya'],
];
// Letters that do not join to the letter after them
export const NON_JOINERS = ['ا', 'د', 'ذ', 'ر', 'ز', 'و', 'ء'];
export const FATHA = '\u064E';
export const KASRA = '\u0650';
export const DAMMA = '\u064F';
export const SUKOON = '\u0652';
export const SHADDA = '\u0651';

export const QAIDA_LESSONS = [
  { id: 'letters', title: 'The letters', desc: 'Meet the 29 Arabic letters and hear each one.' },
  { id: 'shapes', title: 'Letter shapes', desc: 'How a letter looks at the start, middle and end of a word.' },
  { id: 'harakat', title: 'Zabar, Zer, Pesh', desc: 'Short sounds: fatha, kasra and damma.' },
  { id: 'tanween', title: 'Tanween', desc: 'Two zabar, two zer and two pesh.' },
  { id: 'madd', title: 'Long sounds', desc: 'Stretching a sound: ba, bee, boo.' },
  { id: 'sukoon', title: 'Sukoon and Shadda', desc: 'A stop on the letter, and a doubled letter.' },
];

export const MEMORY_PAIRS = [
  { emoji: '🕌', ar: 'مسجد', en: 'Masjid' },
  { emoji: '🌙', ar: 'قمر', en: 'Qamar (moon)' },
  { emoji: '📖', ar: 'قرآن', en: 'Quran' },
  { emoji: '🕋', ar: 'كعبة', en: 'Kaaba' },
  { emoji: '🌴', ar: 'نخلة', en: 'Nakhla (palm)' },
  { emoji: '💧', ar: 'ماء', en: 'Maa (water)' },
  { emoji: '☀️', ar: 'شمس', en: 'Shams (sun)' },
  { emoji: '⭐', ar: 'نجم', en: 'Najm (star)' },
];

export const QUIZ = [
  { q: 'How many pillars of Islam are there?', o: ['3', '4', '5', '6'], a: 2 },
  { q: 'What is the first pillar of Islam?', o: ['Salah', 'Shahadah', 'Zakat', 'Hajj'], a: 1 },
  { q: 'How many times do Muslims pray every day?', o: ['2', '3', '5', '7'], a: 2 },
  { q: 'In which month do Muslims fast?', o: ['Rajab', 'Shawwal', 'Ramadan', 'Muharram'], a: 2 },
  { q: 'What is the holy book of Islam?', o: ['The Quran', 'A storybook', 'A newspaper', 'A dictionary'], a: 0 },
  { q: 'In which city is the Kaaba?', o: ['Madinah', 'Makkah', 'Cairo', 'Jerusalem'], a: 1 },
  { q: 'Who is the last Prophet?', o: ['Musa', 'Isa', 'Ibrahim', 'Muhammad ﷺ'], a: 3 },
  { q: 'Who was the first Prophet?', o: ['Adam', 'Nuh', 'Musa', 'Yusuf'], a: 0 },
  { q: 'Which angel brought the Quran to the Prophet ﷺ?', o: ['Jibril', 'Mikail', 'Israfil', 'Izrail'], a: 0 },
  { q: 'What do we say before we eat?', o: ['Bismillah', 'Alhamdulillah', 'SubhanAllah', 'Ameen'], a: 0 },
  { q: 'What do we say after we finish eating?', o: ['Bismillah', 'Alhamdulillah', 'Astaghfirullah', 'Ameen'], a: 1 },
  { q: 'How do Muslims greet each other?', o: ['As-salamu alaykum', 'Good morning', 'See you', 'Goodbye'], a: 0 },
  { q: 'How many surahs are in the Quran?', o: ['100', '110', '114', '120'], a: 2 },
  { q: 'What is the first surah of the Quran?', o: ['Al-Baqarah', 'Al-Fatihah', 'Al-Ikhlas', 'An-Nas'], a: 1 },
  { q: 'Which Eid comes after Ramadan?', o: ['Eid al-Fitr', 'Eid al-Adha', 'Both', 'Neither'], a: 0 },
  { q: 'Which direction do Muslims face to pray?', o: ['North', 'East', 'West', 'The Qibla (towards the Kaaba)'], a: 3 },
  { q: 'Which prayer is prayed at dawn?', o: ['Fajr', 'Dhuhr', 'Asr', 'Isha'], a: 0 },
  { q: 'Which prayer is prayed just after sunset?', o: ['Fajr', 'Asr', 'Maghrib', 'Isha'], a: 2 },
  { q: 'Which Prophet built the Kaaba with his son Ismail?', o: ['Ibrahim', 'Nuh', 'Dawud', 'Yunus'], a: 0 },
  { q: 'Which Prophet was swallowed by a big fish?', o: ['Musa', 'Yunus', 'Yusuf', 'Ayyub'], a: 1 },
  { q: 'Which Prophet is remembered for his patience in illness?', o: ['Ayyub', 'Adam', 'Isa', 'Harun'], a: 0 },
  { q: 'What do we do before we pray?', o: ['Wudu', 'Sleep', 'Swim', 'Play'], a: 0 },
  { q: 'What is Zakat?', o: ['Giving a part of our wealth to people in need', 'A kind of prayer', 'A trip', 'A fast'], a: 0 },
  { q: 'How many rakat are in the Fajr fard prayer?', o: ['2', '3', '4', '5'], a: 0 },
  { q: 'What was the name of the Prophet’s ﷺ mother?', o: ['Aminah', 'Khadijah', 'Aisha', 'Fatimah'], a: 0 },
];

export const ORDER_GAMES = {
  wudu: {
    title: 'Wudu steps',
    intro: 'Put the steps of wudu in the right order.',
    steps: [
      'Say Bismillah and make the intention',
      'Wash both hands up to the wrists',
      'Rinse the mouth',
      'Clean the nose with water',
      'Wash the face',
      'Wash the arms up to the elbows (right, then left)',
      'Wipe the head',
      'Wipe the ears',
      'Wash the feet up to the ankles (right, then left)',
      'Say the dua after wudu',
    ],
  },
  salah: {
    title: 'Salah steps',
    intro: 'Put the steps of a two-rakat prayer in order (simplified).',
    steps: [
      'Stand facing the Qibla and make the intention',
      'Say "Allahu Akbar" and fold the hands',
      'Recite Surah Al-Fatihah and another surah',
      'Say "Allahu Akbar" and bow (Ruku)',
      'Stand up straight again',
      'Go down to Sujood, forehead on the ground',
      'Sit up for a moment',
      'Do the second Sujood',
      'Sit for Tashahhud and send Durood on the Prophet ﷺ',
      'Turn the face to the right, then to the left, saying "As-salamu alaykum wa rahmatullah"',
    ],
  },
};

export const KIDS_DUAS = ['eat-before', 'eat-after', 'sleep', 'wake', 'home-enter', 'home-leave', 'clothes', 'masjid-in', 'masjid-out', 'rain', 'thanks', 'salam', 'toilet-in', 'toilet-out'];
export const STICKERS = ['⭐', '🌙', '🕌', '📖', '🌴', '🕋', '🌟', '🤲', '🌹', '🦋', '🐪', '🐑', '🌈', '🎈', '🍎', '🍇', '🐦', '🌸', '🍯', '💧', '☀️', '🌿', '🧡', '🎀'];

export const BADGES = [
  { id: 'letters', emoji: '🔤', name: 'Letter Learner', how: 'Finish the letters lesson' },
  { id: 'quiz', emoji: '❓', name: 'Quiz Starter', how: 'Finish a quiz' },
  { id: 'perfect', emoji: '🏆', name: 'Perfect Score', how: 'Answer every quiz question right' },
  { id: 'memory', emoji: '🧠', name: 'Memory Star', how: 'Finish a memory game' },
  { id: 'wudu', emoji: '💧', name: 'Wudu Expert', how: 'Put the wudu steps in order' },
  { id: 'salah', emoji: '🤲', name: 'Salah Star', how: 'Put the salah steps in order' },
  { id: 'stickers', emoji: '🎖️', name: 'Sticker Collector', how: 'Collect 5 stickers' },
  { id: 'stories', emoji: '📚', name: 'Story Lover', how: 'Read 3 stories' },
];

// Short stories, written in simple words from what the Quran and the Seerah tell us.
export const STORIES = [
  {
    id: 'adam', emoji: '🌿', title: 'Adam and saying sorry',
    text: 'Allah created Adam, peace be upon him, from clay, and taught him the names of things. Adam and his wife Hawwa lived in a beautiful garden. Allah told them they could enjoy everything except one tree. Shaytan whispered to them, and they forgot and ate from it. They felt very sorry and said, "Our Lord, we have wronged ourselves. If You do not forgive us, we will be lost." Allah forgave them. We learn that everyone makes mistakes, and Allah loves it when we say sorry and try again.',
  },
  {
    id: 'nuh', emoji: '🚢', title: 'Nuh and the great ship',
    text: 'Nuh, peace be upon him, called his people to worship Allah alone for a very long time. Most of them would not listen. Allah told Nuh to build a ship. People laughed at him as he worked. Then the rain came and the water rose. Nuh, the believers and pairs of animals went on the ship, and they were safe. We learn to be patient and to trust Allah, even when others laugh at us.',
  },
  {
    id: 'ibrahim', emoji: '🔥', title: 'Ibrahim and the fire',
    text: 'Ibrahim, peace be upon him, asked his people, "Why do you pray to statues that cannot hear or help you?" One day he broke the statues, and the people were angry. They made a huge fire and threw him in. But Allah said, "O fire, be cool and safe for Ibrahim." The fire did not hurt him. We learn to be brave and to believe that Allah always protects those who trust Him.',
  },
  {
    id: 'yusuf', emoji: '🌟', title: 'Yusuf, the boy with a dream',
    text: 'Yusuf, peace be upon him, dreamed of eleven stars, the sun and the moon bowing to him. His father Yaqub loved him, and some of his brothers became jealous. They threw him into a well. A caravan found him and took him to Egypt. Yusuf stayed patient and honest, and in time he became a trusted leader. When his brothers came to him, he forgave them. We learn patience, honesty and forgiveness.',
  },
  {
    id: 'musa', emoji: '🧺', title: 'Musa and the river',
    text: 'A cruel ruler named Firawn was afraid of baby boys born at that time. Musa’s mother trusted Allah and placed her baby in a basket on the river. The river carried him to Firawn’s house, where he was kept safe, and Allah brought him back to be nursed by his own mother. When Musa grew up, Allah chose him as a Prophet. We learn that Allah looks after us in ways we cannot see.',
  },
  {
    id: 'ayyub', emoji: '💚', title: 'Ayyub and patience',
    text: 'Ayyub, peace be upon him, had health, family and wealth, and he thanked Allah for it all. Then he became very sick for a long time and lost much of what he had. He never complained. He prayed, "I am in hardship, and You are the Most Merciful of those who show mercy." Allah healed him and blessed him again. We learn to be thankful in good times and patient in hard times.',
  },
  {
    id: 'yunus', emoji: '🐋', title: 'Yunus and the big fish',
    text: 'Yunus, peace be upon him, was sent to his people but left them before Allah allowed him to. On a ship during a storm, he was thrown into the sea and a big fish swallowed him. In the darkness he called out, "There is no god but You, glory to You. I was one of those who did wrong." Allah heard him and saved him. We learn that no place is too dark to call upon Allah.',
  },
  {
    id: 'muhammad', emoji: '🕋', title: 'The Prophet ﷺ and the Black Stone',
    text: 'The people of Makkah were rebuilding the Kaaba. When it was time to put the Black Stone back, every tribe wanted the honour, and they began to argue. They agreed that the first person to walk in would decide. It was Muhammad ﷺ, whom they called Al-Amin, the Trustworthy. He spread out a cloth, put the stone in the middle, and asked each tribe to hold one corner and lift it together. Then he placed the stone in its spot with his own hands. Everyone was happy. We learn to be wise, fair and to bring people together.',
  },
];
