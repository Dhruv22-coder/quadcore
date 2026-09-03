import React, { useState } from 'react';
import { CropData, Language, VehicleType, IndianState } from '../types';
import { vehicleOptions } from '../data/cropsData';
import { translations, formatINR, parseNumericValue } from '../lib/utils';
import { CropImage } from '../data/cropImages';
import { POOLING_TRANSLATIONS } from '../data/poolingTranslations';
import {
  Truck,
  TrendingUp,
  Award,
  Navigation,
  Fuel,
  IndianRupee,
  Minus,
  Equal,
  CheckCircle2,
  Users,
  ShieldCheck,
  AlertCircle,
  Clock,
  Building2,
  MapPin,
  Filter,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

interface LogisticsComparisonProps {
  crop: CropData;
  language: Language;
  currentState: IndianState;
  isSunlightMode?: boolean;
  isDarkMode?: boolean;
  quantity?: number;
  onQuantityChange?: (newQty: number) => void;
  onOpenPoolingModal?: () => void;
  onNavigateToDecision?: () => void;
  onNavigateToWeather?: () => void;
}

export const LogisticsComparison: React.FC<LogisticsComparisonProps> = ({
  crop,
  language,
  currentState,
  isSunlightMode = false,
  isDarkMode = false,
  quantity: externalQuantity,
  onQuantityChange,
  onOpenPoolingModal,
  onNavigateToDecision,
  onNavigateToWeather,
}) => {
  const [internalQuantity, setInternalQuantity] = useState<number>(12);
  // Strictly enforce native JavaScript number for quantity, falling back to 12
  const rawQuantity = externalQuantity !== undefined ? externalQuantity : internalQuantity;
  const quantity = Math.max(1, parseNumericValue(rawQuantity) || 12);

  const handleUpdateQuantity = (newQty: unknown) => {
    const parsed = parseNumericValue(newQty);
    const numericQty = Math.max(1, Math.min(500, Math.round(parsed || 1)));
    if (onQuantityChange) {
      onQuantityChange(numericQty);
    } else {
      setInternalQuantity(numericQty);
    }
  };

  const {
    pooledFarmers = [],
    isPooledProfitMode,
    setIsPooledProfitMode,
  } = useFirebase();

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('pickup');
  const [radiusLimit, setRadiusLimit] = useState<number>(100); // 100km maximum radius filter
  // Native numeric cultivation cost state (₹/Quintal)
  const [cultivationCostPerQtl, setCultivationCostPerQtl] = useState<number>(0);

  const t = translations[language] || translations.en;
  const pt = POOLING_TRANSLATIONS[language] || POOLING_TRANSLATIONS.en;
  const vehicle = vehicleOptions.find((v) => v.id === selectedVehicle) || vehicleOptions[0];
  const vehicleCostPerKm = parseNumericValue(vehicle?.costPerKm) || 18;

  // Collaborating pool farmers for the currently selected crop (strictly parsed numbers)
  const activeCropPooledFarmers = (pooledFarmers || []).filter(
    (f) => f && f.cropId === crop.id
  );
  const collaboratingQuantity = activeCropPooledFarmers.reduce(
    (sum, f) => sum + (parseNumericValue(f.quantity) || 0),
    0
  );
  const cumulativeQuantity = Math.max(1, quantity + collaboratingQuantity);
  const isSmallYield = quantity < 15;
  const hasActivePool = activeCropPooledFarmers.length > 0;

  // Filter mandis within radiusLimit (all mandis are guaranteed within 100 km and same state)
  const displayedMandis = (crop.mandis || []).filter(
    (m) => parseNumericValue(m.distanceKm) <= radiusLimit
  );

  // Calculate comparisons for each mandi using strictly native numbers
  const comparisons = displayedMandis.map((mandi) => {
    const mandiDist = parseNumericValue(mandi.distanceKm) || 20;
    const roundTripKm = mandiDist * 2;
    const mandiRate = parseNumericValue(mandi.ratePerQuintal) || parseNumericValue(crop.currentPrice) || 0;
    const cultivationRate = parseNumericValue(cultivationCostPerQtl) || 0;

    // 1. Solo trip calculations
    const soloGrossSale = Math.round(mandiRate * quantity);
    const soloTransportCost = Math.round(roundTripKm * vehicleCostPerKm);
    const soloCultivationCost = Math.round(cultivationRate * quantity);
    const soloNetCash = soloGrossSale - soloTransportCost - soloCultivationCost;

    // 2. Pooled trip calculations (< 15 Quintals)
    const pooledSharedVehicleCost = Math.round(roundTripKm * vehicleCostPerKm * 1.12);
    const userPooledTransportCost = Math.round(
      cumulativeQuantity > 0
        ? pooledSharedVehicleCost * (quantity / cumulativeQuantity)
        : soloTransportCost
    );
    const userPooledNetCash = soloGrossSale - userPooledTransportCost - soloCultivationCost;
    const freightSavings = Math.max(0, soloTransportCost - userPooledTransportCost);

    // Group-level calculations for "Calculate Pooled Group Profit" toggle mode
    const groupGrossSale = Math.round(mandiRate * cumulativeQuantity);
    const groupTransportCost = pooledSharedVehicleCost;
    const groupCultivationCost = Math.round(cultivationRate * cumulativeQuantity);
    const groupNetCash = groupGrossSale - groupTransportCost - groupCultivationCost;

    const isPooled = isSmallYield && hasActivePool && isPooledProfitMode;
    const displayGrossSale = isPooled ? groupGrossSale : soloGrossSale;
    const displayTransportCost = isPooled
      ? groupTransportCost
      : isSmallYield && hasActivePool
      ? userPooledTransportCost
      : soloTransportCost;
    const displayCultivationCost = isPooled ? groupCultivationCost : soloCultivationCost;
    const displayNetCash = isPooled
      ? groupNetCash
      : isSmallYield && hasActivePool
      ? userPooledNetCash
      : soloNetCash;

    return {
      mandi,
      roundTripKm,
      isPooledActive: isPooled,
      soloGrossSale: isNaN(soloGrossSale) ? 0 : soloGrossSale,
      soloTransportCost: isNaN(soloTransportCost) ? 0 : soloTransportCost,
      soloCultivationCost: isNaN(soloCultivationCost) ? 0 : soloCultivationCost,
      soloNetCash: isNaN(soloNetCash) ? 0 : soloNetCash,
      userPooledTransportCost: isNaN(userPooledTransportCost) ? 0 : userPooledTransportCost,
      userPooledNetCash: isNaN(userPooledNetCash) ? 0 : userPooledNetCash,
      freightSavings: isNaN(freightSavings) ? 0 : freightSavings,
      groupGrossSale: isNaN(groupGrossSale) ? 0 : groupGrossSale,
      groupTransportCost: isNaN(groupTransportCost) ? 0 : groupTransportCost,
      groupCultivationCost: isNaN(groupCultivationCost) ? 0 : groupCultivationCost,
      groupNetCash: isNaN(groupNetCash) ? 0 : groupNetCash,
      displayGrossSale: isNaN(displayGrossSale) ? 0 : displayGrossSale,
      displayTransportCost: isNaN(displayTransportCost) ? 0 : displayTransportCost,
      displayCultivationCost: isNaN(displayCultivationCost) ? 0 : displayCultivationCost,
      displayNetCash: isNaN(displayNetCash) ? 0 : displayNetCash,
    };
  });

  // Sort by displayNetCash descending to identify best profit (safe against NaN)
  const bestOption = comparisons.length > 0
    ? [...comparisons].sort((a, b) => (b.displayNetCash || 0) - (a.displayNetCash || 0))[0]
    : undefined;
  const worstOption = comparisons.length > 0
    ? [...comparisons].sort((a, b) => (a.displayNetCash || 0) - (b.displayNetCash || 0))[0]
    : undefined;
  const maxSavings = bestOption && worstOption
    ? Math.max(0, (bestOption.displayNetCash || 0) - (worstOption.displayNetCash || 0))
    : 0;

  const quickQuantities = [8, 12, 15, 30, 50, 100];

  return (
    <section
      id="logistics-comparison-section"
      className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs"
    >
      {/* Module Title & Subtitle with Active Crop Visual Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-bold">
              <IndianRupee className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white tracking-tight">
              {t.netProfitTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {t.netProfitSubtitle}
          </p>
        </div>

        {/* Active Crop HD Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shadow-2xs shrink-0 bg-white">
            <CropImage
              id={crop.id}
              name={crop.name}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
              fallbackIconClassName="w-5 h-5"
            />
          </div>
          <div className="text-xs">
            <span className="font-extrabold text-slate-900 dark:text-white block leading-tight">
              {crop.name} ({crop.regionalNames?.[language] || crop.hindiName})
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
              Rate: {formatINR(crop.currentPrice)}/qtl
            </span>
          </div>
        </div>
      </div>

      {/* Small-Yield Pooling Banner & Cumulative Quantity Display (< 15 Quintals) */}
      {isSmallYield && (
        <div className="mb-5 p-4 rounded-xl bg-linear-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-md border border-emerald-700/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {pt.yieldCap}
                </span>
                <span className="text-xs text-emerald-200 font-bold">
                  {pt.modalTitle}
                </span>
              </div>

              {/* Cumulative Quantity Display */}
              <div className="mt-2 flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                  <span className="text-[10px] text-emerald-200 block">{pt.myYieldBox}:</span>
                  <span className="text-sm font-black text-white">{quantity} {t.quintalsUnit}</span>
                </div>

                <div className="text-emerald-300 font-black text-lg">+</div>

                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                  <span className="text-[10px] text-emerald-200 block">{pt.selectedCollaborators} ({activeCropPooledFarmers.length}):</span>
                  <span className="text-sm font-black text-amber-300">
                    {collaboratingQuantity} {t.quintalsUnit}
                  </span>
                </div>

                <div className="text-emerald-300 font-black text-lg">=</div>

                <div className="bg-emerald-800/80 px-3.5 py-1.5 rounded-lg border border-emerald-400/50">
                  <span className="text-[10px] text-emerald-200 block">{pt.cumulativeYield}:</span>
                  <span className="text-sm font-black text-emerald-300">
                    {cumulativeQuantity} {t.quintalsUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Action / Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              {hasActivePool ? (
                /* Toggle: "Calculate Individual Profit" vs "Calculate Pooled Group Profit" */
                <div className="bg-white/15 p-1 rounded-xl border border-white/25 flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsPooledProfitMode(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isPooledProfitMode
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-emerald-100 hover:text-white'
                    }`}
                  >
                    {t.calculateIndividualProfit}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPooledProfitMode(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isPooledProfitMode
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-emerald-100 hover:text-white'
                    }`}
                  >
                    {t.calculatePooledProfit}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenPoolingModal}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>{t.connectWithFarmersBtn}</span>
                </button>
              )}

              {hasActivePool && onOpenPoolingModal && (
                <button
                  type="button"
                  onClick={onOpenPoolingModal}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold rounded-lg transition-colors cursor-pointer text-white"
                >
                  {t.editPoolBtn}
                </button>
              )}
            </div>
          </div>

          {/* Bulk Logistics Savings Indicator */}
          {hasActivePool && (
            <div className="mt-3 pt-2.5 border-t border-white/15 flex flex-wrap items-center justify-between text-xs">
              <span className="text-emerald-100 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {isPooledProfitMode
                    ? 'Displaying combined vehicle load and shared economics for all pooled farmers.'
                    : 'Showing your individual net cash after bulk shared truck savings.'}
                </span>
              </span>
              <span className="text-amber-300 font-extrabold">
                {activeCropPooledFarmers.map((f) => `${f.farmerName} (${f.quantity} Q)`).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Input Controls: Quantity & Vehicle Selection */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-5">
        {/* Quantity & Cultivation Controls */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <label htmlFor="harvest-quantity-slider" className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                {t.yourHarvestQuantity}
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="harvest-quantity-input"
                  type="number"
                  min={1}
                  max={500}
                  value={quantity}
                  onChange={(e) => handleUpdateQuantity(e.target.value)}
                  className="w-16 px-2 py-0.5 text-right text-xs sm:text-sm font-black bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-md shadow-2xs tabular-nums focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {t.quintalsUnit} ({(quantity * 100).toLocaleString('en-IN')} {t.kgUnit})
                </span>
              </div>
            </div>

            {/* Slider */}
            <input
              id="harvest-quantity-slider"
              type="range"
              min={5}
              max={150}
              step={1}
              value={quantity}
              onChange={(e) => handleUpdateQuantity(e.target.value)}
              className="w-full accent-emerald-700 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Quick Quantity Buttons */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick:</span>
            {quickQuantities.map((qty) => (
              <button
                key={qty}
                onClick={() => handleUpdateQuantity(qty)}
                className={`min-h-[32px] px-2.5 rounded-md text-xs font-semibold transition-colors border ${
                  quantity === qty
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {qty} {t.quintalsUnit ? t.quintalsUnit.slice(0, 4) : 'qtl'}
              </button>
            ))}
          </div>

          {/* Cost of Cultivation (Optional input) */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2">
            <label htmlFor="cultivation-cost-input" className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {t.costOfCultivationLabel}
            </label>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-500">₹</span>
              <input
                id="cultivation-cost-input"
                type="number"
                min={0}
                max={50000}
                step={50}
                value={cultivationCostPerQtl || ''}
                placeholder="0"
                onChange={(e) => {
                  const parsed = parseNumericValue(e.target.value);
                  setCultivationCostPerQtl(parsed >= 0 ? parsed : 0);
                }}
                className="w-20 px-2 py-0.5 text-right text-xs font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-600 tabular-nums"
              />
              <span className="text-[11px] text-slate-400 font-medium">/qtl</span>
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="md:col-span-6">
          <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
            {t.chooseVehicle}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {vehicleOptions.map((v) => {
              const isSelected = v.id === selectedVehicle;
              const vName =
                language === 'hi'
                  ? v.hindiName
                  : language === 'mr'
                  ? v.marathiName
                  : v.name;

              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`min-h-[46px] p-2 rounded-lg text-left flex items-center gap-2 transition-all border ${
                    isSelected
                      ? 'bg-white text-slate-950 ring-2 ring-emerald-600 border-emerald-600 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Truck className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <p className="text-xs font-bold truncate leading-tight">{vName}</p>
                    <p className="text-[10px] text-slate-500 tabular-nums">
                      ₹{parseNumericValue(v.costPerKm)}/km • Max {parseNumericValue(v.capacityQuintals)} {t.quintalsUnit}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 100km Same-State Mandi Network Banner */}
      <div className="mb-5 p-4 rounded-xl bg-linear-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-800 text-white uppercase tracking-wider">
                <Navigation className="w-3 h-3" />
                <span>&le; 100 KM MANDIS</span>
              </span>
              <span className="text-xs font-extrabold text-emerald-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                State: {currentState.name} ({currentState.nativeName})
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-950 mt-1.5 leading-snug">
              Displaying real APMC mandis located exclusively in <strong>{currentState.name}</strong> within 100 km of your selected state or GPS coordinates.
            </p>
          </div>

          {/* Radius Filter Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" />
              Radius:
            </span>
            {[
              { label: 'All (< 100 km)', val: 100 },
              { label: '< 50 km', val: 50 },
              { label: '< 30 km', val: 30 },
            ].map((rf) => {
              const count = crop.mandis.filter((m) => m.distanceKm <= rf.val).length;
              const isActive = radiusLimit === rf.val;
              return (
                <button
                  key={rf.val}
                  type="button"
                  onClick={() => setRadiusLimit(rf.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {rf.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decision Insight Pill if Far Mandi has deceptive rate */}
      {maxSavings > 500 && bestOption && (
        <div className="mb-5 p-3 sm:p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm leading-snug">
            <span className="font-bold text-emerald-900 mr-1">
              Smart Decision Insight:
            </span>
            <span>
              Selling at <strong>{bestOption.mandi.name}</strong> nets you{' '}
              <strong className="text-emerald-800 font-extrabold tabular-nums">
                {formatINR(maxSavings)} more cash in-hand
              </strong>{' '}
              after fuel deductions compared to travelling to far mandis!
            </span>
          </div>
        </div>
      )}

      {/* Side-by-Side Mandi Comparison Cards */}
      {comparisons.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 my-4">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="font-bold text-slate-800 text-sm">No mandis found within {radiusLimit} km</p>
          <p className="text-xs text-slate-600 mt-1">
            Click 'All (&lt; 100 km)' above to view all verified {currentState.name} mandis within the 100 km radius.
          </p>
          <button
            type="button"
            onClick={() => setRadiusLimit(100)}
            className="mt-3 px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors"
          >
            Show All (&lt; 100 km)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {comparisons.map((item) => {
            const isBest = bestOption && item.mandi.id === bestOption.mandi.id;

            return (
              <div
                key={item.mandi.id}
                className={`relative rounded-xl p-4 flex flex-col justify-between transition-all ${
                  isBest
                    ? isSunlightMode
                      ? 'bg-white ring-3 ring-slate-950 shadow-sm border-2 border-slate-950'
                      : 'bg-white ring-2 ring-emerald-600 border-emerald-600 shadow-xs'
                    : 'bg-white border border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Best In-Hand Profit Badge */}
                {isBest && (
                  <div className="absolute -top-2.5 left-3.5 inline-flex items-center gap-1 bg-emerald-700 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-2xs">
                    <Award className="w-3 h-3" />
                    <span>{t.bestProfitBadge}</span>
                  </div>
                )}

                <div>
                  {/* Mandi Name, Region & State */}
                  <div className="mt-1 mb-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                        {item.mandi.name}
                      </h3>
                      <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 tabular-nums">
                        {formatINR(item.mandi.ratePerQuintal)} / qtl
                      </span>
                    </div>

                    {/* Prominent Mandi Region and State Badges (Requirement: Display name, region & state of the mandi) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100/90 font-medium px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span>Region: <strong className="text-slate-900 font-bold">{item.mandi.region}</strong></span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100/90 font-medium px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        <Building2 className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span>State: <strong className="text-slate-900 font-bold">{item.mandi.state}</strong></span>
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 mt-2">
                      <Navigation className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>{item.mandi.distanceKm} km away ({item.roundTripKm} km round trip) • &le; 100 km limit</span>
                    </p>
                  </div>

                  {/* The Math Formula breakdown: Gross - Transport = Net Cash */}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                    {/* Gross Sale */}
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="font-medium">
                        {item.isPooledActive
                          ? `Group Gross (${cumulativeQuantity} qtl):`
                          : `${t.grossSale} (${quantity} qtl):`}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatINR(item.displayGrossSale)}
                      </span>
                    </div>

                    {/* Fuel / Transport Cost */}
                    <div className="flex items-center justify-between text-red-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Minus className="w-3 h-3" />
                        <span>
                          {item.isPooledActive
                            ? 'Pooled Shared Freight:'
                            : hasActivePool && isSmallYield
                            ? 'Your Shared Freight:'
                            : `${t.dieselTransportCost}:`}
                        </span>
                      </span>
                      <span className="font-bold tabular-nums">
                        -{formatINR(item.displayTransportCost)}
                      </span>
                    </div>

                    {/* Cost of Cultivation (if entered) */}
                    {item.displayCultivationCost > 0 && (
                      <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Minus className="w-3 h-3" />
                          <span>{t.costOfCultivationLabel}:</span>
                        </span>
                        <span className="font-bold tabular-nums">
                          -{formatINR(item.displayCultivationCost)}
                        </span>
                      </div>
                    )}

                    {/* Bulk Logistics Freight Savings Highlight */}
                    {hasActivePool && isSmallYield && item.freightSavings > 0 && (
                      <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{t.bulkPoolingSavings}:</span>
                        </span>
                        <span>+{formatINR(item.freightSavings)}</span>
                      </div>
                    )}

                    {/* Divider Line */}
                    <div className="border-t border-dashed border-slate-200 dark:border-slate-700 my-1" />

                    {/* Actual Net Cash In Hand */}
                    <div
                      className={`p-2.5 rounded-lg ${
                        isBest
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                          {item.isPooledActive ? 'Group Net Cash:' : t.actualNetCash}:
                        </span>
                        <span
                          className={`text-base sm:text-lg font-black tracking-tight tabular-nums ${
                            isBest ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {formatINR(item.displayNetCash)}
                        </span>
                      </div>

                      {/* User's individual share breakdown if viewing pooled group mode */}
                      {item.isPooledActive && (
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold mt-1">
                          Your individual net cut ({quantity} {t.quintalsUnit}): {formatINR(item.userPooledNetCash)}
                        </p>
                      )}

                      {isBest && maxSavings > 0 && (
                        <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          + {formatINR(maxSavings)} extra in your pocket!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mandi details footer: Buyers, Payment */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium">
                  <div>
                    <span className="text-slate-400 block">{t.paymentLabel}</span>
                    <span className="font-bold text-slate-700">{item.mandi.paymentTerms}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t.activeTradersLabel}</span>
                    <span className="font-bold text-slate-700">{item.mandi.buyerCount} {t.licensedTraders}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Page 3 Navigation Buttons */}
      {(onNavigateToDecision || onNavigateToWeather) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 mt-5">
          {onNavigateToDecision && (
            <button
              type="button"
              onClick={onNavigateToDecision}
              className="w-full sm:w-auto min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <span>{t.backToDecision}</span>
            </button>
          )}

          {onNavigateToWeather && (
            <button
              type="button"
              id="proceed-to-weather-btn"
              onClick={onNavigateToWeather}
              className="w-full sm:w-auto min-h-[48px] px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>{t.proceedToWeather}</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
