export type Language =
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'mr' // Marathi (मराठी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'bn' // Bengali (বাংলা)
  | 'te' // Telugu (తెలుగు)
  | 'ta' // Tamil (தமிழ்)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'as' // Assamese (অসমীয়া)
  | 'ur'; // Urdu (اردو)

export type ActivePage = 'crops' | 'decision' | 'profit' | 'weather' | 'help';

export type DecisionSignal = 'green' | 'amber' | 'red';

export type VehicleType = 'pickup' | 'tractor' | 'cart' | 'truck';

export interface VehicleOption {
  id: VehicleType;
  name: string;
  hindiName: string;
  marathiName: string;
  costPerKm: number;
  capacityQuintals: number;
  icon: string;
}

export interface MandiOption {
  id: string;
  name: string;
  region?: string;
  state?: string;
  location: string;
  distanceKm: number;
  ratePerQuintal: number;
  trend: 'up' | 'down' | 'steady';
  buyerCount: number;
  paymentTerms: string;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  verifiedToday: boolean;
  stateId?: string;
}

export type CropCategory =
  | 'All'
  | 'Cereals'
  | 'Pulses'
  | 'Oilseeds'
  | 'Spices'
  | 'Vegetables'
  | 'Cash Crops'
  | 'Fruits & Plantation';

export interface CropData {
  id: string;
  name: string;
  hindiName: string;
  marathiName?: string;
  regionalNames?: Partial<Record<Language, string>>;
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Spices' | 'Vegetables' | 'Cash Crops' | 'Fruits & Plantation';
  imageUrl?: string;
  colorTheme: string;
  badgeBg: string;
  currentPrice: number;
  priceChangeToday: number;
  trendDirection: 'up' | 'down' | 'neutral';
  arrivalsToday: string;
  arrivalsTrend: 'High' | 'Normal' | 'Low';
  decision: {
    signal: DecisionSignal;
    actionTitle: string;
    actionSubtitle: string;
    verdictLabel: string;
    peakPriceEstimate: number;
    peakTimeframe: string;
    riskFactor: string;
    confidenceScore: number;
    reasons: string[];
    audioSpeechEn: string;
    audioSpeechHi: string;
    audioSpeechRegional?: Partial<Record<Language, string>>;
  };
  priceHistory: Array<{
    day: string;
    price: number;
    projected?: boolean;
  }>;
  mandis: MandiOption[];
}

export interface IndianState {
  id: string;
  name: string;
  hindiName: string;
  nativeName: string;
  language: Language;
  primaryCrops: string[];
  keyMandi: string;
  lat: number;
  lng: number;
}
