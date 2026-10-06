import React, { useMemo } from 'react';
import { TeamIcon } from '../common/TeamIcon';
import { Department, Employee, TeamInsight } from '../../types';
import { simulateHire } from '../../utils/teamInsights';
import { summarizeWork } from '../../utils/workTracking';
import { DailyBars } from '../common/DailyBars';
import { MAX_DEFAULT_SKILLS, TeamTab } from '../team/TeamScreen';
import { ArrowLeft } from 'lucide-react';

interface HomeScreenProps {
  employees: Employee[];
  teams: TeamInsight[];
  usingSampleData: boolean;
  onOpenTeam: (department: Department, tab?: TeamTab) => void;
  onOpenDataSettings: () => void;
}

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="bg-surface rounded-2xl border border-slate-200 p-4">
    <span className="text-sm text-slate-700 block">{label}</span>
    <span className="type-stat text-link tabular-nums">{value}</span>
  </div>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({
  employees,
  teams,
  usingSampleData,
  onOpenTeam,
  onOpenDataSettings,
}) => {
  const work = useMemo(() => summarizeWork(employees), [employees]);
  const gapsCount = teams.reduce((sum, t) => sum + t.gaps.length, 0);
  const readyCount = teams.reduce((sum, t) => sum + t.ready.length, 0);
  const teamsWithGaps = teams.filter(t => t.gaps.length > 0);

  return (
    <div className="space-y-6 pb-20 text-right">
      <h1 className="type-1 text-slate-900">لوحة المتابعة</h1>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Stat label="نسبة إنجاز المهام" value={`${work.percent}%`} />
        <Stat
          label="مهام اليوم"
          value={
            <>
              {work.today?.completed ?? 0}
              <span className="text-lg text-slate-400"> / {work.today?.assigned ?? 0}</span>
            </>
          }
        />
        <Stat label="مهارات ناقصة" value={gapsCount} />
        <Stat label="يستحقون الترقية" value={readyCount} />
      </div>

      {/* Workflow */}
      <section className="bg-surface rounded-2xl border border-slate-200 p-4 sm:p-5">
        <h2 className="type-2 plain-title text-slate-900 mb-2">سير العمل: المهام المنجزة يومياً</h2>
        <DailyBars days={work.days} height={140} />
      </section>

      {/* Teams */}
      <section className="space-y-3">
        <h2 className="type-2 text-slate-900">الفرق</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teams.map(t => {
            const teamWork = summarizeWork(t.members);
            return (
              <button
                key={t.department}
                onClick={() => onOpenTeam(t.department)}
                className="group text-right bg-surface rounded-2xl border border-slate-200 hover:border-brand-700 p-4 sm:p-5 space-y-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <TeamIcon department={t.department} />
                  <div className="flex-1 min-w-0">
                    <h3 className="type-3 text-slate-900">{t.department}</h3>
                    <span className="text-sm text-slate-500">{t.members.length} موظفين</span>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-brand-700 transition-colors shrink-0" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 shrink-0">الإنجاز</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-700" style={{ width: `${teamWork.percent}%` }} />
                  </div>
                  <span className="shrink-0 w-12 type-3 text-slate-900 tabular-nums text-left">
                    {teamWork.percent}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded-md font-semibold ${
                      t.gaps.length > 0 ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {t.gaps.length > 0 ? `مهارات ناقصة: ${t.gaps.length}` : 'المهارات مغطاة'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Value of a hire */}
      {teamsWithGaps.length > 0 && (
        <section className="space-y-3">
          <h2 className="type-2 text-slate-900">لو وظّفنا شخصاً، وش يضيف؟</h2>
          <div className="bg-surface rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {teamsWithGaps.map(t => {
              const skills = t.gaps.slice(0, MAX_DEFAULT_SKILLS);
              const after = simulateHire(
                t,
                skills.map(s => s.skillName)
              );
              return (
                <button
                  key={t.department}
                  onClick={() => onOpenTeam(t.department, 'skills')}
                  className="w-full px-6 py-3.5 sm:px-10 sm:py-4 lg:px-16 text-right hover:bg-slate-50 flex items-center gap-4"
                >
                  <TeamIcon department={t.department} />
                  <span className="flex-1 min-w-0 space-y-1.5">
                    <span className="text-base sm:text-lg font-semibold text-slate-900 block">{t.department}</span>
                    <span className="text-sm text-slate-600 leading-relaxed block">
                      يسدّ: {skills.map(s => s.skillName).join('، ')}
                    </span>
                  </span>
                  <span className="flex items-baseline gap-2 shrink-0">
                    <span className="text-lg font-semibold text-slate-400 tabular-nums">{t.coveragePercent}%</span>
                    <ArrowLeft className="w-4 h-4 text-slate-400 self-center" />
                    <span className="text-2xl sm:text-[28px] font-bold text-link tabular-nums">{after}%</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-sm text-slate-500">النسبة هي تغطية مهارات الفريق قبل التوظيف وبعده.</p>
        </section>
      )}

      {usingSampleData && (
        <p className="text-sm text-slate-500 text-center">
          هذه بيانات تجريبية.{' '}
          <button onClick={onOpenDataSettings} className="font-semibold text-link underline">
            ارفع بيانات شركتك
          </button>
        </p>
      )}
    </div>
  );
};
