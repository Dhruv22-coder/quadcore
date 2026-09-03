import React, { useState } from 'react';
import { CropData, Language } from '../types';
import { translations, formatINR } from '../lib/utils';
import {
  MessageSquare,
  Volume2,
  VolumeX,
  PhoneCall,
  Share2,
  WifiOff,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface OfflineAccessibilityBannerProps {
  crop: CropData;
  language: Language;
  onPlayAudio: () => void;
  isAudioPlaying: boolean;
  isSunlightMode: boolean;
}

export const OfflineAccessibilityBanner: React.FC<OfflineAccessibilityBannerProps> = ({
  crop,
  language,
  onPlayAudio,
  isAudioPlaying,
  isSunlightMode,
}) => {
  const [smsSentNotice, setSmsSentNotice] = useState(false);
  const t = translations[language];

  // Format SMS body for Indian farmer devices
  const smsBody = encodeURIComponent(
    `MandiMitra Alert for ${crop.name} (${crop.hindiName}):\n` +
      `Highest Rate: Rs ${crop.currentPrice}/quintal at ${crop.mandis[0].name} (${crop.mandis[0].region}, ${crop.mandis[0].state}).\n` +
      `Verdict: ${crop.decision.actionTitle} - ${crop.decision.actionSubtitle}.\n` +
      `Helpline: 1800-889-2040 (Free Audio Call).`
  );

  const smsHref = `sms:?body=${smsBody}`;

  const shareText = encodeURIComponent(
    `🌾 MandiMitra Mandi Rate Today:\n` +
      `Crop: ${crop.name} (${crop.hindiName})\n` +
      `Best Rate: Rs ${crop.currentPrice}/qtl\n` +
      `Verdict: ${crop.decision.actionTitle} (${crop.decision.actionSubtitle})\n` +
      `Check in-hand net cash calculator: https://mandimitra.in`
  );

  const whatsappHref = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <section
      id="offline-accessibility-banner"
      className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-2xs"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left info column */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-emerald-400 border border-slate-700 mb-2">
            <WifiOff className="w-3 h-3" />
            <span>{t.lowInternetBadge}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
            {t.offlineBannerTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5 leading-relaxed">
            {language === 'hi'
              ? `आज का ${crop.name} (${crop.hindiName}) भाव और सलाह सीधे किसी भी फोन पर एसएमएस, मुफ्त मिस्ड कॉल या व्हाट्सएप से प्राप्त करें।`
              : language === 'mr'
              ? `आजचा ${crop.name} दर आणि सल्ला थेट कोणत्याही फोनवर एसएमएस, मोफत मिस्ड कॉल किंवा व्हॉट्सअॅपद्वारे मिळवा.`
              : `Get today’s ${crop.name} rate and advisory delivered straight to any phone via SMS, free automated voice missed call, or WhatsApp.`}
          </p>

          {/* Toll Free Missed Call Pill */}
          <div className="mt-3.5 flex flex-wrap items-center gap-3 bg-slate-800/60 rounded-xl p-2.5 sm:p-3 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {t.missedCallTitle}
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.2 rounded font-semibold">
                  {t.tollFree}
                </span>
              </div>
              <a
                href="tel:18008892040"
                className="text-base sm:text-lg font-bold text-white hover:text-emerald-300 tracking-wide block transition-colors tabular-nums"
              >
                {t.missedCallNumber}
              </a>
              <p className="text-[11px] text-slate-400 font-normal">
                {t.missedCallDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Right action buttons column (Touch targets >= 44px) */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
          {/* Native SMS button */}
          <a
            id="send-sms-button"
            href={smsHref}
            onClick={() => setSmsSentNotice(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs"
          >
            <MessageSquare className="w-4 h-4 stroke-[2]" />
            <span>{t.sendSmsBtn}</span>
          </a>

          {/* Play Audio Pill */}
          <button
            id="banner-play-audio-btn"
            onClick={onPlayAudio}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all border active:scale-95 ${
              isAudioPlaying
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{t.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>{t.playAudioBtn}</span>
              </>
            )}
          </button>

          {/* Share on WhatsApp */}
          <a
            id="share-whatsapp-btn"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{t.shareWithKisanGroup}</span>
          </a>
        </div>
      </div>

      {smsSentNotice && (
        <div className="mt-2.5 text-center text-xs text-emerald-400 font-medium">
          {t.smsPrefilledNotice}
        </div>
      )}
    </section>
  );
};
