import { IndianState, Language } from '../types';

export const INDIAN_STATES: IndianState[] = [
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    nativeName: 'महाराष्ट्र',
    language: 'mr',
    primaryCrops: ['onion', 'soybean', 'cotton', 'sugarcane', 'tur', 'pomegranate'],
    keyMandi: 'Lasalgaon / Vashi APMC',
    lat: 19.7515,
    lng: 75.7139,
  },
  {
    id: 'punjab',
    name: 'Punjab',
    hindiName: 'पंजाब',
    nativeName: 'ਪੰਜਾਬ',
    language: 'pa',
    primaryCrops: ['wheat', 'paddy', 'cotton', 'maize', 'mustard'],
    keyMandi: 'Khanna / Ludhiana Grain Market',
    lat: 31.1471,
    lng: 75.3412,
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    hindiName: 'गुजरात',
    nativeName: 'ગુજરાત',
    language: 'gu',
    primaryCrops: ['cotton', 'groundnut', 'cumin', 'castor', 'onion'],
    keyMandi: 'Unjha / Gondal Market Yard',
    lat: 22.2587,
    lng: 71.1924,
  },
  {
    id: 'uttar_pradesh',
    name: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    nativeName: 'उत्तर प्रदेश',
    language: 'hi',
    primaryCrops: ['sugarcane', 'wheat', 'potato', 'paddy', 'mustard'],
    keyMandi: 'Muzaffarnagar / Agra / Kanpur',
    lat: 26.8467,
    lng: 80.9462,
  },
  {
    id: 'madhya_pradesh',
    name: 'Madhya Pradesh',
    hindiName: 'मध्य प्रदेश',
    nativeName: 'मध्य प्रदेश',
    language: 'hi',
    primaryCrops: ['soybean', 'wheat', 'chana', 'garlic', 'mustard'],
    keyMandi: 'Indore / Ujjain / Harda Mandi',
    lat: 22.9734,
    lng: 78.6569,
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    hindiName: 'राजस्थान',
    nativeName: 'राजस्थान',
    language: 'hi',
    primaryCrops: ['mustard', 'bajra', 'cumin', 'chana', 'guar'],
    keyMandi: 'Kota / Jaipur / Nagaur Mandi',
    lat: 27.0238,
    lng: 74.2179,
  },
  {
    id: 'haryana',
    name: 'Haryana',
    hindiName: 'हरियाणा',
    nativeName: 'हरियाणा',
    language: 'hi',
    primaryCrops: ['wheat', 'paddy', 'mustard', 'cotton', 'bajra'],
    keyMandi: 'Karnal / Sirsa / Kaithal',
    lat: 29.0588,
    lng: 76.0856,
  },
  {
    id: 'west_bengal',
    name: 'West Bengal',
    hindiName: 'पश्चिम बंगाल',
    nativeName: 'পশ্চিমবঙ্গ',
    language: 'bn',
    primaryCrops: ['paddy', 'jute', 'potato', 'tea', 'vegetables'],
    keyMandi: 'Burdwan / Siliguri Regulated Market',
    lat: 22.9868,
    lng: 87.855,
  },
  {
    id: 'bihar',
    name: 'Bihar',
    hindiName: 'बिहार',
    nativeName: 'बिहार',
    language: 'hi',
    primaryCrops: ['maize', 'paddy', 'wheat', 'makhana', 'litchi'],
    keyMandi: 'Gulabbagh Purnea / Muzaffarpur',
    lat: 25.0961,
    lng: 85.3131,
  },
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu',
    hindiName: 'तमिलनाडु',
    nativeName: 'தமிழ்நாடு',
    language: 'ta',
    primaryCrops: ['paddy', 'banana', 'coconut', 'turmeric', 'sugarcane'],
    keyMandi: 'Koyambedu / Erode Turmeric Market',
    lat: 11.1271,
    lng: 78.6569,
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    hindiName: 'कर्नाटक',
    nativeName: 'ಕರ್ನಾಟಕ',
    language: 'kn',
    primaryCrops: ['coffee', 'ragi', 'tur', 'cotton', 'tomato', 'maize'],
    keyMandi: 'Hubballi / Kolar / APMC Yeshwanthpur',
    lat: 15.3173,
    lng: 75.7139,
  },
  {
    id: 'andhra_pradesh',
    name: 'Andhra Pradesh',
    hindiName: 'आंध्र प्रदेश',
    nativeName: 'ఆంధ్ర ప్రదేశ్',
    language: 'te',
    primaryCrops: ['red_chilli', 'paddy', 'tobacco', 'cotton', 'groundnut'],
    keyMandi: 'Guntur Chilli Yard / Vijayawada',
    lat: 15.9129,
    lng: 79.74,
  },
  {
    id: 'telangana',
    name: 'Telangana',
    hindiName: 'तेलंगाना',
    nativeName: 'తెలంగాణ',
    language: 'te',
    primaryCrops: ['cotton', 'paddy', 'red_chilli', 'turmeric', 'maize'],
    keyMandi: 'Warangal Enamamula / Nizamabad',
    lat: 18.1124,
    lng: 79.0193,
  },
  {
    id: 'kerala',
    name: 'Kerala',
    hindiName: 'केरल',
    nativeName: 'കേരളം',
    language: 'ml',
    primaryCrops: ['rubber', 'coconut', 'tea', 'coffee', 'black_pepper', 'ginger'],
    keyMandi: 'Kochi Rubber / Wayanad Spices Market',
    lat: 10.8505,
    lng: 76.2711,
  },
  {
    id: 'odisha',
    name: 'Odisha',
    hindiName: 'ओडिशा',
    nativeName: 'ଓଡ଼ିଶା',
    language: 'or',
    primaryCrops: ['paddy', 'pulses', 'turmeric', 'groundnut', 'jute'],
    keyMandi: 'Bhubaneswar / Sambalpur RMC',
    lat: 20.9517,
    lng: 85.0985,
  },
  {
    id: 'assam',
    name: 'Assam',
    hindiName: 'असम',
    nativeName: 'অসম',
    language: 'as',
    primaryCrops: ['tea', 'jute', 'paddy', 'mustard', 'ginger'],
    keyMandi: 'Guwahati Tea Auction / Darrang Mandi',
    lat: 26.2006,
    lng: 92.9376,
  },
  {
    id: 'jammu_kashmir',
    name: 'Jammu & Kashmir',
    hindiName: 'जम्मू और कश्मीर',
    nativeName: 'جموں و کشمیر',
    language: 'ur',
    primaryCrops: ['apple', 'saffron', 'walnut', 'paddy'],
    keyMandi: 'Sopore Fruit Mandi / Narwal Jammu',
    lat: 33.7782,
    lng: 76.5762,
  },
  {
    id: 'himachal_pradesh',
    name: 'Himachal Pradesh',
    hindiName: 'हिमाचल प्रदेश',
    nativeName: 'हिमाचल प्रदेश',
    language: 'hi',
    primaryCrops: ['apple', 'potato', 'ginger', 'garlic', 'tomato'],
    keyMandi: 'Dhali Fruit Market / Solan Mandi',
    lat: 31.1048,
    lng: 77.1734,
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    hindiName: 'छत्तीसगढ़',
    nativeName: 'छत्तीसगढ़',
    language: 'hi',
    primaryCrops: ['paddy', 'maize', 'soybean', 'chana', 'vegetables'],
    keyMandi: 'Raipur / Durg APMC Mandi',
    lat: 21.2787,
    lng: 81.8661,
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    hindiName: 'झारखंड',
    nativeName: 'झारखंड',
    language: 'hi',
    primaryCrops: ['paddy', 'maize', 'pulses', 'vegetables'],
    keyMandi: 'Ranchi / Jamshedpur Krishi Bazaar',
    lat: 23.6102,
    lng: 85.2799,
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    hindiName: 'उत्तराखंड',
    nativeName: 'उत्तराखंड',
    language: 'hi',
    primaryCrops: ['paddy', 'wheat', 'sugarcane', 'soybean', 'apple'],
    keyMandi: 'Kashipur / Haldwani / Rudrapur',
    lat: 30.0668,
    lng: 79.0193,
  },
];

