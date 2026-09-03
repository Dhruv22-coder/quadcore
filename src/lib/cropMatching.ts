import { CropData } from '../types';

/**
 * Comprehensive multi-lingual and phonetic voice search alias dictionary
 * for all 32 crops in MandiMitra.
 * Covers English, Hindi, Marathi, Gujarati, Punjabi, Bengali, Tamil, Telugu,
 * Kannada, Malayalam, Odia, Urdu, and common colloquial/phonetic spoken variations.
 */
export const CROP_VOICE_ALIASES: Record<string, string[]> = {
  wheat: [
    'wheat',
    'gehun',
    'gehu',
    'gehoon',
    'गेहूं',
    'गेहुं',
    'गहू',
    'ghau',
    'ghav',
    'kanak',
    'कनक',
    'godhumai',
    'godhumalu',
    'godhi',
    'sharbati',
    'lokwan',
    'tukda',
    'गोधूम',
    'wheats',
  ],
  paddy: [
    'rice',
    'paddy',
    'chawal',
    'chaawal',
    'dhan',
    'daan',
    'चावल',
    'धान',
    'भात',
    'तांदूळ',
    'dangar',
    'chokha',
    'jhona',
    'arisi',
    'vari',
    'nellu',
    'dhaanya',
    'basmati',
    'parmal',
    'bhat',
    'chaval',
  ],
  maize: [
    'maize',
    'corn',
    'makka',
    'makkai',
    'makai',
    'मक्का',
    'मका',
    'भुट्टा',
    'bhutta',
    'cholam',
    'mokka jonna',
    'mekkejola',
    'makke',
    'makkah',
  ],
  bajra: [
    'bajra',
    'bajri',
    'baajra',
    'बाजरा',
    'बाजरी',
    'pearl millet',
    'millet',
    'kambu',
    'sajje',
    'sajjalu',
    'cambu',
  ],
  jowar: [
    'jowar',
    'jowari',
    'ज्वार',
    'ज्वारी',
    'sorghum',
    'jonna',
    'jola',
    'cholam',
    'juar',
    'jovar',
    'jovaar',
  ],
  ragi: [
    'ragi',
    'रागी',
    'nachni',
    'नाचणी',
    'finger millet',
    'mandua',
    'kezhvaragu',
    'ragulu',
    'mandia',
    'nachani',
  ],
  chana: [
    'chana',
    'channa',
    'चना',
    'हरभरा',
    'harbhara',
    'gram',
    'bengal gram',
    'chhole',
    'chole',
    'kadalai',
    'senagalu',
    'kadale',
    'kone',
    'chickpea',
    'chickpeas',
    'kala chana',
    'kabuli chana',
  ],
  tur: [
    'tur',
    'toor',
    'arhar',
    'अरहर',
    'तूर',
    'तुवर',
    'tuvar',
    'tuver',
    'pigeon pea',
    'kandulu',
    'thuvaram paruppu',
    'togari',
    'arahar',
    'toor dal',
    'tur dal',
    'arhar dal',
  ],
  moong: [
    'moong',
    'mung',
    'मूंग',
    'मूँग',
    'mug',
    'green gram',
    'pesalu',
    'paasi payaru',
    'hesaru kaalu',
    'mung dal',
    'moong dal',
    'moong daal',
    'munga',
  ],
  urad: [
    'urad',
    'उड़द',
    'उडीद',
    'udid',
    'mash',
    'black gram',
    'minumulu',
    'ulundhu',
    'uddu',
    'urad dal',
    'udad',
    'urad daal',
    'black lentil',
  ],
  soybean: [
    'soybean',
    'soya',
    'सोयाबीन',
    'सोया',
    'soyabean',
    'soya bean',
    'bhatmash',
    'soiabean',
    'soya seed',
  ],
  mustard: [
    'mustard',
    'sarson',
    'सरसों',
    'मोहरी',
    'mohari',
    'rai',
    'राई',
    'kadugu',
    'avalu',
    'sasive',
    'sorisa',
    'toria',
    'sarso',
    'raai',
  ],
  groundnut: [
    'groundnut',
    'peanut',
    'mungfali',
    'मूंगफली',
    'भुईमूग',
    'bhuimug',
    'singdana',
    'moongfali',
    'kadalai',
    'verukadalai',
    'pallilu',
    'shenga',
    'chinabadam',
    'sing',
    'ground nut',
    'pea nut',
    'shingdana',
  ],
  cotton: [
    'cotton',
    'kapas',
    'कपास',
    'कापूस',
    'kapus',
    'ru',
    'rui',
    'rooi',
    'रुई',
    'paruthi',
    'paththi',
    'kapasiya',
    'rooyi',
  ],
  sugarcane: [
    'sugarcane',
    'ganna',
    'गन्ना',
    'ऊस',
    'us',
    'oos',
    'karumbu',
    'cheruku',
    'kabbu',
    'ikshu',
    'sugar cane',
    'ganne',
  ],
  jute: [
    'jute',
    'पटसन',
    'patson',
    'ताग',
    'tag',
    'san',
    'paat',
    'shon',
    'jute fiber',
    'patsan',
    'jhute',
  ],
  onion: [
    'onion',
    'pyaz',
    'pyaaz',
    'प्याज',
    'कांदा',
    'kanda',
    'dungri',
    'vengayam',
    'ullipayalu',
    'eerulli',
    'piyaz',
    'kande',
    'onions',
    'pyaaj',
  ],
  garlic: [
    'garlic',
    'lahsun',
    'lasun',
    'लहसुन',
    'लसूण',
    'poondu',
    'vellulli',
    'bellulli',
    'veluthulli',
    'lasan',
    'lehsan',
    'lahsan',
  ],
  red_chilli: [
    'red chilli',
    'chilli',
    'chili',
    'mirch',
    'mirchi',
    'लाल मिर्च',
    'मिरची',
    'lal mirch',
    'milagai',
    'mirapakaya',
    'menasinakayi',
    'sukhi mirch',
    'chilli pepper',
    'mirchiya',
    'laal mirch',
  ],
  turmeric: [
    'turmeric',
    'haldi',
    'हल्दी',
    'हळद',
    'halad',
    'manjal',
    'pasupu',
    'arishina',
    'haladi',
    'turmaric',
    'haldee',
  ],
  ginger: [
    'ginger',
    'adrak',
    'अदरक',
    'आले',
    'aale',
    'ale',
    'allam',
    'inji',
    'shunti',
    'ada',
    'aada',
    'adrakh',
  ],
  cumin: [
    'cumin',
    'jeera',
    'jira',
    'जीरा',
    'जিরে',
    'jeerakam',
    'jeelakarra',
    'jeerige',
    'zeera',
    'jeeru',
    'cumin seeds',
  ],
  coriander: [
    'coriander',
    'dhaniya',
    'dhania',
    'धनिया',
    'कोथिंबीर',
    'kothimbir',
    'kothmir',
    'kothamalli',
    'dhaniamalu',
    'kothambari',
    'dhani',
  ],
  tomato: [
    'tomato',
    'tamatar',
    'टमाटर',
    'टोमॅटो',
    'thakkali',
    'tameta',
    'tamata',
    'tomaato',
    'tomatoes',
    'tamatr',
  ],
  potato: [
    'potato',
    'aloo',
    'alu',
    'aaloo',
    'आलू',
    'बटाटा',
    'batata',
    'urulaikizhangu',
    'alugadda',
    'alagedda',
    'potatoes',
  ],
  green_peas: [
    'green peas',
    'peas',
    'matar',
    'mattar',
    'मटर',
    'मटार',
    'batani',
    'pattani',
    'watana',
    'vatana',
    'greenpeas',
    'green pea',
    'hari matar',
    'pea',
  ],
  cauliflower: [
    'cauliflower',
    'gobi',
    'gobhi',
    'गोभी',
    'फूलगोभी',
    'फुलकोबी',
    'phool gobhi',
    'flower',
    'cauli',
    'phul gobhi',
    'bandha gobi',
    'patta gobhi',
  ],
  apple: [
    'apple',
    'seb',
    'सेब',
    'सफरचंद',
    'safarchand',
    'aappil',
    'sebphal',
    'seba',
    'apples',
  ],
  banana: [
    'banana',
    'kela',
    'kele',
    'केला',
    'केळी',
    'keli',
    'vazhaipazham',
    'arati pandu',
    'bale hannu',
    'kola',
    'bananas',
  ],
  tea: [
    'tea',
    'chai',
    'चाए',
    'चाय',
    'चहा',
    'chaha',
    'theeneer',
    'cha',
    'chah',
    'chaipatti',
  ],
  coffee: [
    'coffee',
    'kaapi',
    'कॉफ़ी',
    'कॉफी',
    'kafi',
    'koffee',
    'kapi',
  ],
  coconut: [
    'coconut',
    'nariyal',
    'नारियल',
    'नारळ',
    'naral',
    'thengai',
    'kobbari',
    'tenginakayi',
    'naarol',
    'copra',
    'kopra',
    'narikel',
    'nariyel',
  ],
};

