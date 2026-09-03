import React, { useState, useMemo } from 'react';
import { CropData, Language } from '../types';
import { CropIcon } from './CropIcons';
import { CropImage } from '../data/cropImages';
import { translations } from '../lib/utils';
import { NAV_TRANSLATIONS } from '../data/navigationTranslations';
import {
  Mic,
  Search,
  Check,
  TrendingUp,
  Pause,
  AlertTriangle,
  Layers,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface CropSelectorProps {
  crops: CropData[];
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
  language: Language;
  onOpenVoiceSearch: () => void;
  isSunlightMode: boolean;
  onProceedToDecision?: () => void;
}

// Common transliterations and colloquial names for all-India farmers
const CROP_ALIASES: Record<string, string[]> = {
  onion: ['pyaaz', 'pyaz', 'kanda', 'dungri', 'vengayam', 'ullipayalu', 'eerulli'],
  potato: ['aloo', 'aalu', 'batata', 'urulaikizhangu', 'alu', 'aaloo'],
  tomato: ['tamatar', 'thakkali', 'tameta', 'tamata'],
  wheat: ['gehu', 'gehun', 'gahu', 'kanak', 'sharbati', 'lokwan', 'tukda', 'godhumai', 'godhumalu'],
  paddy: ['rice', 'chawal', 'dhan', 'basmati', 'bhat', 'arisi', 'vari', 'nellu', 'dhaanya'],
  maize: ['corn', 'makka', 'makai', 'bhutta', 'cholam', 'mokka jonna'],
  bajra: ['pearl millet', 'bajri', 'kambu', 'sajje', 'sajjalu'],
  jowar: ['sorghum', 'jowari', 'cholam', 'jonna', 'jola'],
  ragi: ['finger millet', 'nachni', 'kezhvaragu', 'ragulu'],
  chana: ['gram', 'channa', 'bengal gram', 'chhole', 'kadalai', 'senagalu', 'kadale'],
  tur: ['arhar', 'toor', 'pigeon pea', 'tuvar', 'tuver', 'kandulu', 'thuvaram paruppu', 'togari'],
  moong: ['green gram', 'mung', 'pesalu', 'paasi payaru', 'hesaru kaalu', 'mug'],
  urad: ['black gram', 'mash', 'minumulu', 'ulundhu', 'uddu'],
  soybean: ['soya', 'soyabean', 'soya bean'],
  mustard: ['sarson', 'rai', 'kadugu', 'avalu', 'sasive', 'sorisa'],
  groundnut: ['peanut', 'mungfali', 'moongfali', 'singdana', 'kadalai', 'verukadalai', 'pallilu', 'shenga'],
  cotton: ['kapas', 'rooi', 'rui', 'paruthi', 'paththi', 'kapasiya'],
  sugarcane: ['ganna', 'us', 'karumbu', 'cheruku', 'kabbu', 'ikshu'],
  jute: ['patson', 'san', 'paat', 'shon'],
  garlic: ['lahsun', 'lasun', 'poondu', 'vellulli', 'bellulli', 'lasun'],
  red_chilli: ['mirch', 'mirchi', 'lal mirch', 'milagai', 'mirapakaya', 'menasinakayi'],
  turmeric: ['haldi', 'manjal', 'pasupu', 'arishina', 'halad'],
  ginger: ['adrak', 'allam', 'inji', 'shunti', 'aale'],
  cumin: ['jeera', 'jira', 'jeerakam', 'jeelakarra', 'jeerige'],
  coriander: ['dhaniya', 'dhania', 'kothmir', 'kothamalli', 'dhaniamalu', 'kothambari'],
  green_peas: ['matar', 'mattar', 'batani', 'pattani'],
  cauliflower: ['phool gobhi', 'gobi', 'gobhi', 'flower'],
  apple: ['seb', 'safarchand', 'aappil'],
  banana: ['kela', 'kele', 'vazhaipazham', 'arati pandu', 'bale hannu'],
  coconut: ['nariyal', 'thengai', 'kobbari', 'tenginakayi', 'naarol'],
  tea: ['chai', 'cha', 'theeneer'],
  coffee: ['kaapi', 'kafi'],
};

export const CropSelector: React.FC<CropSelectorProps> = ({
  crops,
  selectedCropId,
  onSelectCrop,
  language,
  onOpenVoiceSearch,
  isSunlightMode,
  onProceedToDecision,
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSignal, setSelectedSignal] = useState<'all' | 'green' | 'amber' | 'red'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-high' | 'price-low' | 'gainers' | 'name'>('default');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const t = translations[language];
  const navTexts = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.en;

  // Defined categories with exact category names matching CropData
  const categories = useMemo(() => [
    {
      id: 'all',
      label: t.allCrops || 'All Crops',
      count: crops.length,
    },
    {
      id: 'Vegetables',
      label: t.categoryVegetables || 'Vegetables',
      count: crops.filter((c) => c.category === 'Vegetables').length,
    },
    {
      id: 'Cereals',
      label: t.categoryCereals || 'Cereals & Millets',
      count: crops.filter((c) => c.category === 'Cereals').length,
    },
    {
      id: 'Pulses',
      label: t.categoryPulses || 'Pulses (Dal)',
      count: crops.filter((c) => c.category === 'Pulses').length,
    },
    {
      id: 'Oilseeds',
      label: t.categoryOilseeds || 'Oilseeds',
      count: crops.filter((c) => c.category === 'Oilseeds').length,
    },
    {
      id: 'Cash Crops',
      label: t.categoryCashCrops || 'Cash Crops',
      count: crops.filter((c) => c.category === 'Cash Crops').length,
    },
    {
      id: 'Spices',
      label: t.categorySpices || 'Spices',
      count: crops.filter((c) => c.category === 'Spices').length,
    },
    {
      id: 'Fruits & Plantation',
      label: t.categoryFruits || 'Fruits & Plantation',
      count: crops.filter((c) => c.category === 'Fruits & Plantation').length,
    },
  ], [crops, t]);

  // Counts for signal filtering
  const signalCounts = useMemo(() => {
    return {
      green: crops.filter((c) => c.decision.signal === 'green').length,
      amber: crops.filter((c) => c.decision.signal === 'amber').length,
      red: crops.filter((c) => c.decision.signal === 'red').length,
    };
  }, [crops]);

  // Multi-dimensional filtering logic (Category, Decision Signal, Text Search & Synonyms)
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      // 1. Category filter (normalized match)
      if (selectedCategory !== 'all') {
        const cropCat = crop.category.toLowerCase().trim();
        const selectedCat = selectedCategory.toLowerCase().trim();
        if (cropCat !== selectedCat) {
          return false;
        }
      }

      // 2. Decision signal filter (Green / Amber / Red)
      if (selectedSignal !== 'all' && crop.decision.signal !== selectedSignal) {
        return false;
      }

      // 3. Text search query
      const q = filterText.toLowerCase().trim();
      if (!q) return true;

      const nameMatch = crop.name.toLowerCase().includes(q);
      const idMatch = crop.id.toLowerCase().includes(q);
      const hindiMatch = crop.hindiName?.toLowerCase().includes(q) ?? false;
      const marathiMatch = crop.marathiName?.toLowerCase().includes(q) ?? false;
      const catMatch = crop.category.toLowerCase().includes(q);

      // Search inside regional names
      const regionalMatch = crop.regionalNames
        ? Object.values(crop.regionalNames).some(
            (val) => typeof val === 'string' && val.toLowerCase().includes(q)
          )
        : false;

      // Search inside colloquial / vernacular aliases
      const aliasMatch =
        CROP_ALIASES[crop.id]?.some((alias) => alias.includes(q) || q.includes(alias)) ?? false;

      return (
        nameMatch ||
        idMatch ||
        hindiMatch ||
        marathiMatch ||
        catMatch ||
        regionalMatch ||
        aliasMatch
      );
    });
  }, [crops, selectedCategory, selectedSignal, filterText]);

  // Sorting
  const sortedAndFilteredCrops = useMemo(() => {
    const list = [...filteredCrops];
    switch (sortBy) {
      case 'price-high':
        return list.sort((a, b) => b.currentPrice - a.currentPrice);
      case 'price-low':
        return list.sort((a, b) => a.currentPrice - b.currentPrice);
      case 'gainers':
        return list.sort((a, b) => (b.priceChangeToday || 0) - (a.priceChangeToday || 0));
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'default':
      default:
        return list;
    }
  }, [filteredCrops, sortBy]);

  // Active options count inside the Options panel
  const activeOptionsCount =
    (selectedSignal !== 'all' ? 1 : 0) + (sortBy !== 'default' ? 1 : 0);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSignal !== 'all' ||
    filterText.trim() !== '' ||
    sortBy !== 'default';

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSignal('all');
    setFilterText('');
    setSortBy('default');
  };

  return (
    <section className="relative">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              {t.selectCrop}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              {sortedAndFilteredCrops.length} of {crops.length} Crops
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {t.selectCropSubtitle}
          </p>
        </div>

        {/* Quick Search & Filter Controls */}
        <div className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="crop-quick-filter"
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search crop / फसल खोजें (e.g., Pyaz, Gehu, Chana)..."
              className="w-full pl-8.5 pr-8 py-2 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs font-medium"
            />
            {filterText && (
              <button
                type="button"
                onClick={() => setFilterText('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Options Toggle Button */}
          <button
            id="crop-options-toggle-btn"
            type="button"
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
            className={`min-h-[38px] px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 select-none cursor-pointer ${
              showAdvancedFilters
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-600/30'
                : activeOptionsCount > 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/70'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            aria-expanded={showAdvancedFilters}
            aria-controls="crop-options-panel"
            title="Filter & Sort Options"
            aria-label="Toggle filter and sort options"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
            <span>Options</span>
            {activeOptionsCount > 0 && (
              <span
                className={`text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-extrabold ${
                  showAdvancedFilters
                    ? 'bg-white text-emerald-800'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {activeOptionsCount}
              </span>
            )}
            {showAdvancedFilters ? (
              <ChevronUp className="w-3.5 h-3.5 opacity-90 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* 1. Category Pills (Zero-typing category browsing with real-time item counts) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2.5">
        {categories.map((cat) => {
          const isCatActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`category-pill-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border select-none cursor-pointer ${
                isCatActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-1 ring-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isCatActive
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Expandable Options Panel (Decision Signal Filters & Sorting) */}
      {showAdvancedFilters && (
        <div
          id="crop-options-panel"
          className="bg-white border border-slate-200 rounded-xl p-3.5 mb-3 shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <SlidersHorizontal className="w-3 h-3" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">
                Filter & Sort Options
              </h4>
              {activeOptionsCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  {activeOptionsCount} active
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeOptionsCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSignal('all');
                    setSortBy('default');
                  }}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Options</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close options"
                aria-label="Close options"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Market Decision Filter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Market Decision Signal:
                </label>
                <span className="text-[10px] text-slate-400">
                  AI Advice
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSignal('all')}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-all border cursor-pointer select-none ${
                    selectedSignal === 'all'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All ({crops.length})
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSignal('green')}
                  className={`inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none ${
                    selectedSignal === 'green'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs font-bold'
                      : 'bg-emerald-50/70 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 shrink-0" />
                  <span>Sell ({signalCounts.green})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSignal('amber')}
                  className={`inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none ${
                    selectedSignal === 'amber'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-bold'
                      : 'bg-amber-50/70 text-amber-800 border-amber-200/80 hover:bg-amber-100/70'
                  }`}
                >
                  <Pause className="w-3 h-3 shrink-0" />
                  <span>Wait ({signalCounts.amber})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSignal('red')}
                  className={`inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none ${
                    selectedSignal === 'red'
                      ? 'bg-red-700 text-white border-red-700 shadow-xs font-bold'
                      : 'bg-red-50/70 text-red-800 border-red-200/80 hover:bg-red-100/70'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>Risk ({signalCounts.red})</span>
                </button>
              </div>
            </div>

            {/* Sorting Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  <span>Sort Crops By:</span>
                </label>
                <span className="text-[10px] text-slate-400">Order</span>
              </div>
              <select
                id="crop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:bg-white shadow-2xs cursor-pointer"
              >
                <option value="default">Default (All-India Order)</option>
                <option value="price-high">Price: High to Low (₹)</option>
                <option value="price-low">Price: Low to High (₹)</option>
                <option value="gainers">Today's Top Gainers (+₹)</option>
                <option value="name">Crop Name (A to Z)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 3. Compact Active Filter Chips when panel is collapsed */}
      {!showAdvancedFilters && activeOptionsCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5 text-xs">
          <span className="text-[11px] font-bold text-slate-500">Active Options:</span>
          {selectedSignal !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <span>
                Signal: {selectedSignal === 'green' ? 'Sell Today' : selectedSignal === 'amber' ? 'Wait' : 'Risk'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedSignal('all')}
                className="hover:text-emerald-950 p-0.5 cursor-pointer"
                title="Clear signal filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {sortBy !== 'default' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
              <span>
                Sort: {sortBy === 'price-high' ? 'Price High' : sortBy === 'price-low' ? 'Price Low' : sortBy === 'gainers' ? 'Top Gainers' : 'A-Z'}
              </span>
              <button
                type="button"
                onClick={() => setSortBy('default')}
                className="hover:text-slate-950 p-0.5 cursor-pointer"
                title="Reset sorting"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(true)}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline ml-1 cursor-pointer"
          >
            Edit Options
          </button>
        </div>
      )}

      {/* Grid of large, tap-friendly crop cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {sortedAndFilteredCrops.map((crop) => {
          const isSelected = crop.id === selectedCropId;
          const isGreen = crop.decision.signal === 'green';
          const isAmber = crop.decision.signal === 'amber';
          const isRed = crop.decision.signal === 'red';

          // Get primary localized name for this crop
          const regionalName = crop.regionalNames?.[language];
          const localizedName =
            regionalName ||
            (language === 'hi'
              ? crop.hindiName
              : language === 'mr'
              ? crop.marathiName || crop.name
              : crop.name);
          const secondaryName = language === 'en' ? crop.hindiName : crop.name;

          return (
            <button
              key={crop.id}
              id={`crop-card-${crop.id}`}
              type="button"
              onClick={() => onSelectCrop(crop.id)}
              className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer select-none text-left active:scale-[0.98] ${
                isSelected
                  ? isSunlightMode
                    ? 'bg-white ring-4 ring-black border-2 border-black shadow-lg'
                    : 'bg-white ring-2.5 ring-emerald-600 border-2 border-emerald-600 shadow-md ring-offset-2 ring-offset-white'
                  : isSunlightMode
                  ? 'bg-white border-2 border-slate-800 shadow-xs hover:border-black'
                  : 'bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5'
              }`}
              aria-pressed={isSelected}
              aria-label={`Select ${crop.name}, current mandi price ₹${crop.currentPrice} per quintal`}
            >
              {/* Card Image Banner */}
              <div className="w-full h-32 sm:h-36 relative overflow-hidden bg-slate-100 shrink-0">
                <CropImage
                  id={crop.id}
                  name={crop.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fallbackIconClassName="w-10 h-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />

                {/* Top Corner Badges: Category & Signal / Selected */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/75 backdrop-blur-xs text-white shadow-2xs">
                    {crop.category}
                  </span>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs border border-white/40">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Selected</span>
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-2xs backdrop-blur-xs ${
                        isGreen
                          ? 'bg-emerald-700/90 text-white'
                          : isAmber
                          ? 'bg-amber-600/90 text-white'
                          : 'bg-rose-700/90 text-white'
                      }`}
                    >
                      {isGreen && <TrendingUp className="w-2.5 h-2.5" />}
                      {isAmber && <Pause className="w-2.5 h-2.5" />}
                      {isRed && <AlertTriangle className="w-2.5 h-2.5" />}
                      <span>{isGreen ? 'Sell' : isAmber ? 'Wait' : 'Risk'}</span>
                    </span>
                  )}
                </div>

                {/* Bottom Image Overlay: Mandi Price & Today's Change */}
                <div className="absolute bottom-2 left-2 right-2 flex items-baseline justify-between pointer-events-none">
                  <div className="flex items-baseline gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white">
                    <span className="text-xs sm:text-sm font-black tabular-nums">
                      ₹{crop.currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-slate-300 font-semibold">/qtl</span>
                  </div>

                  {crop.priceChangeToday !== 0 && (
                    <div
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-black flex items-center gap-0.5 backdrop-blur-xs ${
                        crop.priceChangeToday > 0
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-rose-600/90 text-white'
                      }`}
                    >
                      {crop.priceChangeToday > 0 ? (
                        <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                      )}
                      <span>
                        {crop.priceChangeToday > 0 ? '+' : ''}
                        {crop.priceChangeToday}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body Content */}
              <div className="w-full p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-1">
                    {localizedName}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {secondaryName}
                  </p>
                </div>

                {/* Mandi Advice & Selection Action Cue */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                    <span>Advice:</span>
                    <span
                      className={`font-bold ${
                        isGreen
                          ? 'text-emerald-700'
                          : isAmber
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {crop.decision.verdictLabel || (isGreen ? 'Sell Today' : isAmber ? 'Wait' : 'Caution')}
                    </span>
                  </div>

                  {isSelected ? (
                    <div className="w-full py-1.5 px-2 rounded-lg bg-emerald-700 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-2xs tracking-wide">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Selected (चुना गया)</span>
                    </div>
                  ) : (
                    <div className="w-full py-1.5 px-2 rounded-lg bg-slate-50 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-800 border border-slate-200/80 group-hover:border-emerald-200 text-[11px] font-bold flex items-center justify-center transition-colors">
                      Select (चुनें)
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty State when zero crops match */}
      {sortedAndFilteredCrops.length === 0 && (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-2xs">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">
            No crops found matching your filters.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {filterText
              ? `No crop matching "${filterText}" in this view.`
              : 'Try changing category, market advice signal, or sorting.'}
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Prominent Proceed to Decision Banner */}
      {onProceedToDecision && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-300 shadow-2xs shrink-0 bg-white">
              <CropImage
                id={selectedCropId}
                name={crops.find((c) => c.id === selectedCropId)?.name}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
                fallbackIconClassName="w-7 h-7"
              />
            </div>
            <div>
              <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wide">
                Fasal Chuni Gayi (फसल चुनी गई):
              </span>
              <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                {crops.find((c) => c.id === selectedCropId)?.name || 'Crop'} (
                {crops.find((c) => c.id === selectedCropId)?.regionalNames?.[language] ||
                  crops.find((c) => c.id === selectedCropId)?.hindiName}
                ) · ₹
                {crops.find((c) => c.id === selectedCropId)?.currentPrice}/qtl
              </div>
            </div>
          </div>

          <button
            type="button"
            id="proceed-to-decision-btn"
            onClick={onProceedToDecision}
            className="w-full sm:w-auto min-h-[48px] px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <span>2. {navTexts.navItems.decision.label} ➡️</span>
          </button>
        </div>
      )}

      {/* Floating WhatsApp-Style Voice Search Microphone Button */}
      <button
        id="floating-voice-search-btn"
        onClick={onOpenVoiceSearch}
        title={t.voiceSearchPrompt}
        className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40 flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white pl-3 pr-4 py-2.5 sm:py-3 rounded-full shadow-lg border border-white/20 transition-all select-none cursor-pointer"
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