// Distance calculation using Haversine formula
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest Indian State based on coordinates and returns
 * the corresponding regional state info & primary native language.
 */
export function detectStateFromCoordinates(lat: number, lng: number): IndianState {
  let closestState = INDIAN_STATES[0];
  let minDistance = Infinity;

  for (const state of INDIAN_STATES) {
    const dist = getDistanceKm(lat, lng, state.lat, state.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestState = state;
    }
  }

  return closestState;
}

export function getStateById(id: string): IndianState | undefined {
  return INDIAN_STATES.find((s) => s.id === id);
}

export const LANGUAGE_OPTIONS: Array<{
  code: Language;
  label: string;
  nativeName: string;
  scriptBadge: string;
  associatedStates: string;
}> = [
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', scriptBadge: 'हि', associatedStates: 'UP, MP, Bihar, Raj, Har, CG' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', scriptBadge: 'म', associatedStates: 'Maharashtra, Goa' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', scriptBadge: 'ગુ', associatedStates: 'Gujarat' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', scriptBadge: 'ਪੰ', associatedStates: 'Punjab, Haryana' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', scriptBadge: 'বা', associatedStates: 'West Bengal, Tripura, Assam' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', scriptBadge: 'తె', associatedStates: 'Andhra Pradesh, Telangana' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', scriptBadge: 'த', associatedStates: 'Tamil Nadu, Puducherry' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', scriptBadge: 'ಕ', associatedStates: 'Karnataka' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം', scriptBadge: 'മ', associatedStates: 'Kerala' },
  { code: 'or', label: 'Odia', nativeName: 'ଓଡ଼ିଆ', scriptBadge: 'ଓ', associatedStates: 'Odisha' },
  { code: 'as', label: 'Assamese', nativeName: 'অসমীয়া', scriptBadge: 'অ', associatedStates: 'Assam' },
  { code: 'ur', label: 'Urdu', nativeName: 'اردو', scriptBadge: 'ار', associatedStates: 'J&K, Telangana, Delhi' },
  { code: 'en', label: 'English', nativeName: 'English', scriptBadge: 'EN', associatedStates: 'All India' },
];
