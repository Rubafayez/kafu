import React, { useMemo, useState } from 'react';
import { Department, Employee, JobRole, PromotionEvaluation, TeamInsight } from '../../types';
import { getRoleCandidates, RoleCandidate } from '../../utils/teamInsights';
import { AddRoleModal } from './AddRoleModal';
import { FloatingAddButton } from '../common/FloatingAddButton';
import { ShareWithEmployeeModal } from '../employee/ShareWithEmployeeModal';
import { PromotionPlanPanel } from './PromotionPlanPanel';
import { buildPromotionGaps } from '../../utils/promotionPlan';
import { PromotionPlanResponse } from '../../services/api';
import { ArrowRight, ArrowLeft, ChevronDown, Settings2, Trash2, Share, Sparkles } from 'lucide-react';

interface PromotionsScreenProps {
  roles: JobRole[];
  teams: TeamInsight[];
  onSelectEmployee: (employee: Employee) => void;
  onEditCriteria: () => void;
  onAddRole: (role: JobRole) => void;
  onDeleteRole: (roleId: string) => void;
}

const MAX_COMPARED = 3;

function reasonFor(candidate: RoleCandidate, totalSkills: number): string {
  const unmet = candidate.evaluation.checks.filter(c => !c.met);
  if (candidate.qualified) {
    return `حقق كل معايير الترقية، ويتقن ${candidate.matchedSkills.length} من ${totalSkills} مهارات المنصب.`;
  }
  if (unmet.length > 0) {
    return `لم يتحقق: ${unmet.map(c => c.label).join('، ')}.`;
  }
  return `حقق المعايير، لكن يتقن ${candidate.matchedSkills.length} من ${totalSkills} مهارات المنصب فقط.`;
}

