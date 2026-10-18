// Duas. Quran-based duas load their Arabic text from the Quran API.
// `tags` make the search bar forgiving: English, plus a few Roman Urdu words.
export const DUA_GROUPS = [
  { id: 'daily', label: 'Daily life' },
  { id: 'prayer', label: 'Prayer and wudu' },
  { id: 'protection', label: 'Protection and worry' },
  { id: 'health', label: 'Health' },
  { id: 'forgive', label: 'Forgiveness and guidance' },
  { id: 'family', label: 'Family and people' },
  { id: 'ramadan', label: 'Ramadan' },
  { id: 'quran', label: 'From the Quran' },
];

export const DUAS = [
  // ---------- Daily life ----------
  {
    id: 'wake', group: 'daily', title: 'When waking up', tags: 'wake morning sleep neend uthna jaagna',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    translit: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    en: 'All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.',
    ur: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف اٹھنا ہے۔',
  },
  {
    id: 'sleep', group: 'daily', title: 'Before sleeping', tags: 'sleep sleeping bed night neend sona raat', source: 'Sahih al-Bukhari',
    arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا', translit: 'Allahumma bismika amutu wa ahya.',
    en: 'O Allah, in Your name I die and I live.', ur: 'اے اللہ! تیرے نام کے ساتھ میں مرتا ہوں اور جیتا ہوں۔',
  },
  {
    id: 'eat-before', group: 'daily', title: 'Before eating', tags: 'eat eating food meal khana khane se pehle',
    arabic: 'بِسْمِ اللَّهِ', translit: 'Bismillah.', en: 'In the name of Allah.', ur: 'اللہ کے نام سے۔',
  },
  {
    id: 'eat-after', group: 'daily', title: 'After eating', tags: 'eat eating food meal khana khane ke baad',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    translit: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin.",
    en: 'All praise is for Allah who fed us, gave us drink, and made us Muslims.',
    ur: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں کھلایا، پلایا اور مسلمان بنایا۔',
  },
  {
    id: 'home-enter', group: 'daily', title: 'Entering the home', tags: 'home house enter ghar dakhil',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    translit: "Bismillahi walajna, wa bismillahi kharajna, wa ala Rabbina tawakkalna.",
    en: 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.',
    ur: 'اللہ کے نام سے ہم داخل ہوئے، اللہ کے نام سے نکلے اور اپنے رب پر ہم نے بھروسا کیا۔',
  },
  {
    id: 'home-leave', group: 'daily', title: 'Leaving the home', tags: 'home house leave going out ghar nikalna',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    translit: "Bismillahi tawakkaltu alallah, wa la hawla wa la quwwata illa billah.",
    en: 'In the name of Allah, I rely on Allah, and there is no power and no strength except with Allah.',
    ur: 'اللہ کے نام سے، میں نے اللہ پر بھروسا کیا، اور گناہ سے بچنے کی طاقت اور نیکی کی قوت صرف اللہ ہی سے ہے۔',
  },
  {
    id: 'clothes', group: 'daily', title: 'Wearing new clothes', tags: 'clothes dress wearing kapre libas',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    translit: "Alhamdu lillahil-ladhi kasani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.",
    en: 'All praise is for Allah who clothed me with this and provided it for me, with no power or strength from myself.',
    ur: 'تمام تعریفیں اس اللہ کے لیے ہیں جس نے مجھے یہ پہنایا اور مجھے عطا کیا، میری کسی طاقت اور قوت کے بغیر۔',
  },
  {
    id: 'mirror', group: 'daily', title: 'Looking in the mirror', tags: 'mirror look appearance aaina',
    arabic: 'اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
    translit: 'Allahumma anta hassanta khalqi fahassin khuluqi.',
    en: 'O Allah, You made my form beautiful, so make my character beautiful.',
    ur: 'اے اللہ! تو نے میری صورت اچھی بنائی، پس میرے اخلاق بھی اچھے کر دے۔',
  },
  {
    id: 'toilet-in', group: 'daily', title: 'Entering the toilet', tags: 'toilet bathroom washroom istinja',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    translit: "Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith.",
    en: 'O Allah, I seek refuge in You from evil male and female jinn.', ur: 'اے اللہ! میں تیری پناہ مانگتا ہوں ناپاک جنوں اور جنّنیوں سے۔',
  },
  {
    id: 'toilet-out', group: 'daily', title: 'Leaving the toilet', tags: 'toilet bathroom washroom',
    arabic: 'غُفْرَانَكَ', translit: 'Ghufranak.', en: 'I seek Your forgiveness.', ur: 'میں تیری بخشش مانگتا ہوں۔',
  },
  {
    id: 'rain', group: 'daily', title: 'When it rains', tags: 'rain weather barish baarish',
    arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا', translit: "Allahumma sayyiban nafi'a.",
    en: 'O Allah, let it be a beneficial rain.', ur: 'اے اللہ! اسے نفع بخش بارش بنا دے۔',
  },
  {
    id: 'sneeze', group: 'daily', title: 'When you sneeze', tags: 'sneeze sneezing chheenk',
    arabic: 'الْحَمْدُ لِلَّهِ', translit: 'Alhamdulillah.', en: 'All praise is for Allah.', ur: 'تمام تعریف اللہ کے لیے ہے۔',
  },
  {
    id: 'sneezed', group: 'daily', title: 'When someone sneezes and says Alhamdulillah', tags: 'sneeze sneezing chheenk reply',
    arabic: 'يَرْحَمُكَ اللَّهُ', translit: 'Yarhamukallah.', en: 'May Allah have mercy on you. (The sneezer replies: Yahdikumullahu wa yuslihu balakum, "May Allah guide you and set your affairs right.")',
    ur: 'اللہ تم پر رحم کرے۔ (چھینکنے والا جواب دے: اللہ تمہیں ہدایت دے اور تمہارا حال درست کرے۔)',
  },
  {
    id: 'thanks', group: 'daily', title: 'Thanking someone', tags: 'thanks thank you shukriya',
    arabic: 'جَزَاكَ اللَّهُ خَيْرًا', translit: 'Jazakallahu khayran.', en: 'May Allah reward you with goodness.', ur: 'اللہ آپ کو بہترین بدلہ دے۔',
  },
  {
    id: 'salam', group: 'daily', title: 'Greeting (salam)', tags: 'salam greeting hello meeting',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ', translit: "As-salamu alaykum wa rahmatullahi wa barakatuh.",
    en: 'Peace be upon you, and the mercy of Allah and His blessings.', ur: 'تم پر سلامتی ہو اور اللہ کی رحمت اور اس کی برکتیں ہوں۔',
  },
  {
    id: 'salam-reply', group: 'daily', title: 'Replying to salam', tags: 'salam greeting reply jawab',
    arabic: 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ', translit: "Wa alaykumus-salamu wa rahmatullahi wa barakatuh.",
    en: 'And upon you be peace, and the mercy of Allah and His blessings.', ur: 'اور تم پر بھی سلامتی ہو اور اللہ کی رحمت اور اس کی برکتیں ہوں۔',
  },
  {
    id: 'travel', group: 'daily', title: 'When travelling', tags: 'travel journey vehicle car safar sawari', quran: [{ s: 43, from: 13, to: 14 }],
    en: 'Exalted is He who subjected this to us, and we could not have done it ourselves. And indeed, to our Lord we will return.',
    ur: 'پاک ہے وہ ذات جس نے اس سواری کو ہمارے تابع کر دیا، اور ہم اسے قابو میں لانے والے نہ تھے، اور بے شک ہم اپنے رب ہی کی طرف لوٹنے والے ہیں۔',
  },
  {
    id: 'istikhara', group: 'daily', title: 'Istikhara (seeking guidance in a decision)', tags: 'istikhara decision guidance choose marriage job faisla',
    source: 'Sahih al-Bukhari',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ. وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ',
    en: 'Usually prayed after two non-obligatory rakat. O Allah, I seek Your guidance by Your knowledge, and I seek ability by Your power, and I ask You of Your great bounty. You are able and I am not; You know and I do not; and You are the Knower of the unseen. O Allah, if You know that this matter (name it) is good for me in my religion, my livelihood and the outcome of my affairs, then decree it for me, make it easy for me, and bless it for me. And if You know that this matter is bad for me in my religion, my livelihood and the outcome of my affairs, then turn it away from me and turn me away from it, and decree for me the good wherever it is, and make me content with it.',
    ur: 'عموماً دو رکعت نفل کے بعد پڑھی جاتی ہے۔ اے اللہ! میں تیرے علم کے واسطے سے تجھ سے خیر مانگتا ہوں، اور تیری قدرت کے واسطے سے طاقت مانگتا ہوں، اور تیرے عظیم فضل کا سوال کرتا ہوں، کیونکہ تو قدرت رکھتا ہے اور میں نہیں رکھتا، تو جانتا ہے اور میں نہیں جانتا، اور تو غیبوں کو خوب جاننے والا ہے۔ اے اللہ! اگر تو جانتا ہے کہ یہ کام (اس کا نام لیں) میرے دین، میری روزی اور میرے انجام کے لیے بہتر ہے تو اسے میرے لیے مقدر کر دے، آسان کر دے اور اس میں برکت دے۔ اور اگر تو جانتا ہے کہ یہ کام میرے دین، میری روزی اور میرے انجام کے لیے برا ہے تو اسے مجھ سے پھیر دے اور مجھے اس سے پھیر دے، اور جہاں بھی بھلائی ہو وہ میرے لیے مقدر کر دے، پھر مجھے اس پر راضی کر دے۔',
  },

  // ---------- Prayer and wudu ----------
  {
    id: 'wudu-after', group: 'prayer', title: 'After wudu', tags: 'wudu ablution after wazu', source: 'Sahih Muslim',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    translit: "Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan abduhu wa rasuluh.",
    en: 'I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His servant and messenger.',
    ur: 'میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ محمد ﷺ اس کے بندے اور رسول ہیں۔',
  },
  {
    id: 'wudu-tawbah', group: 'prayer', title: 'After wudu: repentant and pure', tags: 'wudu ablution after wazu', source: 'Jami at-Tirmidhi',
    arabic: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    translit: "Allahummaj-alni minat-tawwabina waj-alni minal-mutatahhirin.",
    en: 'O Allah, make me among those who repent often and among those who purify themselves.',
    ur: 'اے اللہ! مجھے بہت توبہ کرنے والوں میں اور پاک رہنے والوں میں شامل فرما۔',
  },
  {
    id: 'adhan', group: 'prayer', title: 'After the adhan', tags: 'adhan azan call to prayer', source: 'Sahih al-Bukhari',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    translit: "Allahumma rabba hadhihid-da'watit-tammah, was-salatil-qa'imah, ati Muhammadanil-wasilata wal-fadilah, wab'athhu maqamam-mahmudanil-ladhi wa'adtah.",
    en: 'O Allah, Lord of this perfect call and the prayer to be established, grant Muhammad the intercession and the excellence, and raise him to the praised station You have promised him.',
    ur: 'اے اللہ! اس کامل پکار اور قائم ہونے والی نماز کے رب! محمد ﷺ کو وسیلہ اور فضیلت عطا فرما اور انہیں وہ مقامِ محمود عطا فرما جس کا تو نے ان سے وعدہ کیا ہے۔',
  },
  {
    id: 'masjid-in', group: 'prayer', title: 'Entering the masjid', tags: 'masjid mosque enter dakhil',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', translit: 'Allahummaf-tah li abwaba rahmatik.',
    en: 'O Allah, open for me the doors of Your mercy.', ur: 'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔',
  },
  {
    id: 'masjid-out', group: 'prayer', title: 'Leaving the masjid', tags: 'masjid mosque leave nikalna',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', translit: "Allahumma inni as'aluka min fadlik.",
    en: 'O Allah, I ask You of Your bounty.', ur: 'اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔',
  },
  {
    id: 'qunut', group: 'prayer', title: 'Dua Qunut (Witr prayer)', tags: 'qunut qunoot witr isha hanafi',
    arabic: 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ، وَنَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ. اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ، وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ، وَنَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ، إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ',
    translit: "Allahumma inna nasta'inuka wa nastaghfiruka wa nu'minu bika wa natawakkalu alayka wa nuthni alaykal-khayr, wa nashkuruka wa la nakfuruk, wa nakhla'u wa natruku man yafjuruk. Allahumma iyyaka na'budu wa laka nusalli wa nasjud, wa ilayka nas'a wa nahfid, wa narju rahmataka wa nakhsha adhabak, inna adhabaka bil-kuffari mulhiq.",
    en: 'Recited in the Witr prayer, especially in the Hanafi school. O Allah, we seek Your help and Your forgiveness, we believe in You and rely on You, and we praise You with all good. We thank You and do not deny You, and we cast off and leave whoever disobeys You. O Allah, You alone we worship, to You we pray and prostrate, and to You we hasten. We hope for Your mercy and fear Your punishment; indeed Your punishment will reach the disbelievers.',
    ur: 'وتر کی نماز میں پڑھی جاتی ہے۔ اے اللہ! ہم تجھ سے مدد مانگتے ہیں اور تجھ سے بخشش چاہتے ہیں، تجھ پر ایمان رکھتے ہیں، تجھ پر بھروسا کرتے ہیں اور تیری اچھی تعریف کرتے ہیں۔ ہم تیرا شکر ادا کرتے ہیں اور تیری ناشکری نہیں کرتے، اور جو تیری نافرمانی کرے اسے چھوڑ دیتے اور الگ کرتے ہیں۔ اے اللہ! ہم تیری ہی عبادت کرتے ہیں، تیرے ہی لیے نماز پڑھتے اور سجدہ کرتے ہیں، تیری ہی طرف دوڑتے اور حاضر ہوتے ہیں، تیری رحمت کی امید رکھتے ہیں اور تیرے عذاب سے ڈرتے ہیں، بے شک تیرا عذاب کافروں کو پہنچنے والا ہے۔',
  },

  // ---------- Protection and worry ----------
  {
    id: 'anxiety', group: 'protection', title: 'Worry, grief and debt', tags: 'worry anxiety stress grief sad debt fikar pareshani gham qarz', source: 'Sahih al-Bukhari',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    translit: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.",
    en: 'O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from miserliness and cowardice, and from being overwhelmed by debt and overpowered by people.',
    ur: 'اے اللہ! میں تیری پناہ مانگتا ہوں فکر اور غم سے، عاجزی اور سستی سے، بخل اور بزدلی سے، اور قرض کے بوجھ اور لوگوں کے غلبے سے۔',
  },
  {
    id: 'calamity', group: 'protection', title: 'When hit by a calamity', tags: 'calamity loss death grief musibat sadma', source: 'Sahih Muslim',
    arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
    translit: "Inna lillahi wa inna ilayhi raji'un. Allahumma'jurni fi musibati wa akhlif li khayran minha.",
    en: 'We belong to Allah and to Him we return. O Allah, reward me in my affliction and replace it with something better.',
    ur: 'ہم اللہ ہی کے ہیں اور اسی کی طرف لوٹنے والے ہیں۔ اے اللہ! میری مصیبت میں مجھے اجر دے اور اس سے بہتر بدل عطا فرما۔',
  },
  {
    id: 'hasbunallah', group: 'protection', title: 'Allah is enough for us', tags: 'trust tawakkul difficulty fear dar bharosa',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', translit: "Hasbunallahu wa ni'mal-wakil.",
    en: 'Allah is sufficient for us, and He is the best disposer of affairs (Quran 3:173).', ur: 'ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے (القرآن 3:173)۔',
  },
  {
    id: 'evil-eye', group: 'protection', title: 'Protection from harm and the evil eye', tags: 'evil eye nazar nazar-e-bad protection children bachon', source: 'Sahih al-Bukhari',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    translit: "A'udhu bikalimatillahit-tammati min kulli shaytanin wa hammah, wa min kulli aynin lammah.",
    en: 'I seek refuge in the perfect words of Allah from every devil and every harmful creature, and from every evil eye.',
    ur: 'میں اللہ کے کامل کلمات کی پناہ مانگتا ہوں ہر شیطان اور ہر زہریلے جانور سے اور ہر نقصان پہنچانے والی نظر سے۔',
  },
  {
    id: 'anger', group: 'protection', title: 'When angry', tags: 'anger angry gussa ghussa',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', translit: "A'udhu billahi minash-shaytanir-rajim.",
    en: 'I seek refuge in Allah from the accursed Satan.', ur: 'میں اللہ کی پناہ مانگتا ہوں شیطانِ مردود سے۔',
  },
  {
    id: 'debt', group: 'protection', title: 'Debt and provision', tags: 'debt money rizq provision qarz paisa', source: 'Jami at-Tirmidhi',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    translit: "Allahummak-fini bihalalika an haramik, wa aghnini bifadlika amman siwak.",
    en: 'O Allah, suffice me with what You have made lawful instead of what You have forbidden, and make me independent of everyone but You by Your bounty.',
    ur: 'اے اللہ! اپنے حلال کے ذریعے مجھے حرام سے کافی کر دے اور اپنے فضل سے مجھے اپنے سوا سب سے بے نیاز کر دے۔',
  },
  {
    id: 'q-yunus', group: 'protection', title: 'Dua of Yunus in distress', tags: 'distress trouble difficulty yunus jonah pareshani', quran: [{ s: 21, from: 87, to: 87 }],
    en: "The supplication of Prophet Yunus (Jonah) is in this verse: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.'",
    ur: 'اس آیت میں حضرت یونس علیہ السلام کی دعا ہے: تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ظالموں میں سے تھا۔',
  },

  // ---------- Health ----------
  {
    id: 'sick-visit', group: 'health', title: 'Visiting the sick', tags: 'sick ill visit patient bimar iyadat',
    arabic: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ', translit: "La ba'sa tahurun in sha Allah.",
    en: 'No harm, it is a purification, if Allah wills.', ur: 'کوئی حرج نہیں، یہ (بیماری) گناہوں سے پاکی کا ذریعہ ہے، ان شاء اللہ۔',
  },
  {
    id: 'healing', group: 'health', title: 'Asking Allah for healing', tags: 'heal healing cure sick illness shifa bimari', source: 'Sahih al-Bukhari',
    arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    translit: "Allahumma rabban-nas, adhhibil-ba's, ishfi antash-shafi, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama.",
    en: 'O Allah, Lord of the people, remove the harm, and heal, for You are the Healer. There is no cure except Your cure, a cure that leaves no illness behind.',
    ur: 'اے اللہ! لوگوں کے رب! تکلیف دور فرما، شفا دے، تو ہی شفا دینے والا ہے، تیری شفا کے سوا کوئی شفا نہیں، ایسی شفا جو کوئی بیماری نہ چھوڑے۔',
  },
  {
    id: 'pain', group: 'health', title: 'For pain in the body', tags: 'pain ache headache dard', source: 'Sahih Muslim',
    arabic: 'أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
    translit: "A'udhu billahi wa qudratihi min sharri ma ajidu wa uhadhir.",
    en: 'Place your hand on the place of pain, say Bismillah three times, then say this seven times: I seek refuge in Allah and His power from the evil of what I feel and what I fear.',
    ur: 'درد کی جگہ ہاتھ رکھ کر تین بار بسم اللہ پڑھیں، پھر سات بار یہ پڑھیں: میں اللہ اور اس کی قدرت کی پناہ مانگتا ہوں اس تکلیف کے شر سے جو میں پاتا ہوں اور جس کا مجھے ڈر ہے۔',
  },
  {
    id: 'afiyah', group: 'health', title: 'Well-being in both worlds', tags: 'wellbeing health afiyat sehat',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', translit: "Allahumma inni as'alukal-afiyata fid-dunya wal-akhirah.",
    en: 'O Allah, I ask You for well-being in this world and the next.', ur: 'اے اللہ! میں تجھ سے دنیا اور آخرت میں عافیت مانگتا ہوں۔',
  },
  {
    id: 'janazah', group: 'health', title: 'For a deceased Muslim', tags: 'death deceased janazah funeral grave marhoom inteqal', source: 'Sahih Muslim',
    arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ', translit: "Allahummaghfir lahu warhamhu wa afihi wa'fu anhu.",
    en: 'O Allah, forgive him, have mercy on him, give him well-being and pardon him. (For a woman, say "laha" in place of "lahu", "hu" and "anhu" with "ha" and "anha".)',
    ur: 'اے اللہ! اسے بخش دے، اس پر رحم فرما، اسے عافیت دے اور اسے معاف کر دے۔ (عورت کے لیے "لَهَا، ارْحَمْهَا، عَافِهَا، عَنْهَا" پڑھیں۔)',
  },

  // ---------- Forgiveness and guidance ----------
  {
    id: 'forgive', group: 'forgive', title: 'Asking forgiveness and repentance', tags: 'forgive forgiveness repent tawbah maafi gunah', source: 'Abu Dawud and Tirmidhi',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', translit: "Rabbighfir li wa tub alayya, innaka antat-Tawwabur-Rahim.",
    en: 'My Lord, forgive me and accept my repentance; You are the Accepting of repentance, the Merciful.',
    ur: 'اے میرے رب! مجھے بخش دے اور میری توبہ قبول فرما، بے شک تو ہی توبہ قبول کرنے والا، رحم کرنے والا ہے۔',
  },
  {
    id: 'guidance', group: 'forgive', title: 'Guidance, piety and contentment', tags: 'guidance hidayat taqwa contentment', source: 'Sahih Muslim',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى', translit: "Allahumma inni as'alukal-huda wat-tuqa wal-afafa wal-ghina.",
    en: 'O Allah, I ask You for guidance, piety, chastity and self-sufficiency.', ur: 'اے اللہ! میں تجھ سے ہدایت، تقویٰ، پاکدامنی اور بے نیازی مانگتا ہوں۔',
  },
  {
    id: 'steadfast', group: 'forgive', title: 'Steadfast heart', tags: 'heart steadfast faith iman dil sabit', source: 'Jami at-Tirmidhi',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ', translit: 'Ya muqallibal-qulub, thabbit qalbi ala dinik.',
    en: 'O Turner of hearts, keep my heart firm upon Your religion.', ur: 'اے دلوں کو پھیرنے والے! میرے دل کو اپنے دین پر ثابت قدم رکھ۔',
  },
  {
    id: 'knowledge', group: 'forgive', title: 'Increase in knowledge', tags: 'knowledge ilm study exam learning padhai imtihan',
    arabic: 'رَبِّ زِدْنِي عِلْمًا', translit: 'Rabbi zidni ilma.',
    en: 'My Lord, increase me in knowledge (Quran 20:114).', ur: 'اے میرے رب! میرے علم میں اضافہ فرما (القرآن 20:114)۔',
  },
  {
    id: 'useful-knowledge', group: 'forgive', title: 'Beneficial knowledge', tags: 'knowledge ilm study exam learning padhai', source: 'Ibn Majah and Tirmidhi',
    arabic: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا',
    translit: "Allahumman-fa'ni bima allamtani wa allimni ma yanfa'uni wa zidni ilma.",
    en: 'O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.',
    ur: 'اے اللہ! جو تو نے مجھے سکھایا اس سے مجھے نفع دے، اور مجھے وہ سکھا جو میرے لیے نافع ہو، اور میرا علم بڑھا۔',
  },
  {
    id: 'q-hasanah', group: 'quran', title: 'Good in this world and the next', tags: 'dunya akhirah comprehensive', quran: [{ s: 2, from: 201, to: 201 }],
    en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    ur: 'اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے، اور ہمیں آگ کے عذاب سے بچا۔',
  },
  {
    id: 'q-hearts', group: 'quran', title: 'Steadfast hearts', tags: 'heart guidance mercy', quran: [{ s: 3, from: 8, to: 8 }],
    en: 'Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself. You are the Bestower.',
    ur: 'اے ہمارے رب! ہمارے دلوں کو ٹیڑھا نہ کر بعد اس کے کہ تو نے ہمیں ہدایت دی، اور ہمیں اپنے پاس سے رحمت عطا فرما، بے شک تو ہی بہت عطا کرنے والا ہے۔',
  },
  {
    id: 'q-adam', group: 'quran', title: 'Dua of Adam: forgiveness', tags: 'forgive forgiveness adam maafi', quran: [{ s: 7, from: 23, to: 23 }],
    en: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy on us, we will surely be among the losers.',
    ur: 'اے ہمارے رب! ہم نے اپنی جانوں پر ظلم کیا، اور اگر تو ہمیں نہ بخشے اور ہم پر رحم نہ کرے تو ہم ضرور نقصان اٹھانے والوں میں سے ہوں گے۔',
  },

  // ---------- Family and people ----------
  {
    id: 'q-parents', group: 'family', title: 'For parents', tags: 'parents mother father walidain walidayn ammi abu maa baap', quran: [{ s: 17, from: 24, to: 24 }],
    en: 'My Lord, have mercy upon them as they brought me up when I was small.',
    ur: 'اے میرے رب! ان دونوں پر رحم فرما جیسا کہ انہوں نے بچپن میں مجھے پالا۔',
  },
  {
    id: 'q-ibrahim', group: 'family', title: 'Dua of Ibrahim for prayer and family', tags: 'family children parents ibrahim aulad', quran: [{ s: 14, from: 40, to: 41 }],
    en: 'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication. Our Lord, forgive me and my parents and the believers on the Day the account is established.',
    ur: 'اے میرے رب! مجھے نماز قائم کرنے والا بنا اور میری اولاد میں سے بھی۔ اے ہمارے رب! میری دعا قبول فرما۔ اے ہمارے رب! مجھے، میرے والدین کو اور تمام مومنوں کو بخش دے جس دن حساب قائم ہوگا۔',
  },
  {
    id: 'q-family', group: 'family', title: 'Comfort in spouse and children', tags: 'spouse wife husband children family biwi shohar aulad', quran: [{ s: 25, from: 74, to: 74 }],
    en: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes, and make us leaders for the righteous.',
    ur: 'اے ہمارے رب! ہمیں اپنی بیویوں اور اولاد سے آنکھوں کی ٹھنڈک عطا فرما اور ہمیں پرہیزگاروں کا امام بنا۔',
  },
  {
    id: 'marriage', group: 'family', title: 'Congratulating a newly married couple', tags: 'marriage wedding nikah shadi mubarak',
    arabic: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ', translit: "Barakallahu laka wa baraka alayka wa jama'a baynakuma fi khayr.",
    en: 'May Allah bless you, shower blessings upon you, and bring you together in goodness.', ur: 'اللہ تمہیں برکت دے، تم پر برکت نازل کرے اور تم دونوں کو خیر میں جمع رکھے۔',
  },

  // ---------- Ramadan ----------
  {
    id: 'iftar', group: 'ramadan', title: 'When breaking the fast', tags: 'iftar ramadan fast roza break', source: 'Abu Dawud',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ', translit: "Dhahaba az-zama'u wabtallatil-urooqu wa thabatal-ajru in sha Allah.",
    en: 'The thirst has gone, the veins are moist, and the reward is confirmed, if Allah wills.', ur: 'پیاس بجھ گئی، رگیں تر ہو گئیں اور ان شاء اللہ اجر ثابت ہو گیا۔',
  },
  {
    id: 'qadr', group: 'ramadan', title: 'Laylat al-Qadr', tags: 'laylatul qadr night of power ramadan shab-e-qadr', source: 'Jami at-Tirmidhi',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', translit: "Allahumma innaka afuwwun tuhibbul-afwa fa'fu anni.",
    en: 'O Allah, You are the Pardoner and You love to pardon, so pardon me.', ur: 'اے اللہ! تو بہت معاف کرنے والا ہے، معافی کو پسند کرتا ہے، پس مجھے معاف کر دے۔',
  },
];
