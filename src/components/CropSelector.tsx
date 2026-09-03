import React, { useState } from 'react';
import { CropData, Language, CropCategory } from '../types';
import { CropIcon } from './CropIcons';
import { translations } from '../lib/utils';
import { Mic, Search, Check, TrendingUp, Pause, AlertTriangle, Layers } from 'lucide-react';

interface CropSelectorProps {
  crops: CropData[];
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
  language: Language;
  onOpenVoiceSearch: () => void;
  isSunlightMode: boolean;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  crops,
  selectedCropId,
  onSelectCrop,
  language,
  onOpenVoiceSearch,
  isSunlightMode,
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[language];

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: t.allCategories || 'All Crops' },
    { id: 'vegetables', label: t.vegetables || 'Vegetables' },
    { id: 'cereals', label: t.cereals || 'Cereals & Millets' },
    { id: 'pulses', label: t.pulses || 'Pulses (Dal)' },
    { id: 'oilseeds', label: t.oilseeds || 'Oilseeds' },
    { id: 'cash_crops', label: t.cashCrops || 'Cash Crops' },
    { id: 'spices', label: t.spices || 'Spices' },
    { id: 'fruits', label: t.fruits || 'Fruits' },
    { id: 'plantation', label: t.plantation || 'Plantation' },
  ];

  const filteredCrops = crops.filter((crop) => {
    // Category match
    if (selectedCategory !== 'all' && crop.category !== selectedCategory) {
      return false;
    }

    // Text search query
    const q = filterText.toLowerCase().trim();
    if (!q) return true;

    const regionalName = crop.regionalNames?.[language]?.toLowerCase() || '';
    return (
      crop.name.toLowerCase().includes(q) ||
      crop.hindiName.toLowerCase().includes(q) ||
      crop.marathiName.toLowerCase().includes(q) ||
      regionalName.includes(q)
    );
  });

  return (
    <section className="relative">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              {t.selectCrop}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              {crops.length} All-India Crops
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {t.selectCropSubtitle}
          </p>
        </div>

        {/* Quick Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="crop-quick-filter"
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search crop / फसल खोजें..."
            className="w-full pl-8.5 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 focus:ring-1 focus:ring-slate-300 shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* Category Pills (Zero-typing category browsing) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        {categories.map((cat) => {
          const isCatActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                isCatActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of large, tap-friendly crop cards */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {filteredCrops.map((crop) => {
          const isSelected = crop.id === selectedCropId;
          const isGreen = crop.decision.signal === 'green';
          const isAmber = crop.decision.signal === 'amber';
          const isRed = crop.decision.signal === 'red';

          // Get primary localized name for this crop
          const regionalName = crop.regionalNames?.[language];
          const localizedName = regionalName || (language === 'hi' ? crop.hindiName : language === 'mr' ? crop.marathiName : crop.name);
          const secondaryName = language === 'en' ? crop.hindiName : crop.name;

          return (
            <button
              key={crop.id}
              id={`crop-card-${crop.id}`}
              onClick={() => onSelectCrop(crop.id)}
              className={`relative flex flex-col items-center justify-between p-3 rounded-xl text-left transition-all min-h-[140px] select-none active:scale-[0.98] ${
                isSelected
                  ? isSunlightMode
                    ? 'bg-white ring-3 ring-slate-950 shadow-sm border-2 border-slate-950'
                    : 'bg-white ring-2 ring-emerald-600 shadow-xs border-emerald-600'
                  : 'bg-white hover:border-slate-300 border border-slate-200 shadow-2xs'
              }`}
              aria-label={`Select ${crop.name}`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Crop Visual Icon */}
              <div className="w-12 h-12 flex items-center justify-center my-1">
                <CropIcon id={crop.id} className="w-11 h-11" />
              </div>

              {/* Crop Name & Localized Name */}
              <div className="w-full text-center mt-1">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                  {localizedName}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {secondaryName}
                </p>

                {/* Price & Signal Tag */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between w-full">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 tabular-nums">
                    ₹{crop.currentPrice.toLocaleString('en-IN')}
                  </span>

                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${
                      isGreen
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                        : isAmber
                        ? 'bg-amber-50 text-amber-900 border-amber-200/80'
                        : 'bg-red-50 text-red-800 border-red-200/80'
                    }`}
                  >
                    {isGreen && <TrendingUp className="w-2.5 h-2.5" />}
                    {isAmber && <Pause className="w-2.5 h-2.5" />}
                    {isRed && <AlertTriangle className="w-2.5 h-2.5" />}
                    <span>{isGreen ? 'Sell' : isAmber ? 'Wait' : 'Risk'}</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredCrops.length === 0 && (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-2xs">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No crops found in this category or search.</p>
          <button
            onClick={() => {
              setFilterText('');
              setSelectedCategory('all');
            }}
            className="mt-2 text-xs text-emerald-700 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Floating WhatsApp-Style Voice Search Microphone Button */}
      <button
        id="floating-voice-search-btn"
        onClick={onOpenVoiceSearch}
        title={t.voiceSearchPrompt}
        className="fixed bottom-6 right-5 sm:right-8 z-40 flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white pl-3 pr-4 py-2.5 sm:py-3 rounded-full shadow-lg border border-white/20 transition-all select-none"
        aria-label="Voice Search"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <Mic className="w-4 h-4 text-white stroke-[2.5]" />
        </div>
        <div className="text-left">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-100 leading-none">
            {t.speakCropName || 'Bol Kar Khojein'}
          </span>
          <span className="text-xs sm:text-sm font-extrabold tracking-tight leading-none text-white">
            {t.voiceSearch || 'Voice Search'}
          </span>
        </div>
      </button>
    </section>
  );
};
