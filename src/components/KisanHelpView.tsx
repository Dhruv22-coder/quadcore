import React, { useState } from 'react';
import { CropData, Language } from '../types';
import { formatINR } from '../lib/utils';
import {
  PhoneCall,
  MessageSquare,
  Share2,
  Smartphone,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  Wheat,
  ExternalLink,
} from 'lucide-react';

interface KisanHelpViewProps {
  crop: CropData;
  language: Language;
  isSunlightMode?: boolean;
  onToggleSunlightMode?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onNavigateToWeather: () => void;
  onNavigateToCrops: () => void;
}

export const KisanHelpView: React.FC<KisanHelpViewProps> = ({
  crop,
  language,
  isSunlightMode = false,
  onToggleSunlightMode,
  isDarkMode = false,
  onToggleDarkMode,
  onNavigateToWeather,
  onNavigateToCrops,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const regionalName = crop.regionalNames?.[language] || crop.hindiName;

  // SMS Body for basic keypad phones
  const smsBody = encodeURIComponent(
    `MandiMitra Mandi Bhav:\n` +
      `Fasal: ${crop.name} (${regionalName})\n` +
      `Bhav: Rs ${crop.currentPrice}/qtl at ${crop.mandis[0].name}\n` +
      `Advisory: ${crop.decision.actionTitle}\n` +
      `Helpline: 1800-180-1551`
  );

  // WhatsApp Share Text
  const shareText = encodeURIComponent(
    `🌾 *MandiMitra Mandi Rate Today* 🌾\n` +
      `Crop: *${crop.name}* (${regionalName})\n` +
      `Highest Rate: *₹${crop.currentPrice}* / quintal (${crop.mandis[0].name}, ${crop.mandis[0].region}, ${crop.mandis[0].state})\n` +
      `Advisory: *${crop.decision.actionTitle}* - ${crop.decision.actionSubtitle}\n` +
      `Calculate real in-hand net cash after diesel: https://mandimitra.in`
  );

  const handleCopyUssd = () => {
    navigator.clipboard.writeText('*99*7762#');
    setCopiedText('USSD code copied! Dial *99*7762# on any phone.');
    setTimeout(() => setCopiedText(null), 4000);
  };

  return (
    <div id="kisan-help-page" className="space-y-5">
      {/* 1. Header Card */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                Page 5 of 5
              </span>
              <span className="text-xs text-slate-500 font-bold">
                Assistance & Offline Support
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Kisan Helpline & Offline Support
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              मुफ्त किसान कॉल सेंटर, एसएमएस मंडी भाव व बिना इंटरनेट ऑफलाइन सेवाएं
            </p>
          </div>
        </div>

        {/* 2. Direct One-Tap Call Cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* National Kisan Call Center */}
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  Govt of India (Free Toll-Free)
                </span>
                <PhoneCall className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-base font-black text-emerald-950 mt-2">
                Kisan Call Center (किसान कॉल सेंटर)
              </h3>
              <p className="text-xs text-emerald-900/90 font-medium mt-1 leading-snug">
                Connect with agricultural scientists in 22 regional languages. Open 6:00 AM – 10:00 PM every day.
              </p>
            </div>

            <a
              href="tel:18001801551"
              className="mt-4 min-h-[44px] px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 1800-180-1551 (मुफ्त कॉल)</span>
            </a>
          </div>

          {/* MandiMitra Interactive Audio Line */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 bg-slate-800 px-2 py-0.5 rounded">
                  24x7 Automated Voice Line
                </span>
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-black text-white mt-2">
                MandiMitra Audio Bhav Line
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                Give a missed call or call directly to hear today’s {crop.name} APMC rates read out in your regional dialect.
              </p>
            </div>

            <a
              href="tel:18008892040"
              className="mt-4 min-h-[44px] px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>Call 1800-889-2040</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. SMS & WhatsApp Instant Alerts */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-700" />
          <span>Share & Save Mandi Rates for Low Connectivity</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* SMS for Keypad phones */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase block">
              Feature & Keypad Phones (बिना इंटरनेट)
            </span>
            <p className="text-xs text-slate-700 font-medium mt-1">
              Send today’s {crop.name} price summary as a standard SMS to your own phone or another farmer.
            </p>
            <a
              href={`sms:?body=${smsBody}`}
              className="mt-3 inline-flex items-center justify-center gap-2 w-full min-h-[42px] px-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send SMS (एसएमएस भेजें)</span>
            </a>
          </div>

          {/* WhatsApp Farmer Group Share */}
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase block">
              Farmer WhatsApp Groups (व्हाट्सएप ग्रुप)
            </span>
            <p className="text-xs text-slate-700 font-medium mt-1">
              Share the mandi rates and in-hand net cash analysis with your village farmers cooperative.
            </p>
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-2 w-full min-h-[42px] px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to WhatsApp Group</span>
            </a>
          </div>
        </div>

        {/* USSD Code Section */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
              <span>Offline USSD Service (बिना इंटरनेट कोड)</span>
            </div>
            <p className="text-xs text-amber-950 font-medium mt-0.5">
              Dial <strong className="font-mono font-bold">*99*7762#</strong> on any 2G phone to receive instant APMC rate via SMS flash.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyUssd}
            className="min-h-[38px] px-3 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold cursor-pointer shrink-0 transition-colors"
          >
            {copiedText ? '✓ Copied!' : 'Copy Code (*99*7762#)'}
          </button>
        </div>

        {/* Sunlight Mode Helper */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block">
                Outdoor Sunlight Mode (तेज धूप मोड)
              </span>
              <span className="text-xs text-slate-600 font-medium">
                Increases text contrast and black borders for easy reading under direct farm sunlight.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleSunlightMode}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0 ${
              isSunlightMode
                ? 'bg-amber-400 text-slate-950 border-amber-500 font-black'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {isSunlightMode ? '☀️ High Contrast ON' : 'Turn Sunlight Mode ON'}
          </button>
        </div>
      </section>

      {/* 4. Bottom Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onNavigateToWeather}
          className="w-full sm:w-auto min-h-[48px] px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>⬅️ 4. मौसम व भंडारण (Back to Weather)</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToCrops}
          className="w-full sm:w-auto min-h-[48px] px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Wheat className="w-4 h-4" />
          <span>1. दूसरी फसल चुनें (Check Another Crop)</span>
        </button>
      </div>
    </div>
  );
};
