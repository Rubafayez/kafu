import React, { useState } from 'react';
import { generatePromotionPlan, PromotionPlanResponse } from '../../services/api';
import {
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  Flag,
  FolderKanban,
  GraduationCap,
  Loader2,
  LucideIcon,
  Mail,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';

interface PromotionPlanPanelProps {
  employeeName: string;
  roleTitle: string;
  gaps: string[];
  // الخطة تُحفظ عند الشاشة الأم حتى لا تضيع عند طيّ اللوحة
  plan: PromotionPlanResponse | null;
  onPlan: (plan: PromotionPlanResponse) => void;
}

// لكل نوع خطوة أيقونة ولون من الهوية، حتى تُميَّز المحطات من أول نظرة
const KINDS: Record<string, { label: string; icon: LucideIcon; circle: string; chip: string }> = {
  course: { label: 'دورة', icon: GraduationCap, circle: 'bg-royal text-white', chip: 'bg-royal/10 text-royal' },
  mentoring: { label: 'توجيه', icon: Users, circle: 'bg-brand-800 text-white', chip: 'bg-brand-50 text-link' },
  project: { label: 'مشروع', icon: FolderKanban, circle: 'bg-chart-1 text-white', chip: 'bg-brand-50 text-link' },
  practice: { label: 'ممارسة', icon: Wrench, circle: 'bg-chart-2 text-link', chip: 'bg-brand-50 text-link' },
};

/**
 * «كيف يوصل؟» داخل الصفحة: ما ينقص الموظف (محسوب في الكود)، ثم خطة يكتبها الذكاء الاصطناعي
 * تُعرض كمسار من ثلاث محطات ملوّنة ينتهي بالمنصب. الضغط على محطة يعرض تفاصيلها تحت المسار.
 */
export const PromotionPlanPanel: React.FC<PromotionPlanPanelProps> = ({
  employeeName,
  roleTitle,
  gaps,
  plan,
  onPlan,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  // بعد كتابة الخطة تُطوى قائمة النواقص حتى لا تتكرر مع المسار
  const [showGaps, setShowGaps] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(false);
    try {
      onPlan(await generatePromotionPlan({ employeeName, roleTitle, gaps }));
      setActiveStep(0);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const subject = `خطة ${employeeName} للوصول إلى منصب ${roleTitle}`;
  const planText = plan
    ? [
        subject,
        plan.summary,
        ...plan.steps.map((s, i) => `${i + 1}. ${s.title} (${s.duration})\n${s.action}\nتكتمل عند: ${s.doneWhen}`),
      ].join('\n\n')
    : '';

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(planText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const gapsList = (
    <ul className="list-disc pr-5 space-y-1.5 text-sm text-slate-700 leading-relaxed tabular-nums">
      {gaps.map(gap => (
        <li key={gap}>{gap}</li>
      ))}
    </ul>
  );

  const current = plan ? plan.steps[Math.min(activeStep, plan.steps.length - 1)] : null;
  const currentKind = current ? KINDS[current.kind || 'practice'] || KINDS.practice : null;

  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 sm:p-5 space-y-5">
      {!plan ? (
        <div className="space-y-2">
          <h3 className="type-4 text-slate-900">
            باقي له <span className="tabular-nums">({gaps.length})</span>
          </h3>
          {gapsList}
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => setShowGaps(!showGaps)}
            aria-expanded={showGaps}
            className="flex items-center gap-1.5 type-4 text-slate-900 min-h-[32px]"
          >
            <span>
              باقي له <span className="tabular-nums">({gaps.length})</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showGaps ? 'rotate-180' : ''}`} />
          </button>
          {showGaps && gapsList}
        </div>
      )}

      {!plan && (
        <button
          onClick={generate}
          disabled={loading}
          className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 px-4"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'جارٍ كتابة الخطة...' : 'اكتب خطة بالذكاء الاصطناعي'}</span>
        </button>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-rose-900">تعذر الاتصال بالذكاء الاصطناعي.</p>
            <button onClick={generate} className="text-sm font-bold text-rose-900 underline min-h-[44px]">
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      {plan && current && currentKind && (
        <div className="space-y-4">
          <p className="flex items-start gap-2 text-sm font-semibold text-slate-900 leading-relaxed">
            <Sparkles className="w-4 h-4 text-link shrink-0 mt-1" />
            <span>{plan.summary}</span>
          </p>

          {/* المسار: محطات بأيقونة ولون لكل نوع يصلها خط، وآخرها المنصب */}
          <ol className="relative grid grid-cols-4 gap-2 sm:gap-3">
            <span
              aria-hidden="true"
              className="absolute top-7 right-[12.5%] left-[12.5%] border-t-2 border-dashed border-brand-200"
            />
            {plan.steps.map((step, i) => {
              const kind = KINDS[step.kind || 'practice'] || KINDS.practice;
              const isActive = i === activeStep;
              return (
                <li key={i} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveStep(i)}
                    aria-pressed={isActive}
                    className={`w-full flex flex-col items-center gap-2 text-center rounded-xl p-1.5 pb-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
                      isActive ? 'bg-surface shadow-xs' : 'hover:bg-surface/60'
                    }`}
                  >
                    <span
                      className={`relative w-11 h-11 rounded-full flex items-center justify-center ${kind.circle} ${
                        isActive ? 'ring-4 ring-brand-200' : ''
                      }`}
                    >
                      <kind.icon className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-surface border border-slate-200 text-[11px] font-bold text-slate-900 flex items-center justify-center tabular-nums">
                        {i + 1}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-slate-900 leading-snug">{step.title}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <Clock className="w-3.5 h-3.5" />
                      {step.duration}
                    </span>
                  </button>
                </li>
              );
            })}
            <li className="relative flex flex-col items-center gap-2 text-center p-1.5">
              <span className="relative w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </span>
              <span className="text-sm font-semibold text-slate-900 leading-snug">جاهز للترشيح</span>
              <span className="text-xs text-slate-600 leading-snug">{roleTitle}</span>
            </li>
          </ol>

          {/* تفاصيل المحطة المختارة */}
          <div className="rounded-xl bg-surface border border-slate-200 p-4 space-y-2" aria-live="polite">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${currentKind.chip}`}>{currentKind.label}</span>
              <span className="type-4 text-slate-900">{current.title}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{current.action}</p>
            <p className="flex items-start gap-1.5 text-sm text-slate-700 leading-relaxed">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold text-slate-900">تكتمل عند: </span>
                {current.doneWhen}
              </span>
            </p>
          </div>

          <p className="text-xs text-slate-500">المدد تقديرية، والخطة تؤهله للترشيح والقرار للإدارة.</p>

          <div className="flex flex-wrap gap-3">
            {/* يفتح برنامج البريد برسالة جاهزة فيها الخطة، والمدير يكتب عنوان الموظف ويرسل */}
            <a
              href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(planText)}`}
              className="flex-1 min-h-[48px] px-4 bg-brand-800 hover:bg-brand-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              <span>أرسلها بالبريد</span>
            </a>
            <button
              onClick={copyPlan}
              className="min-h-[48px] px-4 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'تم النسخ' : 'انسخ'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
