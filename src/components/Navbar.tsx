import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sprout,
  Globe,
  Check,
  MapPin,
  ChevronDown,
  Wheat,
  Scale,
  Calculator,
  CloudSun,
  PhoneCall,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { Language, IndianState, ActivePage } from '../types';
import { translations } from '../lib/utils';
import { NAV_TRANSLATIONS } from '../data/navigationTranslations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  isSunlightMode?: boolean;
  onToggleSunlightMode?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  currentState: IndianState;
  onOpenLocationModal: () => void;
  onOpenAgriTipsModal: () => void;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

export interface TipsButtonTranslation {
  buttonLabel: string;
  badgeLabel: string;
  drawerTitle: string;
  viewBtn: string;
}

export const TIPS_BUTTON_TRANSLATIONS: Record<Language, TipsButtonTranslation> = {
  en: { buttonLabel: 'Tips', badgeLabel: 'Guide', drawerTitle: 'Seasonal Crop & Soil Guide', viewBtn: 'View' },
  hi: { buttonLabel: 'सलाह', badgeLabel: 'मार्गदर्शन', drawerTitle: 'फसल व मिट्टी सलाह', viewBtn: 'देखें' },
  mr: { buttonLabel: 'सल्ला', badgeLabel: 'मार्गदर्शक', drawerTitle: 'हंगामी पिके व माती सल्ला', viewBtn: 'पहा' },
  pa: { buttonLabel: 'ਸਲਾਹ', badgeLabel: 'ਗਾਈਡ', drawerTitle: 'ਮੌਸਮੀ ਫ਼ਸਲਾਂ ਅਤੇ ਮਿੱਟੀ ਸਲਾਹ', viewBtn: 'ਵੇਖੋ' },
  gu: { buttonLabel: 'સલાહ', badgeLabel: 'માર્ગદર્શિકા', drawerTitle: 'મોસમી પાક અને જમીન સલાહ', viewBtn: 'જુઓ' },
  bn: { buttonLabel: 'পরামর্শ', badgeLabel: 'গাইড', drawerTitle: 'মৌসুমি ফসল ও মাটির পরামর্শ', viewBtn: 'দেখুন' },
  te: { buttonLabel: 'సలహాలు', badgeLabel: 'గైడ్', drawerTitle: 'కాలానుగుణ పంటలు & నేల సలహాలు', viewBtn: 'చూడండి' },
  kn: { buttonLabel: 'ಸಲಹೆಗಳು', badgeLabel: 'ಮಾರ್ಗದರ್ಶಿ', drawerTitle: 'ಋತುಮಾನದ ಬೆಳೆಗಳು & ಮಣ್ಣಿನ ಸಲಹೆ', viewBtn: 'ನೋಡಿ' },
  ta: { buttonLabel: 'ஆலோசனை', badgeLabel: 'வழிகாட்டி', drawerTitle: 'பருவ பயிர்கள் & மண் ஆலோசனை', viewBtn: 'பார்க்க' },
  ml: { buttonLabel: 'നിർദ്ദേശങ്ങൾ', badgeLabel: 'വഴികാട്ടി', drawerTitle: 'കാലാനുസൃത വിളകളും മണ്ണും', viewBtn: 'കാണുക' },
  or: { buttonLabel: 'ପରାମର୍ଶ', badgeLabel: 'ମାର୍ଗଦର୍ଶିକା', drawerTitle: 'ଋତୁକାଳୀନ ଫସଲ ଓ ମୃତ୍ତିକା ପରାମର୍ଶ', viewBtn: 'ଦେଖନ୍ତୁ' },
  as: { buttonLabel: 'পৰামৰ্শ', badgeLabel: 'গাইড', drawerTitle: 'ঋতুকালীন শস্য আৰু মাটিৰ পৰামৰ্শ', viewBtn: 'চাওক' },
  ur: { buttonLabel: 'تجاویز', badgeLabel: 'رہنما', drawerTitle: 'موسمی فصلیں اور مٹی کی رہنمائی', viewBtn: 'دیکھیں' },
};

