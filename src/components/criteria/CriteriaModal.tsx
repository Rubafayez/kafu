import React, { useEffect, useState } from 'react';
import { PromotionCriteria } from '../../types';
import { DEFAULT_PROMOTION_CRITERIA } from '../../utils/teamInsights';
import { X } from 'lucide-react';

interface CriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: PromotionCriteria;
  onSave: (criteria: PromotionCriteria) => void;
}

interface FieldProps {
  label: string;
  hint: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const Field: React.FC<FieldProps> = ({ label, hint, value, unit, min, max, step, onChange }) => (
  <label className="block">
    <span className="type-4 text-slate-900 block">{label}</span>
    <span className="text-sm text-slate-500 block mt-0.5 leading-relaxed">{hint}</span>
    <div className="flex items-center gap-2 mt-2">
      <input
        type="number"
        inputMode="decimal"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-28 min-h-[44px] px-3 border border-slate-300 rounded-lg text-base font-semibold text-slate-900 tabular-nums focus:outline-none focus:border-brand-700"
      />
      <span className="text-sm text-slate-600">{unit}</span>
    </div>
  </label>
);

export const CriteriaModal: React.FC<CriteriaModalProps> = ({ isOpen, onClose, criteria, onSave }) => {
  const [draft, setDraft] = useState<PromotionCriteria>(criteria);

  useEffect(() => {
    if (isOpen) setDraft(criteria);
  }, [isOpen, criteria]);

  if (!isOpen) return null;

  const isValid =
    draft.minScore >= 1 &&
    draft.minScore <= 5 &&
    draft.consecutiveQuarters >= 1 &&
    draft.consecutiveQuarters <= 4 &&
    draft.minExperienceYears >= 0 &&
    draft.minTaskCompletion >= 0 &&
    draft.minTaskCompletion <= 100 &&
    draft.minCoursesPerYear >= 0 &&
    draft.minMonthsSinceLastPromotion >= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full text-right my-auto">
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="type-2 text-slate-900">معايير الترقية</h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              أنت تحدد متى يستحق الموظف الترشيح للترقية، وكفء يطبق معاييرك على الجميع بنفس الطريقة.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <Field
            label="أقل تقييم أداء مقبول"
            hint="التقييم الربعي من 5. الموظف يجب أن يحققه في كل ربع من المدة المحددة."
            value={draft.minScore}
            unit="من 5"
            min={1}
            max={5}
            step={0.1}
            onChange={v => setDraft({ ...draft, minScore: v })}
          />
          <Field
            label="مدة الأداء المتواصل"
            hint="عدد الأرباع المتتالية التي يحافظ فيها على التقييم. ربعان = آخر 6 أشهر."
            value={draft.consecutiveQuarters}
            unit="أرباع متتالية (من 1 إلى 4)"
            min={1}
            max={4}
            step={1}
            onChange={v => setDraft({ ...draft, consecutiveQuarters: Math.round(v) })}
          />
          <Field
            label="أقل نسبة إنجاز للمهام"
            hint="نسبة المهام التي أنجزها الموظف من المهام المسندة إليه خلال نفس المدة."
            value={draft.minTaskCompletion}
            unit="%"
            min={0}
            max={100}
            step={5}
            onChange={v => setDraft({ ...draft, minTaskCompletion: v })}
          />
          <Field
            label="أقل عدد دورات في السنة"
            hint="عدد الدورات التي أكملها الموظف في آخر 12 شهراً. من لا يحققه يظهر في «من نطوّر»."
            value={draft.minCoursesPerYear}
            unit="دورات"
            min={0}
            max={36}
            step={1}
            onChange={v => setDraft({ ...draft, minCoursesPerYear: Math.round(v) })}
          />
          <Field
            label="أقل سنوات خبرة"
            hint="إجمالي سنوات خبرة الموظف."
            value={draft.minExperienceYears}
            unit="سنوات"
            min={0}
            max={40}
            step={0.5}
            onChange={v => setDraft({ ...draft, minExperienceYears: v })}
          />
          <Field
            label="المدة منذ آخر ترقية"
            hint="من لم يترقَّ من قبل يُعتبر محققاً لهذا المعيار."
            value={draft.minMonthsSinceLastPromotion}
            unit="شهراً"
            min={0}
            max={120}
            step={1}
            onChange={v => setDraft({ ...draft, minMonthsSinceLastPromotion: Math.round(v) })}
          />
        </div>

        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            disabled={!isValid}
            className="flex-1 min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-base transition-colors"
          >
            حفظ المعايير
          </button>
          <button
            onClick={() => setDraft(DEFAULT_PROMOTION_CRITERIA)}
            className="min-h-[48px] px-4 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm transition-colors"
          >
            رجوع للقيم الافتراضية
          </button>
        </div>
      </div>
    </div>
  );
};
