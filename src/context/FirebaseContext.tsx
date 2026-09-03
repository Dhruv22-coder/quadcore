import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  getFarmerProfile,
  syncFarmerProfile,
  subscribeToWatchlist,
  addOrUpdateWatchedCrop,
  removeWatchedCrop,
  subscribeToSalesRecords,
  logMandiSale,
  deleteMandiSale,
  subscribeToCommunityTips,
  addCommunityTip,
  upvoteCommunityTip,
  publishOrUpdateFarmerPool,
  FarmerProfile,
  WatchedCropItem,
  MandiSaleRecord,
  CommunityTipItem,
  FarmerPoolItem,
} from '../lib/firebase';
import { Language, IndianState } from '../types';

interface FirebaseContextType {
  user: User | null;
  authLoading: boolean;
  profile: FarmerProfile | null;
  userProfile: FarmerProfile | null; // Alias
  watchlist: WatchedCropItem[];
  salesRecords: MandiSaleRecord[];
  communityTips: CommunityTipItem[];
  isCloudSyncing: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleWatchCrop: (cropId: string, cropName: string, minPrice?: number, maxPrice?: number) => Promise<void>;
  isCropWatched: (cropId: string) => boolean;
  recordSale: (sale: Omit<MandiSaleRecord, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  removeSale: (saleId: string) => Promise<void>;
  postTip: (cropName: string, tipText: string, mandiName?: string) => Promise<void>;
  likeTip: (tipId: string, currentLikes: number) => Promise<void>;
  syncCurrentPreferences: (stateId: string, language: Language, isSunlightMode: boolean) => Promise<void>;
  
  // Background State Sync
  syncActiveCropAndYield: (cropId: string, cropName: string, quantity: number, unit?: string) => Promise<void>;
  saveFarmerContactInfo: (displayName: string, phone: string, village?: string, lat?: number, lng?: number) => Promise<void>;
  
  // Farmer Load Pooling (< 15 Quintals)
  pooledFarmers: FarmerPoolItem[];
  toggleSelectPooledFarmer: (farmer: FarmerPoolItem) => void;
  setPooledFarmers: React.Dispatch<React.SetStateAction<FarmerPoolItem[]>>;
  isPooledProfitMode: boolean;
  setIsPooledProfitMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{
  children: React.ReactNode;
  initialState?: IndianState;
  initialLanguage?: Language;
  initialSunlightMode?: boolean;
  onRestorePreferences?: (stateId: string, lang: Language, sunlightMode: boolean) => void;
}> = ({
  children,
  initialState,
  initialLanguage = 'en',
  initialSunlightMode = false,
  onRestorePreferences,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<FarmerProfile | null>(() => {
    // Initial restoration from localStorage for instant display
    try {
      const cached = localStorage.getItem('mandimitra_farmer_profile');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return null;
  });
  const [watchlist, setWatchlist] = useState<WatchedCropItem[]>([]);
  const [salesRecords, setSalesRecords] = useState<MandiSaleRecord[]>([]);
  const [communityTips, setCommunityTips] = useState<CommunityTipItem[]>([]);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  
  // Pooling state
  const [pooledFarmers, setPooledFarmers] = useState<FarmerPoolItem[]>(() => {
    try {
      const cached = localStorage.getItem('mandimitra_pooled_farmers');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return [];
  });
  const [isPooledProfitMode, setIsPooledProfitMode] = useState<boolean>(false);

  // Auto initialize anonymous session if not signed in, so background sync works out of the box
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;
      setUser(firebaseUser);
      setAuthLoading(false);

      if (firebaseUser) {
        setIsCloudSyncing(true);
        try {
          const existingProfile = await getFarmerProfile(firebaseUser.uid);
          if (existingProfile) {
            setProfile(existingProfile);
            localStorage.setItem('mandimitra_farmer_profile', JSON.stringify(existingProfile));
            if (onRestorePreferences) {
              onRestorePreferences(
                existingProfile.state,
                existingProfile.language as Language,
                existingProfile.isSunlightMode ?? false
              );
            }
          } else {
            // First time registration: create cloud profile
            const newProfile: FarmerProfile = {
              id: firebaseUser.uid,
              displayName: firebaseUser.displayName || profile?.displayName || 'Kisan Mitra',
              email: firebaseUser.email || profile?.email || '',
              phone: profile?.phone || '',
              state: initialState?.id || 'maharashtra',
              language: initialLanguage,
              isSunlightMode: initialSunlightMode,
              selectedCropId: profile?.selectedCropId,
              selectedCropName: profile?.selectedCropName,
              quantity: profile?.quantity ?? 12,
              unit: profile?.unit || 'quintals',
              updatedAt: new Date().toISOString(),
            };
            await syncFarmerProfile(newProfile);
            setProfile(newProfile);
            localStorage.setItem('mandimitra_farmer_profile', JSON.stringify(newProfile));
          }
        } catch (err) {
          console.error('Failed to fetch/sync farmer profile:', err);
        } finally {
          setIsCloudSyncing(false);
        }
      } else {
        // Try anonymous sign-in so user has an active Firestore UID seamlessly
        try {
          await signInAnonymously(auth);
        } catch (anonErr) {
          console.log('Anonymous sign-in unavailable, proceeding with local farmer state:', anonErr);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Save pooled farmers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mandimitra_pooled_farmers', JSON.stringify(pooledFarmers));
    } catch {
      // ignore
    }
  }, [pooledFarmers]);

  // Listen to user-specific subcollections when logged in
  useEffect(() => {
    if (!user) return;

    // Realtime Watchlist
    const unsubWatchlist = subscribeToWatchlist(user.uid, (items) => {
      setWatchlist(items);
    });

    // Realtime Sales
    const unsubSales = subscribeToSalesRecords(user.uid, (items) => {
      setSalesRecords(items);
    });

    return () => {
      unsubWatchlist();
      unsubSales();
    };
  }, [user]);

  // Listen to public Community Tips for all visitors
  useEffect(() => {
    const unsubTips = subscribeToCommunityTips((items) => {
      setCommunityTips(items);
    });
    return () => unsubTips();
  }, []);

  const signIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const syncCurrentPreferences = async (
    stateId: string,
    language: Language,
    isSunlightMode: boolean
  ) => {
    if (!user) return;
    try {
      setIsCloudSyncing(true);
      const updated: FarmerProfile = {
        id: user.uid,
        displayName: user.displayName || profile?.displayName || 'Farmer',
        email: user.email || profile?.email || '',
        state: stateId,
        language,
        isSunlightMode,
        updatedAt: new Date().toISOString(),
      };
      await syncFarmerProfile(updated);
      setProfile(updated);
    } catch (err) {
      console.error('Failed to sync preferences:', err);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const toggleWatchCrop = async (
    cropId: string,
    cropName: string,
    minPrice?: number,
    maxPrice?: number
  ) => {
    if (!user) {
      await signIn();
      return;
    }
    const isAlreadyWatched = watchlist.some((w) => w.cropId === cropId);
    try {
      if (isAlreadyWatched) {
        const item = watchlist.find((w) => w.cropId === cropId);
        if (item) {
          await removeWatchedCrop(user.uid, item.id);
        }
      } else {
        const newItem: WatchedCropItem = {
          id: `${cropId}_${Date.now()}`,
          cropId,
          cropName,
          targetMinPrice: minPrice,
          targetMaxPrice: maxPrice,
          userId: user.uid,
          updatedAt: new Date().toISOString(),
        };
        await addOrUpdateWatchedCrop(user.uid, newItem);
      }
    } catch (err) {
      console.error('Failed to toggle watchlist:', err);
    }
  };

  const isCropWatched = (cropId: string) => {
    return watchlist.some((w) => w.cropId === cropId);
  };

  const recordSale = async (
    saleData: Omit<MandiSaleRecord, 'id' | 'userId' | 'createdAt'>
  ) => {
    if (!user) {
      await signIn();
      return;
    }
    const newRecord: MandiSaleRecord = {
      ...saleData,
      id: `sale_${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    await logMandiSale(newRecord);
  };

  const removeSale = async (saleId: string) => {
    if (!user) return;
    await deleteMandiSale(user.uid, saleId);
  };

  const postTip = async (cropName: string, tipText: string, mandiName?: string) => {
    if (!user) {
      await signIn();
      return;
    }
    const newTip: CommunityTipItem = {
      id: `tip_${Date.now()}`,
      authorId: user.uid,
      authorName: user.displayName || 'Fellow Farmer',
      cropName,
      mandiName: mandiName || '',
      tipText,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };
    await addCommunityTip(newTip);
  };

  const likeTip = async (tipId: string, currentLikes: number) => {
    if (!user) {
      await signIn();
      return;
    }
    await upvoteCommunityTip(tipId, currentLikes);
  };

  // Automatic Background State Sync to Firestore for selected crop & harvest yield
  const syncActiveCropAndYield = useCallback(
    async (cropId: string, cropName: string, quantity: number, unit: string = 'quintals') => {
      // Update local profile state immediately for instant feedback
      setProfile((prev) => {
        const updated: FarmerProfile = {
          id: user?.uid || prev?.id || 'local_farmer',
          displayName: user?.displayName || prev?.displayName || 'Kisan Mitra',
          email: user?.email || prev?.email || '',
          phone: prev?.phone || '',
          state: prev?.state || initialState?.id || 'maharashtra',
          language: prev?.language || initialLanguage,
          isSunlightMode: prev?.isSunlightMode ?? initialSunlightMode,
          selectedCropId: cropId,
          selectedCropName: cropName,
          quantity,
          unit,
          lat: prev?.lat,
          lng: prev?.lng,
          village: prev?.village,
          updatedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem('mandimitra_farmer_profile', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      // If user is authenticated in Firebase (or anonymous), sync to Firestore active document
      if (user) {
        try {
          const docPayload: Partial<FarmerProfile> = {
            id: user.uid,
            displayName: user.displayName || profile?.displayName || 'Kisan Mitra',
            email: user.email || profile?.email || '',
            phone: profile?.phone || '',
            state: profile?.state || initialState?.id || 'maharashtra',
            language: profile?.language || initialLanguage,
            isSunlightMode: profile?.isSunlightMode ?? initialSunlightMode,
            selectedCropId: cropId,
            selectedCropName: cropName,
            quantity,
            unit,
            updatedAt: new Date().toISOString(),
          };
          await syncFarmerProfile(docPayload as FarmerProfile);

          // If quantity < 15 and farmer has contact info, also update active farmerPools entry
          if (quantity < 15 && profile?.displayName && profile?.phone) {
            const poolEntry: FarmerPoolItem = {
              id: `pool_${user.uid}`,
              userId: user.uid,
              farmerName: profile.displayName,
              phone: profile.phone,
              cropId,
              cropName,
              quantity,
              unit,
              lat: profile.lat || initialState?.lat || 19.7515,
              lng: profile.lng || initialState?.lng || 75.7139,
              village: profile.village || '',
              state: profile.state || initialState?.id || 'maharashtra',
              updatedAt: new Date().toISOString(),
            };
            await publishOrUpdateFarmerPool(poolEntry);
          }
        } catch (err) {
          console.warn('Background sync to Firestore skipped or throttled:', err);
        }
      }
    },
    [user, profile, initialState, initialLanguage, initialSunlightMode]
  );

  // Save farmer contact info (Name and Phone) once so user is NEVER prompted again
  const saveFarmerContactInfo = useCallback(
    async (displayName: string, phone: string, village?: string, lat?: number, lng?: number) => {
      const updatedProfile: FarmerProfile = {
        id: user?.uid || profile?.id || 'local_farmer',
        displayName,
        phone,
        email: user?.email || profile?.email || '',
        state: profile?.state || initialState?.id || 'maharashtra',
        language: profile?.language || initialLanguage,
        isSunlightMode: profile?.isSunlightMode ?? initialSunlightMode,
        selectedCropId: profile?.selectedCropId,
        selectedCropName: profile?.selectedCropName,
        quantity: profile?.quantity ?? 12,
        unit: profile?.unit || 'quintals',
        lat: lat ?? profile?.lat,
        lng: lng ?? profile?.lng,
        village: village ?? profile?.village,
        updatedAt: new Date().toISOString(),
      };

      setProfile(updatedProfile);
      try {
        localStorage.setItem('mandimitra_farmer_profile', JSON.stringify(updatedProfile));
      } catch {
        // ignore
      }

      if (user) {
        try {
          await syncFarmerProfile(updatedProfile);

          // If small yield, also publish to farmerPools
          if ((updatedProfile.quantity ?? 12) < 15 && updatedProfile.selectedCropId && updatedProfile.selectedCropName) {
            const poolEntry: FarmerPoolItem = {
              id: `pool_${user.uid}`,
              userId: user.uid,
              farmerName: displayName,
              phone,
              cropId: updatedProfile.selectedCropId,
              cropName: updatedProfile.selectedCropName,
              quantity: updatedProfile.quantity ?? 12,
              unit: updatedProfile.unit || 'quintals',
              lat: lat || updatedProfile.lat || initialState?.lat || 19.7515,
              lng: lng || updatedProfile.lng || initialState?.lng || 75.7139,
              village: village || updatedProfile.village || '',
              state: updatedProfile.state,
              updatedAt: new Date().toISOString(),
            };
            await publishOrUpdateFarmerPool(poolEntry);
          }
        } catch (err) {
          console.error('Failed to sync contact info to Firestore:', err);
        }
      }
    },
    [user, profile, initialState, initialLanguage, initialSunlightMode]
  );

  // Toggle selection of a nearby collaborating farmer to pool with
  const toggleSelectPooledFarmer = useCallback((farmer: FarmerPoolItem) => {
    setPooledFarmers((prev) => {
      const exists = prev.some((f) => f.id === farmer.id);
      if (exists) {
        return prev.filter((f) => f.id !== farmer.id);
      } else {
        return [...prev, farmer];
      }
    });
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authLoading,
        profile,
        userProfile: profile,
        watchlist,
        salesRecords,
        communityTips,
        isCloudSyncing,
        signIn,
        signOut,
        toggleWatchCrop,
        isCropWatched,
        recordSale,
        removeSale,
        postTip,
        likeTip,
        syncCurrentPreferences,
        syncActiveCropAndYield,
        saveFarmerContactInfo,
        pooledFarmers,
        toggleSelectPooledFarmer,
        setPooledFarmers,
        isPooledProfitMode,
        setIsPooledProfitMode,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
