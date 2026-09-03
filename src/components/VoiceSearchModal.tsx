import React, { useEffect, useState, useRef } from 'react';
import { ActivePage, CropData, Language } from '../types';
import { translations, formatINR, speakText } from '../lib/utils';
import { NAV_TRANSLATIONS } from '../data/navigationTranslations';
import { Mic, X, Sparkles, CheckCircle2, Navigation, AlertCircle, RotateCcw } from 'lucide-react';
import { CropImage } from '../data/cropImages';
import { matchCropFromVoiceTranscript, normalizeTranscript } from '../lib/cropMatching';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: CropData[];
  onSelectCrop: (cropId: string, cropName?: string) => void;
  language: Language;
  onNavigatePage?: (page: ActivePage) => void;
  onUpdateSearchInput?: (cropName: string) => void;
  onFeedbackToast?: (message: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  crops,
  onSelectCrop,
  language,
  onNavigatePage,
  onUpdateSearchInput,
  onFeedbackToast,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [matchingCrop, setMatchingCrop] = useState<CropData | null>(null);
  const [matchedNav, setMatchedNav] = useState<{ page: ActivePage; label: string } | null>(null);
  const [unrecognizedFeedback, setUnrecognizedFeedback] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const hasHandledMatchRef = useRef(false);

  const t = translations[language];
  const navTexts = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.en;

  // Map language code to Web Speech BCP 47 tag
  const getSpeechLangTag = (lang: Language): string => {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'mr':
        return 'mr-IN';
      case 'gu':
        return 'gu-IN';
      case 'pa':
        return 'pa-IN';
      case 'bn':
        return 'bn-IN';
      case 'ta':
        return 'ta-IN';
      case 'te':
        return 'te-IN';
      case 'kn':
        return 'kn-IN';
      case 'ml':
        return 'ml-IN';
      case 'ur':
        return 'ur-IN';
      default:
        return 'en-IN';
    }
  };

  const getUnrecognizedMessage = (): string => {
    switch (language) {
      case 'hi':
        return "फसल पहचानी नहीं गई, कृपया पुनः प्रयास करें (उदा. 'प्याज' या 'टमाटर' कहें)";
      case 'mr':
        return "पीक ओळखले गेले नाही, कृपया पुन्हा प्रयत्न करा (उदा. 'कांदा' किंवा 'टोमॅटो' म्हणा)";
      default:
        return "Crop not recognized, please try again (e.g., say 'Pyaz' or 'Tomato')";
    }
  };

  const startListeningSession = () => {
    hasHandledMatchRef.current = false;
    setMatchingCrop(null);
    setMatchedNav(null);
    setUnrecognizedFeedback(null);
    setRecognizedText('');

    if (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (_) {}
        }

        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 3;
        recognition.lang = getSpeechLangTag(language);

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }

          if (currentTranscript) {
            setRecognizedText(currentTranscript);
            handleSpeechTranscript(currentTranscript, event.results[0].isFinal);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event?.error);
          setIsListening(false);
          if (!hasHandledMatchRef.current && event?.error !== 'aborted') {
            triggerUnrecognizedFeedback();
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          // If ended without any match having occurred and with some recognized text
          if (!hasHandledMatchRef.current) {
            triggerUnrecognizedFeedback();
          }
        };

        recognition.start();
      } catch (err) {
        console.warn('Speech recognition start error:', err);
        setIsListening(false);
      }
    } else {
      setIsListening(false);
      setUnrecognizedFeedback('Speech recognition is not supported in this browser. Please tap any crop below.');
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setRecognizedText('');
      setMatchingCrop(null);
      setMatchedNav(null);
      setUnrecognizedFeedback(null);
      hasHandledMatchRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      return;
    }

    startListeningSession();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [isOpen, language]);

  const triggerUnrecognizedFeedback = () => {
    if (hasHandledMatchRef.current) return;
    const msg = getUnrecognizedMessage();
    setUnrecognizedFeedback(msg);
    onFeedbackToast?.(msg);
    // Optional brief audio feedback
    try {
      speakText(msg, language);
    } catch (_) {}
  };

  const handleSpeechTranscript = (rawText: string, isFinal: boolean = false) => {
    if (hasHandledMatchRef.current) return;

    const clean = normalizeTranscript(rawText);
    if (!clean) return;

    // 1. Check for navigation voice commands
    if (onNavigatePage) {
      if (
        clean.includes('profit') ||
        clean.includes('munafa') ||
        clean.includes('calculator') ||
        clean.includes('hisab') ||
        clean.includes('nafa')
      ) {
        hasHandledMatchRef.current = true;
        setMatchedNav({ page: 'profit', label: '3. Profit Calculator' });
        setTimeout(() => {
          onNavigatePage('profit');
          onClose();
        }, 400);
        return;
      }
      if (
        clean.includes('weather') ||
        clean.includes('mausam') ||
        clean.includes('havaman') ||
        clean.includes('barish') ||
        clean.includes('rain')
      ) {
        hasHandledMatchRef.current = true;
        setMatchedNav({ page: 'weather', label: '4. Weather & Storage' });
        setTimeout(() => {
          onNavigatePage('weather');
          onClose();
        }, 400);
        return;
      }
      if (
        clean.includes('help') ||
        clean.includes('sahayata') ||
        clean.includes('madad') ||
        clean.includes('madat') ||
        clean.includes('helpline')
      ) {
        hasHandledMatchRef.current = true;
        setMatchedNav({ page: 'help', label: '5. Kisan Helpline' });
        setTimeout(() => {
          onNavigatePage('help');
          onClose();
        }, 400);
        return;
      }
      if (
        clean.includes('decision') ||
        clean.includes('faisla') ||
        clean.includes('faishla') ||
        clean.includes('nirnay') ||
        clean.includes('bhav')
      ) {
        hasHandledMatchRef.current = true;
        setMatchedNav({ page: 'decision', label: '2. Sell/Store Decision' });
        setTimeout(() => {
          onNavigatePage('decision');
          onClose();
        }, 400);
        return;
      }
      if (
        clean.includes('crop') ||
        clean.includes('crops') ||
        clean.includes('fasal') ||
        clean.includes('sabzi')
      ) {
        hasHandledMatchRef.current = true;
        setMatchedNav({ page: 'crops', label: '1. Crops Directory' });
        setTimeout(() => {
          onNavigatePage('crops');
          onClose();
        }, 400);
        return;
      }
    }

    // 2. Multilingual & phonetic crop matching across all 32 crops
    const matchResult = matchCropFromVoiceTranscript(rawText, crops);

    if (matchResult) {
      hasHandledMatchRef.current = true;
      const { crop } = matchResult;

      setMatchingCrop(crop);
      setUnrecognizedFeedback(null);

      // Stop speech recognition immediately
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      // Execute Action on Match:
      // 1. Automatically set the matched crop as active in state
      onSelectCrop(crop.id, crop.name);

      // 2. Update the search bar input with the crop name
      onUpdateSearchInput?.(crop.name);

      // 3. Immediately navigate/switch directly to the "2. Decision" page
      if (onNavigatePage) {
        onNavigatePage('decision');
      }

      // Briefly keep card visible (400ms) for high-confidence visual feedback, then close
      setTimeout(() => {
        onClose();
      }, 450);
    } else if (isFinal) {
      // If speech finished and no match was recognized
      triggerUnrecognizedFeedback();
    }
  };

  const handleManualVoicePick = (crop: CropData) => {
    hasHandledMatchRef.current = true;
    setRecognizedText(crop.regionalNames?.[language] || crop.hindiName || crop.name);
    setMatchingCrop(crop);
    setUnrecognizedFeedback(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
    }

    onSelectCrop(crop.id, crop.name);
    onUpdateSearchInput?.(crop.name);
    if (onNavigatePage) {
      onNavigatePage('decision');
    }

    setTimeout(() => {
      onClose();
    }, 250);
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
          <button
            type="button"
            onClick={startListeningSession}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-emerald-700 text-white shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950 animate-pulse'
                : 'bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 text-slate-700 hover:text-emerald-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
            title={isListening ? 'Listening...' : 'Tap to speak'}
          >
            <Mic className="w-8 h-8 stroke-[2.2]" />
          </button>

          {isListening && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-xs">
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
            ? 'Speak crop name (e.g., "Pyaz", "Tomato", "Gehun", "Kapas") or say a tab'
            : 'Tap the mic or select any crop below'}
        </p>

        {/* Recognized Transcript */}
        {recognizedText && (
          <div className="mt-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 w-full text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Heard: "{recognizedText}"</span>
          </div>
        )}

        {/* Unrecognized Feedback Toast */}
        {unrecognizedFeedback && !matchingCrop && !matchedNav && (
          <div className="mt-3.5 p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl border border-rose-200 dark:border-rose-800 w-full text-left animate-in fade-in slide-in-from-top-1">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  {unrecognizedFeedback}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startListeningSession}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Try Again</span>
                  </button>
                  <span className="text-[10px] text-rose-700 dark:text-rose-300 font-medium">
                    Or select your crop below:
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matched Navigation Command */}
        {matchedNav && (
          <div className="mt-3.5 w-full p-3 bg-emerald-100/80 dark:bg-emerald-950/80 rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-left animate-in zoom-in-95">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-700 dark:text-emerald-400 animate-spin" />
              <span className="text-xs font-black text-emerald-950 dark:text-emerald-100">
                Opening {matchedNav.label}...
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Navigating</span>
          </div>
        )}

        {/* Matched Crop Card Preview */}
        {matchingCrop && (
          <div className="mt-3.5 w-full p-3 bg-emerald-50 dark:bg-emerald-950/80 rounded-xl border-2 border-emerald-500 dark:border-emerald-600 flex items-center justify-between animate-in zoom-in-95 shadow-sm">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-11 h-11 rounded-lg overflow-hidden border border-emerald-300 dark:border-emerald-700 shadow-2xs shrink-0 bg-white">
                <CropImage
                  id={matchingCrop.id}
                  name={matchingCrop.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  fallbackIconClassName="w-6 h-6"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                    {matchingCrop.regionalNames?.[language] || matchingCrop.hindiName || matchingCrop.name}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold tabular-nums">
                  {formatINR(matchingCrop.currentPrice)}/quintal · Opening Decision...
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectCrop(matchingCrop.id, matchingCrop.name);
                onUpdateSearchInput?.(matchingCrop.name);
                if (onNavigatePage) onNavigatePage('decision');
                onClose();
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
            >
              Go ➔
            </button>
          </div>
        )}

        {/* Quick Speak Shortcuts */}
        <div className="mt-4 w-full pt-3.5 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Quick Navigation Tabs:
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
            Or tap any crop to select & view decision:
          </p>
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
            {crops.map((crop) => {
              const label = crop.regionalNames?.[language] || crop.hindiName || crop.name;
              return (
                <button
                  key={crop.id}
                  onClick={() => handleManualVoicePick(crop)}
                  className="min-h-[40px] p-1.5 bg-white hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg border border-slate-200 hover:border-emerald-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
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
