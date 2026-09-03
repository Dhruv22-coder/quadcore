import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CropData, Language, IndianState } from '../types';
import { translations, speakText, stopSpeaking } from '../lib/utils';
import { WEATHER_TRANSLATIONS } from '../data/weatherTranslations';
import { CropImage } from '../data/cropImages';
import {
  fetchLiveWeatherData,
  getSimulatedWeatherData,
  getContextAwareStorageSuggestion,
  WeatherData,
} from '../lib/weatherService';
import { AIWeatherAdvisoryCard } from './AIWeatherAdvisoryCard';
import { WeatherChatbot } from './WeatherChatbot';
import {
  CloudRain,
  Flame,
  Warehouse,
  Volume2,
  VolumeX,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Thermometer,
  Droplets,
  Wind,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WeatherStorageViewProps {
  crop: CropData;
  language: Language;
  currentState?: IndianState;
  isSunlightMode?: boolean;
  isDarkMode?: boolean;
  onNavigateToProfit: () => void;
  onNavigateToHelp: () => void;
}

export const WeatherStorageView: React.FC<WeatherStorageViewProps> = ({
  crop,
  language,
  currentState,
  onNavigateToProfit,
  onNavigateToHelp,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [weatherSimulation, setWeatherSimulation] = useState<'live' | 'rain' | 'heat'>('live');
  const [isPlayingHeaderAudio, setIsPlayingHeaderAudio] = useState<boolean>(false);
  const [isStorageDetailsOpen, setIsStorageDetailsOpen] = useState<boolean>(false);
  const wt = WEATHER_TRANSLATIONS[language] || WEATHER_TRANSLATIONS.en;

  // Load weather data
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

      // Live GPS check
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
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
            const data = await fetchLiveWeatherData(fallbackLat, fallbackLng, locLabel, false);
            setWeatherData(data);
            setIsLoadingWeather(false);
          },
          { timeout: 6000, enableHighAccuracy: false }
        );
      } else {
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

  // Storage suggestion reference
  const storageSuggestion = useMemo(() => {
    const risk =
      weatherData?.riskType === 'rain' || weatherData?.riskType === 'heat'
        ? weatherData.riskType
        : 'rain';
    return getContextAwareStorageSuggestion(
      crop.id,
      crop.name,
      crop.category,
      risk,
      language
    );
  }, [crop.id, crop.name, crop.category, weatherData?.riskType, language]);

  const locName = weatherData?.locationName || currentState?.name || 'Local Mandi';

  // Header quick audio overview
  const handleToggleHeaderAudio = () => {
    if (isPlayingHeaderAudio) {
      stopSpeaking();
      setIsPlayingHeaderAudio(false);
    } else {
      if (!weatherData) return;
      setIsPlayingHeaderAudio(true);
      const textToSpeak = `Current weather in ${locName}: Temperature is ${weatherData.temperature} degrees Celsius, humidity is ${weatherData.humidity} percent, and wind speed is ${weatherData.windSpeed ?? 14} kilometers per hour. Condition is ${weatherData.conditionLabel}. Check the AI Kisan Advisory below for ${crop.name} protection.`;

      speakText(textToSpeak, language, () => {
        setIsPlayingHeaderAudio(false);
      });
    }
  };

  const isRain = weatherData?.riskType === 'rain';

  return (
    <div id="weather-page" className="space-y-5">
      {/* 1. Page Header with Crop HD Photo & Audio Button */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs">
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
                  Page 4 of 5 • Weather
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {currentState?.name} Mandi Zone
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {wt.pageTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {wt.pageSubtitle} ({crop.name} - {crop.hindiName || ''})
              </p>
            </div>
          </div>

          <button
            type="button"
            id="listen-weather-overview-btn"
            onClick={handleToggleHeaderAudio}
            className={`min-h-[44px] px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all border cursor-pointer select-none shadow-2xs ${
              isPlayingHeaderAudio
                ? 'bg-slate-900 text-white border-slate-900 animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200/90 text-amber-950 border-amber-300'
            }`}
          >
            {isPlayingHeaderAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-300" />
                <span>{wt.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-800" />
                <span>{wt.listenAudio}</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Weather Status & Test Scenarios Strip */}
        <div className="mt-4 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{locName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                {weatherData?.source === 'gps'
                  ? wt.gpsLocation
                  : weatherData?.source === 'simulated'
                  ? wt.simulated
                  : wt.regionalStation}
              </span>
            </div>

            {/* Test buttons for farmers/reviewers */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 mr-1">{wt.testForecast}</span>
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
                {wt.liveForecast}
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
                {wt.testRain}
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
                {wt.testHeat}
              </button>
            </div>
          </div>

          {/* 4 Weather Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">{wt.temperature}</span>
                <Thermometer className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {isLoadingWeather ? '...' : `${weatherData?.temperature}°C`}
              </div>
              <span className="text-[10px] text-slate-500 font-medium block truncate">
                High: {weatherData?.maxTemperature}°C / Low: {weatherData?.minTemperature}°C
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">{wt.precipitation}</span>
                <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {isLoadingWeather ? '...' : `${weatherData?.precipitationSum} mm`}
              </div>
              <span className="text-[10px] text-slate-500 font-medium block truncate">
                {weatherData?.precipitationProbability}% {wt.rainProbability}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">{wt.relativeHumidity}</span>
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                {isLoadingWeather ? '...' : `${weatherData?.humidity}%`}
              </div>
              <span className="text-[10px] text-slate-500 font-medium block truncate">
                {wt.airMoisture}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase">{wt.windAndSky}</span>
                <Wind className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 truncate">
                {isLoadingWeather ? 'Checking...' : `${weatherData?.windSpeed ?? 14} km/h`}
              </div>
              <span className="text-[10px] text-slate-600 font-semibold block truncate">
                {weatherData?.conditionLabel}
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
                  {wt.urgentRiskAlert}
                </span>
                <span className="text-xs font-bold opacity-90">
                  {wt.mandiImpact}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black mt-1">
                {weatherData.riskTitle}
              </h2>
              <p className="text-xs sm:text-sm text-white/95 mt-1 leading-snug font-medium">
                {isRain
                  ? `Rainfall of ${weatherData.precipitationSum} mm will waterlog open APMC yards and spoil wet bags. Follow the AI advisory below to avoid price dockage of 15%–30%.`
                  : `High temperatures of ${weatherData.maxTemperature}°C will cause rapid moisture loss, heat softening, and weight shrinkage. Schedule transport before 7:30 AM.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. AI Kisan Weather Advisory Card (Gemini 2.5 Flash) */}
      <AIWeatherAdvisoryCard
        crop={crop}
        locationName={locName}
        weather={weatherData}
        language={language}
      />

      {/* 5. Interactive Weather Q&A Chatbot (5-Question Limit) */}
      <WeatherChatbot
        crop={crop}
        locationName={locName}
        weather={weatherData}
        language={language}
      />

      {/* 6. Scientific Storage Specifications Reference (Collapsible Accordion) */}
      {storageSuggestion && (
        <section
          id="scientific-storage-reference"
          className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setIsStorageDetailsOpen(!isStorageDetailsOpen)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Warehouse className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{wt.scientificStorageTitle}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {crop.name}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {wt.scientificStorageSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="hidden sm:inline">{isStorageDetailsOpen ? wt.hideGuidelines : wt.viewGuidelines}</span>
              {isStorageDetailsOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {isStorageDetailsOpen && (
            <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-900 block">
                    {wt.recommendedStructure}
                  </span>
                  <div className="text-sm font-black text-emerald-950 mt-0.5">
                    {storageSuggestion.facilityType}
                  </div>
                  <div className="text-xs text-emerald-800 font-bold mt-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{wt.safeDuration}: {storageSuggestion.safeStorageDuration}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    {wt.moistureStandard}: {storageSuggestion.moistureLimit}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{wt.mandiDispatchCaution}</span>
                  </span>
                  <p className="text-xs font-semibold text-amber-950 mt-1 leading-snug">
                    {storageSuggestion.mandiTransitAdvice}
                  </p>
                </div>
              </div>

              {/* Standard Directives Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  {wt.keyDirectivesFor} {crop.name}:
                </h4>
                <div className="space-y-1.5">
                  {storageSuggestion.keyDirectives.map((directive, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{directive}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 7. Page Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onNavigateToProfit}
          className="w-full sm:w-auto min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{wt.backToProfit}</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToHelp}
          className="w-full sm:w-auto min-h-[48px] px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <span>{wt.nextKisanHelp}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
