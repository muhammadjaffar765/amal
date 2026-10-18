// Daily adhkar. Items with `quran` load their Arabic text from the Quran API (exact text).
// Items with `arabic` are short, widely known supplications from the hadith.
// Always compare with a printed source you trust (such as Hisn al-Muslim).

const KURSI = {
  id: 'kursi', title: 'Ayat al-Kursi', count: 1, quran: [{ s: 2, from: 255, to: 255 }],
  en: 'The Throne Verse.', ur: 'آیت الکرسی۔',
};
const QULS = {
  id: 'quls', title: 'Al-Ikhlas, Al-Falaq and An-Nas', count: 3,
  quran: [{ s: 112 }, { s: 113 }, { s: 114 }],
  en: 'Recite the three surahs together, three times.', ur: 'تینوں سورتیں ملا کر تین مرتبہ پڑھیں۔',
};
const SAYYID = {
  id: 'sayyid', title: 'Sayyid al-Istighfar', count: 1, source: 'Sahih al-Bukhari',
  arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
  translit: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika alayya, wa abu'u bidhanbi faghfir li, fa innahu la yaghfirudh-dhunuba illa anta.",
  en: 'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant, and I keep Your covenant and promise as far as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.',
  ur: 'اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی استطاعت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کی برائی سے تیری پناہ مانگتا ہوں، میں تیری نعمت کا اقرار کرتا ہوں جو مجھ پر ہے اور اپنے گناہ کا اعتراف کرتا ہوں، پس مجھے بخش دے، بے شک تیرے سوا کوئی گناہ نہیں بخشتا۔',
};
const RADITU = {
  id: 'raditu', title: 'Pleased with Allah as Lord', count: 3,
  arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ نَبِيًّا',
  translit: "Radeetu billahi rabba, wa bil-Islami deena, wa bi Muhammadin nabiyya.",
  en: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad as my Prophet.',
  ur: 'میں اللہ کے رب ہونے، اسلام کے دین ہونے اور محمد ﷺ کے نبی ہونے پر راضی ہوں۔',
};
const BISMILLAH_LA_YADURRU = {
  id: 'la-yadurru', title: 'In the name of Allah, nothing can harm', count: 3,
  arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
  translit: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-Alim.",
  en: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.',
  ur: 'اللہ کے نام سے، جس کے نام کے ساتھ زمین و آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہ سننے والا جاننے والا ہے۔',
};
const AUDHU_KALIMAT = {
  id: 'audhu-kalimat', title: 'Refuge in the perfect words of Allah', count: 3,
  arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
  translit: "A'udhu bikalimatillahit-tammati min sharri ma khalaq.",
  en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
  ur: 'میں اللہ کے کامل کلمات کی پناہ مانگتا ہوں ہر اس چیز کے شر سے جو اس نے پیدا کی۔',
};
const SUBHANALLAH_BIHAMDIHI = {
  id: 'subhanallah-bihamdihi', title: 'Subhanallahi wa bihamdihi', count: 100,
  arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', translit: 'Subhanallahi wa bihamdihi.',
  en: 'Glory be to Allah and praise be to Him.', ur: 'اللہ پاک ہے اور اسی کی تعریف ہے۔',
};
const TAHLIL = {
  id: 'tahlil', title: 'La ilaha illallah wahdahu', count: 10,
  arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
  translit: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay'in qadir.",
  en: 'There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is able to do all things.',
  ur: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف ہے، اور وہ ہر چیز پر قادر ہے۔',
};
const ISTIGHFAR = {
  id: 'istighfar', title: 'Istighfar', count: 100,
  arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', translit: 'Astaghfirullaha wa atubu ilayh.',
  en: 'I seek forgiveness from Allah and turn to Him in repentance.',
  ur: 'میں اللہ سے بخشش مانگتا ہوں اور اسی کی طرف رجوع کرتا ہوں۔',
};
const SALAWAT_SHORT = {
  id: 'salawat-short', title: 'Salawat on the Prophet', count: 10,
  arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِهِ وَصَحْبِهِ أَجْمَعِينَ',
  translit: "Allahumma salli wa sallim wa barik ala sayyidina Muhammadin wa ala alihi wa sahbihi ajma'in.",
  en: 'O Allah, send prayers, peace and blessings upon our master Muhammad, and upon his family and all his companions.',
  ur: 'اے اللہ! ہمارے سردار محمد ﷺ اور ان کی آل اور تمام صحابہ پر درود، سلام اور برکت نازل فرما۔',
};
const SALAWAT_IBRAHIMIYYA = {
  id: 'salawat-ibrahimiyya', title: 'Salat Ibrahimiyya (the prayer in tashahhud)', count: 10,
  arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
  translit: "Allahumma salli ala Muhammadin wa ala ali Muhammad, kama sallayta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik ala Muhammadin wa ala ali Muhammad, kama barakta ala Ibrahima wa ala ali Ibrahim, innaka Hamidun Majid.",
  en: 'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim; You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; You are Praiseworthy and Glorious.',
  ur: 'اے اللہ! محمد ﷺ اور آلِ محمد پر رحمت نازل فرما جیسے تو نے ابراہیم اور آلِ ابراہیم پر رحمت نازل فرمائی، بے شک تو تعریف والا، بزرگی والا ہے۔ اے اللہ! محمد ﷺ اور آلِ محمد پر برکت نازل فرما جیسے تو نے ابراہیم اور آلِ ابراہیم پر برکت نازل فرمائی، بے شک تو تعریف والا، بزرگی والا ہے۔',
};
const SALAWAT_SAW = {
  id: 'salawat-saw', title: 'Sallallahu alayhi wa sallam', count: 100,
  arabic: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', translit: 'Sallallahu alayhi wa sallam.',
  en: 'May Allah send prayers and peace upon him.', ur: 'اللہ ان پر درود و سلام بھیجے۔',
};

