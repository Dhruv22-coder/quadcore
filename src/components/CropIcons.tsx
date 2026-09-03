import React from 'react';

interface CropIconProps {
  id: string;
  className?: string;
}

export const CropIcon: React.FC<CropIconProps> = ({ id, className = 'w-10 h-10' }) => {
  switch (id) {
    case 'onion':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M32 6C31 12 28 18 24 24C32 20 36 20 40 24C36 17 33 11 32 6Z" fill="#16A34A" />
          <path d="M32 6C34 11 37 15 42 18" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32 20C20 20 12 28 12 40C12 51 21 58 32 58C43 58 52 51 52 40C52 28 44 20 32 20Z" fill="url(#onionGrad)" />
          <path d="M32 20C26 28 24 38 24 48C24 53 27 57 32 58" stroke="#9F1239" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.4" />
          <path d="M32 20C38 28 40 38 40 48C40 53 37 57 32 58" stroke="#9F1239" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.4" />
          <path d="M28 58L26 62M32 58V63M36 58L38 62" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="onionGrad" x1="16" y1="20" x2="48" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="0.6" stopColor="#E11D48" />
              <stop offset="1" stopColor="#9F1239" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'tomato':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M32 6V14" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M32 14L22 11M32 14L42 11M32 14L25 18M32 14L39 18" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="38" r="22" fill="url(#tomatoGrad)" />
          <ellipse cx="25" cy="28" rx="6" ry="3.5" transform="rotate(-30 25 28)" fill="#FFF" fillOpacity="0.35" />
          <defs>
            <linearGradient id="tomatoGrad" x1="18" y1="20" x2="46" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF4444" />
              <stop offset="0.7" stopColor="#DC2626" />
              <stop offset="1" stopColor="#991B1B" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'potato':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M20 22C28 16 42 17 50 25C57 32 55 45 48 52C40 59 24 58 16 49C9 41 12 28 20 22Z" fill="url(#potatoGrad)" />
          <ellipse cx="26" cy="30" rx="2" ry="1" fill="#78350F" fillOpacity="0.6" />
          <ellipse cx="40" cy="28" rx="2.5" ry="1.2" fill="#78350F" fillOpacity="0.6" />
          <ellipse cx="32" cy="42" rx="3" ry="1.5" fill="#78350F" fillOpacity="0.6" />
          <defs>
            <linearGradient id="potatoGrad" x1="14" y1="18" x2="52" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D97706" />
              <stop offset="0.6" stopColor="#B45309" />
              <stop offset="1" stopColor="#78350F" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'wheat':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M32 60V18" stroke="#CA8A04" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 18C30 14 26 12 24 14C22 16 26 22 32 24" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M32 18C34 14 38 12 40 14C42 16 38 22 32 24" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M32 26C28 22 24 20 22 23C20 26 26 31 32 32" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M32 26C36 22 40 20 42 23C44 26 38 31 32 32" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M32 34C28 30 24 29 22 32C20 35 26 39 32 40" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M32 34C36 30 40 29 42 32C44 35 38 39 32 40" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M24 14L16 6M40 14L48 6M22 23L12 18M42 23L52 18" stroke="#CA8A04" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'paddy':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M20 58C26 44 36 26 50 14" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
          <path d="M50 14C42 16 40 24 45 28C48 30 52 24 50 14Z" fill="#A3E635" stroke="#4D7C0F" strokeWidth="1.5" />
          <path d="M42 22C34 24 32 32 38 36C41 38 44 32 42 22Z" fill="#BEF264" stroke="#4D7C0F" strokeWidth="1.5" />
          <path d="M34 30C26 32 25 40 30 44C33 46 36 40 34 30Z" fill="#A3E635" stroke="#4D7C0F" strokeWidth="1.5" />
          <path d="M26 40C20 42 19 48 24 52C27 54 29 48 26 40Z" fill="#BEF264" stroke="#4D7C0F" strokeWidth="1.5" />
        </svg>
      );

    case 'maize':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M16 48C20 30 30 18 48 12C44 26 38 42 20 54" fill="#15803D" fillOpacity="0.4" />
          <ellipse cx="34" cy="32" rx="12" ry="22" transform="rotate(15 34 32)" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          <line x1="26" y1="20" x2="42" y2="24" stroke="#CA8A04" strokeWidth="1.5" />
          <line x1="24" y1="28" x2="44" y2="33" stroke="#CA8A04" strokeWidth="1.5" />
          <line x1="24" y1="36" x2="42" y2="41" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M20 54C28 48 40 46 48 48C46 54 36 58 20 54Z" fill="#16A34A" />
        </svg>
      );

    case 'bajra':
    case 'jowar':
    case 'ragi':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M32 60V22" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="32" cy="24" rx="9" ry="18" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          <circle cx="30" cy="14" r="2" fill="#FDE68A" />
          <circle cx="34" cy="16" r="2" fill="#FDE68A" />
          <circle cx="28" cy="22" r="2.2" fill="#FDE68A" />
          <circle cx="34" cy="24" r="2.2" fill="#FDE68A" />
          <circle cx="30" cy="30" r="2.2" fill="#FDE68A" />
          <circle cx="35" cy="34" r="2" fill="#FDE68A" />
          <path d="M32 6L32 10M26 8L29 11M38 8L35 11" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'chana':
    case 'tur':
    case 'moong':
    case 'urad':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M14 46C20 50 36 48 50 32C56 26 56 16 50 12C42 24 26 36 14 46Z" fill="#84CC16" />
          <circle cx="28" cy="36" r="7" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="40" cy="26" r="6.5" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="49" cy="18" r="5" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <ellipse cx="29" cy="36" rx="1.5" ry="3" fill="#78350F" />
        </svg>
      );

    case 'soybean':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M12 48C18 52 36 50 52 34C58 28 58 18 52 14C44 26 26 38 12 48Z" fill="#65A30D" />
          <circle cx="28" cy="38" r="7" fill="#FDE047" stroke="#65A30D" strokeWidth="1.5" />
          <circle cx="40" cy="28" r="6.5" fill="#FDE047" stroke="#65A30D" strokeWidth="1.5" />
          <circle cx="49" cy="20" r="5" fill="#FDE047" stroke="#65A30D" strokeWidth="1.5" />
        </svg>
      );

    case 'mustard':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M32 58V24" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          {/* Small vibrant yellow 4-petal mustard flowers */}
          <circle cx="32" cy="18" r="5" fill="#FACC15" />
          <circle cx="25" cy="24" r="4.5" fill="#FACC15" />
          <circle cx="39" cy="24" r="4.5" fill="#FACC15" />
          <circle cx="24" cy="14" r="4" fill="#FDE047" />
          <circle cx="40" cy="14" r="4" fill="#FDE047" />
          <circle cx="32" cy="10" r="4.5" fill="#FACC15" />
          <circle cx="32" cy="18" r="2" fill="#CA8A04" />
        </svg>
      );

    case 'groundnut':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Peanut shell pod */}
          <path
            d="M20 38C15 32 16 22 24 16C31 11 39 15 36 24C34 29 38 33 42 34C48 36 53 44 48 50C43 56 32 56 27 50C23 45 23 42 20 38Z"
            fill="#D97706"
            stroke="#92400E"
            strokeWidth="2.5"
          />
          <ellipse cx="26" cy="24" rx="5" ry="7" transform="rotate(-20 26 24)" fill="#B45309" fillOpacity="0.4" />
          <ellipse cx="38" cy="44" rx="6" ry="6" fill="#B45309" fillOpacity="0.4" />
        </svg>
      );

    case 'cotton':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M32 46L24 54M32 46L40 54M32 46V58" stroke="#854D0E" strokeWidth="3" strokeLinecap="round" />
          <path d="M18 42C24 45 40 45 46 42" stroke="#713F12" strokeWidth="2.5" />
          <circle cx="25" cy="34" r="11" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="39" cy="34" r="11" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="32" cy="24" r="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        </svg>
      );

    case 'sugarcane':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M26 60V12" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
          <path d="M38 60V18" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" />
          {/* Nodes */}
          <line x1="22" y1="45" x2="30" y2="45" stroke="#84CC16" strokeWidth="2" />
          <line x1="22" y1="30" x2="30" y2="30" stroke="#84CC16" strokeWidth="2" />
          <line x1="34" y1="48" x2="42" y2="48" stroke="#84CC16" strokeWidth="2" />
          <line x1="34" y1="35" x2="42" y2="35" stroke="#84CC16" strokeWidth="2" />
          {/* Top leaves */}
          <path d="M26 12C20 8 16 6 12 10M26 12C32 6 38 6 42 10" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'jute':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M24 60C26 40 28 20 30 6" stroke="#CA8A04" strokeWidth="3" strokeLinecap="round" />
          <path d="M36 60C34 40 32 20 30 6" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 60V10" stroke="#A16207" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="30" cy="32" r="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
        </svg>
      );

    case 'garlic':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M32 10V18" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32 18C22 18 16 26 16 38C16 50 24 56 32 56C40 56 48 50 48 38C48 26 42 18 32 18Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M32 18C26 26 26 44 32 56" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M32 18C38 26 38 44 32 56" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M28 56L26 60M32 56V61M36 56L38 60" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'red_chilli':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M24 10C26 14 30 16 32 16" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M32 16C40 18 46 28 42 42C38 52 28 58 20 60C22 54 26 48 28 40C30 30 26 22 32 16Z"
            fill="url(#chilliGrad)"
          />
          <defs>
            <linearGradient id="chilliGrad" x1="24" y1="16" x2="40" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF4444" />
              <stop offset="0.7" stopColor="#DC2626" />
              <stop offset="1" stopColor="#991B1B" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'turmeric':
    case 'ginger':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M20 36C18 28 22 22 30 22C36 22 38 28 44 26C50 24 54 30 50 38C46 44 48 50 42 52C34 54 30 48 24 48C18 48 16 42 20 36Z"
            fill="#D97706"
            stroke="#92400E"
            strokeWidth="2.5"
          />
          <line x1="28" y1="28" x2="34" y2="28" stroke="#92400E" strokeWidth="2" />
          <line x1="38" y1="36" x2="44" y2="36" stroke="#92400E" strokeWidth="2" />
          <line x1="26" y1="42" x2="32" y2="42" stroke="#92400E" strokeWidth="2" />
        </svg>
      );

    case 'cumin':
    case 'coriander':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <ellipse cx="26" cy="30" rx="4" ry="12" transform="rotate(-30 26 30)" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
          <ellipse cx="38" cy="24" rx="4" ry="12" transform="rotate(25 38 24)" fill="#92400E" stroke="#451A03" strokeWidth="1.5" />
          <ellipse cx="34" cy="42" rx="4" ry="12" transform="rotate(70 34 42)" fill="#B45309" stroke="#451A03" strokeWidth="1.5" />
        </svg>
      );

    case 'green_peas':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M12 44C20 48 44 44 54 22C46 36 28 40 12 44Z" fill="#16A34A" />
          <circle cx="24" cy="38" r="6" fill="#4ADE80" stroke="#15803D" strokeWidth="1.5" />
          <circle cx="36" cy="32" r="6" fill="#4ADE80" stroke="#15803D" strokeWidth="1.5" />
          <circle cx="47" cy="24" r="5.5" fill="#4ADE80" stroke="#15803D" strokeWidth="1.5" />
        </svg>
      );

    case 'cauliflower':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Leaves */}
          <path d="M14 42C16 26 26 16 32 14C30 24 24 38 14 42Z" fill="#15803D" />
          <path d="M50 42C48 26 38 16 32 14C34 24 40 38 50 42Z" fill="#16A34A" />
          {/* White head */}
          <circle cx="26" cy="32" r="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="38" cy="32" r="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="32" cy="24" r="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="32" cy="40" r="9" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5" />
        </svg>
      );

    case 'apple':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M32 14C33 8 36 6 40 6" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 14C38 10 44 12 46 14C44 18 38 18 32 14Z" fill="#16A34A" />
          <path
            d="M32 20C22 14 12 24 14 38C16 52 24 58 32 58C40 58 48 52 50 38C52 24 42 14 32 20Z"
            fill="url(#appleGrad)"
          />
          <ellipse cx="24" cy="28" rx="4" ry="7" transform="rotate(-30 24 28)" fill="#FFF" fillOpacity="0.3" />
          <defs>
            <linearGradient id="appleGrad" x1="18" y1="18" x2="48" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="0.6" stopColor="#E11D48" />
              <stop offset="1" stopColor="#881337" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'banana':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M16 46C20 48 38 48 48 30C54 20 54 12 50 10C48 14 42 24 32 32C22 40 18 42 16 46Z"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="2.5"
          />
          <path d="M50 10L54 8" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="46" r="2" fill="#78350F" />
        </svg>
      );

    case 'tea':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M32 56V26" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          {/* Two leaves and a bud */}
          <path d="M32 26C30 14 32 8 32 6C34 8 36 14 32 26Z" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1.5" />
          <path d="M32 32C20 28 14 20 18 16C24 16 28 24 32 32Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
          <path d="M32 36C44 32 50 24 46 20C40 20 36 28 32 36Z" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" />
        </svg>
      );

    case 'coffee':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <ellipse cx="26" cy="32" rx="9" ry="14" transform="rotate(-20 26 32)" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          <path d="M23 20C26 26 26 38 23 44" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="40" cy="34" rx="8" ry="13" transform="rotate(25 40 34)" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <path d="M42 22C39 28 39 40 42 46" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'coconut':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="32" cy="34" r="20" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
          {/* 3 characteristic coconut eyes */}
          <circle cx="28" cy="24" r="2.5" fill="#29140A" />
          <circle cx="36" cy="24" r="2.5" fill="#29140A" />
          <circle cx="32" cy="32" r="2.8" fill="#29140A" />
          {/* Husk texture fibers */}
          <path d="M20 40C24 46 32 48 42 42" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <div className={`rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800 ${className}`}>
          🌾
        </div>
      );
  }
};
