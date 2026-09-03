import React, { useEffect, useState } from 'react';
import { ActivePage, CropData, Language } from '../types';
import { translations, formatINR } from '../lib/utils';
import { NAV_TRANSLATIONS } from '../data/navigationTranslations';
import { Mic, X, Sparkles, CheckCircle2, Navigation, ArrowRight } from 'lucide-react';
import { CropIcon } from './CropIcons';
import { CropImage } from '../data/cropImages';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: CropData[];
  onSelectCrop: (cropId: string) => void;
  language: Language;
  onNavigatePage?: (page: ActivePage) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  crops,
  onSelectCrop,
  language,
  onNavigatePage,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [matchingCrop, setMatchingCrop] = useState<CropData | null>(null);
  const [matchedNav, setMatchedNav] = useState<{ page: ActivePage; label: string } | null>(null);

  const t = translations[language];
  const navTexts = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.en;

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
      setMatchedNav(null);
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
        handleSpeechTranscript(transcript);
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

  const handleSpeechTranscript = (text: string) => {
    const clean = text.toLowerCase().trim();

    // 1. Check for navigation voice commands
    if (onNavigatePage) {
      if (clean.includes('profit') || clean.includes('munafa') || clean.includes('calculator') || clean.includes('hisab') || clean.includes('nafa')) {
        setMatchedNav({ page: 'profit', label: '3. Profit Calculator' });
        setTimeout(() => {
          onNavigatePage('profit');
          onClose();
        }, 500);
        return;
      }
      if (clean.includes('weather') || clean.includes('mausam') || clean.includes('havaman') || clean.includes('barish') || clean.includes('rain')) {
        setMatchedNav({ page: 'weather', label: '4. Weather & Storage' });
        setTimeout(() => {
          onNavigatePage('weather');
          onClose();
        }, 500);
        return;
      }
      if (clean.includes('help') || clean.includes('sahayata') || clean.includes('madad') || clean.includes('madat') || clean.includes('helpline')) {
        setMatchedNav({ page: 'help', label: '5. Kisan Helpline' });
        setTimeout(() => {
          onNavigatePage('help');
          onClose();
        }, 500);
        return;
      }
      if (clean.includes('decision') || clean.includes('faisla') || clean.includes('faishla') || clean.includes('nirnay') || clean.includes('bhav')) {
        setMatchedNav({ page: 'decision', label: '2. Sell/Store Decision' });
        setTimeout(() => {
          onNavigatePage('decision');
          onClose();
        }, 500);
        return;
      }
      if (clean.includes('crop') || clean.includes('crops') || clean.includes('fasal') || clean.includes('sabzi')) {
        setMatchedNav({ page: 'crops', label: '1. Crops Directory' });
        setTimeout(() => {
          onNavigatePage('crops');
          onClose();
        }, 500);
        return;
      }
    }

    // 2. Otherwise match crop names
    matchCrop(clean);
  };

  const matchCrop = (clean: string) => {
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

  const handleNavPick = (page: ActivePage) => {
    if (onNavigatePage) {
      onNavigatePage(page);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close voice search"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Pulsing Mic Graphic */}
        <div className="relative my-3">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-emerald-700 text-white shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
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
        <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight mt-1">
          {isListening ? (t.speakCropName || 'Bol Kar Khojein') : (t.voiceSearch || 'Voice Search')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          {isListening
            ? 'Speak crop name (e.g., "Pyaaz", "Tomato") or tab (e.g., "Profit", "Weather")'
            : 'Tap any crop below or try speaking again'}
        </p>

        {/* Recognized Transcript or Match */}
        {recognizedText && (
          <div className="mt-3.5 p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 w-full text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Heard: "{recognizedText}"</span>
          </div>
        )}

        {/* Matched Navigation Command */}
        {matchedNav && (
          <div className="mt-3.5 w-full p-3 bg-emerald-100/70 dark:bg-emerald-950/80 rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-left animate-in zoom-in-95">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-700 dark:text-emerald-400 animate-spin" />
              <span className="text-xs font-black text-emerald-950 dark:text-emerald-100">
                Opening {matchedNav.label}...
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Navigating</span>
          </div>
        )}

        {/* Matched Crop */}
        {matchingCrop && (
          <div className="mt-3.5 w-full p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 bg-white">
                <CropImage
                  id={matchingCrop.id}
                  name={matchingCrop.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  fallbackIconClassName="w-6 h-6"
                />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {matchingCrop.regionalNames?.[language] || matchingCrop.name}
                </span>
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold tabular-nums">
                  {formatINR(matchingCrop.currentPrice)}/quintal
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectCrop(matchingCrop.id);
                onClose();
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs cursor-pointer"
            >
              Select
            </button>
          </div>
        )}

        {/* Quick Speak Shortcuts */}
        <div className="mt-5 w-full pt-3.5 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Quick Navigation by Voice or Tap:
          </p>
          <div className="flex items-center justify-center gap-1.5 flex-wrap mb-3">
            {[
              { id: 'crops' as ActivePage, label: `1. ${navTexts.navItems.crops.label}` },
              { id: 'decision' as ActivePage, label: `2. ${navTexts.navItems.decision.label}` },
              { id: 'profit' as ActivePage, label: `3. ${navTexts.navItems.profit.label}` },
              { id: 'weather' as ActivePage, label: `4. ${navTexts.navItems.weather.label}` },
              { id: 'help' as ActivePage, label: `5. ${navTexts.navItems.help.label}` },
            ].map((nav) => (
              <button
                key={nav.id}
                type="button"
                onClick={() => handleNavPick(nav.id)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
              >
                {nav.label}
              </button>
            ))}
          </div>

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Or tap any crop to select:
          </p>
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
            {crops.map((crop) => {
              const label = crop.regionalNames?.[language] || crop.hindiName || crop.name;
              return (
                <button
                  key={crop.id}
                  onClick={() => handleManualVoicePick(crop)}
                  className="min-h-[40px] p-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                    <CropImage
                      id={crop.id}
                      name={crop.name}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                      fallbackIconClassName="w-4 h-4"
                    />
                  </div>
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
