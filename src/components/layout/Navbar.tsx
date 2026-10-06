import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { LayoutDashboard, Users, Database, HelpCircle, TrendingUp, FolderKanban, Moon, Sun, RotateCcw, LucideIcon } from 'lucide-react';

export type TabType = 'home' | 'projects' | 'promotions' | 'employees';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenDataSettings: () => void;
  onOpenGuide: () => void;
  onResetData: () => void;
}

const TABS: { key: TabType; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: 'المتابعة', icon: LayoutDashboard },
  { key: 'projects', label: 'المشاريع', icon: FolderKanban },
  { key: 'promotions', label: 'الترقيات', icon: TrendingUp },
  { key: 'employees', label: 'الموظفون', icon: Users },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenDataSettings, onOpenGuide, onResetData }) => {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    try {
      localStorage.setItem('jahez_theme', next ? 'dark' : 'light');
    } catch {
      // التخزين غير متاح: يبقى الاختيار لهذه الجلسة فقط
    }
  };

  const utilityClass =
    'w-11 h-11 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700';

  return (
    <>
      {/* Top header */}
      <header className="sticky top-0 z-30 bg-surface/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            aria-label="كفء: الرجوع للوحة المتابعة"
          >
            <Logo size={56} />
          </button>

          {/* Desktop navigation: active tab marked by an underline on the header edge */}
          <nav className="hidden md:flex items-stretch gap-1 h-16" aria-label="التنقل الرئيسي">
            {TABS.map(tab => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex items-center gap-2 px-4 text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:bg-slate-100 ${
                    active ? 'text-link' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className="w-[18px] h-[18px]" />
                  <span>{tab.label}</span>
                  <span
                    className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full transition-colors ${
                      active ? 'bg-brand-800' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Utilities */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              title={dark ? 'الوضع النهاري' : 'الوضع الليلي'}
              aria-label={dark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
              className={utilityClass}
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={onOpenGuide}
              title="كيف يعمل كفء؟"
              aria-label="كيف يعمل كفء؟"
              className="w-11 h-11 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenDataSettings}
              title="بيانات الموظفين"
              aria-label="بيانات الموظفين"
              className="w-11 h-11 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <Database className="w-5 h-5" />
            </button>
            <button
              onClick={onResetData}
              title="إعادة البيانات التجريبية"
              aria-label="إعادة البيانات التجريبية"
              className="w-11 h-11 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-md border-t border-slate-200/80"
        aria-label="التنقل الرئيسي"
      >
        <div className="grid grid-cols-4 h-16">
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  active ? 'text-link' : 'text-slate-500'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-14 h-7 rounded-full transition-colors ${
                    active ? 'bg-brand-50' : ''
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                </span>
                <span className={`text-xs ${active ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
