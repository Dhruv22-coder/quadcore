import React, { useState } from 'react';
import { CropData, Language, VehicleType } from '../types';
import { vehicleOptions } from '../data/cropsData';
import { translations, formatINR } from '../lib/utils';
import { CropImage } from '../data/cropImages';
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
} from 'lucide-react';

interface LogisticsComparisonProps {
  crop: CropData;
  language: Language;
  isSunlightMode: boolean;
  onNavigateToDecision?: () => void;
  onNavigateToWeather?: () => void;
}

export const LogisticsComparison: React.FC<LogisticsComparisonProps> = ({
  crop,
  language,
  isSunlightMode,
  onNavigateToDecision,
  onNavigateToWeather,
}) => {
  const [quantity, setQuantity] = useState<number>(40); // default 40 quintals (~ 1 tractor or pickup load)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('pickup');

  const t = translations[language];
  const vehicle = vehicleOptions.find((v) => v.id === selectedVehicle) || vehicleOptions[0];

  // Calculate comparisons for each mandi
  const comparisons = crop.mandis.map((mandi) => {
    const grossSale = mandi.ratePerQuintal * quantity;
    // Round trip distance (to mandi and back to village)
    const roundTripKm = mandi.distanceKm * 2;
    // Transport / fuel cost
    const transportCost = Math.round(roundTripKm * vehicle.costPerKm);
    const netCash = grossSale - transportCost;

    return {
      mandi,
      grossSale,
      roundTripKm,
      transportCost,
      netCash,
    };
  });

  // Sort by netCash descending to identify best profit
  const bestOption = [...comparisons].sort((a, b) => b.netCash - a.netCash)[0];
  const worstOption = [...comparisons].sort((a, b) => a.netCash - b.netCash)[0];
  const maxSavings = bestOption.netCash - worstOption.netCash;

  const quickQuantities = [15, 30, 50, 100];

  return (
    <section
      id="logistics-comparison-section"
      className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs"
    >
      {/* Module Title & Subtitle with Active Crop Visual Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
              <IndianRupee className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
              {t.netProfitTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {t.netProfitSubtitle}
          </p>
        </div>

        {/* Active Crop HD Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
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
            <span className="font-extrabold text-slate-900 block leading-tight">
              {crop.name} ({crop.regionalNames?.[language] || crop.hindiName})
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">
              Rate: ₹{crop.currentPrice.toLocaleString('en-IN')}/qtl
            </span>
          </div>
        </div>
      </div>

      {/* Input Controls: Quantity & Vehicle Selection */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 mb-5">
        {/* Quantity Controls */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="harvest-quantity-slider" className="text-xs sm:text-sm font-bold text-slate-700">
                {t.yourHarvestQuantity}
              </label>
              <span className="text-xs sm:text-sm font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs tabular-nums">
                {quantity} Quintals ({quantity * 100} kg)
              </span>
            </div>

            {/* Slider */}
            <input
              id="harvest-quantity-slider"
              type="range"
              min={5}
              max={150}
              step={5}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Quick Quantity Buttons */}
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick:</span>
            {quickQuantities.map((qty) => (
              <button
                key={qty}
                onClick={() => setQuantity(qty)}
                className={`min-h-[32px] px-2.5 rounded-md text-xs font-semibold transition-colors border ${
                  quantity === qty
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {qty} qtl
              </button>
            ))}
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
                      ₹{v.costPerKm}/km • Max {v.capacityQuintals} qtl
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decision Insight Pill if Far Mandi has deceptive rate */}
      {maxSavings > 500 && (
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {comparisons.map((item) => {
          const isBest = item.mandi.id === bestOption.mandi.id;

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
                {/* Mandi Name & Location */}
                <div className="flex items-start justify-between gap-2 mt-1 mb-2">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                      {item.mandi.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Navigation className="w-3 h-3 text-slate-400" />
                      {item.mandi.distanceKm} km away ({item.roundTripKm} km round trip)
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 tabular-nums">
                    {formatINR(item.mandi.ratePerQuintal)} / qtl
                  </span>
                </div>

                {/* The Math Formula breakdown: Gross - Fuel = Net */}
                <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                  {/* Gross Sale */}
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium">{t.grossSale} ({quantity} qtl):</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatINR(item.grossSale)}
                    </span>
                  </div>

                  {/* Fuel / Transport Cost */}
                  <div className="flex items-center justify-between text-red-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Minus className="w-3 h-3" />
                      <span>{t.dieselTransportCost}:</span>
                    </span>
                    <span className="font-bold tabular-nums">
                      -{formatINR(item.transportCost)}
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t border-dashed border-slate-200 my-1" />

                  {/* Actual Net Cash In Hand */}
                  <div
                    className={`p-2.5 rounded-lg ${
                      isBest ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                        {t.actualNetCash}:
                      </span>
                      <span
                        className={`text-base sm:text-lg font-black tracking-tight tabular-nums ${
                          isBest ? 'text-emerald-900' : 'text-slate-900'
                        }`}
                      >
                        {formatINR(item.netCash)}
                      </span>
                    </div>

                    {isBest && maxSavings > 0 && (
                      <p className="text-[10px] font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
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
                  <span className="text-slate-400 block">Payment</span>
                  <span className="font-bold text-slate-700">{item.mandi.paymentTerms}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Active Traders</span>
                  <span className="font-bold text-slate-700">{item.mandi.buyerCount} licensed</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Page 3 Navigation Buttons */}
      {(onNavigateToDecision || onNavigateToWeather) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 mt-5">
          {onNavigateToDecision && (
            <button
              type="button"
              onClick={onNavigateToDecision}
              className="w-full sm:w-auto min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <span>⬅️ 2. आज का निर्णय (Back to Decision)</span>
            </button>
          )}

          {onNavigateToWeather && (
            <button
              type="button"
              id="proceed-to-weather-btn"
              onClick={onNavigateToWeather}
              className="w-full sm:w-auto min-h-[48px] px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>4. मौसम व भंडारण सुरक्षा (Weather & Safe Storage) ➡️</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
