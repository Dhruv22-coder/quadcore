import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CropData, Language, IndianState } from '../types';
import { translations, formatINR, speakText, stopSpeaking } from '../lib/utils';
import {
  fetchLiveWeatherData,
  getSimulatedWeatherData,
  getContextAwareStorageSuggestion,
  WeatherData,
} from '../lib/weatherService';
import {
  TrendingUp,
  Pause,
  AlertTriangle,
  Volume2,
  ShieldCheck,
  CloudRain,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Layers,
  Flame,
  ThermometerSun,
  Sun,
  Warehouse,
  ShieldAlert,
  MapPin,
  RefreshCw,
  X,
  Radio,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface DecisionHeroCardProps {
  crop: CropData;
  language: Language;
  onPlayAudio: () => void;
  isAudioPlaying: boolean;
  isSunlightMode: boolean;
  currentState?: IndianState;
  onNavigateToCrops?: () => void;
  onNavigateToProfit?: () => void;
  onNavigateToWeather?: () => void;
}

export const DecisionHeroCard: React.FC<DecisionHeroCardProps> = ({
  crop,
  language,
  onPlayAudio,
  isAudioPlaying,
  isSunlightMode,
  currentState,
  onNavigateToCrops,
  onNavigateToProfit,
  onNavigateToWeather,
}) => {
  const [showDetailedGraph, setShowDetailedGraph] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [weatherSimulation, setWeatherSimulation] = useState<'live' | 'rain' | 'heat'>('live');
  const [isStorageSuggestionOpen, setIsStorageSuggestionOpen] = useState<boolean>(true);
  const [isPlayingStorageAudio, setIsPlayingStorageAudio] = useState<boolean>(false);
  const [showWeatherDetails, setShowWeatherDetails] = useState<boolean>(false);
  const [locationSource, setLocationSource] = useState<'gps' | 'regional'>('regional');

  const t = translations[language];

  const signal = crop.decision.signal;
  const isGreen = signal === 'green';
  const isAmber = signal === 'amber';
  const isRed = signal === 'red';

  // Fetch weather data based on geolocation or selected state
  const loadWeather = useCallback(
    async (mode: 'live' | 'rain' | 'heat') => {
      setIsLoadingWeather(true);
      const fallbackLat = currentState?.lat ?? 19.7515;
      const fallbackLng = currentState?.lng ?? 75.7139;
      const locLabel = currentState
        ? `${currentState.name} (${currentState.keyMandi})`
        : 'APMC Market Area';

      if (mode === 'rain') {
        const simData = getSimulatedWeatherData('rain', locLabel, fallbackLat, fallbackLng);
        setWeatherData(simData);
        setIsLoadingWeather(false);
        setIsStorageSuggestionOpen(true);
        return;
      }

      if (mode === 'heat') {
        const simData = getSimulatedWeatherData('heat', locLabel, fallbackLat, fallbackLng);
        setWeatherData(simData);
        setIsLoadingWeather(false);
        setIsStorageSuggestionOpen(true);
        return;
      }

      // Live Geolocation Mode
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            setLocationSource('gps');
            const data = await fetchLiveWeatherData(
              pos.coords.latitude,
              pos.coords.longitude,
              `GPS (${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E)`,
              true
            );
            setWeatherData(data);
            setIsLoadingWeather(false);
            if (data.isExtremeRisk) {
              setIsStorageSuggestionOpen(true);
            }
          },
          async (err) => {
            console.log('Geolocation unavailable or denied, using regional coords:', err.message);
            setLocationSource('regional');
            const data = await fetchLiveWeatherData(fallbackLat, fallbackLng, locLabel, false);
            setWeatherData(data);
            setIsLoadingWeather(false);
            if (data.isExtremeRisk) {
              setIsStorageSuggestionOpen(true);
            }
          },
          { timeout: 6000, enableHighAccuracy: false }
        );
      } else {
        setLocationSource('regional');
        const data = await fetchLiveWeatherData(fallbackLat, fallbackLng, locLabel, false);
        setWeatherData(data);
        setIsLoadingWeather(false);
        if (data.isExtremeRisk) {
          setIsStorageSuggestionOpen(true);
        }
      }
    },
    [currentState]
  );

  // Re-fetch on mount or when currentState or mode changes
  useEffect(() => {
    loadWeather(weatherSimulation);
  }, [currentState, weatherSimulation, loadWeather]);

  // Context-aware storage suggestion tailored for this specific crop and weather risk
  const storageSuggestion = useMemo(() => {
    if (!weatherData?.isExtremeRisk) return null;
    return getContextAwareStorageSuggestion(
      crop.id,
      crop.name,
      crop.category,
      weatherData.riskType === 'none' ? 'rain' : weatherData.riskType,
      language
    );
  }, [crop.id, crop.name, crop.category, weatherData, language]);

  // Audio speech for storage recommendation
  const handlePlayStorageAudio = () => {
    if (isPlayingStorageAudio) {
      stopSpeaking();
      setIsPlayingStorageAudio(false);
    } else {
      if (!storageSuggestion) return;
      setIsPlayingStorageAudio(true);
      const textToSpeak =
        language === 'hi'
          ? storageSuggestion.audioSummary.hi
          : language === 'mr'
          ? storageSuggestion.audioSummary.mr
          : storageSuggestion.audioSummary.en;

      speakText(textToSpeak, language, () => {
        setIsPlayingStorageAudio(false);
      });
    }
  };

  // Card theme styling
  const cardBorder = isSunlightMode
    ? 'border-2 border-slate-950 shadow-sm'
    : isGreen
    ? 'border-slate-200 shadow-2xs'
    : isAmber
    ? 'border-slate-200 shadow-2xs'
    : 'border-slate-200 shadow-2xs';

  const badgeBg = isGreen
    ? 'bg-emerald-700 text-white'
    : isAmber
    ? 'bg-amber-400 text-slate-950 font-bold'
    : 'bg-red-700 text-white';

  const topMandi = crop.mandis[0];

  return (
    <section
      id="decision-hero-card"
      className={`relative bg-white rounded-2xl p-4 sm:p-6 border transition-all ${cardBorder} overflow-hidden`}
    >
      {/* Subtle top color stripe indicator */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          weatherData?.isExtremeRisk
            ? 'bg-linear-to-r from-red-600 via-rose-500 to-amber-500'
            : isGreen
            ? 'bg-emerald-600'
            : isAmber
            ? 'bg-amber-400'
            : 'bg-red-600'
        }`}
      />

      {/* Top Header Row: Signal Badge, Confidence, Weather Warning & Audio Button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5 mb-3.5">
        {/* Signal & Confidence */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-sm font-extrabold uppercase tracking-wide ${badgeBg}`}
          >
            {isGreen && <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />}
            {isAmber && <Pause className="w-3.5 h-3.5 stroke-[2.5]" />}
            {isRed && <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>
              {isGreen
                ? 'Signal: SELL TODAY'
                : isAmber
                ? 'Signal: WAIT 2-3 DAYS'
                : 'Signal: SELL IMMEDIATELY'}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            {crop.decision.confidenceScore}% Confidence
          </span>

          {/* Context-Aware Extreme Weather Risk Badge */}
          {weatherData?.isExtremeRisk ? (
            <button
              id="extreme-weather-risk-badge"
              type="button"
              onClick={() => setIsStorageSuggestionOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wide bg-linear-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-xs border border-red-400 hover:brightness-105 active:scale-95 transition-all cursor-pointer animate-pulse select-none"
              title="Click to view crop storage recommendation"
              aria-expanded={isStorageSuggestionOpen}
            >
              {weatherData.riskType === 'rain' ? (
                <CloudRain className="w-3.5 h-3.5 shrink-0 text-amber-200 stroke-[2.5]" />
              ) : (
                <Flame className="w-3.5 h-3.5 shrink-0 text-amber-200 stroke-[2.5]" />
              )}
              <span>Extreme Weather Risk</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded font-bold normal-case tracking-normal">
                {weatherData.riskType === 'rain'
                  ? `${weatherData.precipitationSum}mm Rain`
                  : `${weatherData.maxTemperature}°C Heat`}
              </span>
              {isStorageSuggestionOpen ? (
                <ChevronUp className="w-3 h-3 ml-0.5 opacity-90" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-90" />
              )}
            </button>
          ) : (
            /* Normal Weather Info Pill */
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
              <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                {isLoadingWeather
                  ? 'Checking weather...'
                  : `${weatherData?.temperature ?? 31}°C · ${weatherData?.conditionLabel ?? 'Clear'}`}
              </span>
              <button
                type="button"
                onClick={() => setShowWeatherDetails(!showWeatherDetails)}
                className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold ml-0.5 underline cursor-pointer"
                title="View local forecast & weather tests"
              >
                {showWeatherDetails ? 'Hide' : 'Forecast'}
              </button>
            </div>
          )}
        </div>

        {/* Hero Audio Button for One-Tap Spoken Verdict */}
        <button
          id="hero-play-audio-btn"
          onClick={onPlayAudio}
          className={`min-h-[40px] px-3.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 border cursor-pointer ${
            isAudioPlaying
              ? 'bg-slate-900 text-white border-slate-900 animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200/90'
          }`}
          aria-label="Listen to Audio Verdict"
        >
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span>{isAudioPlaying ? t.audioPlaying : t.audioMode}</span>
        </button>
      </div>

      {/* Geolocation Weather Details & Simulation Options Bar */}
      {showWeatherDetails && (
        <div
          id="weather-diagnostics-bar"
          className="mb-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs animate-in fade-in duration-150"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="font-bold text-slate-900">
                {weatherData?.locationName || currentState?.name || 'Local Mandi'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800">
                {weatherData?.source === 'gps'
                  ? '📍 Geolocation GPS'
                  : weatherData?.source === 'simulated'
                  ? '⚡ Simulated Scenario'
                  : '🗺️ Regional Forecast'}
              </span>
            </div>

            {/* Simulation controls allowing reviewers/farmers to test rain and heatwave */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                id="weather-test-live"
                onClick={() => {
                  setWeatherSimulation('live');
                  loadWeather('live');
                }}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all border cursor-pointer ${
                  weatherSimulation === 'live'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Fetch live weather from Open-Meteo using device Geolocation"
              >
                Live GPS
              </button>

              <button
                type="button"
                id="weather-test-rain"
                onClick={() => {
                  setWeatherSimulation('rain');
                  loadWeather('rain');
                }}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all border cursor-pointer ${
                  weatherSimulation === 'rain'
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-blue-900 border-blue-200 hover:bg-blue-50'
                }`}
                title="Simulate 42mm heavy rainfall to trigger extreme risk & storage advice"
              >
                🌧️ Test Heavy Rain (42mm)
              </button>

              <button
                type="button"
                id="weather-test-heat"
                onClick={() => {
                  setWeatherSimulation('heat');
                  loadWeather('heat');
                }}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all border cursor-pointer ${
                  weatherSimulation === 'heat'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-amber-950 border-amber-200 hover:bg-amber-50'
                }`}
                title="Simulate 43.5°C heatwave to trigger extreme risk & storage advice"
              >
                ☀️ Test Heatwave (43°C)
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Temperature</span>
              <span className="font-extrabold text-slate-900">
                {weatherData?.temperature}°C (High: {weatherData?.maxTemperature}°C)
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Expected Rain</span>
              <span className="font-extrabold text-slate-900">
                {weatherData?.precipitationSum} mm ({weatherData?.precipitationProbability}% chance)
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Humidity</span>
              <span className="font-extrabold text-slate-900">{weatherData?.humidity}%</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Weather Code</span>
              <span className="font-bold text-slate-800 truncate block">
                {weatherData?.conditionLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Extreme Weather Risk Triggered Crop Storage Suggestion Box */}
      {weatherData?.isExtremeRisk && isStorageSuggestionOpen && storageSuggestion && (
        <div
          id="crop-storage-suggestion-panel"
          className="mb-4 p-4 rounded-xl bg-linear-to-br from-amber-50/95 via-orange-50/70 to-red-50/80 border-2 border-amber-300/90 shadow-xs animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-amber-200/90">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <Warehouse className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm bg-red-600 text-white">
                    {weatherData.riskType === 'rain'
                      ? '🌧️ Extreme Rain Risk'
                      : '☀️ Extreme Heatwave Risk'}
                  </span>
                  <span className="text-xs font-bold text-amber-950">
                    Storage Suggestion for {crop.name} ({crop.hindiName})
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-950 mt-1 leading-snug">
                  {storageSuggestion.headline}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Listen to Storage Advisory Voice Audio */}
              <button
                type="button"
                id="listen-storage-audio-btn"
                onClick={handlePlayStorageAudio}
                className={`min-h-[36px] px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer select-none ${
                  isPlayingStorageAudio
                    ? 'bg-slate-900 text-white border-slate-900 animate-pulse'
                    : 'bg-white hover:bg-amber-100/80 text-amber-950 border-amber-300 shadow-2xs'
                }`}
                title="Listen to crop storage recommendation in your language"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                <span>{isPlayingStorageAudio ? 'Speaking...' : 'Listen Storage Advice'}</span>
              </button>

              {/* Dismiss / Close button */}
              <button
                type="button"
                onClick={() => setIsStorageSuggestionOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-white/70 transition-colors cursor-pointer"
                title="Minimize storage suggestion"
                aria-label="Minimize storage suggestion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actionable Directives & Facility Recommendation */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-3">
            {/* 3 Concrete Farmer Storage Directives */}
            <div className="md:col-span-7 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Safe Storage Directives:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                {storageSuggestion.keyDirectives.map((directive, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-200/70 shadow-2xs"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-snug">{directive}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Storage Facility & Mandi Transit Advice */}
            <div className="md:col-span-5 flex flex-col gap-2.5">
              <div className="bg-white/90 p-3 rounded-lg border border-amber-200/80 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Recommended Storage Setup
                </div>
                <div className="text-xs font-black text-slate-950 mt-0.5 leading-tight">
                  {storageSuggestion.facilityType}
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                  Safe Holding Window: {storageSuggestion.safeStorageDuration}
                </div>
              </div>

              <div className="bg-amber-100/80 p-3 rounded-lg border border-amber-300/80 shadow-2xs">
                <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>Mandi Transit Caution</span>
                </div>
                <p className="text-xs text-slate-800 font-medium mt-1 leading-snug">
                  {storageSuggestion.mandiTransitAdvice}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Verdict & Price Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Column: Huge Action Verdict & Rate */}
        <div className="lg:col-span-7">
          {/* Main Action Headline */}
          <div className="mb-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              {crop.decision.actionTitle}
            </h1>
            <p
              className={`text-sm sm:text-base font-bold mt-1 ${
                isGreen
                  ? 'text-emerald-700'
                  : isAmber
                  ? 'text-amber-800'
                  : 'text-red-700'
              }`}
            >
              {crop.decision.actionSubtitle}
            </p>
          </div>

          {/* Current Highest Mandi Rate Display */}
          <div className="mt-3 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">
                {t.highestPriceToday}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {topMandi.name}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight tabular-nums">
                {formatINR(crop.currentPrice)}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                / quintal (100 kg)
              </span>

              {/* Day Change Badge */}
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border tabular-nums ${
                  crop.priceChangeToday >= 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                    : 'bg-red-50 text-red-800 border-red-200/80'
                }`}
              >
                {crop.priceChangeToday >= 0 ? '+' : ''}
                {formatINR(crop.priceChangeToday)} vs yesterday
              </div>
            </div>

            {/* Quick Context Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Arrivals Today</span>
                <span className="font-bold text-slate-800 tabular-nums">{crop.arrivalsToday}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Target Peak</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {formatINR(crop.decision.peakPriceEstimate)}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[11px] font-medium">Window</span>
                <span className="font-bold text-emerald-800">
                  {crop.decision.peakTimeframe}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Decision Reasons & Weather alert */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          {/* Why this decision? Card */}
          <div className="bg-slate-50 rounded-xl p-3.5 sm:p-4 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <Info className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.keyFactors}</span>
            </div>

            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
              {crop.decision.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                  <span className="leading-snug">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Alert / Storage Notice */}
          <div
            className={`rounded-xl p-3 border text-xs sm:text-sm flex items-start gap-2.5 ${
              weatherData?.isExtremeRisk
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : isRed
                ? 'bg-red-50 border-red-200 text-red-900'
                : isAmber
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            {weatherData?.isExtremeRisk ? (
              <CloudRain className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            ) : isRed ? (
              <CloudRain className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold block">
                  {weatherData?.isExtremeRisk
                    ? 'Extreme Weather & Storage Advisory'
                    : isRed
                    ? 'Weather & Storage Risk Warning'
                    : 'Market Intelligence'}
                </span>
                {weatherData?.isExtremeRisk && (
                  <button
                    type="button"
                    onClick={() => setIsStorageSuggestionOpen(true)}
                    className="text-[11px] font-bold text-amber-900 underline cursor-pointer"
                  >
                    View Storage Plan
                  </button>
                )}
              </div>
              <p className="mt-0.5 leading-snug font-medium text-slate-700 text-xs">
                {weatherData?.isExtremeRisk
                  ? `${weatherData.riskTitle}. Store harvest safely to avoid quality deductions at APMC.`
                  : crop.decision.riskFactor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Trend Chart Collapsible Section */}
      <div className="mt-5 pt-3.5 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <button
            id="toggle-trend-chart"
            onClick={() => setShowDetailedGraph(!showDetailedGraph)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg transition-colors select-none cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.sevenDayTrend}</span>
            {showDetailedGraph ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400">
              Agmarknet & APMC Feed
            </span>
            <button
              type="button"
              onClick={() => setShowWeatherDetails(!showWeatherDetails)}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
            >
              {showWeatherDetails ? 'Close Weather Bar' : 'Weather & GPS Options'}
            </button>
          </div>
        </div>

        {/* Visual Trend Chart */}
        {showDetailedGraph && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="h-52 sm:h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={crop.priceHistory}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isGreen ? '#059669' : isAmber ? '#d97706' : '#dc2626'}
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor={isGreen ? '#059669' : isAmber ? '#d97706' : '#dc2626'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={['dataMin - 100', 'dataMax + 100']}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs shadow-md border border-slate-800">
                            <p className="font-semibold text-slate-400 text-[11px]">{item.day}</p>
                            <p className="text-sm font-bold text-white tabular-nums">
                              ₹{item.price.toLocaleString('en-IN')}{' '}
                              <span className="text-[10px] text-slate-400 font-normal">/ qtl</span>
                            </p>
                            {item.projected && (
                              <span className="text-[10px] text-amber-400 font-medium block mt-0.5">
                                • Projected
                              </span>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={crop.currentPrice}
                    stroke="#059669"
                    strokeDasharray="3 3"
                    label={{
                      value: `Today ₹${crop.currentPrice}`,
                      position: 'top',
                      fill: '#059669',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isGreen ? '#059669' : isAmber ? '#d97706' : '#dc2626'}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">
              Note: Dotted line is today’s active auction rate; subsequent points denote APMC arrival projections.
            </p>
          </div>
        )}

        {/* Page 2 Navigation Buttons */}
        {(onNavigateToCrops || onNavigateToProfit) && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 mt-2">
            {onNavigateToCrops && (
              <button
                type="button"
                onClick={onNavigateToCrops}
                className="w-full sm:w-auto min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>⬅️ 1. फसल बदलें (Choose Crop)</span>
              </button>
            )}

            {onNavigateToProfit && (
              <button
                type="button"
                id="proceed-to-profit-btn"
                onClick={onNavigateToProfit}
                className="w-full sm:w-auto min-h-[48px] px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>3. मंडी मुनाफा जांचें (Calculate Mandi Net Cash) ➡️</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
