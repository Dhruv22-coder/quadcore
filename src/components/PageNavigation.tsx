import React from 'react';
import { ActivePage, Language } from '../types';
import {
  Wheat,
  Scale,
  Calculator,
  CloudSun,
  PhoneCall,
} from 'lucide-react';
import { NAV_TRANSLATIONS } from '../data/navigationTranslations';

interface PageNavigationProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  language: Language;
  isDarkMode?: boolean;
  isSunlightMode?: boolean;
}

interface NavItem {
  id: ActivePage;
  icon: React.ComponentType<{ className?: string }>;
  stepNumber: number;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'crops', icon: Wheat, stepNumber: 1 },
  { id: 'decision', icon: Scale, stepNumber: 2 },
  { id: 'profit', icon: Calculator, stepNumber: 3 },
  { id: 'weather', icon: CloudSun, stepNumber: 4 },
  { id: 'help', icon: PhoneCall, stepNumber: 5 },
];

export const PageNavigation: React.FC<PageNavigationProps> = ({
  activePage,
  onPageChange,
  language,
  isDarkMode = false,
}) => {
  const navTexts = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.en;
  const activeIndex = NAV_ITEMS.findIndex((n) => n.id === activePage);

  return (
    <>
      {/* 1. Desktop & Tablet Step Progress Tracker (Clear Workflow Steps) */}
      <nav
        id="top-page-tabs"
        aria-label="Selling Decision Workflow Steps"
        className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 shadow-2xs transition-colors hidden sm:block"
      >
        <div className="flex items-center justify-between gap-1">
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            const isCompleted = index < activeIndex;
            const itemTrans = navTexts.navItems[item.id];

            return (
              <React.Fragment key={item.id}>
                <button
                  id={`tab-btn-${item.id}`}
                  onClick={() => onPageChange(item.id)}
                  type="button"
                  className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none border ${
                    isActive
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs ring-2 ring-emerald-600/30'
                      : isCompleted
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 font-bold ${
                      isActive
                        ? 'bg-emerald-700 text-white'
                        : isCompleted
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isCompleted ? '✓' : item.stepNumber}
                  </div>
                  <span className="truncate">
                    {item.stepNumber}. {itemTrans.label}
                  </span>
                </button>

                {index < NAV_ITEMS.length - 1 && (
                  <div className="text-slate-300 dark:text-slate-600 hidden md:block shrink-0 px-0.5 font-bold">
                    →
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* 2. Mobile Bottom Fixed Thumb Navigation Bar */}
      <nav
        id="bottom-mobile-nav"
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl px-2 py-1.5 sm:hidden"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            const itemTrans = navTexts.navItems[item.id];

            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => onPageChange(item.id)}
                type="button"
                className={`min-h-[50px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 font-black'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform ${
                    isActive ? 'bg-emerald-700 text-white scale-105 shadow-xs' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 tracking-tight truncate max-w-full">
                  {itemTrans.shortLabel}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-emerald-400 absolute bottom-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
