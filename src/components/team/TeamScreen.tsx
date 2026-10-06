import React, { useEffect, useMemo, useState } from 'react';
import { Employee, TeamInsight } from '../../types';
import { coveragePercent, simulateHireSkills } from '../../utils/teamInsights';
import { buildWorkFacts, summarizeWork } from '../../utils/workTracking';
import {
  analyzeWorkflow,
  generateHiringProfile,
  HiringProfileResponse,
  WorkAnalysisResponse,
  WorkFinding,
} from '../../services/api';
import { DailyBars } from '../common/DailyBars';
import { SkillColumns } from '../common/SkillColumns';
import { HiringProfileCard } from './HiringProfileCard';
import { PublishJobModal } from './PublishJobModal';
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  Plus,
  X,
  Loader2,
  CalendarClock,
  Scale,
  TrendingUp,
  ThumbsUp,
  LucideIcon,
} from 'lucide-react';

export type TeamTab = 'work' | 'skills';

interface TeamScreenProps {
  team: TeamInsight;
  initialTab?: TeamTab;
  onBack: () => void;
  onSelectEmployee: (employee: Employee) => void;
}

// موظف واحد لا يغطي كل النقص، فنبدأ بأهم ثلاث مهارات والمدير يعدّل
export const MAX_DEFAULT_SKILLS = 3;

const FINDING_KIND: Record<WorkFinding['kind'], { label: string; icon: LucideIcon }> = {
  pattern: { label: 'نمط متكرر', icon: CalendarClock },
  load: { label: 'حمل العمل', icon: Scale },
  trend: { label: 'الاتجاه', icon: TrendingUp },
  strength: { label: 'نقطة قوة', icon: ThumbsUp },
};

const AiError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
    <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
    <div>
      <p className="text-sm text-rose-900">تعذر الاتصال بالذكاء الاصطناعي.</p>
      <button onClick={onRetry} className="text-sm font-bold text-rose-900 underline min-h-[44px]">
        إعادة المحاولة
      </button>
    </div>
  </div>
);

