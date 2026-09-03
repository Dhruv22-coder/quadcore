import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sun,
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
} from 'lucide-react';
import { Language, IndianState, ActivePage } from '../types';
import { translations } from '../lib/utils';
import { NAV_TRANSLATIONS } from '../data/navigationTranslations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  isSunlightMode: boolean;
  onToggleSunlightMode: () => void;
  currentState: IndianState;
  onOpenLocationModal: () => void;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

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
  currentState,
  onOpenLocationModal,
  activePage,
  onPageChange,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language] || translations.en;
  const navTexts = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.en;

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs transition-colors w-full">
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
                <span className="font-black text-sm sm:text-lg tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                  {t.appName}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold line-clamp-1 hidden md:block max-w-[200px]">
                {t.tagline}
              </p>
            </div>
          </button>

          {/* 2. Utility Controls (Location, Audio, Language, Sunlight) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Location / State Indicator Button */}
            <button
              id="location-state-button"
              onClick={onOpenLocationModal}
              className="h-8 sm:h-9 lg:h-10 px-1.5 sm:px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-colors shadow-2xs group cursor-pointer shrink-0"
              title={`${t.locationLabel}: ${currentState.name} (${currentState.nativeName})`}
              aria-label="Change State Location"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[11px] sm:text-xs text-slate-900 truncate max-w-[48px] xs:max-w-[75px] sm:max-w-[110px]">
                {currentState.name}
              </span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
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
                className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center sm:justify-start gap-1 transition-colors shadow-2xs cursor-pointer shrink-0"
                aria-label="Select Language"
                title={`Language: ${currentLangObj.nativeName} (${currentLangObj.label})`}
              >
                <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="hidden sm:inline text-xs font-black leading-tight text-slate-900">
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
                  <div className="absolute right-0 mt-2 w-56 sm:w-64 max-h-[75vh] overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                      <span>13 Indian Languages</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {languages.map((item) => {
                        const isSelected = language === item.code;
                        return (
                          <button
                            key={item.code}
                            onClick={() => {
                              onLanguageChange(item.code);
                              setLangMenuOpen(false);
                            }}
                            className={`w-full min-h-[40px] px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                              isSelected ? 'bg-emerald-50/80 text-emerald-900 font-bold' : 'text-slate-700'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{item.nativeName}</span>
                              <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sunlight High Contrast Mode Toggle (Always fully visible, shrink-0) */}
            <button
              id="sunlight-mode-toggle"
              onClick={onToggleSunlightMode}
              title={t.sunlightMode}
              className={`h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg text-xs font-bold flex items-center justify-center transition-all border shrink-0 cursor-pointer ${
                isSunlightMode
                  ? 'bg-amber-400 text-slate-950 font-black border-amber-500 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
              }`}
              aria-label="Toggle Sunlight High Contrast Mode"
            >
              <Sun className={`w-4 h-4 ${isSunlightMode ? 'stroke-[2.5] text-slate-950 animate-spin-slow' : 'text-amber-600'}`} />
            </button>

            {/* Mobile Menu Hamburger Toggle Button (Just icon on mobile) */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 flex items-center justify-center font-black text-xs cursor-pointer shadow-2xs select-none shrink-0"
              aria-label={mobileMenuOpen ? navTexts.closeBtn : navTexts.menuBtn}
              title={mobileMenuOpen ? navTexts.closeBtn : navTexts.menuBtn}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-emerald-950 stroke-[2.5]" />
              ) : (
                <Menu className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* 4. Dedicated Mobile & Tablet Horizontal Nav Bar (Under header) */}
        <div className="lg:hidden border-t border-slate-100 py-1.5 overflow-x-auto scrollbar-none w-full">
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
                      : 'bg-slate-50/90 hover:bg-slate-100 text-slate-700 border-slate-200/90'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-200' : 'text-slate-500'}`} />
                  <span className="truncate">
                    {item.stepNum}. {itemTrans.shortLabel}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 5. Mobile Drawer Menu (Localized in selected language, with Sunlight & Audio quick controls) */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-overlay"
          className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-150"
        >
          <div className="max-w-md mx-auto px-3.5 py-3 space-y-2.5">
            {/* Drawer Header with Section Count */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-black text-slate-600 uppercase tracking-wide">
              <span>{navTexts.menuHeading}</span>
              <span className="text-[11px] text-emerald-800 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {navTexts.sectionsCount}
              </span>
            </div>

            {/* Quick Settings Bar inside drawer (Sunlight mode & Location) */}
            <div className="grid grid-cols-2 gap-2 pb-1">
              <button
                type="button"
                onClick={onToggleSunlightMode}
                className={`min-h-[42px] px-3 rounded-xl border flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${
                  isSunlightMode
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-black'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Sun className={`w-4 h-4 ${isSunlightMode ? 'text-amber-700 stroke-[2.5]' : 'text-amber-500'}`} />
                  <span>{t.sunlightMode}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${isSunlightMode ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'}`}>
                  {isSunlightMode ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenLocationModal();
                  setMobileMenuOpen(false);
                }}
                className="min-h-[42px] px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">{currentState.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">Change</span>
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
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-black shadow-2xs ring-1 ring-emerald-500/30'
                        : 'bg-slate-50/70 border-slate-200/80 text-slate-800 hover:bg-slate-100 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
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
                        <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                          {itemTrans.desc}
                        </p>
                      </div>
                    </div>
                    {isActive && <Check className="w-5 h-5 text-emerald-700 shrink-0 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>

            {/* Quick Helpline Call inside drawer (translated) */}
            <div className="pt-2 border-t border-slate-100">
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
