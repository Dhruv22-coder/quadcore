import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CropData, Language, IndianState } from '../types';
import { formatINR, speakText, stopSpeaking } from '../lib/utils';
import { CropImage } from '../data/cropImages';
import {
  fetchLiveWeatherData,
  getSimulatedWeatherData,
  getContextAwareStorageSuggestion,
  WeatherData,
} from '../lib/weatherService';
import {
  CloudRain,
  Flame,
  Sun,
  Warehouse,
  ShieldAlert,
  Volume2,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowRight,
  ArrowLeft,
  Thermometer,
  Droplets,
  Wind,
} from 'lucide-react';

interface WeatherStorageViewProps {
  crop: CropData;
  language: Language;
  currentState?: IndianState;
  isDarkMode: boolean;
  onNavigateToProfit: () => void;
  onNavigateToHelp: () => void;
}

export const WeatherStorageView: React.FC<WeatherStorageViewProps> = ({
  crop,
  language,
  currentState,
  isDarkMode,
  onNavigateToProfit,
  onNavigateToHelp,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [weatherSimulation, setWeatherSimulation] = useState<'live' | 'rain' | 'heat'>('live');
  const [isPlayingStorageAudio, setIsPlayingStorageAudio] = useState<boolean>(false);
  const [locationSource, setLocationSource] = useState<'gps' | 'regional'>('regional');

  // Load weather
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
        return;
      }

      if (mode === 'heat') {
        const simData = getSimulatedWeatherData('heat', locLabel, fallbackLat, fallbackLng);
        setWeatherData(simData);
        setIsLoadingWeather(false);
        return;
      }

      // Live GPS
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
          },
          async (err) => {
            console.log('Geolocation unavailable, using regional:', err.message);
            setLocationSource('regional');
            const data = await fetchLiveWeatherData(fallbackLat, fallbackLng, locLabel, false);
            setWeatherData(data);
            setIsLoadingWeather(false);
          },
          { timeout: 6000, enableHighAccuracy: false }
        );
      } else {
        setLocationSource('regional');
        const data = await fetchLiveWeatherData(fallbackLat, fallbackLng, locLabel, false);
        setWeatherData(data);
        setIsLoadingWeather(false);
      }
    },
    [currentState]
  );

  useEffect(() => {
    loadWeather(weatherSimulation);
  }, [currentState, weatherSimulation, loadWeather]);

  // Context-aware storage suggestion
  const storageSuggestion = useMemo(() => {
    const risk =
      weatherData?.riskType === 'rain' || weatherData?.riskType === 'heat'
        ? weatherData.riskType
        : 'rain'; // provide advice even for normal conditions as proactive guide
    return getContextAwareStorageSuggestion(
      crop.id,
      crop.name,
      crop.category,
      risk,
      language
    );
  }, [crop.id, crop.name, crop.category, weatherData, language]);

  // Audio speech
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

  const isRain = weatherData?.riskType === 'rain';
  const isHeat = weatherData?.riskType === 'heat';

  return (
    <div id="weather-storage-page" className="space-y-5">
      {/* 1. Page Header with Voice Audio Callout & Crop HD Photo */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-slate-200 shadow-2xs shrink-0 bg-slate-100 mt-0.5">
              <CropImage
                id={crop.id}
                name={crop.name}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
                fallbackIconClassName="w-7 h-7"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                  Page 4 of 5
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {currentState?.name} Mandi Zone
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Weather Forecast & Safe Crop Storage
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                मौसम पूर्वानुमान और {crop.name} ({crop.hindiName}) का सुरक्षित भंडारण दिशा-निर्देश
              </p>
            </div>
          </div>

          <button
            type="button"
            id="listen-weather-storage-btn"
            onClick={handlePlayStorageAudio}
            className={`min-h-[44px] px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all border cursor-pointer select-none shadow-2xs ${
              isPlayingStorageAudio
                ? 'bg-slate-900 text-white border-slate-900 animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200/90 text-amber-950 border-amber-300'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-800" />
            <span>{isPlayingStorageAudio ? 'आवाज चल रही है...' : '🔊 आवाज में सुनें (Listen)'}</span>
          </button>
        </div>

        {/* 2. Weather Status & Test Scenarios Strip */}
        <div className="mt-4 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{weatherData?.locationName || currentState?.name || 'Local Mandi'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                {weatherData?.source === 'gps'
                  ? '📍 GPS Geolocation'
                  : weatherData?.source === 'simulated'
                  ? '⚡ Simulated'
                  : '🗺️ Regional'}
              </span>
            </div>

            {/* Test buttons for farmers/reviewers */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 mr-1">Test Conditions:</span>
              <button
                type="button"
                id="weather-view-live"
                onClick={() => {
                  setWeatherSimulation('live');
                  loadWeather('live');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  weatherSimulation === 'live'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Live GPS
              </button>
              <button
                type="button"
                id="weather-view-rain"
                onClick={() => {
                  setWeatherSimulation('rain');
                  loadWeather('rain');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  weatherSimulation === 'rain'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                    : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                🌧️ Test Rain (42mm)
              </button>
              <button
                type="button"
                id="weather-view-heat"
                onClick={() => {
                  setWeatherSimulation('heat');
                  loadWeather('heat');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  weatherSimulation === 'heat'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100'
                }`}
              >
                ☀️ Test Heat (43°C)
              </button>
            </div>
          </div>

          {/* 4 Weather Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">Temperature</span>
                <Thermometer className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {isLoadingWeather ? '...' : `${weatherData?.temperature}°C`}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                High: {weatherData?.maxTemperature}°C / Low: {weatherData?.minTemperature}°C
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">Precipitation</span>
                <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {isLoadingWeather ? '...' : `${weatherData?.precipitationSum} mm`}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                {weatherData?.precipitationProbability}% rain chance today
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">Relative Humidity</span>
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {isLoadingWeather ? '...' : `${weatherData?.humidity}%`}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                Air moisture level
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">Conditions</span>
                <Sun className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                {isLoadingWeather ? 'Checking...' : weatherData?.conditionLabel}
              </div>
              <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">
                {weatherData?.isExtremeRisk ? '⚠️ High Risk Active' : '✓ Normal Conditions'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Extreme Weather Risk Alert Banner */}
      {weatherData?.isExtremeRisk && (
        <div
          id="extreme-risk-alert-banner"
          className="p-4 rounded-2xl bg-linear-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md border border-red-500 animate-in fade-in"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              {isRain ? (
                <CloudRain className="w-6 h-6 text-amber-200" />
              ) : (
                <Flame className="w-6 h-6 text-amber-200" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-black/30 text-amber-200 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                  Urgent Warning
                </span>
                <span className="text-xs font-bold opacity-90">
                  Impact on Mandi Arrivals & Produce Quality
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black mt-1">
                {weatherData.riskTitle}
              </h2>
              <p className="text-xs sm:text-sm text-white/95 mt-1 leading-snug font-medium">
                {isRain
                  ? `Rainfall of ${weatherData.precipitationSum} mm will waterlog open APMC yards and spoil wet bags. Follow the storage directives below to avoid distress price dockage of 15%–30%.`
                  : `High temperatures of ${weatherData.maxTemperature}°C will cause rapid moisture loss, heat softening, and weight shrinkage. Store in shade and schedule transport before 8 AM.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Concrete Crop-Specific Safe Storage Directives */}
      {storageSuggestion && (
        <section
          id="safe-storage-directives-card"
          className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4"
        >
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Warehouse className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                  Scientific Storage Advisory
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {storageSuggestion.headline}
                </h3>
              </div>
            </div>

            <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
              Crop: {crop.name}
            </span>
          </div>

          {/* Key Directives Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              <span>Essential Safe Storage Steps for Farmers:</span>
            </h4>
            <div className="space-y-2">
              {storageSuggestion.keyDirectives.map((directive, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {directive}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Facility Specifications & Transit Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-900 block">
                Recommended Structure
              </span>
              <div className="text-sm font-black text-emerald-950 mt-0.5">
                {storageSuggestion.facilityType}
              </div>
              <div className="text-xs text-emerald-800 font-bold mt-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Safe Duration: {storageSuggestion.safeStorageDuration}</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Moisture Standard: {storageSuggestion.moistureLimit}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-900 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Mandi Dispatch Caution</span>
              </span>
              <p className="text-xs font-semibold text-amber-950 mt-1 leading-snug">
                {storageSuggestion.mandiTransitAdvice}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 5. Navigation Buttons (Prev & Next Page) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onNavigateToProfit}
          className="w-full sm:w-auto min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>⬅️ 3. मंडी मुनाफा (Back to Profit)</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToHelp}
          className="w-full sm:w-auto min-h-[48px] px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <span>5. हेल्पलाइन व एसएमएस (Next: Kisan Help)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
