import React, { useState, useEffect } from 'react';
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
    url: '/crops/bajra.jpg',
    alt: 'Pearl millet (Bajra) stalks with dense seed heads in farm field',
  },
  jowar: {
    url: '/crops/jowar.jpg',
    alt: 'Sorghum (Jowar) crop ear heads with round ripe grains',
  },
  ragi: {
    url: '/crops/ragi.jpg',
    alt: 'Finger millet (Ragi) finger panicles and reddish-brown grains',
  },
  chana: {
    url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    alt: 'Chickpeas (Chana / Bengal Gram) whole grains',
  },
  tur: {
    url: '/crops/tur.jpg',
    alt: 'Pigeon pea (Tur / Arhar dal) golden yellow split pulses',
  },
  moong: {
    url: '/crops/moong.jpg',
    alt: 'Green gram (Moong dal) whole organic green beans',
  },
  urad: {
    url: '/crops/urad.jpg',
    alt: 'Black gram (Urad dal) whole black pulse beans',
  },
  soybean: {
    url: '/crops/soybean.jpg',
    alt: 'Golden-yellow Soybeans clean harvested agricultural seeds',
  },
  mustard: {
    url: '/crops/mustard.jpg',
    alt: 'Blooming yellow mustard (Sarson) field and clean mustard seeds',
  },
  groundnut: {
    url: '/crops/groundnut.jpg',
    alt: 'Freshly harvested raw groundnuts (peanuts / moongphali) with kernels',
  },
  cotton: {
    url: '/crops/cotton.jpg',
    alt: 'Ripe fluffy white cotton bolls ready for harvest on plant',
  },
  sugarcane: {
    url: '/crops/sugarcane.jpg',
    alt: 'Fresh thick juicy purple and green sugarcane stalks',
  },
  jute: {
    url: '/crops/jute.jpg',
    alt: 'Golden natural raw jute fibers and bundles drying',
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
    url: '/crops/ginger.jpg',
    alt: 'Freshly harvested organic raw ginger rhizomes (Adrak)',
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
    url: '/crops/green_peas.jpg',
    alt: 'Fresh plump sweet green peas in open pods (Matar)',
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
    url: '/crops/tea.jpg',
    alt: 'Fresh lush green tea plantation terraces and leaves',
  },
  coffee: {
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh coffee beans and ripe coffee cherries',
  },
  coconut: {
    url: '/crops/coconut.jpg',
    alt: 'Fresh whole green coconuts and brown coconut with kernel',
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

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [id, src]);

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