export const PromotionsScreen: React.FC<PromotionsScreenProps> = ({
  roles,
  teams,
  onSelectEmployee,
  onEditCriteria,
  onAddRole,
  onDeleteRole,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<PromotionEvaluation | null>(null);
  // «كيف يوصل؟»: السطر المفتوح الآن، والخطط المكتوبة (تبقى محفوظة عند الطيّ)
  const [openPlanId, setOpenPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Record<string, PromotionPlanResponse>>({});
  const [department, setDepartment] = useState<Department | 'all'>('all');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const rolesWithCandidates = useMemo(
    () => roles.map(role => ({ role, candidates: getRoleCandidates(role, teams) })),
    [roles, teams],
  );

  const selected = rolesWithCandidates.find(r => r.role.id === selectedRoleId) || null;

  /* ---------- Role detail: candidates side by side ---------- */
  if (selected) {
    const { role } = selected;
    const candidates = selected.candidates.slice(0, MAX_COMPARED);
    const total = role.requiredSkills.length;

    const rows: { label: string; render: (c: RoleCandidate) => React.ReactNode }[] = [
      {
        label: 'الحالة',
        render: c => (
          <span
            className={`inline-block text-xs font-bold px-2 py-1 rounded-md ${
              c.qualified ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
            }`}
          >
            {c.qualified ? 'مؤهل' : 'قريب'}
          </span>
        ),
      },
      {
        label: 'آخر تقييم',
        render: c => `${c.evaluation.recentReviews[c.evaluation.recentReviews.length - 1]?.score ?? '-'} من 5`,
      },
      {
        label: 'إنجاز المهام',
        render: c => (c.evaluation.taskCompletion !== null ? `${c.evaluation.taskCompletion}%` : '-'),
      },
      { label: 'دورات السنة', render: c => c.evaluation.coursesLastYear },
      { label: 'الخبرة', render: c => `${c.evaluation.employee.experienceYears} سنوات` },
      { label: 'مهارات المنصب', render: c => `${c.matchedSkills.length} من ${total}` },
      {
        label: 'ينقصه',
        render: c =>
          c.missingSkills.length === 0 ? (
            <span className="text-emerald-800">لا شيء</span>
          ) : (
            <span className="text-amber-900">{c.missingSkills.map(s => s.name).join('، ')}</span>
          ),
      },
    ];

    return (
      <div className="space-y-6 pb-20 text-right max-w-4xl mx-auto">
        <div>
          <button
            onClick={() => setSelectedRoleId(null)}
            className="flex items-center gap-1.5 text-sm font-semibold text-link hover:underline min-h-[44px]"
          >
            <ArrowRight className="w-4 h-4" />
            <span>كل الترقيات</span>
          </button>
          <h1 className="type-1 text-slate-900">{role.title}</h1>
          <span className="text-sm text-slate-500">
            {role.department} · خبرة {role.minExperienceYears} سنوات
          </span>
        </div>

        <div>
          <span className="type-4 text-slate-900 block mb-2">مهارات المنصب</span>
          <div className="flex flex-wrap gap-1.5">
            {role.requiredSkills.map(s => (
              <span
                key={s.name}
                className="text-sm font-semibold bg-surface border border-slate-300 text-slate-900 px-3 py-1.5 rounded-lg"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {candidates.length === 0 ? (
          <p className="text-sm text-slate-600 bg-surface border border-slate-200 rounded-2xl p-5">
            لا يوجد مرشحون لهذه الترقية حالياً حسب معايير الترقية.
          </p>
        ) : (
          <>
            <h2 className="type-2 text-slate-900">مقارنة المرشحين</h2>

            <div className="bg-surface rounded-2xl border border-slate-200 overflow-x-auto">
              <table className="w-full table-fixed text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-2 sm:p-3 w-16 sm:w-32" />
                    {candidates.map(c => (
                      <th key={c.evaluation.employee.id} className="p-2 sm:p-3 align-top text-center font-normal">
                        <span className="type-3 text-slate-900 block">{c.evaluation.employee.name}</span>
                        <span className="text-xs text-slate-500 block">{c.evaluation.employee.title}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map(row => (
                    <tr key={row.label}>
                      <th className="p-2 sm:p-3 text-xs sm:text-sm text-slate-500 font-semibold align-top text-right">
                        {row.label}
                      </th>
                      {candidates.map(c => (
                        <td
                          key={c.evaluation.employee.id}
                          className="p-2 sm:p-3 text-slate-900 align-top text-center tabular-nums"
                        >
                          {row.render(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th className="p-3" />
                    {candidates.map(c => (
                      <td key={c.evaluation.employee.id} className="p-3 text-center">
                        <button
                          onClick={() => onSelectEmployee(c.evaluation.employee)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-link min-h-[44px]"
                        >
                          <span>الملف</span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <h2 className="type-2 text-slate-900">ليش؟</h2>
              <ul className="bg-surface rounded-2xl border border-slate-200 divide-y divide-slate-100">
                {candidates.map(c => {
                  const gaps = buildPromotionGaps(c);
                  const planKey = `${role.id}:${c.evaluation.employee.id}`;
                  const isPlanOpen = openPlanId === planKey;
                  return (
                    <li key={c.evaluation.employee.id} className="p-4 text-sm space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex-1 min-w-0">
                          <span className="font-bold text-slate-900">{c.evaluation.employee.name}: </span>
                          <span className="text-slate-700">{reasonFor(c, total)}</span>
                        </span>
                        {/* زر الذكاء الاصطناعي يظهر فقط لمن ينقصه شيء، ويفتح «كيف يوصل؟» تحت السطر ويطويه */}
                        {gaps.length > 0 && (
                          <button
                            onClick={() => setOpenPlanId(isPlanOpen ? null : planKey)}
                            aria-expanded={isPlanOpen}
                            aria-label={`كيف يوصل ${c.evaluation.employee.name}؟`}
                            title="كيف يوصل؟ خطة بالذكاء الاصطناعي"
                            className={`shrink-0 h-8 px-2 flex items-center justify-center gap-1 rounded-md text-white ${
                              isPlanOpen ? 'bg-brand-900' : 'bg-brand-800 hover:bg-brand-900'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPlanOpen ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                        <button
                          onClick={() => setShareTarget(c.evaluation)}
                          aria-label={`شارك مع ${c.evaluation.employee.name}`}
                          title="شارك مع الموظف"
                          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 text-link hover:bg-slate-50"
                        >
                          <Share className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {isPlanOpen && (
                        <PromotionPlanPanel
                          employeeName={c.evaluation.employee.name}
                          roleTitle={role.title}
                          gaps={gaps}
                          plan={plans[planKey] || null}
                          onPlan={plan => setPlans(prev => ({ ...prev, [planKey]: plan }))}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}

        <p className="text-xs text-slate-500 text-center">ترشيحات مساندة، والقرار لإدارة الموارد البشرية.</p>

        <ShareWithEmployeeModal evaluation={shareTarget} onClose={() => setShareTarget(null)} />

        {role.id.startsWith('role-custom-') && (
          <button
            onClick={() => {
              onDeleteRole(role.id);
              setSelectedRoleId(null);
            }}
            className="mx-auto flex items-center gap-1.5 text-sm font-semibold text-rose-700 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف هذه الترقية</span>
          </button>
        )}
      </div>
    );
  }

  /* ---------- Roles list with team filter ---------- */
  const departments = teams.map(t => t.department);
  const visible = rolesWithCandidates.filter(r => department === 'all' || r.role.department === department);

  return (
    <div className="space-y-6 pb-20 text-right">
      <div className="flex items-center justify-between gap-3">
        <h1 className="type-1 text-slate-900">الترقيات</h1>
        <button
          onClick={onEditCriteria}
          aria-label="معايير الترقية"
          className="flex items-center gap-1.5 text-sm font-semibold text-link border border-slate-300 bg-surface hover:bg-slate-50 rounded-lg px-3 min-h-[44px]"
        >
          <Settings2 className="w-4 h-4" />
          <span>المعايير</span>
        </button>
      </div>

      <FloatingAddButton label="إضافة ترقية" onClick={() => setIsAddOpen(true)} />

      {/* Team filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', ...departments] as (Department | 'all')[]).map(d => (
          <button
            key={d}
            onClick={() => setDepartment(d)}
            aria-pressed={department === d}
            className={`px-3 min-h-[44px] rounded-full text-sm font-semibold border transition-colors ${
              department === d
                ? 'bg-brand-800 text-white border-brand-800'
                : 'bg-surface text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {d === 'all' ? 'كل الفرق' : d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visible.map(({ role, candidates }) => {
          const qualified = candidates.filter(c => c.qualified).length;
          const near = candidates.length - qualified;
          return (
            <button
              key={role.id}
              onClick={() => {
                setSelectedRoleId(role.id);
                window.scrollTo({ top: 0 });
              }}
              className="group text-right bg-surface rounded-2xl border border-slate-200 hover:border-brand-700 p-5 flex items-center justify-between gap-4 transition-colors"
            >
              <div className="min-w-0">
                <h2 className="type-3 text-slate-900">{role.title}</h2>
                <span className="text-sm text-slate-500 block">{role.department}</span>
                {near > 0 && <span className="text-sm text-amber-900 block mt-1">قريبون من التأهل: {near}</span>}
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <div className="text-center">
                  <span
                    className={`type-stat tabular-nums block leading-none ${
                      qualified > 0 ? 'text-link' : 'text-slate-300'
                    }`}
                  >
                    {qualified}
                  </span>
                  <span className="text-xs text-slate-600">مؤهلون</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-brand-700 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {visible.length === 0 && <p className="text-sm text-slate-600">لا توجد ترقيات في هذا الفريق.</p>}

      <AddRoleModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        teams={teams}
        onAdd={role => {
          onAddRole(role);
          setSelectedRoleId(role.id);
          window.scrollTo({ top: 0 });
        }}
      />
    </div>
  );
};
