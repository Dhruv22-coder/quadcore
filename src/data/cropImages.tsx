import React, { useState } from 'react';
import { CropIcon } from '../components/CropIcons';

export interface CropImageInfo {
  url: string;
  alt: string;
  credit?: string;
}

export const CROP_HD_IMAGES: Record<string, CropImageInfo> = {
  wheat: {
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    alt: 'Golden Wheat harvest field with ripe grains',
  },
  paddy: {
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    alt: 'Basmati Rice paddy grains and harvest',
  },
  maize: {
    url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    alt: 'Ripe golden maize and corn cobs',
  },
  bajra: {
    url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    alt: 'Pearl millet (Bajra) grains and stalks',
  },
  jowar: {
    url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    alt: 'Sorghum (Jowar) grains and ear heads',
  },
  ragi: {
    url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    alt: 'Finger millet (Ragi) brown healthy grains',
  },
  chana: {
    url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    alt: 'Chickpeas (Chana / Bengal Gram) whole grains',
  },
  tur: {
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    alt: 'Pigeon pea (Tur / Arhar dal) yellow pulses',
  },
  moong: {
    url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80',
    alt: 'Green gram (Moong) whole organic beans',
  },
  urad: {
    url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
    alt: 'Black gram (Urad dal) whole beans',
  },
  soybean: {
    url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    alt: 'Soybeans clean harvested agricultural seeds',
  },
  mustard: {
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    alt: 'Golden mustard seeds and blooming flowers',
  },
  groundnut: {
    url: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh raw peanuts and groundnuts in shells',
  },
  cotton: {
    url: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80',
    alt: 'Fluffy white raw cotton bolls on plant',
  },
  sugarcane: {
    url: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh green sugarcane stalks in lush field',
  },
  jute: {
    url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80',
    alt: 'Golden natural raw jute fibers and bundles',
  },
  onion: {
    url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh crisp red onion bulbs harvested from farm',
  },
  garlic: {
    url: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
    alt: 'Whole white farm-fresh garlic heads and cloves',
  },
  red_chilli: {
    url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    alt: 'Bright spicy sun-dried red chillies',
  },
  turmeric: {
    url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh raw turmeric root rhizomes and pure haldi',
  },
  ginger: {
    url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh organic aromatic ginger root',
  },
  cumin: {
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    alt: 'Whole aromatic cumin seeds (Jeera)',
  },
  coriander: {
    url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh green coriander leaves and seeds',
  },
  tomato: {
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh ripe red juicy vine tomatoes',
  },
  potato: {
    url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    alt: 'Farm fresh clean golden harvest potatoes',
  },
  green_peas: {
    url: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh sweet green peas in pod',
  },
  cauliflower: {
    url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh whole crisp white cauliflower head',
  },
  apple: {
    url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh glossy crisp red delicious apples',
  },
  banana: {
    url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh ripe golden yellow banana bunch',
  },
  tea: {
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh lush green tea leaves plucked on plantation',
  },
  coffee: {
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh coffee beans and ripe coffee cherries',
  },
  coconut: {
    url: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh organic whole coconuts and coconut water',
  },
};

export function getCropImageUrl(cropId: string): string {
  return (
    CROP_HD_IMAGES[cropId]?.url ||
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  );
}

export function getCropImageAlt(cropId: string, fallbackName?: string): string {
  return CROP_HD_IMAGES[cropId]?.alt || `${fallbackName || cropId} real crop photography`;
}

interface CropImageProps {
  id: string;
  name?: string;
  className?: string;
  imgClassName?: string;
  fallbackIconClassName?: string;
  showBadge?: boolean;
}

export const CropImage: React.FC<CropImageProps> = ({
  id,
  name,
  className = 'w-full h-24',
  imgClassName = 'w-full h-full object-cover',
  fallbackIconClassName = 'w-10 h-10',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageInfo = CROP_HD_IMAGES[id];
  const src = imageInfo?.url;
  const alt = imageInfo?.alt || `${name || id} photograph`;

  if (hasError || !src) {
    return (
      <div className={`flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden ${className}`}>
        <CropIcon id={id} className={fallbackIconClassName} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-100 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <CropIcon id={id} className="w-6 h-6 opacity-30" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${imgClassName} transition-all duration-300 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
    </div>
  );
};
