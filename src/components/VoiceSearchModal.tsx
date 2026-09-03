import React, { useEffect, useState } from 'react';
import { CropData, Language } from '../types';
import { translations } from '../lib/utils';
import { Mic, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { CropIcon } from './CropIcons';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: CropData[];
  onSelectCrop: (cropId: string) => void;
  language: Language;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  crops,
  onSelectCrop,
  language,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [matchingCrop, setMatchingCrop] = useState<CropData | null>(null);

  const t = translations[language];

  // Map language code to Web Speech BCP 47 tag
  const getSpeechLangTag = (lang: Language): string => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'gu': return 'gu-IN';
      case 'pa': return 'pa-IN';
      case 'bn': return 'bn-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'kn': return 'kn-IN';
      case 'ml': return 'ml-IN';
      case 'ur': return 'ur-IN';
      default: return 'en-IN';
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setRecognizedText('');
      setMatchingCrop(null);
      return;
    }

    setIsListening(true);
    let recognition: any = null;

    if (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getSpeechLangTag(language);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setRecognizedText(transcript);
        matchCrop(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition start error:', err);
      }
    } else {
      const timer = setTimeout(() => {
        setIsListening(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (_) {}
      }
    };
  }, [isOpen, language]);

  const matchCrop = (text: string) => {
    const clean = text.toLowerCase().trim();
    const found = crops.find((c) => {
      const reg = c.regionalNames?.[language]?.toLowerCase() || '';
      return (
        clean.includes(c.name.toLowerCase()) ||
        clean.includes(c.hindiName.toLowerCase()) ||
        clean.includes(c.marathiName.toLowerCase()) ||
        (reg && clean.includes(reg)) ||
        (clean.includes('pyaaz') && c.id === 'onion') ||
        (clean.includes('kanda') && c.id === 'onion') ||
        (clean.includes('tamatar') && c.id === 'tomato') ||
        (clean.includes('aalu') && c.id === 'potato') ||
        (clean.includes('batata') && c.id === 'potato') ||
        (clean.includes('gehun') && c.id === 'wheat') ||
        (clean.includes('gehu') && c.id === 'wheat') ||
        (clean.includes('chawal') && c.id === 'paddy') ||
        (clean.includes('dhan') && c.id === 'paddy') ||
        (clean.includes('makka') && c.id === 'maize') ||
        (clean.includes('kapas') && c.id === 'cotton') ||
        (clean.includes('ganna') && c.id === 'sugarcane') ||
        (clean.includes('sarson') && c.id === 'mustard') ||
        (clean.includes('mungfali') && c.id === 'groundnut') ||
        (clean.includes('lahsun') && c.id === 'garlic') ||
        (clean.includes('haldi') && c.id === 'turmeric')
      );
    });

    if (found) {
      setMatchingCrop(found);
    }
  };

  const handleManualVoicePick = (crop: CropData) => {
    setRecognizedText(crop.regionalNames?.[language] || crop.hindiName);
    setMatchingCrop(crop);
    setTimeout(() => {
      onSelectCrop(crop.id);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 flex flex-col items-center text-center max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Close voice search"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Pulsing Mic Graphic */}
        <div className="relative my-3">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-emerald-700 text-white shadow-md ring-4 ring-emerald-100 animate-pulse'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Mic className="w-8 h-8 stroke-[2.2]" />
          </div>

          {isListening && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Listening...
            </div>
          )}
        </div>

        {/* Prompt Titles */}
        <h3 className="text-lg font-bold text-slate-950 tracking-tight mt-1">
          {isListening ? t.speakCropName : t.voiceSearch}
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {isListening
            ? t.speakCropName
            : 'Tap any crop below or try speaking again'}
        </p>

        {/* Recognized Transcript or Match */}
        {recognizedText && (
          <div className="mt-3.5 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 w-full text-xs font-bold text-emerald-900 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Heard: "{recognizedText}"</span>
          </div>
        )}

        {matchingCrop && (
          <div className="mt-3.5 w-full p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-left">
              <CropIcon id={matchingCrop.id} className="w-8 h-8" />
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  {matchingCrop.regionalNames?.[language] || matchingCrop.name}
                </span>
                <span className="text-xs text-emerald-800 font-bold tabular-nums">
                  ₹{matchingCrop.currentPrice.toLocaleString('en-IN')}/quintal
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectCrop(matchingCrop.id);
                onClose();
              }}
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs hover:bg-emerald-800"
            >
              Select
            </button>
          </div>
        )}

        {/* Quick Speak Shortcuts */}
        <div className="mt-5 w-full pt-3.5 border-t border-slate-200">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Or tap any crop to select:
          </p>
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
            {crops.map((crop) => {
              const label = crop.regionalNames?.[language] || crop.hindiName || crop.name;
              return (
                <button
                  key={crop.id}
                  onClick={() => handleManualVoicePick(crop)}
                  className="min-h-[44px] p-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <CropIcon id={crop.id} className="w-4 h-4 shrink-0" />
                  <span className="truncate">{label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
