import React, { useState } from 'react';
import { HiringProfileResponse } from '../../services/api';
import { Check, CheckCircle, Copy, Send, Sparkles } from 'lucide-react';

interface HiringProfileCardProps {
  profile: HiringProfileResponse;
  publishedTo: string[]; // أين نُشرت الوظيفة، فارغة إذا لم تُنشر
  onPublish: () => void;
}

const DECISION: Record<HiringProfileResponse['recommendation']['decision'], string> = {
  hire: 'التوصية: توظيف من الخارج',
  develop: 'التوصية: تطوير داخلي يكفي',
  both: 'التوصية: توظيف وتطوير معاً',
};

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-1.5">
    <h4 className="type-4 text-slate-900">{title}</h4>
    {children}
  </div>
);

const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700 leading-relaxed">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

/**
 * ملف التوظيف كما كتبه الذكاء الاصطناعي: لماذا الآن، القرار، الدور، ثم النشر.
 */
export const HiringProfileCard: React.FC<HiringProfileCardProps> = ({ profile, publishedTo, onPublish }) => {
  const [copied, setCopied] = useState(false);

  // ينسخ نص إعلان الوظيفة الجاهز
  const copyPost = async () => {
    try {
      await navigator.clipboard.writeText(profile.postText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const copyButton = (
    <button
      onClick={copyPost}
      className="shrink-0 min-h-[48px] px-5 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
    >
      {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
      <span>{copied ? 'تم النسخ' : 'انسخ الإعلان'}</span>
    </button>
  );

  return (
  <div className="bg-surface rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-5">
    <div>
      <span className="flex items-center gap-1.5 text-sm font-semibold text-link">
        <Sparkles className="w-4 h-4" />
        ملف التوظيف
      </span>
      <h3 className="type-2 plain-title text-slate-900 mt-1">{profile.title}</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-sm font-semibold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md">
          المستوى: {profile.seniority}
        </span>
        <span className="text-sm font-semibold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md tabular-nums">
          خبرة {profile.experienceYears} سنوات
        </span>
      </div>
    </div>

    <Block title="لماذا الآن؟">
      <p className="text-sm text-slate-700 leading-relaxed tabular-nums">{profile.whyNow}</p>
    </Block>

    <div className="rounded-xl bg-brand-50 border border-brand-200 p-4">
      <h4 className="type-4 text-slate-900">{DECISION[profile.recommendation.decision]}</h4>
      <p className="text-sm text-slate-700 leading-relaxed mt-1">{profile.recommendation.reason}</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Block title="المهام">
        <Bullets items={profile.responsibilities} />
      </Block>
      <div className="space-y-4">
        <Block title="المتطلبات الأساسية">
          <Bullets items={profile.mustHave} />
        </Block>
        {profile.niceToHave.length > 0 && (
          <Block title="يُفضّل">
            <Bullets items={profile.niceToHave} />
          </Block>
        )}
      </div>
    </div>

    {publishedTo.length > 0 ? (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-900">نُشر الإعلان في: {publishedTo.join('، ')}.</p>
        </div>
        {copyButton}
      </div>
    ) : (
      <div className="flex gap-3">
        <button
          onClick={onPublish}
          className="flex-1 min-h-[48px] bg-brand-800 hover:bg-brand-900 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          <span>انشر الوظيفة</span>
        </button>
        {copyButton}
      </div>
    )}
  </div>
  );
};
