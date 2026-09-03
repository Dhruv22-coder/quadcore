import React, { useState, useEffect } from 'react';
import {
  X,
  Sprout,
  Sun,
  CloudRain,
  Calendar,
  Layers,
  Sparkles,
  Award,
  AlertTriangle,
  BookOpen,
  Droplets,
  CheckCircle2,
  Volume2,
  VolumeX,
  TrendingUp,
  MapPin,
  Clock,
  Filter,
  Check,
  ChevronDown,
  Wheat,
} from 'lucide-react';
import { IndianState, Language } from '../types';
import {
  getStateAgriProfile,
  SeasonInfo,
  SeasonalCropRecommendation,
  localizeScheduleText,
  getLocalizedStarterGuide,
  generateAudioAdvisoryText,
} from '../data/agriTipsData';
import {
  AGRI_TIPS_TRANSLATIONS,
  getLocalizedCropDisplayName,
} from '../data/agriTipsTranslations';
import { INDIAN_STATES } from '../data/locations';
import { speakText, stopSpeaking } from '../lib/utils';

interface NewbieAgriTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: IndianState;
  onSelectState?: (state: IndianState) => void;
  language: Language;
}

type TipsFilterView = 'all' | 'crops' | 'soil' | 'rules';

export const NewbieAgriTipsModal: React.FC<NewbieAgriTipsModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onSelectState,
  language,
}) => {
  const t = AGRI_TIPS_TRANSLATIONS[language] || AGRI_TIPS_TRANSLATIONS['en'];
  const profile = getStateAgriProfile(currentState.id, currentState.name);

  const [activeSeasonTab, setActiveSeasonTab] = useState<'kharif' | 'rabi' | 'zaid'>('rabi');
  const [activeFilterView, setActiveFilterView] = useState<TipsFilterView>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState<boolean>(false);

  // Stop audio on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      setIsPlayingAudio(false);
      setIsStateDropdownOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSeason =
    profile.seasons.find((s) => s.seasonId === activeSeasonTab) || profile.seasons[0];

  const localizedStarterGuide = getLocalizedStarterGuide(
    currentState.id,
    language,
    profile.newbieFarmerStarterGuide
  );

  // Handle Audio Speech for Tips in selected language
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const topCropNames = currentSeason.recommendedCrops.map((c) =>
        getLocalizedCropDisplayName(c.cropName, language)
      );
      const seasonTitle =
        activeSeasonTab === 'kharif'
          ? t.tabKharif
          : activeSeasonTab === 'rabi'
          ? t.tabRabi
          : t.tabZaid;

      const speechScript = generateAudioAdvisoryText(
        currentState.nativeName || currentState.name,
        seasonTitle,
        topCropNames,
        language
      );

      speakText(speechScript, language, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  // Helper to determine appropriate crop glyph/emoji
  const getCropIcon = (cropName: string) => {
    const lower = cropName.toLowerCase();
    if (lower.includes('wheat') || lower.includes('gehun')) return '🌾';
    if (lower.includes('paddy') || lower.includes('rice') || lower.includes('dhan')) return '🍚';
    if (lower.includes('cotton') || lower.includes('kapas')) return '☁️';
    if (lower.includes('soybean')) return '🌱';
    if (lower.includes('onion') || lower.includes('pyaz')) return '🧅';
    if (lower.includes('mustard') || lower.includes('sarson') || lower.includes('rai')) return '🌼';
    if (lower.includes('groundnut') || lower.includes('peanut')) return '🥜';
    if (lower.includes('chana') || lower.includes('gram') || lower.includes('moong') || lower.includes('tur')) return '🫘';
    if (lower.includes('maize') || lower.includes('corn')) return '🌽';
    if (lower.includes('potato') || lower.includes('aloo')) return '🥔';
    if (lower.includes('garlic') || lower.includes('lahsun')) return '🧄';
    if (lower.includes('cumin') || lower.includes('jeera')) return '🌿';
    if (lower.includes('chilli') || lower.includes('mirch')) return '🌶️';
    if (lower.includes('watermelon')) return '🍉';
    return '🌱';
  };

  // Water need droplet counter
  const renderWaterMeter = (waterNeed: 'Low' | 'Medium' | 'High') => {
    const activeDrops = waterNeed === 'High' ? 3 : waterNeed === 'Medium' ? 2 : 1;
    const label =
      waterNeed === 'High'
        ? t.waterHigh
        : waterNeed === 'Medium'
        ? t.waterMedium
        : t.waterLow;

    return (
      <div className="flex items-center gap-1.5" title={`${t.waterLabel}: ${label}`}>
        <div className="flex items-center gap-0.5 text-blue-500">
          <Droplets className={`w-3.5 h-3.5 ${activeDrops >= 1 ? 'fill-blue-500 text-blue-600' : 'text-slate-300'}`} />
          <Droplets className={`w-3.5 h-3.5 ${activeDrops >= 2 ? 'fill-blue-500 text-blue-600' : 'text-slate-300'}`} />
          <Droplets className={`w-3.5 h-3.5 ${activeDrops >= 3 ? 'fill-blue-500 text-blue-600' : 'text-slate-300'}`} />
        </div>
        <span className="font-extrabold text-slate-800 text-[11px]">{label}</span>
      </div>
    );
  };

  // Difficulty badge styling
  const renderDifficultyBadge = (difficulty: 'Easy' | 'Moderate' | 'Challenging') => {
    if (difficulty === 'Easy') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100/90 text-emerald-900 border border-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          {t.easyBadge}
        </span>
      );
    }
    if (difficulty === 'Moderate') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100/90 text-amber-950 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          {t.moderateBadge}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100/90 text-indigo-950 border border-indigo-300">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
        {t.challengingBadge}
      </span>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agri-tips-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Modern Agrarian Hero Header */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-emerald-900/40 bg-linear-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shrink-0 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-emerald-400/20 to-teal-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    id="agri-tips-title"
                    className="text-base sm:text-lg font-black tracking-tight text-white leading-snug"
                  >
                    {t.modalTitle}
                  </h2>

                  {/* State Pill with Quick Dropdown Toggle */}
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                      title={t.switchStateLabel}
                      aria-expanded={isStateDropdownOpen}
                    >
                      <MapPin className="w-3 h-3 text-slate-900 shrink-0" />
                      <span>{currentState.nativeName || currentState.name}</span>
                      <ChevronDown className="w-2.5 h-2.5 text-slate-900" />
                    </button>

                    {/* Quick State Switcher Dropdown */}
                    {isStateDropdownOpen && (
                      <div className="absolute left-0 mt-1.5 w-52 max-h-56 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-1 text-slate-800 text-xs animate-in fade-in zoom-in-95">
                        <div className="px-2.5 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                          {t.switchStateLabel}
                        </div>
                        {INDIAN_STATES.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => {
                              if (onSelectState) onSelectState(st);
                              setIsStateDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg font-bold flex items-center justify-between transition-colors cursor-pointer ${
                              st.id === currentState.id
                                ? 'bg-emerald-50 text-emerald-900 font-black'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span>
                              {st.name} ({st.nativeName})
                            </span>
                            {st.id === currentState.id && (
                              <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-emerald-200/90 mt-1 font-medium line-clamp-1 leading-relaxed">
                  {t.modalSubtitle}
                </p>
              </div>
            </div>

            {/* Header Right Actions: Audio Listen & Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="tips-audio-narration-btn"
                type="button"
                onClick={handleToggleAudio}
                className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 shadow-md animate-pulse'
                    : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                }`}
                title={isPlayingAudio ? t.stopAudio : t.listenAudio}
                aria-label={isPlayingAudio ? t.stopAudio : t.listenAudio}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4 text-white shrink-0" />
                    <span className="hidden sm:inline text-[11px] font-black">{t.stopAudio}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="hidden sm:inline text-[11px] font-black">{t.listenAudio}</span>
                  </>
                )}
              </button>

              <button
                id="close-tips-modal-btn"
                type="button"
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close Crop Guide"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Quick Segment Filter Pills inside Header for fast scanning */}
          <div className="flex items-center gap-1.5 mt-3.5 pt-3 border-t border-emerald-800/60 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveFilterView('all')}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeFilterView === 'all'
                  ? 'bg-emerald-400 text-slate-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {t.filterAllView}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilterView('crops')}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeFilterView === 'crops'
                  ? 'bg-emerald-400 text-slate-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/10'
              }`}
            >
              🌾 {t.filterCropsOnly}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilterView('soil')}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeFilterView === 'soil'
                  ? 'bg-emerald-400 text-slate-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/10'
              }`}
            >
              🌱 {t.filterSoilOnly}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilterView('rules')}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeFilterView === 'rules'
                  ? 'bg-emerald-400 text-slate-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/10'
              }`}
            >
              📜 {t.sectionRulesTitle.replace(/^\d+\.\s*/, '')}
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-3.5 sm:p-6 space-y-6">
          {/* SECTION 1: CROPS BY SEASON (Show if view is 'all' or 'crops') */}
          {(activeFilterView === 'all' || activeFilterView === 'crops') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0">
                    <Calendar className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {t.sectionCropTitle}
                  </h3>
                </div>

                <span className="text-[11px] font-bold text-slate-500">
                  {currentState.name}
                </span>
              </div>

              {/* Season Selector Tabs (Kharif, Rabi, Zaid) */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
                {profile.seasons.map((season) => {
                  const isActive = activeSeasonTab === season.seasonId;
                  const seasonTitle =
                    season.seasonId === 'kharif'
                      ? t.tabKharif
                      : season.seasonId === 'rabi'
                      ? t.tabRabi
                      : t.tabZaid;

                  const seasonPeriod = localizeScheduleText(season.period, language);

                  return (
                    <button
                      key={season.seasonId}
                      type="button"
                      onClick={() => setActiveSeasonTab(season.seasonId)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer text-center select-none ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/15 border border-emerald-700'
                          : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-950'
                      }`}
                    >
                      <div className="truncate">{seasonTitle}</div>
                      <span
                        className={`text-[10px] font-semibold block mt-0.5 truncate ${
                          isActive ? 'text-emerald-200' : 'text-slate-500'
                        }`}
                      >
                        {seasonPeriod}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Season Weather Context Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-xs text-emerald-950 flex items-start gap-2.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div>
                    <span className="font-black text-emerald-950">{t.seasonWeatherLabel}:</span>{' '}
                    <span className="text-emerald-900 font-medium">
                      {currentSeason.weatherCondition}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-900 leading-relaxed">
                    <span className="font-black text-emerald-950">{t.whyNewbieLabel}:</span>{' '}
                    {currentSeason.idealForNewbies}
                  </div>
                </div>
              </div>

              {/* Crop Cards List */}
              <div className="grid grid-cols-1 gap-3.5">
                {currentSeason.recommendedCrops.map((crop, idx) => {
                  const localizedCropName = getLocalizedCropDisplayName(crop.cropName, language);
                  const sowingLocalized = localizeScheduleText(crop.sowingMonths, language);
                  const harvestLocalized = localizeScheduleText(crop.harvestMonths, language);
                  const cropGlyph = getCropIcon(crop.cropName);

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-xs hover:shadow-md space-y-3"
                    >
                      {/* Card Header: Crop Icon, Localized Title & Beginner Pill */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                            {cropGlyph}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                                {localizedCropName}
                              </h4>
                              {renderDifficultyBadge(crop.beginnerDifficulty)}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {crop.cropName} • {t.soilLabel}: <strong className="text-slate-700">{crop.soilSuitability}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Expected Yield Badge */}
                        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-black shrink-0 border border-slate-200/80">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{crop.expectedYield}</span>
                        </div>
                      </div>

                      {/* Metric Strip: Sowing, Harvest, Water Requirement & Yield */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                        {/* 1. Sowing Window */}
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">
                            <Calendar className="w-3 h-3 text-emerald-700" />
                            <span>{t.sowingLabel}</span>
                          </div>
                          <span className="font-black text-slate-900 text-xs line-clamp-1">
                            {sowingLocalized}
                          </span>
                        </div>

                        {/* 2. Harvest Window */}
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>{t.harvestLabel}</span>
                          </div>
                          <span className="font-black text-slate-900 text-xs line-clamp-1">
                            {harvestLocalized}
                          </span>
                        </div>

                        {/* 3. Water Need Meter */}
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">
                            {t.waterLabel}
                          </div>
                          {renderWaterMeter(crop.waterNeed)}
                        </div>

                        {/* 4. Expected Yield */}
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">
                            {t.yieldLabel}
                          </div>
                          <span className="font-black text-emerald-800 text-xs line-clamp-1">
                            {crop.expectedYield}
                          </span>
                        </div>
                      </div>

                      {/* Golden Pro-Tip for Newbies */}
                      <div className="p-3 rounded-xl bg-linear-to-r from-amber-50 via-amber-50/80 to-amber-100/50 border border-amber-300/80 text-amber-950 flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs leading-relaxed">
                          <strong className="text-amber-950 font-black mr-1">
                            {t.proTipTitle}:
                          </strong>
                          <span className="text-amber-900 font-medium">{crop.proTip}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: REGIONAL SOIL HEALTH & CONDITIONS (Show if view is 'all' or 'soil') */}
          {(activeFilterView === 'all' || activeFilterView === 'soil') && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black shrink-0">
                  <Layers className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {t.sectionSoilTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {profile.dominantSoils.map((soil, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 transition-all shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                            {soil.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400">
                            {soil.type}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300/80 shrink-0">
                          {t.phLabel} {soil.phRange}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        {soil.characteristics}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                        {t.topCropsLabel}:
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {soil.bestCrops.map((c, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-black text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80 shadow-2xs"
                          >
                            {getLocalizedCropDisplayName(c, language)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: WEATHER & CLIMATE PROFILE (Show if view is 'all' or 'soil') */}
          {(activeFilterView === 'all' || activeFilterView === 'soil') && (
            <div className="rounded-2xl p-4 sm:p-5 bg-linear-to-br from-sky-50 via-blue-50/70 to-indigo-50/50 border border-blue-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                  <Sun className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {t.sectionWeatherTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-white/90 border border-blue-200 text-xs">
                  <div className="flex items-center gap-1 text-[10px] font-black text-blue-700 uppercase tracking-wider mb-1">
                    <CloudRain className="w-3 h-3" />
                    <span>{t.annualRainfallLabel}</span>
                  </div>
                  <div className="font-black text-slate-900">{profile.annualRainfall}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/90 border border-blue-200 text-xs">
                  <div className="flex items-center gap-1 text-[10px] font-black text-blue-700 uppercase tracking-wider mb-1">
                    <Sun className="w-3 h-3" />
                    <span>{t.averageTempLabel}</span>
                  </div>
                  <div className="font-black text-slate-900">{profile.averageTemperature}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/90 border border-blue-200 text-xs">
                  <div className="flex items-center gap-1 text-[10px] font-black text-blue-700 uppercase tracking-wider mb-1">
                    <Droplets className="w-3 h-3" />
                    <span>{t.waterLabel}</span>
                  </div>
                  <div className="font-black text-slate-900 line-clamp-2">{profile.waterAvailability}</div>
                </div>
              </div>

              {/* Live Seasonal Advisory */}
              <div className="p-3.5 rounded-xl bg-blue-900 text-white flex items-start gap-2.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="text-amber-300 font-black mr-1">
                    {t.liveAdvisoryLabel}:
                  </strong>
                  <span className="text-blue-100 font-medium">
                    {profile.currentSeasonalAlert}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: 4 GOLDEN STARTER RULES (Show if view is 'all' or 'rules') */}
          {(activeFilterView === 'all' || activeFilterView === 'rules') && (
            <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 text-white shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-black shrink-0">
                  <BookOpen className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {t.sectionRulesTitle}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400">
                    {currentState.nativeName || currentState.name}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Rule 1: Soil Preparation */}
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/50 flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span>{t.rule1Title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {localizedStarterGuide.soilPreparation}
                  </p>
                </div>

                {/* Rule 2: Core Sowing Rule */}
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sky-400 font-black">
                    <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-500/50 flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span>{t.rule2Title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {localizedStarterGuide.topRule}
                  </p>
                </div>

                {/* Rule 3: Mistake to Avoid */}
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-400 font-black">
                    <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 border border-rose-500/50 flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>{t.rule3Title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {localizedStarterGuide.mistakeToAvoid}
                  </p>
                </div>

                {/* Rule 4: Government Subsidy & Scheme */}
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-black">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/50 flex items-center justify-center text-[10px]">
                      4
                    </span>
                    <span>{t.rule4Title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {localizedStarterGuide.governmentSupportNote}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 font-medium hidden sm:flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              {currentState.nativeName || currentState.name} • {t.modalTitle}
            </span>
          </div>

          <button
            id="close-tips-modal-footer-btn"
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black transition-all cursor-pointer shadow-sm hover:shadow"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
