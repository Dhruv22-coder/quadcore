import React, { useState, useEffect } from 'react';
import { CropIcon } from '../components/CropIcons';

import bajraImg from '../assets/images/bajra_millet_crop_1788449566013.jpg';
import coconutImg from '../assets/images/coconut_fresh_crop_1788450316117.jpg';
import cottonImg from '../assets/images/cotton_bolls_crop_1788450254704.jpg';
import gingerImg from '../assets/images/ginger_adrak_crop_1788450331069.jpg';
import greenPeasImg from '../assets/images/green_peas_matar_crop_1788450300353.jpg';
import groundnutImg from '../assets/images/groundnut_peanut_crop_1788450232690.jpg';
import jowarImg from '../assets/images/jowar_sorghum_crop_1788449601021.jpg';
import juteImg from '../assets/images/jute_fiber_crop_1788449666924.jpg';
import moongImg from '../assets/images/moong_dal_crop_1788449647057.jpg';
import mustardImg from '../assets/images/mustard_sarson_crop_1788450286775.jpg';
import ragiImg from '../assets/images/ragi_millet_crop_1788449582919.jpg';
import soybeanImg from '../assets/images/soybean_seeds_crop_1788449617302.jpg';
import sugarcaneImg from '../assets/images/sugarcane_stalks_crop_1788450269826.jpg';
import teaImg from '../assets/images/tea_plantation_crop_1788449521532.jpg';
import turImg from '../assets/images/tur_dal_crop_1788449633240.jpg';
import uradImg from '../assets/images/urad_dal_crop_1788449547403.jpg';

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
    url: bajraImg,
    alt: 'Pearl millet (Bajra) stalks with dense seed heads in farm field',
  },
  jowar: {
    url: jowarImg,
    alt: 'Sorghum (Jowar) crop ear heads with round ripe grains',
  },
  ragi: {
    url: ragiImg,
    alt: 'Finger millet (Ragi) finger panicles and reddish-brown grains',
  },
  chana: {
    url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    alt: 'Chickpeas (Chana / Bengal Gram) whole grains',
  },
  tur: {
    url: turImg,
    alt: 'Pigeon pea (Tur / Arhar dal) golden yellow split pulses',
  },
  moong: {
    url: moongImg,
    alt: 'Green gram (Moong dal) whole organic green beans',
  },
  urad: {
    url: uradImg,
    alt: 'Black gram (Urad dal) whole black pulse beans',
  },
  soybean: {
    url: soybeanImg,
    alt: 'Golden-yellow Soybeans clean harvested agricultural seeds',
  },
  mustard: {
    url: mustardImg,
    alt: 'Blooming yellow mustard (Sarson) field and clean mustard seeds',
  },
  groundnut: {
    url: groundnutImg,
    alt: 'Freshly harvested raw groundnuts (peanuts / moongphali) with kernels',
  },
  cotton: {
    url: cottonImg,
    alt: 'Ripe fluffy white cotton bolls ready for harvest on plant',
  },
  sugarcane: {
    url: sugarcaneImg,
    alt: 'Fresh thick juicy purple and green sugarcane stalks',
  },
  jute: {
    url: juteImg,
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
    url: gingerImg,
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
    url: greenPeasImg,
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
    url: teaImg,
    alt: 'Fresh lush green tea plantation terraces and leaves',
  },
  coffee: {
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh coffee beans and ripe coffee cherries',
  },
  coconut: {
    url: coconutImg,
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