export const ADHKAR_CATEGORIES = [
  {
    id: 'morning', title: 'Morning adhkar', icon: 'sun', hue: 36,
    desc: 'After Fajr, until the sun is well up',
    items: [
      KURSI, QULS,
      {
        id: 'asbahna', title: 'By You we reach the morning', count: 1,
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
        translit: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur.",
        en: 'O Allah, by You we reach the morning, by You we reach the evening, by You we live and by You we die, and to You is the resurrection.',
        ur: 'اے اللہ! تیرے ہی نام سے ہم نے صبح کی، تیرے ہی نام سے ہم نے شام کی، تیرے ہی نام سے ہم جیتے ہیں اور تیرے ہی نام سے مرتے ہیں، اور تیری ہی طرف اٹھنا ہے۔',
      },
      SAYYID, RADITU, BISMILLAH_LA_YADURRU, SUBHANALLAH_BIHAMDIHI, TAHLIL, ISTIGHFAR, SALAWAT_SHORT,
    ],
  },
  {
    id: 'evening', title: 'Evening adhkar', icon: 'moon', hue: 250,
    desc: 'After Asr, until night falls',
    items: [
      KURSI, QULS,
      {
        id: 'amsayna', title: 'By You we reach the evening', count: 1,
        arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
        translit: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-maseer.",
        en: 'O Allah, by You we reach the evening, by You we reach the morning, by You we live and by You we die, and to You is the final return.',
        ur: 'اے اللہ! تیرے ہی نام سے ہم نے شام کی، تیرے ہی نام سے ہم نے صبح کی، تیرے ہی نام سے ہم جیتے ہیں اور تیرے ہی نام سے مرتے ہیں، اور تیری ہی طرف لوٹنا ہے۔',
      },
      SAYYID, RADITU, BISMILLAH_LA_YADURRU, AUDHU_KALIMAT, SUBHANALLAH_BIHAMDIHI, TAHLIL, ISTIGHFAR, SALAWAT_SHORT,
    ],
  },
  {
    id: 'after-salah', title: 'After salah', icon: 'mosque', hue: 160,
    desc: 'After every obligatory prayer',
    items: [
      {
        id: 'astaghfirullah', title: 'Astaghfirullah', count: 3, source: 'Sahih Muslim',
        arabic: 'أَسْتَغْفِرُ اللَّهَ', translit: 'Astaghfirullah.',
        en: 'I seek forgiveness from Allah.', ur: 'میں اللہ سے بخشش مانگتا ہوں۔',
      },
      {
        id: 'antas-salam', title: 'You are Peace', count: 1, source: 'Sahih Muslim',
        arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        translit: "Allahumma antas-salam wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.",
        en: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Majesty and Honour.',
        ur: 'اے اللہ! تو سلام ہے اور تجھ ہی سے سلامتی ہے، تو برکت والا ہے اے جلال اور اکرام والے۔',
      },
      KURSI,
      {
        id: 'sf-subhanallah', title: 'SubhanAllah', count: 33, source: 'Sahih Muslim',
        arabic: 'سُبْحَانَ اللَّهِ', translit: 'Subhanallah.', en: 'Glory be to Allah.', ur: 'اللہ پاک ہے۔',
      },
      {
        id: 'sf-alhamdulillah', title: 'Alhamdulillah', count: 33, source: 'Sahih Muslim',
        arabic: 'الْحَمْدُ لِلَّهِ', translit: 'Alhamdulillah.', en: 'All praise is for Allah.', ur: 'تمام تعریف اللہ کے لیے ہے۔',
      },
      {
        id: 'sf-allahu-akbar', title: 'Allahu Akbar', count: 34, source: 'Sahih Muslim',
        arabic: 'اللَّهُ أَكْبَرُ', translit: 'Allahu Akbar.', en: 'Allah is the Greatest.', ur: 'اللہ سب سے بڑا ہے۔',
      },
      { ...TAHLIL, id: 'sf-tahlil', count: 1 },
    ],
  },
  {
    id: 'before-sleep', title: 'Before sleep', icon: 'moon', hue: 275,
    desc: 'Protection and peace for the night',
    items: [
      { ...KURSI, source: 'Sahih al-Bukhari' },
      { ...QULS, id: 'bs-quls', source: 'Sahih al-Bukhari' },
      {
        id: 'last-baqarah', title: 'Last two verses of Al-Baqarah', count: 1, source: 'Sahih al-Bukhari and Muslim',
        quran: [{ s: 2, from: 285, to: 286 }],
        en: 'Whoever recites them at night, they are sufficient for him.', ur: 'جو انہیں رات کو پڑھے، وہ اسے کافی ہو جاتی ہیں۔',
      },
      {
        id: 'bismika', title: 'In Your name I die and live', count: 1, source: 'Sahih al-Bukhari',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', translit: 'Bismika Allahumma amutu wa ahya.',
        en: 'In Your name, O Allah, I die and I live.', ur: 'اے اللہ! تیرے نام کے ساتھ میں مرتا ہوں اور جیتا ہوں۔',
      },
      { id: 'mulk', title: 'Surah Al-Mulk', count: 1, quran: [{ s: 67 }], en: 'Many Muslims recite it each night.', ur: 'بہت سے مسلمان اسے ہر رات پڑھتے ہیں۔' },
      { id: 'bs-subhanallah', title: 'SubhanAllah', count: 33, arabic: 'سُبْحَانَ اللَّهِ', translit: 'Subhanallah.', en: 'Glory be to Allah.', ur: 'اللہ پاک ہے۔' },
      { id: 'bs-alhamdulillah', title: 'Alhamdulillah', count: 33, arabic: 'الْحَمْدُ لِلَّهِ', translit: 'Alhamdulillah.', en: 'All praise is for Allah.', ur: 'تمام تعریف اللہ کے لیے ہے۔' },
      { id: 'bs-allahu-akbar', title: 'Allahu Akbar', count: 34, arabic: 'اللَّهُ أَكْبَرُ', translit: 'Allahu Akbar.', en: 'Allah is the Greatest.', ur: 'اللہ سب سے بڑا ہے۔' },
    ],
  },
  {
    id: 'salawat', title: 'Salawat (Durood)', icon: 'heart', hue: 340,
    desc: 'Prayers and peace upon the Prophet',
    note: 'Sending salawat in abundance, especially on Fridays, is a beloved practice.',
    groups: {
      core: { title: 'Everyday salawat', note: '' },
      hadith: { title: 'Forms reported in the hadith', note: 'These forms are taught in authentic hadith collections, mostly as the salawat of the tashahhud.' },
      classical: { title: 'Classical salawat of the scholars and saints', note: 'These were composed by scholars and saints and are widely recited. They are not hadith texts, and scholars differ about some wordings. Follow the guidance of your own teacher.' },
    },
    items: [
      { ...SALAWAT_IBRAHIMIYYA, group: 'core' },
      { ...SALAWAT_SHORT, group: 'core' },
      { ...SALAWAT_SAW, group: 'core' },
      {
        id: 'salawat-quran', group: 'hadith', title: 'The command to send salawat', count: 1,
        quran: [{ s: 33, from: 56, to: 56 }],
        en: 'Allah and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greet him with peace.',
        ur: 'بے شک اللہ اور اس کے فرشتے نبی ﷺ پر درود بھیجتے ہیں۔ اے ایمان والو! تم بھی ان پر درود اور خوب سلام بھیجو۔',
      },
      {
        id: 'salawat-abu-humayd', group: 'hadith', title: 'Salawat with his wives and descendants', count: 10, source: 'Sahih al-Bukhari and Muslim (Abu Humayd as-Sa\'idi)',
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَأَزْوَاجِهِ وَذُرِّيَّتِهِ كَمَا صَلَّيْتَ عَلَىٰ آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَأَزْوَاجِهِ وَذُرِّيَّتِهِ كَمَا بَارَكْتَ عَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        translit: "Allahumma salli ala Muhammadin wa azwajihi wa dhurriyyatihi, kama sallayta ala ali Ibrahim, wa barik ala Muhammadin wa azwajihi wa dhurriyyatihi, kama barakta ala ali Ibrahim, innaka Hamidun Majid.",
        en: 'O Allah, send prayers upon Muhammad, his wives and his descendants, as You sent prayers upon the family of Ibrahim; and bless Muhammad, his wives and his descendants, as You blessed the family of Ibrahim. You are Praiseworthy and Glorious.',
        ur: 'اے اللہ! محمد ﷺ، ان کی ازواج اور ان کی اولاد پر رحمت نازل فرما جیسے تو نے آلِ ابراہیم پر رحمت نازل فرمائی، اور محمد ﷺ، ان کی ازواج اور ان کی اولاد پر برکت نازل فرما جیسے تو نے آلِ ابراہیم پر برکت نازل فرمائی، بے شک تو تعریف والا، بزرگی والا ہے۔',
      },
      {
        id: 'salawat-abu-said', group: 'hadith', title: 'Salawat on his servant and messenger', count: 10, source: 'Sahih al-Bukhari (Abu Sa\'id al-Khudri)',
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ عَبْدِكَ وَرَسُولِكَ، كَمَا صَلَّيْتَ عَلَىٰ آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَآلِ إِبْرَاهِيمَ',
        translit: "Allahumma salli ala Muhammadin abdika wa rasulik, kama sallayta ala ali Ibrahim, wa barik ala Muhammadin wa ala ali Muhammad, kama barakta ala Ibrahima wa ali Ibrahim.",
        en: 'O Allah, send prayers upon Muhammad, Your servant and Your messenger, as You sent prayers upon the family of Ibrahim, and bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim.',
        ur: 'اے اللہ! اپنے بندے اور رسول محمد ﷺ پر رحمت نازل فرما جیسے تو نے آلِ ابراہیم پر رحمت نازل فرمائی، اور محمد ﷺ اور آلِ محمد پر برکت نازل فرما جیسے تو نے ابراہیم اور آلِ ابراہیم پر برکت نازل فرمائی۔',
      },
      {
        id: 'salawat-abu-masud', group: 'hadith', title: 'Salawat "in all the worlds"', count: 10, source: 'Sahih Muslim (Abu Mas\'ud al-Ansari)',
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ آلِ إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
        translit: "Allahumma salli ala Muhammadin wa ala ali Muhammad, kama sallayta ala ali Ibrahim, wa barik ala Muhammadin wa ala ali Muhammad, kama barakta ala ali Ibrahim, fil-alamin, innaka Hamidun Majid.",
        en: 'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon the family of Ibrahim, and bless Muhammad and the family of Muhammad, as You blessed the family of Ibrahim, in all the worlds. You are Praiseworthy and Glorious.',
        ur: 'اے اللہ! محمد ﷺ اور آلِ محمد پر رحمت نازل فرما جیسے تو نے آلِ ابراہیم پر رحمت نازل فرمائی، اور محمد ﷺ اور آلِ محمد پر برکت نازل فرما جیسے تو نے آلِ ابراہیم پر برکت نازل فرمائی، تمام جہانوں میں، بے شک تو تعریف والا، بزرگی والا ہے۔',
      },
      {
        id: 'salawat-tashahhud-salam', group: 'hadith', title: 'Salam upon the Prophet (in tashahhud)', count: 10, source: 'Sahih al-Bukhari and Muslim',
        arabic: 'السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
        translit: 'As-salamu alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh.',
        en: 'Peace be upon you, O Prophet, and the mercy of Allah and His blessings.',
        ur: 'اے نبی ﷺ! آپ پر سلامتی ہو اور اللہ کی رحمت اور اس کی برکتیں ہوں۔',
      },
      {
        id: 'salawat-simple', group: 'hadith', title: 'Simple salawat', count: 100,
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', translit: 'Allahumma salli ala Muhammad.',
        en: 'O Allah, send prayers upon Muhammad.', ur: 'اے اللہ! محمد ﷺ پر رحمت نازل فرما۔',
      },
      {
        id: 'salawat-alayhis-salam', group: 'hadith', title: 'Prayers and peace be upon him', count: 100,
        arabic: 'عَلَيْهِ الصَّلَاةُ وَالسَّلَامُ', translit: 'Alayhis-salatu was-salam.',
        en: 'Prayers and peace be upon him.', ur: 'ان پر درود و سلام ہو۔',
      },
      {
        id: 'salawat-tunjina', group: 'classical', title: 'Salat at-Tunjina', count: 10,
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ، وَتَقْضِي لَنَا بِهَا جَمِيعَ الْحَاجَاتِ، وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ، وَتَرْفَعُنَا بِهَا عِنْدَكَ أَعْلَى الدَّرَجَاتِ، وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ مِنْ جَمِيعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ، إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        translit: "Allahumma salli ala sayyidina Muhammadin salatan tunjina biha min jami'il-ahwali wal-afat, wa taqdi lana biha jami'al-hajat, wa tutahhiruna biha min jami'is-sayyi'at, wa tarfa'una biha indaka a'lad-darajat, wa tuballighuna biha aqsal-ghayat min jami'il-khayrat fil-hayati wa ba'dal-mamat, innaka ala kulli shay'in qadir.",
        en: 'O Allah, send prayers upon our master Muhammad, a prayer by which You save us from all terrors and afflictions, fulfil for us all our needs, purify us from all bad deeds, raise us to the highest ranks with You, and take us to the furthest limit of all good, in this life and after death. Indeed You have power over all things.',
        ur: 'اے اللہ! ہمارے سردار محمد ﷺ پر ایسا درود نازل فرما جس کے ذریعے تو ہمیں تمام خوفناک حالات اور آفات سے نجات دے، ہماری تمام حاجتیں پوری فرما، ہمیں تمام برائیوں سے پاک کر دے، اپنے ہاں ہمیں بلند ترین درجات تک پہنچا دے، اور زندگی میں بھی اور موت کے بعد بھی تمام بھلائیوں کی انتہا تک پہنچا دے، بے شک تو ہر چیز پر قادر ہے۔',
      },
      {
        id: 'salawat-fatih', group: 'classical', title: 'Salat al-Fatih', count: 10,
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ، وَالْخَاتِمِ لِمَا سَبَقَ، نَاصِرِ الْحَقِّ بِالْحَقِّ، وَالْهَادِي إِلَىٰ صِرَاطِكَ الْمُسْتَقِيمِ، وَعَلَىٰ آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ',
        translit: "Allahumma salli ala sayyidina Muhammadinil-fatihi lima ughliq, wal-khatimi lima sabaq, nasiril-haqqi bil-haqq, wal-hadi ila siratikal-mustaqim, wa ala alihi haqqa qadrihi wa miqdarihil-azim.",
        en: 'O Allah, send prayers upon our master Muhammad, the opener of what was closed and the seal of what came before, the helper of truth by the truth and the guide to Your straight path, and upon his family, according to his true rank and great stature.',
        ur: 'اے اللہ! ہمارے سردار محمد ﷺ پر درود نازل فرما جو بند دروازوں کو کھولنے والے، پچھلے سلسلے کو ختم کرنے والے، حق کے ذریعے حق کی مدد کرنے والے اور تیرے سیدھے راستے کی طرف رہنمائی کرنے والے ہیں، اور ان کی آل پر بھی ان کے حقیقی مرتبے اور عظیم شان کے مطابق۔',
      },
      {
        id: 'salawat-nariya', group: 'classical', title: 'Salat at-Tafrijiyya (Nariya)', count: 10,
        arabic: 'اللَّهُمَّ صَلِّ صَلَاةً كَامِلَةً وَسَلِّمْ سَلَامًا تَامًّا عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الَّذِي تَنْحَلُّ بِهِ الْعُقَدُ، وَتَنْفَرِجُ بِهِ الْكُرَبُ، وَتُقْضَىٰ بِهِ الْحَوَائِجُ، وَتُنَالُ بِهِ الرَّغَائِبُ وَحُسْنُ الْخَوَاتِيمِ، وَيُسْتَسْقَى الْغَمَامُ بِوَجْهِهِ الْكَرِيمِ، وَعَلَىٰ آلِهِ وَصَحْبِهِ فِي كُلِّ لَمْحَةٍ وَنَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ',
        translit: "Allahumma salli salatan kamilatan wa sallim salaman tamman ala sayyidina Muhammadinil-ladhi tanhallu bihil-uqad, wa tanfariju bihil-kurab, wa tuqda bihil-hawa'ij, wa tunalu bihir-raghaibu wa husnul-khawatim, wa yustasqal-ghamamu bi wajhihil-karim, wa ala alihi wa sahbihi fi kulli lamhatin wa nafasin bi adadi kulli ma'lumin lak.",
        en: 'O Allah, send complete prayers and perfect peace upon our master Muhammad, through whom knots are untied, hardships are eased, needs are fulfilled, desires are attained and good endings are gained, and by whose noble face the clouds are asked for rain, and upon his family and companions, in every glance and breath, as many times as everything You know.',
        ur: 'اے اللہ! ہمارے سردار محمد ﷺ پر کامل درود اور مکمل سلام نازل فرما، جن کے وسیلے سے گرہیں کھلتی ہیں، مصیبتیں دور ہوتی ہیں، حاجتیں پوری ہوتی ہیں، مرادیں ملتی ہیں اور اچھا خاتمہ نصیب ہوتا ہے، اور جن کے چہرۂ مبارک کے وسیلے سے بارش مانگی جاتی ہے، اور ان کی آل اور صحابہ پر ہر لمحے اور ہر سانس میں، ہر اس چیز کی تعداد کے برابر جو تیرے علم میں ہے۔',
      },
      {
        id: 'salawat-adad', group: 'classical', title: 'Salawat as many as His creation', count: 10,
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ عَدَدَ خَلْقِكَ وَرِضَا نَفْسِكَ وَزِنَةَ عَرْشِكَ وَمِدَادَ كَلِمَاتِكَ',
        translit: "Allahumma salli ala sayyidina Muhammadin adada khalqika wa rida nafsika wa zinata arshika wa midada kalimatik.",
        en: 'O Allah, send prayers upon our master Muhammad, as many as the number of Your creation, as much as pleases You, as heavy as Your Throne and as much as the ink of Your words.',
        ur: 'اے اللہ! ہمارے سردار محمد ﷺ پر درود نازل فرما، تیری مخلوق کی تعداد کے برابر، تیری رضا کے برابر، تیرے عرش کے وزن کے برابر اور تیرے کلمات کی روشنائی کے برابر۔',
      },
      {
        id: 'salawat-ummi', group: 'classical', title: 'Salawat on the unlettered Prophet', count: 10,
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَىٰ آلِهِ وَسَلِّمْ تَسْلِيمًا',
        translit: 'Allahumma salli ala Muhammadinin-nabiyyil-ummiyyi wa ala alihi wa sallim tasliman.',
        en: 'O Allah, send prayers upon Muhammad, the unlettered Prophet, and upon his family, and grant them abundant peace.',
        ur: 'اے اللہ! نبیِ امی محمد ﷺ اور ان کی آل پر درود نازل فرما اور خوب سلام نازل فرما۔',
      },
      {
        id: 'salawat-shafii', group: 'classical', title: 'Salawat attributed to Imam ash-Shafi\'i', count: 10,
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ كُلَّمَا ذَكَرَهُ الذَّاكِرُونَ، وَصَلِّ عَلَىٰ مُحَمَّدٍ كُلَّمَا غَفَلَ عَنْ ذِكْرِهِ الْغَافِلُونَ',
        translit: "Allahumma salli ala Muhammadin kullama dhakarahudh-dhakirun, wa salli ala Muhammadin kullama ghafala an dhikrihil-ghafilun.",
        en: 'O Allah, send prayers upon Muhammad whenever the rememberers remember him, and send prayers upon Muhammad whenever the heedless neglect to remember him.',
        ur: 'اے اللہ! محمد ﷺ پر درود نازل فرما جب بھی ذکر کرنے والے ان کا ذکر کریں، اور محمد ﷺ پر درود نازل فرما جب بھی غافل ان کے ذکر سے غفلت برتیں۔',
      },
    ],
  },
];

export const getCategory = (id) => ADHKAR_CATEGORIES.find((c) => c.id === id);
