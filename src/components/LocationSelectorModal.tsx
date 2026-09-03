import React, { useState } from 'react';
import { MapPin, Navigation, Check, X, Search, Sparkles } from 'lucide-react';
import { IndianState, Language } from '../types';
import { INDIAN_STATES, detectStateFromCoordinates } from '../data/locations';
import { translations } from '../lib/utils';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: IndianState;
  onSelectState: (state: IndianState, autoUpdateLanguage?: boolean) => void;
  language: Language;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onSelectState,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const t = translations[language];

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('GPS location is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        const { latitude, longitude } = position.coords;
        const matched = detectStateFromCoordinates(latitude, longitude);
        onSelectState(matched, true);
        onClose();
      },
      (error) => {
        setIsDetectingGps(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Location access was denied. Please select your state below.');
        } else {
          setGpsError('Could not retrieve GPS coordinates. Please select your state below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredStates = INDIAN_STATES.filter((state) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      state.name.toLowerCase().includes(q) ||
      state.hindiName.toLowerCase().includes(q) ||
      state.nativeName.toLowerCase().includes(q) ||
      state.keyMandi.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {t.changeLocation}
              </h2>
              <p className="text-xs text-slate-500">
                Choose your state for regional language & mandi priority
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Action */}
        <div className="p-3 sm:p-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-col gap-2">
          <button
            onClick={handleDetectGPS}
            disabled={isDetectingGps}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors"
          >
            <Navigation className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
            <span>{isDetectingGps ? 'Detecting Location...' : t.detectLocation}</span>
          </button>
          {gpsError && (
            <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-md border border-rose-200">
              {gpsError}
            </p>
          )}
        </div>

        {/* Search Filter */}
        <div className="p-3 sm:px-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search state (e.g., Punjab, Maharashtra, UP)..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* States List */}
        <div className="overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100 space-y-1">
          {filteredStates.map((state) => {
            const isSelected = currentState.id === state.id;
            return (
              <button
                key={state.id}
                onClick={() => {
                  onSelectState(state, true);
                  onClose();
                }}
                className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-50/80 border border-emerald-300'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{state.name}</span>
                    <span className="text-xs text-slate-500 font-medium">({state.nativeName})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                      Lang: {state.language.toUpperCase()}
                    </span>
                    <span className="truncate max-w-[200px] sm:max-w-[260px]">
                      Hub: {state.keyMandi}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100">
                      Select
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Selecting a state automatically configures its native language & nearby mandis.
        </div>
      </div>
    </div>
  );
};
