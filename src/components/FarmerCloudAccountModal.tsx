import React, { useState } from 'react';
import {
  X,
  Cloud,
  CheckCircle2,
  Bookmark,
  TrendingUp,
  Trash2,
  Plus,
  ThumbsUp,
  MessageSquare,
  LogOut,
  Sparkles,
  ShieldCheck,
  Calendar,
  DollarSign,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { CropData, Language } from '../types';
import { formatINR } from '../lib/utils';

interface FarmerCloudAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  crops: CropData[];
  selectedCrop: CropData;
  onSelectCrop: (crop: CropData) => void;
}

export const FarmerCloudAccountModal: React.FC<FarmerCloudAccountModalProps> = ({
  isOpen,
  onClose,
  language,
  crops,
  selectedCrop,
  onSelectCrop,
}) => {
  const {
    user,
    authLoading,
    signIn,
    signOut,
    watchlist,
    salesRecords,
    communityTips,
    toggleWatchCrop,
    isCropWatched,
    recordSale,
    removeSale,
    postTip,
    likeTip,
    isCloudSyncing,
  } = useFirebase();

  const [activeTab, setActiveTab] = useState<'watchlist' | 'sales' | 'community'>('watchlist');

  // New Sale Form State
  const [showAddSale, setShowAddSale] = useState(false);
  const [saleCropId, setSaleCropId] = useState(selectedCrop.id);
  const [saleMandi, setSaleMandi] = useState(selectedCrop.mandis[0]?.name || 'Local Mandi');
  const [saleQuintals, setSaleQuintals] = useState<number>(20);
  const [saleRate, setSaleRate] = useState<number>(selectedCrop.currentPrice);
  const [saleTransport, setSaleTransport] = useState<number>(1200);
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // New Tip Form State
  const [showAddTip, setShowAddTip] = useState(false);
  const [tipCrop, setTipCrop] = useState(selectedCrop.name);
  const [tipMandi, setTipMandi] = useState(selectedCrop.mandis[0]?.name || '');
  const [tipText, setTipText] = useState('');

  if (!isOpen) return null;

  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const cropObj = crops.find((c) => c.id === saleCropId) || selectedCrop;
    const grossRevenue = saleQuintals * saleRate;
    const netProfit = grossRevenue - saleTransport;

    await recordSale({
      cropId: cropObj.id,
      cropName: cropObj.name,
      mandiName: saleMandi,
      quantityQuintals: Number(saleQuintals),
      ratePerQuintal: Number(saleRate),
      transportCost: Number(saleTransport),
      netProfit,
      saleDate,
    });
    setShowAddSale(false);
  };

  const handleSaveTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipText.trim()) return;
    await postTip(tipCrop, tipText.trim(), tipMandi.trim());
    setTipText('');
    setShowAddTip(false);
  };

  // Calculations for Sales summary
  const totalQuintalsSold = salesRecords.reduce((sum, s) => sum + (s.quantityQuintals || 0), 0);
  const totalNetRevenue = salesRecords.reduce((sum, s) => sum + (s.netProfit || 0), 0);

  return (
    <div
      id="farmer-cloud-account-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white dark:from-slate-800 dark:via-slate-850 dark:to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Cloud className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Kisan Cloud Sync (Firebase)
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Live Firestore
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Persistent watchlist, sales records, and farmer community intel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Authentication Banner */}
        <div className="px-4 py-3 sm:px-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {authLoading ? (
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>Connecting to Firebase...</span>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Farmer'}
                  className="w-9 h-9 rounded-full border border-emerald-500 object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center shrink-0">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'K'}
                </div>
              )}
              <div className="truncate">
                <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
                  {user.displayName || 'Kisan Mitra'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                  {user.email}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sign in with Google to preserve your records permanently</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {isCloudSyncing && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Syncing...
              </span>
            )}
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="h-8 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={signIn}
                className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-5">
          <button
            type="button"
            onClick={() => setActiveTab('watchlist')}
            className={`py-3 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'watchlist'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Watchlist</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              {watchlist.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`py-3 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'sales'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Sales & Profits Log</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              {salesRecords.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('community')}
            className={`py-3 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'community'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Tips</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              {communityTips.length}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: WATCHLIST */}
          {activeTab === 'watchlist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Pinned Crops for Target Monitoring
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Keep your primary harvest crops pinned for quick decision checks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleWatchCrop(selectedCrop.id, selectedCrop.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isCropWatched(selectedCrop.id)
                      ? 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isCropWatched(selectedCrop.id) ? 'fill-amber-500 text-amber-500' : ''
                    }`}
                  />
                  <span>
                    {isCropWatched(selectedCrop.id)
                      ? `Unpin ${selectedCrop.name}`
                      : `+ Pin ${selectedCrop.name}`}
                  </span>
                </button>
              </div>

              {!user && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
                  <span>Sign in above with Google to save your pinned crops to Firestore.</span>
                  <button
                    type="button"
                    onClick={signIn}
                    className="font-bold underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {watchlist.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    No crops in your watchlist yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click "Pin {selectedCrop.name}" above to start tracking prices in Firestore.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {watchlist.map((item) => {
                    const matchedCrop = crops.find((c) => c.id === item.cropId);
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-300 transition-all flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="truncate">
                          <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
                            {item.cropName}
                          </span>
                          {matchedCrop && (
                            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 block tabular-nums">
                              {formatINR(matchedCrop.currentPrice)} / quintal
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {matchedCrop && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectCrop(matchedCrop);
                                onClose();
                              }}
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                            >
                              <span>View</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleWatchCrop(item.cropId, item.cropName)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                            title="Remove from watchlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SALES RECORDS */}
          {activeTab === 'sales' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Farmer Mandi Sales & Profits
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Log and track your historical harvest revenue and transport deductions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddSale(!showAddSale)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddSale ? 'Cancel' : 'Log Sale'}</span>
                </button>
              </div>

              {/* Metric Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                    Total Volume Sold
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums">
                    {totalQuintalsSold} Quintals
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block uppercase">
                    Net Realized Revenue
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-200 tabular-nums">
                    {formatINR(totalNetRevenue)}
                  </span>
                </div>
              </div>

              {/* Add Sale Form */}
              {showAddSale && (
                <form
                  onSubmit={handleSaveSale}
                  className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3"
                >
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    Record New Mandi Transaction
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Crop
                      </label>
                      <select
                        value={saleCropId}
                        onChange={(e) => {
                          setSaleCropId(e.target.value);
                          const c = crops.find((item) => item.id === e.target.value);
                          if (c) {
                            setSaleRate(c.currentPrice);
                            if (c.mandis[0]) setSaleMandi(c.mandis[0].name);
                          }
                        }}
                        className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      >
                        {crops.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Mandi / Market
                      </label>
                      <input
                        type="text"
                        value={saleMandi}
                        onChange={(e) => setSaleMandi(e.target.value)}
                        placeholder="e.g. Vashi APMC"
                        required
                        className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Quantity (Quintals)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={saleQuintals}
                        onChange={(e) => setSaleQuintals(Number(e.target.value))}
                        required
                        className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Rate per Quintal (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={saleRate}
                        onChange={(e) => setSaleRate(Number(e.target.value))}
                        required
                        className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Transport & Labour Cost (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={saleTransport}
                        onChange={(e) => setSaleTransport(Number(e.target.value))}
                        className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Sale Date
                      </label>
                      <input
                        type="date"
                        value={saleDate}
                        onChange={(e) => setSaleDate(e.target.value)}
                        required
                        className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddSale(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
                    >
                      Save to Cloud
                    </button>
                  </div>
                </form>
              )}

              {/* Records List */}
              {salesRecords.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <DollarSign className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    No mandi sales logged yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click "Log Sale" to save your transaction history to Firestore.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {salesRecords.map((sale) => (
                    <div
                      key={sale.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {sale.cropName}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            • {sale.mandiName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {sale.saleDate}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 flex-wrap">
                          <span>{sale.quantityQuintals} Q @ {formatINR(sale.ratePerQuintal)}/Q</span>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                            Net: {formatINR(sale.netProfit || 0)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSale(sale.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer shrink-0"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMUNITY TIPS */}
          {activeTab === 'community' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Live Farmer Community Advisories
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Crowdsourced market intel, arrival rushes, and mandi alerts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTip(!showAddTip)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddTip ? 'Cancel' : 'Share Tip'}</span>
                </button>
              </div>

              {/* Share Tip Form */}
              {showAddTip && (
                <form
                  onSubmit={handleSaveTip}
                  className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3"
                >
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    Share Market Advisory with Other Farmers
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Crop Name
                      </label>
                      <input
                        type="text"
                        value={tipCrop}
                        onChange={(e) => setTipCrop(e.target.value)}
                        placeholder="e.g. Onion, Soybean"
                        required
                        className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        Mandi Location (Optional)
                      </label>
                      <input
                        type="text"
                        value={tipMandi}
                        onChange={(e) => setTipMandi(e.target.value)}
                        placeholder="e.g. Lasalgaon Mandi"
                        className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                      Advice / Market Observation
                    </label>
                    <textarea
                      rows={3}
                      value={tipText}
                      onChange={(e) => setTipText(e.target.value)}
                      placeholder="e.g. Traders offered ₹200 higher for dry sorted lots this morning. Heavy truck queue after 11 AM."
                      required
                      maxLength={500}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddTip(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
                    >
                      Broadcast to Farmers
                    </button>
                  </div>
                </form>
              )}

              {communityTips.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    No community tips posted yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Be the first farmer to share a tip for your local mandi!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {communityTips.map((tip) => (
                    <div
                      key={tip.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            {tip.cropName}
                          </span>
                          {tip.mandiName && (
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              @{tip.mandiName}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {tip.authorName}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        "{tip.tipText}"
                      </p>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-[10px] text-slate-400">
                          {new Date(tip.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => likeTip(tip.id, tip.upvotes || 0)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950 text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 flex items-center gap-1.5 text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({tip.upvotes || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-4 sm:px-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500">
          <span>Project: mandimitra-fc517 • Region: asia-south1</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
