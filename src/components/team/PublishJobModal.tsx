import React, { useEffect, useState } from 'react';
import { CheckCircle, Globe, Linkedin, Loader2, X } from 'lucide-react';

interface PublishJobModalProps {
  isOpen: boolean;
  jobTitle: string;
  initialText: string;
  onClose: () => void;
  onPublished: (channels: string[]) => void;
}

const CHANNELS = [
  { key: 'لينكدإن', hint: 'صفحة الشركة في لينكدإن', icon: Linkedin },
  { key: 'موقع الشركة', hint: 'صفحة الوظائف في موقعكم', icon: Globe },
];
const JOB_TYPES = ['دوام كامل', 'دوام جزئي', 'عقد مؤقت'];
const WORK_MODES = ['حضوري', 'هجين', 'عن بعد'];
const STEP_TITLES = ['أين تنشر الإعلان؟', 'تفاصيل الوظيفة', 'راجع نص الإعلان', 'تأكيد النشر'];

const Choice: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({
  selected,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`px-4 min-h-[44px] rounded-full text-sm font-semibold border transition-colors ${
      selected ? 'bg-brand-800 text-white border-brand-800' : 'bg-surface text-slate-700 border-slate-300 hover:bg-slate-50'
    }`}
  >
    {children}
  </button>
);

/**
 * نشر إعلان الوظيفة على خطوات: القنوات، التفاصيل، مراجعة النص، التأكيد، ثم «تم».
 * النشر هنا محاكاة للعرض: لا يُرسل شيء فعلياً. الربط الحقيقي يحتاج اتفاقاً مع كل قناة.
 */
export const PublishJobModal: React.FC<PublishJobModalProps> = ({
  isOpen,
  jobTitle,
  initialText,
  onClose,
  onPublished,
}) => {
  const [step, setStep] = useState(0);
  const [channels, setChannels] = useState<string[]>(['لينكدإن']);
  const [jobType, setJobType] = useState(JOB_TYPES[0]);
  const [workMode, setWorkMode] = useState(WORK_MODES[0]);
  const [city, setCity] = useState('الرياض');
  const [text, setText] = useState(initialText);
  const [phase, setPhase] = useState<'form' | 'publishing' | 'done'>('form');

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setChannels(['لينكدإن']);
      setJobType(JOB_TYPES[0]);
      setWorkMode(WORK_MODES[0]);
      setCity('الرياض');
      setText(initialText);
      setPhase('form');
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  const toggleChannel = (key: string) =>
    setChannels(prev => (prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]));

  const canContinue =
    (step === 0 && channels.length > 0) ||
    (step === 1 && city.trim().length > 0) ||
    (step === 2 && text.trim().length > 0) ||
    step === 3;

  const publish = () => {
    setPhase('publishing');
    window.setTimeout(() => {
      setPhase('done');
      onPublished(channels);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full text-right my-auto">
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="type-2 text-slate-900">نشر الوظيفة</h2>
            <p className="text-sm text-slate-600 mt-0.5">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {phase === 'done' ? (
          <div className="px-6 py-8 text-center space-y-4">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
            <div>
              <h3 className="type-2 plain-title text-slate-900">تم نشر الوظيفة</h3>
              <p className="text-base text-slate-700 mt-1">«{jobTitle}»</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {CHANNELS.filter(c => channels.includes(c.key)).map(c => (
                <span
                  key={c.key}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-900"
                >
                  <c.icon className="w-4 h-4" />
                  {c.key}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              {jobType} · {workMode} · {city}
            </p>
            <p className="text-xs text-slate-500">عرض تجريبي: لم يُنشر الإعلان فعلياً.</p>
            <button
              onClick={onClose}
              className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 text-white rounded-xl font-bold text-base"
            >
              تم
            </button>
          </div>
        ) : phase === 'publishing' ? (
          <div className="px-6 py-12 text-center space-y-3">
            <Loader2 className="w-10 h-10 text-link mx-auto animate-spin" />
            <p className="type-4 text-slate-900">الذكاء الاصطناعي ينشر الإعلان...</p>
          </div>
        ) : (
          <>
            <div className="px-6 pt-5">
              {/* Progress */}
              <div className="flex gap-1.5" aria-hidden="true">
                {STEP_TITLES.map((_, i) => (
                  <span key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-brand-600' : 'bg-slate-200'}`} />
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-3 tabular-nums">
                الخطوة {step + 1} من {STEP_TITLES.length}
              </p>
              <h3 className="type-3 text-slate-900">{STEP_TITLES[step]}</h3>
            </div>

            <div className="px-6 py-5 min-h-[220px]">
              {step === 0 && (
                <div className="space-y-2">
                  {CHANNELS.map(channel => {
                    const selected = channels.includes(channel.key);
                    return (
                      <button
                        key={channel.key}
                        type="button"
                        onClick={() => toggleChannel(channel.key)}
                        aria-pressed={selected}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-colors ${
                          selected ? 'border-brand-700 bg-brand-50/60' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-white ${
                            channel.key === 'لينكدإن' ? 'bg-[#0A66C2]' : 'bg-brand-800'
                          }`}
                        >
                          <channel.icon className="w-5 h-5" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="type-4 text-slate-900 block">{channel.key}</span>
                          <span className="text-sm text-slate-600">{channel.hint}</span>
                        </span>
                        {selected && <CheckCircle className="w-5 h-5 text-link shrink-0" />}
                      </button>
                    );
                  })}
                  <p className="text-sm text-slate-500 pt-1">تقدر تختار القناتين معاً.</p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <span className="type-4 text-slate-900 block mb-2">نوع الدوام</span>
                    <div className="flex flex-wrap gap-2">
                      {JOB_TYPES.map(t => (
                        <Choice key={t} selected={jobType === t} onClick={() => setJobType(t)}>
                          {t}
                        </Choice>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="type-4 text-slate-900 block mb-2">مكان العمل</span>
                    <div className="flex flex-wrap gap-2">
                      {WORK_MODES.map(m => (
                        <Choice key={m} selected={workMode === m} onClick={() => setWorkMode(m)}>
                          {m}
                        </Choice>
                      ))}
                    </div>
                  </div>
                  <label className="block">
                    <span className="type-4 text-slate-900 block mb-2">المدينة</span>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full min-h-[44px] px-3 border border-slate-300 rounded-lg text-base text-slate-900 bg-surface focus:outline-none focus:border-brand-700"
                    />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-2">
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={9}
                    aria-label="نص الإعلان"
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm leading-relaxed text-slate-900 bg-surface focus:outline-none focus:border-brand-700"
                  />
                  <p className="text-sm text-slate-500">كتبه الذكاء الاصطناعي من ملف التوظيف. عدّله كما تريد.</p>
                </div>
              )}

              {step === 3 && (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                    <dt className="text-slate-500">القنوات</dt>
                    <dd className="font-semibold text-slate-900">{channels.join('، ')}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                    <dt className="text-slate-500">الوظيفة</dt>
                    <dd className="font-semibold text-slate-900">
                      {jobType} · {workMode} · {city}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 mb-1">نص الإعلان</dt>
                    <dd className="text-slate-700 leading-relaxed line-clamp-4 whitespace-pre-line">{text}</dd>
                  </div>
                </dl>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="min-h-[48px] px-5 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm"
                >
                  رجوع
                </button>
              )}
              <button
                onClick={() => (step === STEP_TITLES.length - 1 ? publish() : setStep(step + 1))}
                disabled={!canContinue}
                className="flex-1 min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-base"
              >
                {step === STEP_TITLES.length - 1 ? 'انشر الآن' : 'التالي'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
