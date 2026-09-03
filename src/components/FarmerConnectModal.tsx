import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  MapPin,
  Truck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  IndianRupee,
  Navigation,
  X,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { CropData, Language, IndianState } from '../types';
import { formatINR, translations } from '../lib/utils';
import { CropImage } from '../data/cropImages';
import { POOLING_TRANSLATIONS } from '../data/poolingTranslations';
import {
  useFirebase,
} from '../context/FirebaseContext';
import {
  fetchNearbyFarmerPools,
  FarmerPoolItem,
} from '../lib/firebase';

interface FarmerConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: CropData;
  harvestQuantity: number;
  language: Language;
  currentState: IndianState;
  onNavigateToProfit?: () => void;
}

export const FarmerConnectModal: React.FC<FarmerConnectModalProps> = ({
  isOpen,
  onClose,
  crop,
  harvestQuantity,
  language,
  currentState,
  onNavigateToProfit,
}) => {
  const {
    profile,
    saveFarmerContactInfo,
    pooledFarmers,
    toggleSelectPooledFarmer,
    setIsPooledProfitMode,
  } = useFirebase();

  const pt = POOLING_TRANSLATIONS[language] || POOLING_TRANSLATIONS.en;
  const t = translations[language] || translations.en;

  // Contact form state if not already saved
  const [nameInput, setNameInput] = useState<string>(profile?.displayName || '');
  const [phoneInput, setPhoneInput] = useState<string>(profile?.phone || '');
  const [villageInput, setVillageInput] = useState<string>(profile?.village || '');
  const [isSavingContact, setIsSavingContact] = useState<boolean>(false);

  // GPS state
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; isGps: boolean }>({
    lat: currentState.lat ?? 19.7515,
    lng: currentState.lng ?? 75.7139,
    isGps: false,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Matching nearby farmers list
  const [nearbyList, setNearbyList] = useState<FarmerPoolItem[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState<boolean>(false);

  const hasContactInfo = Boolean(profile?.phone && profile?.displayName);

  // Auto-detect GPS location once on modal open
  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            isGps: true,
          });
          setIsLocating(false);
        },
        (err) => {
          console.log('GPS detection skipped or denied:', err.message);
          setLocationError('Using mandi regional location');
          setIsLocating(false);
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    }
  }, [isOpen]);

  // Query nearby farmers who also selected the SAME crop within 10 km radius
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingNearby(true);

    const loadFarmers = async () => {
      try {
        const results = await fetchNearbyFarmerPools(
          crop.id,
          crop.name,
          gpsLocation.lat,
          gpsLocation.lng,
          profile?.id
        );
        if (isMounted) {
          setNearbyList(results);
        }
      } catch (err) {
        console.error('Failed to load nearby pool farmers:', err);
      } finally {
        if (isMounted) {
          setIsLoadingNearby(false);
        }
      }
    };

    loadFarmers();

    return () => {
      isMounted = false;
    };
  }, [isOpen, crop.id, crop.name, gpsLocation.lat, gpsLocation.lng, profile?.id]);

  // Handle saving contact info
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) return;

    setIsSavingContact(true);
    try {
      await saveFarmerContactInfo(
        nameInput.trim(),
        phoneInput.trim(),
        villageInput.trim() || `${currentState.name} Area`,
        gpsLocation.lat,
        gpsLocation.lng
      );
    } catch (err) {
      console.error('Failed to save contact info:', err);
    } finally {
      setIsSavingContact(false);
    }
  };

  // Cumulative pooling volume calculations
  const collaboratingQuantity = useMemo(() => {
    return pooledFarmers
      .filter((f) => f.cropId === crop.id)
      .reduce((sum, f) => sum + f.quantity, 0);
  }, [pooledFarmers, crop.id]);

  const totalCumulativeQuantity = harvestQuantity + collaboratingQuantity;

  // Estimated logistics savings per quintal when pooling
  const estimatedSavingsPerQtl = useMemo(() => {
    if (collaboratingQuantity === 0) return 0;
    // Pooling reduces solo trip freight burden significantly: ~35% - 45% cheaper per quintal
    return Math.min(125, Math.round(40 + (collaboratingQuantity / 25) * 50));
  }, [collaboratingQuantity]);

  const totalEstimatedCashSavings = Math.round(estimatedSavingsPerQtl * harvestQuantity);

  const handleApplyToProfitCalculator = () => {
    setIsPooledProfitMode(true);
    onClose();
    if (onNavigateToProfit) {
      onNavigateToProfit();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="farmer-connect-modal"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="farmer-connect-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header with gradient badge */}
        <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Users className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    id="farmer-connect-modal-title"
                    className="text-base sm:text-lg font-black tracking-tight"
                  >
                    {pt.modalTitle}
                  </h2>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {pt.yieldCap}
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-0.5 font-medium">
                  {pt.poolSubtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Crop & Harvest Banner - Zero Re-entry Guarantee */}
          <div className="mt-3.5 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 bg-white/10 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shrink-0 border border-white/30">
                <CropImage
                  id={crop.id}
                  name={crop.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  fallbackIconClassName="w-4 h-4"
                />
              </div>
              <div>
                <span className="text-[11px] text-emerald-200 font-medium block">
                  {pt.activeSelectedCrop}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  {crop.name} ({crop.regionalNames?.[language] || crop.hindiName})
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-emerald-200 font-medium block">
                {pt.myHarvestYield}
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-300">
                {harvestQuantity} {t.quintalsUnit} ({harvestQuantity * 100} {t.kgUnit})
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[68vh] overflow-y-auto">
          {/* Step 1: Prompt for Name and Phone ONLY if not already saved */}
          {!hasContactInfo ? (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-amber-900 dark:text-amber-300 font-extrabold text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>{pt.oneTimeVerification}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {pt.verificationDesc}
              </p>

              <form onSubmit={handleSaveContact} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {pt.farmerNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={pt.farmerNamePlaceholder}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {pt.mobileLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder={pt.mobilePlaceholder}
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {pt.neverAskedAgain}
                  </span>
                  <button
                    type="submit"
                    disabled={isSavingContact || !nameInput || !phoneInput}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isSavingContact ? pt.savingContact : pt.saveAndFindBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Contact profile confirmed pill */
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {profile.displayName} ({profile.phone})
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  {pt.verifiedBadge}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {pt.radiusLabel}
              </span>
            </div>
          )}

          {/* GPS Auto-Detection Status */}
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-1.5">
              <Navigation className={`w-3.5 h-3.5 text-emerald-700 ${isLocating ? 'animate-spin' : ''}`} />
              <span>
                {isLocating
                  ? pt.locatingGps
                  : gpsLocation.isGps
                  ? pt.gpsActive
                  : `${pt.mandiActive}: ${currentState.name} (${currentState.keyMandi})`}
              </span>
            </div>
            <span className="font-bold">{pt.radiusFilter}</span>
          </div>

          {/* Step 2: Checklist of Nearby Matching Farmers with individual quantities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                {pt.nearbyHeading} ({crop.name})
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {nearbyList.length} {pt.farmersFoundWithin}
              </span>
            </div>

            {isLoadingNearby ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-6 h-6 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {pt.scanningFarmers}
                </p>
              </div>
            ) : nearbyList.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {pt.noFarmersFound}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {nearbyList.map((farmer) => {
                  const isSelected = pooledFarmers.some((f) => f.id === farmer.id);

                  return (
                    <div
                      key={farmer.id}
                      onClick={() => toggleSelectPooledFarmer(farmer)}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {/* Left: Checkbox + Farmer Details */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by container click
                          className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-slate-300 cursor-pointer"
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                              {farmer.farmerName}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {farmer.village || 'Nearby Village'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              {farmer.distanceKm} {pt.kmAwayText}
                            </span>
                            <span>• {pt.sameCropText}: {crop.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quantity + Contact */}
                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 block leading-tight">
                            {farmer.quantity} {t.quintalsUnit}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            ({farmer.quantity * 100} {t.kgUnit})
                          </span>
                        </div>

                        {farmer.phone && (
                          <a
                            href={`tel:${farmer.phone.replace(/\s+/g, '')}`}
                            onClick={(e) => e.stopPropagation()}
                            title={`Call ${farmer.farmerName}`}
                            className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cumulative Pooling Summary Box */}
          <div className="bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                {pt.sharedTruckloadTitle}
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                {pooledFarmers.length} {pt.farmersCollaborating}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                <span className="text-[11px] text-slate-400 block">{pt.myYieldBox}</span>
                <span className="text-sm sm:text-base font-black text-white">
                  {harvestQuantity} {t.quintalsUnit}
                </span>
              </div>

              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                <span className="text-[11px] text-slate-400 block">{pt.selectedCollaborators}</span>
                <span className="text-sm sm:text-base font-black text-amber-400">
                  +{collaboratingQuantity} {t.quintalsUnit}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-emerald-950/60 rounded-lg p-2.5 border border-emerald-700/50">
                <span className="text-[11px] text-emerald-300 block">{pt.cumulativeYield}</span>
                <span className="text-sm sm:text-base font-black text-emerald-300">
                  {totalCumulativeQuantity} {t.quintalsUnit}
                </span>
              </div>
            </div>

            {collaboratingQuantity > 0 ? (
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {pt.estFreightSavings}
                </span>
                <span className="font-black text-emerald-400 text-sm">
                  +{formatINR(totalEstimatedCashSavings)} {pt.extraNetProfit}
                </span>
              </div>
            ) : (
              <p className="mt-2 text-center text-[11px] text-slate-400 font-medium">
                {pt.checkFarmersTip}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            {pt.closeBtn}
          </button>

          <button
            type="button"
            id="apply-pooled-to-profit-btn"
            onClick={handleApplyToProfitCalculator}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{pt.applyBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Conditional Persistent Floating Button Component ---
interface FarmerConnectFloatingButtonProps {
  harvestQuantity: number;
  cropName: string;
  onClick: () => void;
  pooledFarmersCount?: number;
  language?: Language;
}

export const FarmerConnectFloatingButton: React.FC<FarmerConnectFloatingButtonProps> = ({
  harvestQuantity,
  cropName,
  onClick,
  pooledFarmersCount = 0,
  language = 'en',
}) => {
  const t = translations[language] || translations.en;
  // CRITICAL VISIBILITY RULE:
  // Show this button ONLY if the user's selected crop quantity is strictly less than 15 quintals (< 15 quintals).
  // If quantity is 15 quintals or more, hide the button completely.
  if (harvestQuantity >= 15) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
      <button
        id="connect-with-farmers-floating-btn"
        type="button"
        onClick={onClick}
        aria-label="Connect with nearby farmers to pool vehicle and cut freight"
        className="group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white rounded-full shadow-xl border-2 border-emerald-400/50 hover:shadow-2xl active:scale-95 transition-all cursor-pointer select-none"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
            <Users className="w-4 h-4 text-emerald-100" />
          </div>
          {pooledFarmersCount > 0 ? (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
              {pooledFarmersCount}
            </span>
          ) : (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          )}
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-black tracking-tight leading-tight">
              {t.connectWithFarmersBtn}
            </span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full uppercase">
              {t.smallYieldBadge}
            </span>
          </div>
          <span className="text-[10px] text-emerald-100 block leading-none mt-0.5">
            {pooledFarmersCount > 0
              ? `${pooledFarmersCount} ${t.farmersPooledStatus}`
              : `${cropName} ${t.poolTruckSubtitle}`}
          </span>
        </div>
      </button>
    </div>
  );
};
