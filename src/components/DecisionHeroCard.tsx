import React, { useState } from 'react';
import { CropData, Language } from '../types';
import { translations, formatINR } from '../lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Pause,
  AlertTriangle,
  Volume2,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  CloudRain,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Layers,
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
}

export const DecisionHeroCard: React.FC<DecisionHeroCardProps> = ({
  crop,
  language,
  onPlayAudio,
  isAudioPlaying,
  isSunlightMode,
}) => {
  const [showDetailedGraph, setShowDetailedGraph] = useState(false);
  const t = translations[language];

  const signal = crop.decision.signal;
  const isGreen = signal === 'green';
  const isAmber = signal === 'amber';
  const isRed = signal === 'red';

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
          isGreen
            ? 'bg-emerald-600'
            : isAmber
            ? 'bg-amber-400'
            : 'bg-red-600'
        }`}
      />

      {/* Top Header Row: Signal Badge, Confidence & Audio Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5 mb-4">
        {/* Traffic-Light Status Pill */}
        <div className="flex items-center gap-2">
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
        </div>

        {/* Hero Audio Button for One-Tap Spoken Verdict */}
        <button
          id="hero-play-audio-btn"
          onClick={onPlayAudio}
          className={`min-h-[44px] px-3.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 border ${
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
              isRed
                ? 'bg-red-50 border-red-200 text-red-900'
                : isAmber
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            {isRed ? (
              <CloudRain className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block">
                {isRed ? 'Weather & Storage Risk Warning' : 'Market Intelligence'}
              </span>
              <p className="mt-0.5 leading-snug font-medium text-slate-700 text-xs">
                {crop.decision.riskFactor}
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
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg transition-colors select-none"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.sevenDayTrend}</span>
            {showDetailedGraph ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <span className="text-[10px] font-medium text-slate-400">
            Agmarknet & APMC Feed
          </span>
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
      </div>
    </section>
  );
};
