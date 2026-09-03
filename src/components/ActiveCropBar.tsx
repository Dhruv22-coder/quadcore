import React from 'react';
import { CropData, Language } from '../types';
import { formatINR, translations } from '../lib/utils';
import { TrendingUp, Pause, AlertTriangle, ArrowLeftRight, Sparkles, Bookmark } from 'lucide-react';
import { NAV_TRANSLATIONS } from '../data/navigationTranslations';
import { CropImage } from '../data/cropImages';
import { useFirebase } from '../context/FirebaseContext';

interface ActiveCropBarProps {
  crop: CropData;
  language: Language;
  onChangeCrop: () => void;
  isDarkMode?: boolean;
}

export const ActiveCropBar: React.FC<ActiveCropBarProps> = ({
  crop,
  language,
  onChangeCrop,
  isDarkMode = false,
}) => {
  const { isCropWatched, toggleWatchCrop } = useFirebase();
  const watched = isCropWatched(crop.id);
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
      className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl overflow-hidden shadow-2xs border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
          <CropImage
            id={crop.id}
            name={crop.name}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
            fallbackIconClassName="w-6 h-6"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
              {crop.name}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              ({regionalName})
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase ${badgeBg}`}
            >
              {isGreen ? t.sellBadge : isAmber ? t.waitBadge : t.riskBadge}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
              {formatINR(crop.currentPrice)}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{t.perQuintal}</span>
            <span
              className={`font-bold text-[11px] ${
                crop.priceChangeToday >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
              }`}
            >
              ({crop.priceChangeToday >= 0 ? '+' : ''}
              {formatINR(crop.priceChangeToday)})
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          id="watchlist-pin-crop-btn"
          onClick={() => toggleWatchCrop(crop.id, crop.name)}
          className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer shadow-2xs ${
            watched
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
          title={watched ? t.pinnedCrop : t.pinCrop}
          aria-label={watched ? t.pinnedCrop : t.pinCrop}
        >
          <Bookmark
            className={`w-3.5 h-3.5 ${
              watched
                ? 'fill-amber-500 text-amber-600 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          />
          <span className="hidden sm:inline">
            {watched ? t.pinnedCrop : t.pinCrop}
          </span>
        </button>

        <button
          type="button"
          id="change-crop-btn"
          onClick={onChangeCrop}
          className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
          title={t.changeCropAction}
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>{t.changeCropAction}</span>
        </button>
      </div>
    </div>
  );
};
