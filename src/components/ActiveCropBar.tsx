import React from 'react';
import { CropData, Language } from '../types';
import { formatINR, translations } from '../lib/utils';
import { TrendingUp, Pause, AlertTriangle, ArrowLeftRight, Sparkles } from 'lucide-react';
import { NAV_TRANSLATIONS } from '../data/navigationTranslations';

interface ActiveCropBarProps {
  crop: CropData;
  language: Language;
  onChangeCrop: () => void;
  isSunlightMode: boolean;
}

export const ActiveCropBar: React.FC<ActiveCropBarProps> = ({
  crop,
  language,
  onChangeCrop,
  isSunlightMode,
}) => {
  const signal = crop.decision.signal;
  const isGreen = signal === 'green';
  const isAmber = signal === 'amber';
  const navTexts = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.en;
  const t = translations[language] || translations.en;

  const badgeBg = isGreen
    ? 'bg-emerald-700 text-white'
    : isAmber
    ? 'bg-amber-400 text-slate-950 font-bold'
    : 'bg-red-700 text-white';

  const regionalName = crop.regionalNames?.[language] || crop.hindiName;

  return (
    <div
      id="active-crop-context-bar"
      className={`p-3 sm:p-3.5 rounded-xl border bg-white shadow-2xs flex flex-wrap items-center justify-between gap-2.5 transition-all ${
        isSunlightMode ? 'border-2 border-slate-900' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-2xs border shrink-0"
          style={{ backgroundColor: `${crop.colorTheme}15`, borderColor: `${crop.colorTheme}40` }}
        >
          {crop.category === 'Vegetables'
            ? '🧅'
            : crop.category === 'Cereals'
            ? '🌾'
            : crop.category === 'Pulses'
            ? '🌱'
            : crop.category === 'Oilseeds'
            ? '🌻'
            : crop.category === 'Cash Crops'
            ? '🌿'
            : '🍎'}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-sm sm:text-base text-slate-900 leading-tight">
              {crop.name}
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({regionalName})
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase ${badgeBg}`}
            >
              {isGreen ? 'SELL TODAY' : isAmber ? 'WAIT' : 'SELL NOW'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
            <span className="font-extrabold text-slate-900 tabular-nums">
              {formatINR(crop.currentPrice)}
            </span>
            <span className="text-[11px] text-slate-400">/ quintal</span>
            <span
              className={`font-bold text-[11px] ${
                crop.priceChangeToday >= 0 ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              ({crop.priceChangeToday >= 0 ? '+' : ''}
              {formatINR(crop.priceChangeToday)})
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        id="change-crop-btn"
        onClick={onChangeCrop}
        className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/90 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer shadow-2xs"
        title="Choose a different crop"
      >
        <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-700" />
        <span>
          {language === 'en'
            ? 'Change Crop'
            : language === 'hi'
            ? 'फसल बदलें'
            : language === 'mr'
            ? 'पीक बदला'
            : `${navTexts.navItems.crops.shortLabel} बदलें`}
        </span>
      </button>
    </div>
  );
};
