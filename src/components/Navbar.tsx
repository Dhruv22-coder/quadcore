import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Sprout, Globe, Check, MapPin, ChevronDown } from 'lucide-react';
import { Language, IndianState } from '../types';
import { translations } from '../lib/utils';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  isSunlightMode: boolean;
  onToggleSunlightMode: () => void;
  currentState: IndianState;
  onOpenLocationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  isAudioPlaying,
  onToggleAudio,
  isSunlightMode,
  onToggleSunlightMode,
  currentState,
  onOpenLocationModal,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[language];

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                {t.appName}
              </span>
              <span className="hidden xs:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Location / State Indicator Button */}
          <button
            id="location-state-button"
            onClick={onOpenLocationModal}
            className="min-h-[44px] sm:min-h-[48px] px-2.5 sm:px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-2xs group"
            title={`${t.location}: ${currentState.name} (${currentState.nativeName})`}
            aria-label="Change State Location"
          >
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 leading-none hidden sm:block">
                {t.location}
              </span>
              <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate max-w-[85px] sm:max-w-[120px]">
                {currentState.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 shrink-0" />
          </button>

          {/* Sunlight High Contrast Mode Toggle */}
          <button
            id="sunlight-mode-toggle"
            onClick={onToggleSunlightMode}
            title={t.sunlightMode}
            className={`min-h-[44px] sm:min-h-[48px] px-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all border shrink-0 ${
              isSunlightMode
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-500 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
            aria-label="Toggle Sunlight High Contrast Mode"
          >
            <Sun className={`w-4 h-4 ${isSunlightMode ? 'stroke-[2.5] text-slate-950' : 'text-amber-600'}`} />
            <span className="hidden lg:inline font-semibold">
              {t.sunlightMode}
            </span>
          </button>

          {/* Prominent Audio Mode Button */}
          <button
            id="listen-audio-button"
            onClick={onToggleAudio}
            className={`min-h-[44px] sm:min-h-[48px] px-2.5 sm:px-3.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all select-none border shrink-0 ${
              isAudioPlaying
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-emerald-500/50'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 shadow-2xs'
            }`}
            aria-label="Listen to Audio Advice"
          >
            {isAudioPlaying ? (
              <>
                <VolumeX className="w-4 h-4 text-white" />
                <span className="font-bold tracking-tight text-xs sm:text-sm">{t.stopAudio}</span>
                <span className="hidden sm:flex gap-0.5 items-end h-3 ml-0.5">
                  <span className="w-1 bg-white rounded-full animate-pulse h-3" />
                  <span className="w-1 bg-white rounded-full animate-pulse h-2" />
                  <span className="w-1 bg-white rounded-full animate-pulse h-3.5" />
                </span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-700 stroke-[2.2]" />
                <span className="font-bold tracking-tight text-emerald-900 text-xs sm:text-sm">{t.audioMode}</span>
              </>
            )}
          </button>

          {/* Language Selector Dropdown (All 13 Indian Languages) */}
          <div className="relative shrink-0">
            <button
              id="language-dropdown-button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="min-h-[44px] sm:min-h-[48px] px-2.5 sm:px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              aria-label="Select Regional Indian Language"
            >
              <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-tight text-slate-900">
                  {currentLangObj.nativeName}
                </span>
                <span className="text-[10px] text-slate-400 uppercase leading-none hidden sm:block font-mono">
                  {currentLangObj.code}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 sm:w-64 max-h-[75vh] overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>{t.language} (13 Languages)</span>
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
                          className={`w-full min-h-[44px] px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-emerald-50/80 text-emerald-900 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{item.nativeName}</span>
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
        </div>
      </div>
    </header>
  );
};