export const TeamScreen: React.FC<TeamScreenProps> = ({
  team,
  initialTab = 'work',
  onBack,
  onSelectEmployee,
}) => {
  const [tab, setTab] = useState<TeamTab>(initialTab);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]); // لا شيء مختار في البداية، المدير يختار
  const [profile, setProfile] = useState<HiringProfileResponse | null>(null);
  // مهارات يضيفها المدير بنفسه لمواصفات الموظف الجديد
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [publishedTo, setPublishedTo] = useState<string[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [analysis, setAnalysis] = useState<WorkAnalysisResponse | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);

  useEffect(() => {
    setTab(initialTab);
    setSelectedSkills([]);
    setProfile(null);
    setCustomSkills([]);
    setNewSkill('');
    setPublishedTo([]);
    setProfileError(false);
    setAnalysis(null);
    setAnalysisError(false);
  }, [team.department, initialTab]);

  const work = useMemo(() => summarizeWork(team.members), [team.members]);
  const hasGaps = team.gaps.length > 0;
  const selectedGaps = team.gaps.filter(g => selectedSkills.includes(g.skillName));
  const skillsAfterHire = simulateHireSkills(team, selectedSkills);
  const coverageAfterHire = coveragePercent(skillsAfterHire);

  const addCustomSkill = () => {
    const name = newSkill.trim();
    if (name && !customSkills.includes(name) && !team.skills.some(sk => sk.skillName === name)) {
      setCustomSkills(prev => [...prev, name]);
      setProfile(null);
      setPublishedTo([]);
    }
    setNewSkill('');
  };

  const toggleSkill = (name: string) => {
    setProfile(null);
    setPublishedTo([]);
    setSelectedSkills(prev => (prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]));
  };

  const handleGenerateProfile = async () => {
    setProfileLoading(true);
    setProfileError(false);
    try {
      const result = await generateHiringProfile({
        department: team.department,
        teamSize: team.members.length,
        coverageBefore: team.coveragePercent,
        coverageAfter: coverageAfterHire,
        capacity: work.days.length > 0 ? buildWorkFacts(work).capacity : null,
        skills: [
          ...selectedGaps.map(g => ({
            name: g.skillName,
            level: g.neededLevel,
            status: g.status as string,
            internalLearners: g.learners.map(l => ({ name: l.employee.name, level: l.level })),
            developable: g.learners.some(l => l.level >= g.neededLevel - 1),
          })),
          ...customSkills.map(name => ({ name, level: 3, status: 'custom', internalLearners: [], developable: false })),
        ],
      });
      setPublishedTo([]);
      setProfile(result);
    } catch {
      setProfileError(true);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalysisLoading(true);
    setAnalysisError(false);
    try {
      const result = await analyzeWorkflow({ department: team.department, facts: buildWorkFacts(work) });
      setAnalysis(result);
    } catch {
      setAnalysisError(true);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const tabs: { key: TeamTab; label: string; count?: number }[] = [
    { key: 'work', label: 'سير العمل' },
    { key: 'skills', label: 'المهارات', count: team.gaps.length },
  ];

  return (
    <div className="space-y-6 pb-20 text-right max-w-4xl mx-auto">
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-link hover:underline min-h-[44px]"
        >
          <ArrowRight className="w-4 h-4" />
          <span>لوحة المتابعة</span>
        </button>
        <h1 className="type-1 text-slate-900">{team.department}</h1>
        <span className="text-sm text-slate-500">{team.members.length} موظفين</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-xl gap-1" role="tablist">
        {tabs.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
              tab === t.key ? 'bg-surface text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && <span className="tabular-nums"> ({t.count})</span>}
          </button>
        ))}
      </div>

      {/* Tab 1: work tracking */}
      {tab === 'work' && (
        <div className="space-y-4">
          {work.days.length === 0 ? (
            <p className="text-sm text-slate-600 bg-surface border border-slate-200 rounded-2xl p-5">
              لا توجد بيانات مهام يومية لهذا الفريق.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-surface rounded-2xl border border-slate-200 p-3 sm:p-4">
                  <span className="text-xs sm:text-sm text-slate-700 block">نسبة الإنجاز</span>
                  <span className="type-stat text-link tabular-nums">{work.percent}%</span>
                </div>
                <div className="bg-surface rounded-2xl border border-slate-200 p-3 sm:p-4">
                  <span className="text-xs sm:text-sm text-slate-700 block">مهام اليوم</span>
                  <span className="type-stat text-link tabular-nums">
                    {work.today?.completed}
                    <span className="text-base text-slate-400"> / {work.today?.assigned}</span>
                  </span>
                </div>
                <div className="bg-surface rounded-2xl border border-slate-200 p-3 sm:p-4">
                  <span className="text-xs sm:text-sm text-slate-700 block">منجزة في {work.days.length} أيام</span>
                  <span className="type-stat text-link tabular-nums">{work.completed}</span>
                </div>
              </div>

              <div className="bg-surface rounded-2xl border border-slate-200 p-4 sm:p-5">
                <h2 className="type-3 text-slate-900 mb-2">المهام المنجزة يومياً</h2>
                <DailyBars days={work.days} />
              </div>

              <div className="bg-surface rounded-2xl border border-slate-200">
                <h2 className="type-3 text-slate-900 p-4 pb-2">إنجاز كل موظف</h2>
                <div className="divide-y divide-slate-100">
                  {work.perEmployee.map(e => (
                    <button
                      key={e.employee.id}
                      onClick={() => onSelectEmployee(e.employee)}
                      className="w-full px-4 py-3 text-right hover:bg-slate-50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="type-4 text-slate-900">{e.employee.name}</span>
                        <span className="text-sm text-slate-600 tabular-nums">
                          اليوم {e.todayCompleted} / {e.todayAssigned}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-brand-700" style={{ width: `${e.percent}%` }} />
                        </div>
                        <span className="shrink-0 w-12 type-3 text-slate-900 tabular-nums text-left">
                          {e.percent}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analysisLoading}
                className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 px-4"
              >
                {analysisLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{analysisLoading ? 'جارٍ التحليل...' : 'حلّل سير العمل بالذكاء الاصطناعي'}</span>
              </button>

              {analysisError && <AiError onRetry={handleAnalyze} />}

              {analysis && (
                <div className="space-y-3">
                  {/* What was found, in one line */}
                  <div className="rounded-2xl bg-brand-50 border border-brand-200 p-4 sm:p-5">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-link">
                      <Sparkles className="w-4 h-4" />
                      تحليل الذكاء الاصطناعي
                    </span>
                    <p className="type-3 text-slate-900 mt-1.5 leading-relaxed">{analysis.headline}</p>
                  </div>

                  {/* Findings: a title, the numbers behind it, and what it means */}
                  {analysis.findings.map((finding, i) => {
                    const kind = FINDING_KIND[finding.kind] || FINDING_KIND.pattern;
                    return (
                      <div key={i} className="bg-surface rounded-2xl border border-slate-200 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <span className="shrink-0 w-10 h-10 rounded-xl bg-brand-50 text-link flex items-center justify-center">
                            <kind.icon className="w-5 h-5" />
                          </span>
                          <div className="min-w-0 space-y-2">
                            <div>
                              <span className="text-xs font-semibold text-slate-500 block">{kind.label}</span>
                              <h3 className="type-3 text-slate-900">{finding.title}</h3>
                            </div>
                            <p className="text-sm text-slate-900 leading-relaxed tabular-nums">{finding.evidence}</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              <span className="font-semibold text-slate-900">يعني: </span>
                              {finding.meaning}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* What to do about it */}
                  <div className="rounded-2xl border-2 border-brand-200 bg-brand-50/50 p-4 sm:p-5 space-y-2">
                    <span className="text-xs font-semibold text-slate-500 block">الإجراء المقترح</span>
                    <h3 className="type-3 text-slate-900">{analysis.action.title}</h3>
                    <ol className="space-y-1.5">
                      {analysis.action.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-900 leading-relaxed">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-brand-800 text-white text-xs font-bold flex items-center justify-center tabular-nums">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    {analysis.action.impact && (
                      <p className="text-sm text-slate-900 leading-relaxed pt-2 border-t border-brand-200 tabular-nums">
                        <span className="font-bold">الأثر المتوقع: </span>
                        {analysis.action.impact}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab 2: skills chart, and the hire that fills the gaps */}
      {tab === 'skills' && (
        <div className="space-y-4">
          {/* Coverage stays visible while skills are ticked below */}
          <div className="sticky top-[72px] z-10 bg-surface rounded-2xl border border-slate-200 shadow-xs px-6 py-3 sm:px-10 sm:py-3.5 lg:px-16 flex items-center justify-between gap-4">
            <span className="text-base sm:text-lg font-semibold text-slate-900">
              تغطية المهارات{selectedSkills.length > 0 ? ' بعد التوظيف' : ''}
            </span>
            <span className="flex items-baseline gap-2 shrink-0">
              {coverageAfterHire !== team.coveragePercent && (
                <>
                  <span className="text-lg font-semibold text-slate-400 tabular-nums">{team.coveragePercent}%</span>
                  <ArrowLeft className="w-4 h-4 text-slate-400 self-center" />
                </>
              )}
              <span className="text-2xl sm:text-[28px] font-bold text-link tabular-nums">{coverageAfterHire}%</span>
            </span>
          </div>

          <SkillColumns skills={team.skills} selected={selectedSkills} />

          {hasGaps && (
            <div className="bg-surface rounded-2xl border border-slate-200 p-4 space-y-3">
              <span className="type-4 text-slate-900 block">مهارات الموظف الجديد:</span>
              <div className="flex flex-wrap gap-2">
                {team.gaps.map(gap => {
                  const checked = selectedSkills.includes(gap.skillName);
                  return (
                    <button
                      key={gap.skillName}
                      onClick={() => toggleSkill(gap.skillName)}
                      aria-pressed={checked}
                      className={`px-3 min-h-[44px] rounded-full text-sm font-semibold border transition-colors ${
                        checked
                          ? 'bg-royal text-white border-royal'
                          : 'bg-surface text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {gap.skillName}
                    </button>
                  );
                })}

                {customSkills.map(name => (
                  <button
                    key={name}
                    onClick={() => {
                      setCustomSkills(prev => prev.filter(c => c !== name));
                      setProfile(null);
                    }}
                    aria-label={`حذف ${name}`}
                    className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-sm font-semibold border bg-royal text-white border-royal"
                  >
                    <span>{name}</span>
                    <X className="w-4 h-4" />
                  </button>
                ))}

                {/* دائرة + تتمدد عند المرور أو التركيز لتصير حقل كتابة لمهارة جديدة.
                    الحاوية تحجز عرض الحقل كاملاً مسبقاً، فلا يقفز لسطر جديد حين يتمدد ولا يرتجف تحت المؤشر */}
                <span className="w-56 max-w-full flex">
                <label
                  className={`flex items-center h-11 rounded-full border border-dashed border-slate-400 text-slate-600 bg-surface overflow-hidden cursor-text transition-all duration-300 ease-out hover:w-56 focus-within:w-56 focus-within:border-brand-700 ${
                    newSkill.length > 0 ? 'w-56' : 'w-11'
                  }`}
                >
                  <span className="shrink-0 w-11 h-11 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    onBlur={addCustomSkill}
                    placeholder="مهارة أخرى"
                    aria-label="أضف مهارة أخرى"
                    className="flex-1 min-w-0 h-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 pl-4 focus:outline-none"
                  />
                </label>
                </span>
              </div>
            </div>
          )}

          {hasGaps && (
            <>
              <button
                onClick={handleGenerateProfile}
                disabled={(selectedGaps.length === 0 && customSkills.length === 0) || profileLoading}
                className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 px-4"
              >
                {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{profileLoading ? 'جارٍ التحليل والكتابة...' : 'جهّز ملف التوظيف بالذكاء الاصطناعي'}</span>
              </button>

              {profileError && <AiError onRetry={handleGenerateProfile} />}

              {profile && (
                <HiringProfileCard
                  profile={profile}
                  publishedTo={publishedTo}
                  onPublish={() => setIsPublishOpen(true)}
                />
              )}
            </>
          )}
        </div>
      )}

      <PublishJobModal
        isOpen={isPublishOpen}
        jobTitle={profile?.title || ''}
        initialText={profile?.postText || ''}
        onClose={() => setIsPublishOpen(false)}
        onPublished={setPublishedTo}
      />
    </div>
  );
};