export interface ThemeTranslation {
  themeLabel: string;
  lightMode: string;
  lightModeShort: string;
  darkMode: string;
  darkModeShort: string;
  themeTogglePrompt: string;
}

export const THEME_TRANSLATIONS: Record<Language, ThemeTranslation> = {
  en: {
    themeLabel: 'Theme',
    lightMode: 'Light Mode',
    lightModeShort: 'Light',
    darkMode: 'Dark Mode',
    darkModeShort: 'Dark',
    themeTogglePrompt: 'Switch between Light & Dark Theme',
  },
  hi: {
    themeLabel: 'थीम',
    lightMode: 'लाइट मोड',
    lightModeShort: 'लाइट',
    darkMode: 'डार्क मोड',
    darkModeShort: 'डार्क',
    themeTogglePrompt: 'लाइट और डार्क मोड बदलें',
  },
  mr: {
    themeLabel: 'थीम',
    lightMode: 'लाइट मोड',
    lightModeShort: 'लाइट',
    darkMode: 'डार्क मोड',
    darkModeShort: 'डार्क',
    themeTogglePrompt: 'लाइट आणि डार्क मोड बदला',
  },
  pa: {
    themeLabel: 'ਥੀਮ',
    lightMode: 'ਲਾਈਟ ਮੋਡ',
    lightModeShort: 'ਲਾਈਟ',
    darkMode: 'ਡਾਰਕ ਮੋਡ',
    darkModeShort: 'ਡਾਰਕ',
    themeTogglePrompt: 'ਲਾਈਟ ਅਤੇ ਡਾਰਕ ਮੋਡ ਬਦਲੋ',
  },
  gu: {
    themeLabel: 'થીમ',
    lightMode: 'લાઇટ મોડ',
    lightModeShort: 'લાઇટ',
    darkMode: 'ડાર્ક મોડ',
    darkModeShort: 'ડાર્ક',
    themeTogglePrompt: 'લાઇટ અને ડાર્ક મોડ બદલો',
  },
  bn: {
    themeLabel: 'থিম',
    lightMode: 'লাইট মোড',
    lightModeShort: 'লাইট',
    darkMode: 'ডার্ক মোড',
    darkModeShort: 'ডার্ক',
    themeTogglePrompt: 'লাইট ও ডার্ক মোড পরিবর্তন করুন',
  },
  te: {
    themeLabel: 'థీమ్',
    lightMode: 'లైట్ మోడ్',
    lightModeShort: 'లైట్',
    darkMode: 'డార్క్ మోడ్',
    darkModeShort: 'డార్క్',
    themeTogglePrompt: 'లైట్ మరియు డార్క్ మోడ్ మార్చండి',
  },
  kn: {
    themeLabel: 'ಥೀಮ್',
    lightMode: 'ಲೈಟ್ ಮೋಡ್',
    lightModeShort: 'ಲೈಟ್',
    darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್',
    darkModeShort: 'ಡಾರ್ಕ್',
    themeTogglePrompt: 'ಲೈಟ್ ಮತ್ತು ಡಾರ್ಕ್ ಮೋಡ್ ಬದಲಾಯಿಸಿ',
  },
  ta: {
    themeLabel: 'தீம்',
    lightMode: 'லைட் பயன்முறை',
    lightModeShort: 'லைட்',
    darkMode: 'டார்க் பயன்முறை',
    darkModeShort: 'டார்க்',
    themeTogglePrompt: 'லைட் மற்றும் டார்க் முறைக்கு மாற்றவும்',
  },
  ml: {
    themeLabel: 'തീം',
    lightMode: 'ലൈറ്റ് മോഡ്',
    lightModeShort: 'ലൈറ്റ്',
    darkMode: 'ഡാർക്ക് മോഡ്',
    darkModeShort: 'ഡാർക്ക്',
    themeTogglePrompt: 'ലൈറ്റ്, ഡാർക്ക് തീം മാറ്റുക',
  },
  or: {
    themeLabel: 'ଥିମ୍',
    lightMode: 'ଲାଇଟ୍ ମୋଡ୍',
    lightModeShort: 'ଲାଇଟ୍',
    darkMode: 'ଡାର୍କ ମୋଡ୍',
    darkModeShort: 'ଡାର୍କ',
    themeTogglePrompt: 'ଲାଇଟ୍ ଓ ଡାର୍କ ମୋଡ୍ ବଦଳାନ୍ତୁ',
  },
  as: {
    themeLabel: 'থিম',
    lightMode: 'লাইট মোড',
    lightModeShort: 'লাইট',
    darkMode: 'ডাৰ্ক মোড',
    darkModeShort: 'ডাৰ্ক',
    themeTogglePrompt: 'লাইট আৰু ডাৰ্ক মোডত সলনি কৰক',
  },
  ur: {
    themeLabel: 'تھیم',
    lightMode: 'لائٹ موڈ',
    lightModeShort: 'لائٹ',
    darkMode: 'ڈارک موڈ',
    darkModeShort: 'ڈارک',
    themeTogglePrompt: 'لائٹ اور ڈارک موڈ میں تبدیل کریں',
  },
};

