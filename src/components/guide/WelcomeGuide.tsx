import React from 'react';
import { X } from 'lucide-react';

interface WelcomeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = ['تابع سير العمل وإنجاز المهام كل يوم.', 'شاهد المهارات الناقصة في كل فريق.', 'اعرف من توظّف، من يستحق الترقية، ومن الأنسب لكل مشروع.'];

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-md w-full text-right my-auto p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="type-2 text-slate-900">أهلاً بك في كفء</h2>
            <p className="text-base text-slate-600 mt-1">كفء يتابع شغل فرقك ويبيّن وش ينقصها.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="shrink-0 w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold tabular-nums">
                {i + 1}
              </span>
              <span className="text-base text-slate-800">{step}</span>
            </li>
          ))}
        </ol>

        <button
          onClick={onClose}
          className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 text-white rounded-xl font-bold text-base transition-colors"
        >
          ابدأ
        </button>
      </div>
    </div>
  );
};