/**
 * Normalizes speech transcript: converts to lowercase, strips punctuation and trims extra spaces.
 */
export function normalizeTranscript(transcript: string): string {
  return transcript
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Robust fuzzy & substring matching algorithm.
 * Matches spoken phrases like:
 * - "select tomato"
 * - "mujhe gehun dekhna hai"
 * - "pyaz ka bhav"
 * - "kanda rate"
 * - "aloo"
 * - "kapas"
 * - "soya"
 * against all 32 crops in the app dataset.
 */
export function matchCropFromVoiceTranscript(
  rawTranscript: string,
  cropsList: CropData[]
): { crop: CropData; matchedAlias: string } | null {
  if (!rawTranscript || typeof rawTranscript !== 'string') {
    return null;
  }

  const cleanTranscript = normalizeTranscript(rawTranscript);
  if (!cleanTranscript) {
    return null;
  }

  const spokenWords = cleanTranscript.split(/\s+/);

  interface MatchCandidate {
    crop: CropData;
    alias: string;
    score: number; // Higher is better
  }

  const candidates: MatchCandidate[] = [];

  for (const crop of cropsList) {
    // Collect all aliases for this crop
    const aliases = new Set<string>();

    // 1. Primary names
    if (crop.name) aliases.add(crop.name.toLowerCase().trim());
    if (crop.id) aliases.add(crop.id.toLowerCase().replace(/_/g, ' ').trim());
    if (crop.hindiName) aliases.add(crop.hindiName.toLowerCase().trim());
    if (crop.marathiName) aliases.add(crop.marathiName.toLowerCase().trim());

    // 2. Regional translated names
    if (crop.regionalNames) {
      Object.values(crop.regionalNames).forEach((val) => {
        if (typeof val === 'string' && val.trim()) {
          // Remove parenthetical details like "(Sharbati/Lokwan)" or "(चावल)"
          const cleaned = val.replace(/\(.*?\)/g, '').toLowerCase().trim();
          if (cleaned) aliases.add(cleaned);
        }
      });
    }

    // 3. Synonym dictionary entries
    const dictAliases = CROP_VOICE_ALIASES[crop.id] || [];
    for (const a of dictAliases) {
      aliases.add(a.toLowerCase().trim());
    }

    // Check each alias against cleanTranscript
    for (const alias of aliases) {
      if (!alias) continue;

      // Substring check: Does the transcript contain the alias?
      if (cleanTranscript.includes(alias)) {
        // High score: longer alias matches have more weight (e.g. "green peas" > "peas")
        // Word boundary match bonus
        const isWholeWord = spokenWords.includes(alias) || cleanTranscript === alias;
        const score = alias.length * (isWholeWord ? 10 : 5);
        candidates.push({ crop, alias, score });
        continue;
      }

      // Reverse check: Is cleanTranscript contained in the alias? (e.g. user said "soya", alias is "soyabean")
      if (cleanTranscript.length >= 3 && alias.includes(cleanTranscript)) {
        candidates.push({ crop, alias, score: cleanTranscript.length * 3 });
        continue;
      }
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  // Sort candidates by highest score
  candidates.sort((a, b) => b.score - a.score);

  return {
    crop: candidates[0].crop,
    matchedAlias: candidates[0].alias,
  };
}
