import React, { useState, useRef, useEffect } from 'react';
import { CropData, Language } from '../types';
import { WeatherData } from '../lib/weatherService';
import { speakText, stopSpeaking } from '../lib/utils';
import { WEATHER_TRANSLATIONS } from '../data/weatherTranslations';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  Clock,
  CheckCheck,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  audioText?: string;
  timestamp: string;
}

interface WeatherChatbotProps {
  crop: CropData;
  locationName: string;
  weather: WeatherData | null;
  language: Language;
}

const MAX_QUESTIONS_PER_SESSION = 5;

export const WeatherChatbot: React.FC<WeatherChatbotProps> = ({
  crop,
  locationName,
  weather,
  language,
}) => {
  const wt = WEATHER_TRANSLATIONS[language] || WEATHER_TRANSLATIONS.en;

  const suggestionChips = [
    wt.chipRain,
    wt.chipSpray,
    wt.chipTransport,
    wt.chipStacking,
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: wt.welcomeMessage,
      audioText: wt.welcomeMessage,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // When language changes, update the initial welcome message if no user message yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            id: 'welcome',
            sender: 'assistant',
            text: wt.welcomeMessage,
            audioText: wt.welcomeMessage,
            timestamp: prev[0].timestamp,
          },
        ];
      }
      return prev;
    });
  }, [language, wt.welcomeMessage]);

  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [questionsUsed, setQuestionsUsed] = useState<number>(0);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const questionsRemaining = Math.max(0, MAX_QUESTIONS_PER_SESSION - questionsUsed);
  const isQuotaExhausted = questionsRemaining <= 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSpeakMessage = (id: string, textToSpeak: string) => {
    if (speakingMessageId === id) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      stopSpeaking();
      setSpeakingMessageId(id);
      speakText(textToSpeak, language, () => {
        setSpeakingMessageId(null);
      });
    }
  };

  const getLocalPerQuestionAdvice = (qText: string) => {
    const q = qText.toLowerCase();
    const cropName = crop.name;
    const hindiCrop = crop.hindiName || cropName;
    const temp = weather?.temperature ?? 30;
    const wind = weather?.windSpeed ?? 14;
    const rainProb = weather?.precipitationProbability ?? 10;
    const rainSum = weather?.precipitationSum ?? 0;
    const hum = weather?.humidity ?? 50;
    const isHi = language === 'hi';

    if (
      q.includes('rain') ||
      q.includes('spoil') ||
      q.includes('बारिश') ||
      q.includes('खराब') ||
      q.includes('पाऊस')
    ) {
      if (rainProb >= 40 || rainSum > 5) {
        return isHi
          ? `⚠️ बारिश चेतावनी: ${locationName || 'क्षेत्र'} में ${rainProb}% बारिश की संभावना (${rainSum} मिमी) है। कटी हुई ${hindiCrop} को तुरंत शेड में रखें या तिरपाल से ढकें ताकि फफूंद व नमी से मंडी भाव न गिरे।`
          : `⚠️ Rain Risk: With a ${rainProb}% chance of rain (${rainSum} mm) in ${locationName || 'your area'}, keep harvested ${cropName} strictly covered under sheds or waterproof tarpaulins to prevent moisture dockage.`;
      }
      return isHi
        ? `✓ बारिश का खतरा कम: वर्तमान में बारिश की संभावना केवल ${rainProb}% (${rainSum} मिमी) है। आज ${hindiCrop} को बारिश से सीधा नुकसान नहीं होगा, फिर भी तिरपाल तैयार रखें।`
        : `✓ Low Rain Risk: Rain probability is currently ${rainProb}% (${rainSum} mm) in ${locationName || 'your area'}. Your harvested ${cropName} is safe from immediate rain damage today.`;
    }

    if (
      q.includes('spray') ||
      q.includes('pesticide') ||
      q.includes('कीटनाशक') ||
      q.includes('दवा') ||
      q.includes('छिड़क')
    ) {
      if (wind >= 16) {
        return isHi
          ? `❌ अभी कीटनाशक न छिड़कें: हवा की गति ${wind} किमी/घंटा है, जिससे दवा उड़कर बर्बाद होगी। हवा शांत होने (12 किमी/घंटा से कम) पर ही सुबह या शाम छिड़कें।`
          : `❌ Do not spray pesticide right now. Wind speed is ${wind} km/h, which will cause excessive chemical drift off your ${cropName}. Wait until wind drops below 12 km/h.`;
      }
      if (rainProb >= 45) {
        return isHi
          ? `❌ छिड़काव टालें: बारिश की संभावना ${rainProb}% है। स्प्रे करने पर दवा धुलने का खतरा है। 24 घंटे का सूखा समय मिलने पर ही छिड़काव करें।`
          : `❌ Postpone spraying today: Rain probability is ${rainProb}%. Incoming rain will wash off foliar chemicals. Wait for a clear 24-hour dry spell.`;
      }
      return isHi
        ? `✓ छिड़काव के लिए अनुकूल समय: हवा की गति शांत (${wind} किमी/घंटा) और तापमान ${temp}°C है। सुबह 7:30 से 10:00 बजे के बीच ${hindiCrop} पर दवा का छिड़काव सबसे उत्तम रहेगा।`
        : `✓ Safe to spray: Current wind is calm (${wind} km/h) and temperature is ${temp}°C. Morning hours are ideal for spraying ${cropName} before heat rises.`;
    }

    if (
      q.includes('transport') ||
      q.includes('mandi') ||
      q.includes('मंडी') ||
      q.includes('safe') ||
      q.includes('सुरक्षित') ||
      q.includes('ले जाना') ||
      q.includes('बाजार') ||
      q.includes('यात्रा') ||
      q.includes('गाड़ी') ||
      q.includes('वाहतूक') ||
      q.includes('परिवहन')
    ) {
      if (rainProb >= 60 || weather?.isExtremeRisk) {
        return isHi
          ? `⚠️ मंडी परिवहन में सावधानी: बारिश की संभावना ${rainProb}% है। यदि आज ${locationName || 'मंडी'} जा रहे हैं, तो वाहन पर दोहरी तिरपाल कसकर बांधें और मंडी शेड में जगह सुनिश्चित करें।`
          : `⚠️ Transport Caution: Rain chance is ${rainProb}% with ${wind} km/h wind. Secure truck cargo with tight double tarpaulins before heading to ${locationName || 'mandi'}.`;
      }
      return isHi
        ? `✓ मंडी ले जाने के लिए सुरक्षित: आज मौसम अनुकूल है (${temp}°C, हवा ${wind} किमी/घंटा)। जल्दी सुबह निकलें ताकि तोल कांटे पर जल्दी टोकन मिले।`
        : `✓ Safe for Mandi Transport: Road conditions to ${locationName || 'mandi'} are favorable (${temp}°C, wind ${wind} km/h). Dispatch early morning to avoid market rush.`;
    }

    if (
      q.includes('stack') ||
      q.includes('bag') ||
      q.includes('storage') ||
      q.includes('humidity') ||
      q.includes('बोरी') ||
      q.includes('भंडारण') ||
      q.includes('थप्पी') ||
      q.includes('गोदाम')
    ) {
      return isHi
        ? `⚠️ भंडारण निर्देश: हवा में नमी ${hum}% है। ${hindiCrop} की बोरियों को जमीन पर सीधे न रखकर लकड़ी की चन्नी (पैलेट्स) पर रखें और हवा के आवागमन के लिए बीच में 1 फुट का स्थान छोड़ें।`
        : `⚠️ Stacking Advice: Humidity is ${hum}%. Stack ${cropName} bags on raised wooden pallets at least 15 cm off damp floors, leaving air gaps between stacks to prevent mold.`;
    }

    return isHi
      ? `${locationName || 'क्षेत्र'} का मौसम: तापमान ${temp}°C, नमी ${hum}%, बारिश की संभावना ${rainProb}%, हवा ${wind} किमी/घंटा। ${hindiCrop} की सुरक्षा के लिए मौसम के अनुसार कार्य करें।`
      : `Current weather in ${locationName || 'your area'}: Temperature ${temp}°C, humidity ${hum}%, rain probability ${rainProb}%, wind ${wind} km/h. Plan field operations for ${cropName} accordingly.`;
  };

  const handleSendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isQuotaExhausted || isTyping) return;

    // Increment question count
    setQuestionsUsed((prev) => prev + 1);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    // Push independent question to the chat history immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/weather/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        cache: 'no-store',
        body: JSON.stringify({
          question: trimmed,
          userQuestion: trimmed,
          crop: {
            id: crop.id,
            name: crop.name,
            hindiName: crop.hindiName,
          },
          selectedCrop: {
            id: crop.id,
            name: crop.name,
            hindiName: crop.hindiName,
          },
          location: locationName || 'Maharashtra',
          currentLocation: locationName || 'Maharashtra',
          weather: weather
            ? {
                temp: weather.temperature,
                temperature: weather.temperature,
                maxTemperature: weather.maxTemperature,
                minTemperature: weather.minTemperature,
                humidity: weather.humidity,
                precipitationSum: weather.precipitationSum,
                rainChance: weather.precipitationProbability,
                precipitationProbability: weather.precipitationProbability,
                windSpeed: weather.windSpeed,
                condition: weather.conditionLabel,
                conditionLabel: weather.conditionLabel,
                isExtremeRisk: weather.isExtremeRisk,
                riskType: weather.riskType,
              }
            : null,
          weatherData: weather
            ? {
                temp: weather.temperature,
                humidity: weather.humidity,
                rainChance: weather.precipitationProbability,
                windSpeed: weather.windSpeed,
                condition: weather.conditionLabel,
              }
            : null,
          language,
          currentLanguage: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: 'assistant',
        text: data.answer || getLocalPerQuestionAdvice(trimmed),
        audioText: data.audioText || data.answer || getLocalPerQuestionAdvice(trimmed),
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Weather chat request fallback activated:', err);
      const fallbackText = getLocalPerQuestionAdvice(trimmed);

      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: 'assistant',
        text: fallbackText,
        audioText: fallbackText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (chipText: string) => {
    if (isQuotaExhausted || isTyping) return;
    handleSendQuestion(chipText);
  };

  return (
    <section
      id="weather-chatbot-widget"
      className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col"
    >
      {/* Header with Title and Quota Badge */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {wt.chatbotTitle}
              </h3>
              <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {wt.chatbotSubtitle}
            </p>
          </div>
        </div>

        {/* Quota Counter Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            id="chatbot-quota-badge"
            className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 shadow-2xs ${
              questionsRemaining > 2
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : questionsRemaining > 0
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{questionsRemaining}/{MAX_QUESTIONS_PER_SESSION} {wt.questionsLeft}</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="p-4 sm:p-5 space-y-3.5 max-h-[420px] overflow-y-auto bg-slate-50/40">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-2xs ${
                  isAssistant
                    ? 'bg-white text-slate-800 border border-slate-200'
                    : 'bg-emerald-700 text-white font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                {/* Footer with time & TTS for assistant */}
                <div
                  className={`mt-2 pt-1.5 border-t flex items-center justify-between gap-2 text-[10px] ${
                    isAssistant
                      ? 'border-slate-100 text-slate-400'
                      : 'border-emerald-600 text-emerald-100'
                  }`}
                >
                  <span className="font-semibold">{msg.timestamp}</span>

                  {isAssistant && (
                    <button
                      type="button"
                      onClick={() => handleSpeakMessage(msg.id, msg.audioText || msg.text)}
                      className="flex items-center gap-1 font-bold text-slate-600 hover:text-emerald-700 cursor-pointer transition-colors"
                      title="Listen to this response"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-amber-700">{wt.stopAudio}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{wt.listenAudio}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <User className="w-4 h-4 text-emerald-300" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold pl-1">
            <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>{wt.assistantTyping}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {!isQuotaExhausted && (
        <div className="px-4 py-2.5 bg-slate-100/70 border-t border-slate-200">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {wt.quickSuggestions}
            </span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input or Exhausted Banner */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        {isQuotaExhausted ? (
          <div
            id="chatbot-quota-exhausted-notice"
            className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5"
          >
            <Info className="w-5 h-5 text-slate-600 shrink-0" />
            <span>
              {wt.quotaUsed}
            </span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              id="weather-chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isQuotaExhausted || isTyping}
              placeholder={wt.askPlaceholder}
              className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white transition-all disabled:opacity-50"
            />

            <button
              type="submit"
              id="weather-chat-send-btn"
              disabled={!inputText.trim() || isQuotaExhausted || isTyping}
              className="min-h-[44px] px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{wt.askAi}</span>
            </button>
          </form>
        )}

        {/* Helper footer */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <CheckCheck className="w-3 h-3 text-emerald-600" />
            Context auto-appended: {crop.name} • {weather?.temperature ?? 30}°C • {weather?.humidity ?? 50}% humidity • {weather?.windSpeed ?? 14} km/h wind
          </span>
          <span>Max 5 queries/session</span>
        </div>
      </div>
    </section>
  );
};
