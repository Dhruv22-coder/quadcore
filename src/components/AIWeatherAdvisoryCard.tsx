import React, { useState, useEffect, useCallback } from 'react';
import { CropData, Language } from '../types';
import { WeatherData } from '../lib/weatherService';
import { speakText, stopSpeaking } from '../lib/utils';
import { WEATHER_TRANSLATIONS } from '../data/weatherTranslations';
import {
  Sparkles,
  RefreshCw,
  Volume2,
  VolumeX,
  Truck,
  ShieldCheck,
  PackageCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AdvisoryMeasure {
  category: string;
  hindiCategory?: string;
  advice: string;
  actionBadge: string;
}

interface AdvisoryData {
  summary: string;
  measures: AdvisoryMeasure[];
  audioText: string;
  isAIGenerated?: boolean;
}

interface AIWeatherAdvisoryCardProps {
  crop: CropData;
  locationName: string;
  weather: WeatherData | null;
  language: Language;
}

export const AIWeatherAdvisoryCard: React.FC<AIWeatherAdvisoryCardProps> = ({
  crop,
  locationName,
  weather,
  language,
}) => {
  const [advisory, setAdvisory] = useState<AdvisoryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const wt = WEATHER_TRANSLATIONS[language] || WEATHER_TRANSLATIONS.en;

  const fetchAdvisory = useCallback(
    async (isManualRefresh = false) => {
      if (!weather) return;
      setIsLoading(true);
      setErrorMsg(null);
      if (isPlayingAudio) {
        stopSpeaking();
        setIsPlayingAudio(false);
      }

      try {
        const response = await fetch('/api/weather/advisory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop: {
              id: crop.id,
              name: crop.name,
              hindiName: crop.hindiName,
              category: crop.category,
            },
            location: locationName || 'Local Mandi',
            weather: {
              temperature: weather.temperature,
              maxTemperature: weather.maxTemperature,
              minTemperature: weather.minTemperature,
              humidity: weather.humidity,
              precipitationSum: weather.precipitationSum,
              precipitationProbability: weather.precipitationProbability,
              windSpeed: weather.windSpeed,
              conditionLabel: weather.conditionLabel,
              isExtremeRisk: weather.isExtremeRisk,
              riskType: weather.riskType,
            },
            language,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        if (data.measures && Array.isArray(data.measures)) {
          setAdvisory(data);
        } else {
          throw new Error('Invalid advisory response format');
        }
      } catch (err: any) {
        console.warn('Weather advisory fetch error:', err);
        setErrorMsg('Using local expert agronomic advisory');
        // Fallback local advisory
        const isWet = (weather.precipitationSum ?? 0) >= 5 || (weather.precipitationProbability ?? 0) >= 50;
        const isHot = (weather.temperature ?? 30) >= 38;
        setAdvisory({
          summary: `${crop.name} Advisory for ${locationName}: ${isWet ? 'Rain Alert Active' : isHot ? 'Heat Alert Active' : 'Normal Seasonal Guidelines'}`,
          measures: [
            {
              category: 'Travel & Transport Safety',
              hindiCategory: 'परिवहन व मंडी यात्रा सुरक्षा',
              advice: isWet
                ? `Cover transport vehicles with double tarpaulin securely fastened against ${weather.windSpeed ?? 14} km/h winds. Avoid waterlogged rural routes to ${locationName}.`
                : isHot
                ? `Dispatch ${crop.name} loads between 4:30 AM and 7:00 AM to prevent moisture shrinkage during open road transit in ${weather.temperature}°C heat.`
                : `Inspect vehicle tarp and tie cords before loading. Morning transit is recommended for early token allocation at ${locationName} yard.`,
              actionBadge: isWet ? 'Tarp Required' : isHot ? 'Early Departure' : 'Safe Transit',
            },
            {
              category: 'Field Protection',
              hindiCategory: 'खेत व खड़ी फसल सुरक्षा',
              advice: isWet
                ? `Open drainage trenches in low-lying field plots immediately. Stop all pesticide spraying as rain will wash away chemicals.`
                : isHot
                ? `Provide light evening irrigation to maintain soil moisture around roots. Avoid midday watering which scalds ${crop.name}.`
                : `Standard weeding and intercultural operations can proceed under current calm winds (${weather.windSpeed ?? 12} km/h).`,
              actionBadge: isWet ? 'Drainage Priority' : isHot ? 'Evening Irrigation' : 'Routine Care',
            },
            {
              category: 'Produce Protection',
              hindiCategory: 'कटी फसल व उपज सुरक्षा',
              advice: isWet
                ? `Never store harvested ${crop.name} on bare ground. Place wooden pallets (channi) under bags in dry sheds to stop bottom moisture rot.`
                : isHot
                ? `Store harvested ${crop.name} under 50% agro-shade nets with ample cross-ventilation to prevent internal sweating and rotting.`
                : `Spread harvested produce in thin layers for 1-2 days of shaded curing before packing to fetch higher auction grades.`,
              actionBadge: isWet ? 'Pallet Stacking' : isHot ? 'Shade Protection' : 'Curing Standard',
            },
          ],
          audioText: `Weather advisory for ${crop.name}: Transport safely with tarp. Protect standing field crops and store bags on raised pallets away from damp soil.`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [crop, locationName, weather, language, isPlayingAudio]
  );

  // Trigger advisory fetch on crop, location, or weather changes
  useEffect(() => {
    if (weather) {
      fetchAdvisory(false);
    }
  }, [crop.id, weather?.temperature, weather?.precipitationSum, weather?.riskType, locationName]);

  // Audio speech handler
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      if (!advisory) return;
      setIsPlayingAudio(true);
      const textToSpeak = advisory.audioText || advisory.summary;
      speakText(textToSpeak, language, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('travel') || cat.includes('transport') || cat.includes('परिवहन')) {
      return <Truck className="w-5 h-5 text-blue-700" />;
    }
    if (cat.includes('field') || cat.includes('खेत')) {
      return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
    }
    return <PackageCheck className="w-5 h-5 text-amber-700" />;
  };

  const getCategoryColorStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('travel') || cat.includes('transport') || cat.includes('परिवहन')) {
      return {
        cardBg: 'bg-blue-50/60 border-blue-200',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        iconBg: 'bg-blue-100 text-blue-700',
      };
    }
    if (cat.includes('field') || cat.includes('खेत')) {
      return {
        cardBg: 'bg-emerald-50/60 border-emerald-200',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        iconBg: 'bg-emerald-100 text-emerald-700',
      };
    }
    return {
      cardBg: 'bg-amber-50/60 border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
      iconBg: 'bg-amber-100 text-amber-800',
    };
  };

  return (
    <section
      id="ai-kisan-weather-advisory"
      className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-200 shadow-xs space-y-4"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200">
        <div className="flex items-start gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {wt.aiAdvisoryTitle}
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {wt.aiAdvisorySubtitle} ({crop.name} - {crop.hindiName || ''})
            </p>
          </div>
        </div>

        {/* Action Buttons: Regenerate & TTS */}
        <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
          <button
            type="button"
            id="regenerate-weather-advisory-btn"
            onClick={() => fetchAdvisory(true)}
            disabled={isLoading || !weather}
            className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            title="Regenerate Advisory with Gemini"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
            <span>{isLoading ? wt.generating : wt.regenerate}</span>
          </button>

          <button
            type="button"
            id="listen-ai-advisory-btn"
            onClick={handleToggleAudio}
            disabled={!advisory}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all border cursor-pointer select-none shadow-2xs ${
              isPlayingAudio
                ? 'bg-slate-900 text-white border-slate-900 animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
            }`}
          >
            {isPlayingAudio ? (
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
      </div>

      {/* Loading Skeleton */}
      {isLoading && !advisory && (
        <div className="space-y-3 py-4">
          <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Error message indicator if any */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Advisory Content */}
      {advisory && (
        <div className="space-y-3.5">
          {/* Summary line */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{advisory.summary}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold hidden sm:inline-block">
              {weather ? `${weather.temperature}°C • ${weather.humidity}% humidity • ${weather.precipitationSum}mm rain` : ''}
            </span>
          </div>

          {/* 3 Crisp Preventive Measures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {advisory.measures.map((measure, index) => {
              const styles = getCategoryColorStyles(measure.category);
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${styles.cardBg} flex flex-col justify-between space-y-3 shadow-2xs`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${styles.iconBg} flex items-center justify-center shrink-0`}>
                          {getCategoryIcon(measure.category)}
                        </div>
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-tight text-slate-900 block leading-tight">
                            {measure.category}
                          </span>
                          {measure.hindiCategory && (
                            <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                              {measure.hindiCategory}
                            </span>
                          )}
                        </div>
                      </div>

                      {measure.actionBadge && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${styles.badgeBg}`}
                        >
                          {measure.actionBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                      {measure.advice}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>{wt.priorityStep} #{index + 1}</span>
                    <span className="text-emerald-800">{wt.actionRecommended}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
