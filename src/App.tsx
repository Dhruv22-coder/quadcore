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
import { NewbieAgriTipsModal } from './components/NewbieAgriTipsModal';
import { FarmerCloudAccountModal } from './components/FarmerCloudAccountModal';
import { FarmerConnectModal, FarmerConnectFloatingButton } from './components/FarmerConnectModal';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { speakText, stopSpeaking, translations } from './lib/utils';
import { Sprout, Radio, MapPin, CheckCircle, X, Mic } from 'lucide-react';

function MandiApp() {
  const [crops] = useState<CropData[]>(mockCrops);
  const [selectedCropId, setSelectedCropId] = useState<string>('onion');
  const [quantity, setQuantity] = useState<number>(12); // Default to 12 quintals to naturally show small-yield pooling benefits
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
  const [isAgriTipsModalOpen, setIsAgriTipsModalOpen] = useState<boolean>(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState<boolean>(false);
  const [isFarmerConnectOpen, setIsFarmerConnectOpen] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);
  const [cropSearchFilter, setCropSearchFilter] = useState<string>('');

  const { profile, userProfile, syncActiveCropAndYield, pooledFarmers } = useFirebase();

  // Sync state if preferred in Firestore profile
  useEffect(() => {
    if (userProfile?.statePreference) {
      const matched = INDIAN_STATES.find((s) => s.id === userProfile.statePreference);
      if (matched && matched.id !== currentState.id) {
        setCurrentState(matched);
      }
    }
  }, [userProfile?.statePreference]);

  // Sync profile crop and quantity from Firestore if available
  useEffect(() => {
    if (profile?.selectedCropId && profile.selectedCropId !== selectedCropId) {
      setSelectedCropId(profile.selectedCropId);
    }
    if (profile?.quantity && profile.quantity !== quantity) {
      setQuantity(profile.quantity);
    }
  }, [profile?.selectedCropId, profile?.quantity]);

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

  // 1. Automatic Background State Sync to Firestore:
  // When the user selects a crop on the '1. Crops' page, immediately save/update 'selectedCrop' in their active farmer document in Firestore.
  const handleSelectCrop = (cropId: string, autoAdvance: boolean = true, cropName?: string) => {
    setSelectedCropId(cropId);
    if (cropName) {
      setCropSearchFilter(cropName);
    } else {
      const found = crops.find((c) => c.id === cropId);
      if (found) setCropSearchFilter(found.name);
    }
    syncActiveCropAndYield(cropId, quantity, 'quintal');
    if (autoAdvance) {
      setActivePage('decision');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // When the user inputs or tweaks their crop quantity/yield anywhere in the workflow (e.g., in '2. Decision' or '3. Profit'), auto-sync that 'quantity' and 'unit' to their Firestore record in real-time.
  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
    syncActiveCropAndYield(selectedCropId, newQty, 'quintal');
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
        onOpenAgriTipsModal={() => setIsAgriTipsModalOpen(true)}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
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
            <button
              type="button"
              onClick={() => setIsCloudModalOpen(true)}
              className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200/80 text-[11px] cursor-pointer transition-colors"
              title="Kisan Cloud Firestore Account"
            >
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              Agmarknet & Cloud Sync
            </button>
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
            onSelectCrop={(id) => handleSelectCrop(id, true)}
            language={language}
            onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
            isSunlightMode={isSunlightMode}
            onProceedToDecision={() => setActivePage('decision')}
            filterText={cropSearchFilter}
            onFilterTextChange={setCropSearchFilter}
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
            harvestQuantity={quantity}
            onQuantityChange={handleQuantityChange}
            onOpenPoolingModal={() => setIsFarmerConnectOpen(true)}
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
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onOpenPoolingModal={() => setIsFarmerConnectOpen(true)}
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

      {/* 1. Global Persistent Floating Voice Search Button */}
      {/* Position: fixed bottom-24 right-6 z-50 (stacked cleanly above 'Connect with Farmers' at bottom-6 right-6 with 24px gap) */}
      <div className="fixed bottom-24 right-6 z-50 animate-fade-in">
        <button
          id="global-floating-voice-search-btn"
          type="button"
          onClick={() => setIsVoiceSearchOpen(true)}
          aria-label="Bol Kar Khojein / Voice Search"
          title="Bol Kar Khojein / Voice Search"
          className="group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-900 hover:to-teal-900 active:scale-95 text-white rounded-full shadow-xl border-2 border-emerald-400/50 hover:shadow-2xl transition-all cursor-pointer select-none"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
              <Mic className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform stroke-[2.2]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black tracking-tight leading-tight">
                {t.voiceSearchBtn}
              </span>
              <span className="text-[10px] bg-emerald-600/80 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                Mic
              </span>
            </div>
            <span className="text-[10px] text-emerald-100 block leading-none mt-0.5">
              {language === 'hi' ? 'बोल कर खोजें और नेविगेट करें' : language === 'mr' ? 'बोलून शोधा व नेव्हिगेट करा' : 'Voice Search & Navigate'}
            </span>
          </div>
        </button>
      </div>

      {/* 2. Conditional Persistent Floating Button ('Connect with Farmers') */}
      {/* CRITICAL VISIBILITY RULE: Visible across all tabs ONLY when quantity is strictly < 15 quintals */}
      <FarmerConnectFloatingButton
        harvestQuantity={quantity}
        cropName={selectedCrop.name}
        onClick={() => setIsFarmerConnectOpen(true)}
        pooledFarmersCount={pooledFarmers.filter((f) => f.cropId === selectedCrop.id).length}
        language={language}
      />

      {/* Farmer Connect / Vehicle Pooling Modal */}
      <FarmerConnectModal
        isOpen={isFarmerConnectOpen}
        onClose={() => setIsFarmerConnectOpen(false)}
        crop={selectedCrop}
        harvestQuantity={quantity}
        language={language}
        currentState={currentState}
        onNavigateToProfit={() => {
          setIsFarmerConnectOpen(false);
          setActivePage('profit');
        }}
      />

      {/* Location / State Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentState={currentState}
        onSelectState={handleStateSelect}
        language={language}
      />

      {/* Newbie Farmer Agri Tips Modal (Soil Condition, Weather & Seasonal Crops) */}
      <NewbieAgriTipsModal
        isOpen={isAgriTipsModalOpen}
        onClose={() => setIsAgriTipsModalOpen(false)}
        currentState={currentState}
        onSelectState={handleStateSelect}
        language={language}
      />

      {/* Floating Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        crops={crops}
        onSelectCrop={(id, name) => handleSelectCrop(id, true, name)}
        onUpdateSearchInput={(name) => setCropSearchFilter(name)}
        onFeedbackToast={(msg) => setLocationToast(msg)}
        language={language}
        onNavigatePage={(page) => {
          setActivePage(page);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Kisan Cloud Account & Firebase Firestore Modal */}
      <FarmerCloudAccountModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        language={language}
        crops={crops}
        selectedCrop={selectedCrop}
        onSelectCrop={(crop) => {
          handleSelectCrop(crop.id, true);
        }}
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

export default function App() {
  return (
    <FirebaseProvider>
      <MandiApp />
    </FirebaseProvider>
  );
}