export interface NavPageMeta {
  id: ActivePage;
  icon: React.ComponentType<{ className?: string }>;
  stepNum: number;
}

export const NAV_PAGES_META: NavPageMeta[] = [
  { id: 'crops', icon: Wheat, stepNum: 1 },
  { id: 'decision', icon: Scale, stepNum: 2 },
  { id: 'profit', icon: Calculator, stepNum: 3 },
  { id: 'weather', icon: CloudSun, stepNum: 4 },
  { id: 'help', icon: PhoneCall, stepNum: 5 },
];

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  isAudioPlaying,
  onToggleAudio,
  isSunlightMode,
  onToggleSunlightMode,
  isDarkMode,
  onToggleDarkMode,
  currentState,
  onOpenLocationModal,
  onOpenAgriTipsModal,
  activePage,
  onPageChange,
}) => {
  const isDark = isSunlightMode ?? isDarkMode ?? false;
  const toggleDark = onToggleSunlightMode || onToggleDarkMode || (() => {});
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language] || translations.en;
  const navTexts = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.en;
  const tipsText = TIPS_BUTTON_TRANSLATIONS[language] || TIPS_BUTTON_TRANSLATIONS.en;
  const themeText = THEME_TRANSLATIONS[language] || THEME_TRANSLATIONS.en;

  const languages: Array<{ code: Language; label: string; nativeName: string }> = [
    { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'en', label: 'English', nativeName: 'English' },
    { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'or', label: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'as', label: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'ur', label: 'Urdu', nativeName: 'اردو' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const handleNavClick = (id: ActivePage) => {
    onPageChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 w-full">
        {/* Main Navbar Top Row */}
        <div className="h-14 sm:h-16 lg:h-18 flex items-center justify-between gap-1 sm:gap-2 w-full">
          {/* 1. Brand Logo & Title (Clicking navigates to Crops list) */}
          <button
            type="button"
            onClick={() => handleNavClick('crops')}
            className="flex items-center gap-1.5 sm:gap-2 text-left cursor-pointer select-none group focus:outline-hidden shrink-0 min-w-0"
            title={`${t.appName} Home`}
            aria-label={`${t.appName} Home`}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:bg-emerald-800 transition-colors">
              <Sprout className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-black text-sm sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {t.appName}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold line-clamp-1 hidden md:block max-w-[200px]">
                {t.tagline}
              </p>
            </div>
          </button>

          {/* 2. Utility Controls (Location, Audio, Language, Theme) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Location / State Indicator Button */}
            <button
              id="location-state-button"
              onClick={onOpenLocationModal}
              className="h-8 sm:h-9 lg:h-10 px-1.5 sm:px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-colors shadow-2xs group cursor-pointer shrink-0"
              title={`${t.locationLabel}: ${currentState.name} (${currentState.nativeName})`}
              aria-label="Change State Location"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white truncate max-w-[48px] xs:max-w-[75px] sm:max-w-[110px]">
                {currentState.name}
              </span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
            </button>

            {/* Beginner Farmer Crop & Soil Tips Button (Localized in Regional Language) */}
            <button
              id="header-agri-tips-button"
              onClick={onOpenAgriTipsModal}
              className="h-8 sm:h-9 lg:h-10 px-2 sm:px-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100/90 dark:hover:bg-amber-900/80 border border-amber-300/80 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 text-xs font-black flex items-center gap-1 sm:gap-1.5 transition-all shadow-2xs group cursor-pointer shrink-0 animate-in fade-in"
              title={`${tipsText.buttonLabel}: ${currentState.name} (${tipsText.drawerTitle})`}
              aria-label={`${tipsText.buttonLabel} - ${currentState.name}`}
            >
              <Sprout className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
              <span className="font-black text-[11px] sm:text-xs text-amber-950 dark:text-amber-200 tracking-tight">
                {tipsText.buttonLabel}
              </span>
              <span className="hidden xl:inline-flex items-center text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-200/90 dark:bg-amber-900 text-amber-900 dark:text-amber-200 ml-0.5">
                {tipsText.badgeLabel}
              </span>
            </button>

            {/* Dark Mode / Light Mode Toggle Button (Header / Desktop & Tablet) */}
            <button
              id="header-theme-toggle-btn"
              type="button"
              onClick={toggleDark}
              className={`h-8 sm:h-9 lg:h-10 px-2 sm:px-2.5 rounded-lg border text-xs font-black flex items-center gap-1 sm:gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 ring-1 ring-amber-400/30'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={isDark ? themeText.lightMode : themeText.darkMode}
              aria-label={`Toggle Theme: currently ${isDark ? 'Dark' : 'Light'}`}
              role="switch"
              aria-checked={isDark}
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-600 stroke-[2.2]" />
              )}
              <span className="hidden xl:inline text-[11px] font-black">
                {isDark ? themeText.darkModeShort : themeText.lightModeShort}
              </span>
            </button>

            {/* Audio Mode Listen Button */}
            <button
              id="listen-audio-button"
              onClick={onToggleAudio}
              className={`h-8 sm:h-9 lg:h-10 px-2 sm:px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all select-none border shrink-0 cursor-pointer ${
                isAudioPlaying
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-emerald-500/50 animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200 shadow-2xs'
              }`}
              aria-label={isAudioPlaying ? t.stopAudio : t.audioMode}
              title={isAudioPlaying ? t.stopAudio : t.audioMode}
            >
              {isAudioPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">{t.stopAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.2]" />
                  <span className="hidden sm:inline">{t.audioMode}</span>
                </>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                id="language-dropdown-button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center sm:justify-start gap-1 transition-colors shadow-2xs cursor-pointer shrink-0"
                aria-label="Select Language"
                title={`Language: ${currentLangObj.nativeName} (${currentLangObj.label})`}
              >
                <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="hidden sm:inline text-xs font-black leading-tight text-slate-900 dark:text-white">
                  {currentLangObj.nativeName}
                </span>
                <ChevronDown className="hidden sm:inline w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 sm:w-64 max-h-[75vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>13 Indian Languages</span>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-850">
                      {languages.map((item) => {
                        const isSelected = language === item.code;
                        return (
                          <button
                            key={item.code}
                            onClick={() => {
                              onLanguageChange(item.code);
                              setLangMenuOpen(false);
                            }}
                            className={`w-full min-h-[40px] px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                              isSelected ? 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold' : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{item.nativeName}</span>
                              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{item.label}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle Button (Just icon on mobile) */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-black text-xs cursor-pointer shadow-2xs select-none shrink-0"
              aria-label={mobileMenuOpen ? navTexts.closeBtn : navTexts.menuBtn}
              title={mobileMenuOpen ? navTexts.closeBtn : navTexts.menuBtn}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-emerald-950 dark:text-emerald-200 stroke-[2.5]" />
              ) : (
                <Menu className="w-4 h-4 text-emerald-800 dark:text-emerald-300 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* 4. Dedicated Mobile & Tablet Horizontal Nav Bar (Under header) */}
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 py-1.5 overflow-x-auto scrollbar-none w-full">
          <nav
            id="mobile-top-navbar"
            aria-label="Mobile Navigation Bar"
            className="flex items-center gap-1 w-full"
          >
            {NAV_PAGES_META.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const itemTrans = navTexts.navItems[item.id];
              return (
                <button
                  key={item.id}
                  id={`mobile-navbar-tab-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                  className={`flex-1 min-h-[36px] sm:min-h-[40px] px-1.5 py-1 rounded-lg flex items-center justify-center gap-1 text-[11px] sm:text-xs font-black transition-all shrink-0 cursor-pointer select-none border whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-slate-50/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-750'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-200' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="truncate">
                    {item.stepNum}. {itemTrans.shortLabel}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 5. Mobile Drawer Menu (Localized in selected language, with Dark Mode & Audio quick controls) */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-overlay"
          className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl animate-in slide-in-from-top-2 duration-150"
        >
          <div className="max-w-md mx-auto px-3.5 py-3 space-y-2.5">
            {/* Drawer Header with Section Count */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              <span>{navTexts.menuHeading}</span>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-extrabold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                {navTexts.sectionsCount}
              </span>
            </div>

            {/* Quick Settings Bar inside drawer (Location & Agri Tips) */}
            <div className="space-y-1.5 pb-1">
              <button
                type="button"
                onClick={() => {
                  onOpenLocationModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full min-h-[42px] px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">Zone: {currentState.name} Mandi District</span>
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-extrabold bg-emerald-100/70 dark:bg-emerald-900/60 px-2 py-0.5 rounded">Change</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenAgriTipsModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full min-h-[42px] px-3 rounded-xl bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100/80 dark:hover:bg-amber-900/80 border border-amber-300/80 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 text-xs font-bold flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <Sprout className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 stroke-[2.2]" />
                  <span className="truncate font-black">{tipsText.drawerTitle} ({currentState.nativeName || currentState.name})</span>
                </div>
                <span className="text-[10px] text-amber-900 dark:text-amber-200 font-black bg-amber-200/90 dark:bg-amber-900 px-2 py-0.5 rounded">{tipsText.viewBtn}</span>
              </button>

              {/* Theme Toggle Button inside the Menu */}
              <button
                type="button"
                id="menu-theme-toggle-btn"
                onClick={toggleDark}
                className={`w-full min-h-[44px] px-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all select-none ${
                  isDark
                    ? 'bg-slate-800/90 border-slate-700 text-slate-100 font-black ring-1 ring-amber-400/30 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
                role="switch"
                aria-checked={isDark}
                aria-label={`Toggle Theme: currently ${isDark ? 'Dark' : 'Light'}`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-slate-700 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isDark ? (
                      <Sun className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                    ) : (
                      <Moon className="w-4 h-4 text-slate-600 stroke-[2.2]" />
                    )}
                  </div>
                  <div className="text-left truncate">
                    <span className="truncate font-black block text-slate-900 dark:text-white">
                      {themeText.themeLabel}: {isDark ? themeText.darkModeShort : themeText.lightModeShort}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">
                      {themeText.themeTogglePrompt}
                    </span>
                  </div>
                </div>

                {/* Visual Toggle Switch */}
                <div
                  className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors duration-200 shrink-0 ${
                    isDark ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center">
                    {isDark ? (
                      <Sun className="w-3 h-3 text-amber-600" />
                    ) : (
                      <Moon className="w-3 h-3 text-slate-700" />
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* 5 Nav Page Cards */}
            <div className="grid grid-cols-1 gap-1.5">
              {NAV_PAGES_META.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                const itemTrans = navTexts.navItems[item.id];
                return (
                  <button
                    key={item.id}
                    id={`mobile-drawer-link-${item.id}`}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`min-h-[50px] w-full p-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-black shadow-2xs ring-1 ring-emerald-500/30'
                        : 'bg-slate-50/70 dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="text-sm leading-tight flex items-center gap-1.5">
                          <span>
                            {item.stepNum}. {itemTrans.label}
                          </span>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-700 text-white font-black">
                              {navTexts.activeBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                          {itemTrans.desc}
                        </p>
                      </div>
                    </div>
                    {isActive && <Check className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>

            {/* Quick Helpline Call inside drawer (translated) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href="tel:18001801551"
                className="w-full min-h-[44px] px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span className="truncate">{navTexts.callHelpline}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
