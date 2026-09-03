/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { mockCrops } from './data/cropsData';
import { CropData, Language, IndianState, ActivePage } from './types';
import { INDIAN_STATES, detectStateFromCoordinates } from './data/locations';
import { getMandisForStateAndCrop } from './data/mandisData';
import { Navbar } from './components/Navbar';
import { PageNavigation } from './components/PageNavigation';
import { ActiveCropBar } from './components/ActiveCropBar';
import { CropSelector } from './components/CropSelector';
import { DecisionHeroCard } from './components/DecisionHeroCard';
import { LogisticsComparison } from './components/LogisticsComparison';
import { WeatherStorageView } from './components/WeatherStorageView';
import { KisanHelpView } from './components/KisanHelpView';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { speakText, stopSpeaking, translations } from './lib/utils';
import { Sprout, Radio, MapPin, CheckCircle, X } from 'lucide-react';

export default function App() {
  const [crops] = useState<CropData[]>(mockCrops);
  const [selectedCropId, setSelectedCropId] = useState<string>('onion');
  const [activePage, setActivePage] = useState<ActivePage>('crops');
  // Default to Maharashtra with Marathi, or auto-detect on mount
  const [currentState, setCurrentState] = useState<IndianState>(
    INDIAN_STATES.find((s) => s.id === 'maharashtra') || INDIAN_STATES[0]
  );
  const [language, setLanguage] = useState<Language>('mr');
  const [isSunlightMode, setIsSunlightMode] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);

  // Dynamically attach real mandis of the selected state (within 100 km radius)
  const selectedCrop = useMemo(() => {
    const raw = crops.find((c) => c.id === selectedCropId) || crops[0];
    const dynamicMandis = getMandisForStateAndCrop(currentState, raw.id, raw.currentPrice);
    return {
      ...raw,
      mandis: dynamicMandis,
    };
  }, [crops, selectedCropId, currentState]);

  const t = translations[language];

  // Auto-detect location & set regional language on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const matched = detectStateFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          setCurrentState(matched);
          setLanguage(matched.language);
          setLocationToast(
            `📍 GPS detected: ${matched.name} (${matched.nativeName}). Mandis within 100 km loaded.`
          );
          setTimeout(() => {
            setLocationToast(null);
          }, 6000);
        },
        (err) => {
          console.log('Location detection skipped or denied:', err.message);
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    }
  }, []);

  // Stop audio if crop or language changes
  useEffect(() => {
    stopSpeaking();
    setIsAudioPlaying(false);
  }, [selectedCropId, language]);

  const handleStateSelect = (state: IndianState, autoUpdateLanguage: boolean = true) => {
    setCurrentState(state);
    if (autoUpdateLanguage) {
      setLanguage(state.language);
      setLocationToast(
        `📍 State set to ${state.name}. Displaying verified ${state.name} mandis within 100 km.`
      );
    } else {
      setLocationToast(
        `📍 State set to ${state.name}. Displaying verified ${state.name} mandis within 100 km.`
      );
    }
    setTimeout(() => {
      setLocationToast(null);
    }, 5000);
  };

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      stopSpeaking();
      setIsAudioPlaying(false);
    } else {
      setIsAudioPlaying(true);
      const regionalName = selectedCrop.regionalNames?.[language] || selectedCrop.hindiName;
      let textToSpeak = '';

      if (language === 'hi' || language === 'mr' || language === 'gu') {
        textToSpeak = `${regionalName} मंडी भाव: ₹${selectedCrop.currentPrice} प्रति क्विंटल। फैसला: ${selectedCrop.decision.actionTitle}। ${selectedCrop.decision.actionSubtitle}।`;
      } else {
        textToSpeak = `${selectedCrop.name} Mandi Rate: ₹${selectedCrop.currentPrice} per quintal. Advisory: ${selectedCrop.decision.actionTitle}. ${selectedCrop.decision.actionSubtitle}.`;
      }

      speakText(textToSpeak, language, () => {
        setIsAudioPlaying(false);
      });
    }
  };

  const handleSelectCrop = (cropId: string, autoAdvance: boolean = false) => {
    setSelectedCropId(cropId);
    if (autoAdvance) {
      setActivePage('decision');
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isSunlightMode
          ? 'bg-amber-50/40 text-slate-950 font-semibold'
          : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Navigation Bar with Integrated Tabs & Mobile Menu */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        isSunlightMode={isSunlightMode}
        onToggleSunlightMode={() => setIsSunlightMode(!isSunlightMode)}
        currentState={currentState}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        activePage={activePage}
        onPageChange={setActivePage}
      />

      {/* Location Toast Notification */}
      {locationToast && (
        <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-3">
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs text-xs sm:text-sm text-emerald-950 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{locationToast}</span>
            </div>
            <button
              onClick={() => setLocationToast(null)}
              className="p-1 text-emerald-700 hover:text-emerald-900 rounded cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-5 pb-32 sm:pb-24">
        {/* Quick Live Status Ticker */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="font-bold text-slate-800 tracking-tight">
              Mandi Auctions Live: {currentState.name} ({currentState.keyMandi}) & All-India APMCs
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-bold text-[11px] cursor-pointer"
            >
              <MapPin className="w-3 h-3" />
              Change State
            </button>
            <span className="hidden sm:inline text-[11px]">Updated 10m ago</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 text-[11px]">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              Agmarknet Sync
            </span>
          </div>
        </div>

        {/* Top Step Pages Navigation (Crops -> Decision -> Profit -> Weather -> Help) */}
        <PageNavigation
          activePage={activePage}
          onPageChange={setActivePage}
          language={language}
          isSunlightMode={isSunlightMode}
        />

        {/* Active Crop Context Strip (shown on non-crops pages for instant crop awareness) */}
        {activePage !== 'crops' && (
          <ActiveCropBar
            crop={selectedCrop}
            language={language}
            onChangeCrop={() => setActivePage('crops')}
            isSunlightMode={isSunlightMode}
          />
        )}

        {/* Multi-Page Views */}
        {activePage === 'crops' && (
          <CropSelector
            crops={crops}
            selectedCropId={selectedCropId}
            onSelectCrop={(id) => handleSelectCrop(id, false)}
            language={language}
            onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
            isSunlightMode={isSunlightMode}
            onProceedToDecision={() => setActivePage('decision')}
          />
        )}

        {activePage === 'decision' && (
          <DecisionHeroCard
            crop={selectedCrop}
            language={language}
            onPlayAudio={handleToggleAudio}
            isAudioPlaying={isAudioPlaying}
            isSunlightMode={isSunlightMode}
            currentState={currentState}
            onNavigateToCrops={() => setActivePage('crops')}
            onNavigateToProfit={() => setActivePage('profit')}
            onNavigateToWeather={() => setActivePage('weather')}
          />
        )}

        {activePage === 'profit' && (
          <LogisticsComparison
            crop={selectedCrop}
            language={language}
            currentState={currentState}
            isSunlightMode={isSunlightMode}
            onNavigateToDecision={() => setActivePage('decision')}
            onNavigateToWeather={() => setActivePage('weather')}
          />
        )}

        {activePage === 'weather' && (
          <WeatherStorageView
            crop={selectedCrop}
            language={language}
            currentState={currentState}
            isSunlightMode={isSunlightMode}
            onNavigateToProfit={() => setActivePage('profit')}
            onNavigateToHelp={() => setActivePage('help')}
          />
        )}

        {activePage === 'help' && (
          <KisanHelpView
            crop={selectedCrop}
            language={language}
            isSunlightMode={isSunlightMode}
            onToggleSunlightMode={() => setIsSunlightMode(!isSunlightMode)}
            onNavigateToWeather={() => setActivePage('weather')}
            onNavigateToCrops={() => setActivePage('crops')}
          />
        )}
      </main>

      {/* Location / State Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentState={currentState}
        onSelectState={handleStateSelect}
        language={language}
      />

      {/* Floating Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        crops={crops}
        onSelectCrop={(id) => handleSelectCrop(id, true)}
        language={language}
      />

      {/* Modern, Clean Utility Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm text-slate-900">MandiMitra</span>
            <span className="text-slate-300">|</span>
            <span>Real-time price intelligence & logistical decision-support for Indian farmers</span>
          </div>

          <div className="flex items-center gap-3 text-slate-600 font-medium text-[11px]">
            <span>Free Kisan Helpline: <strong className="text-slate-900 font-bold">1800-889-2040</strong></span>
            <span>•</span>
            <span>Agmarknet Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
