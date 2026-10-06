import React, { useMemo, useState } from 'react';
import { Department, Employee, PromotionEvaluation, TeamInsight } from '../../types';
import { AddEmployeeModal } from './AddEmployeeModal';
import { FloatingAddButton } from '../common/FloatingAddButton';
import { PersonAvatar } from '../common/PersonAvatar';
import { ExternalCandidate, LINKEDIN_URL } from '../../utils/externalCandidates';
import { ChevronLeft, Download, FileUp, Linkedin, Loader2, Search } from 'lucide-react';

interface EmployeesListScreenProps {
  teams: TeamInsight[];
  departments: Department[];
  companySkills: string[];
  onSelectEmployee: (emp: Employee) => void;
  onAddEmployee: (emp: Employee) => void;
  // وُظّفوا من لينكدإن ولم يُكمل ملفهم بعد
  pendingHires: ExternalCandidate[];
  onOnboardHire: (candidateId: string, emp: Employee) => void;
}

type Filter = Department | 'all' | 'ready';

const STATUS: Record<PromotionEvaluation['status'], { label: string; style: string } | null> = {
  ready: { label: 'يستحق الترقية', style: 'bg-emerald-100 text-emerald-900' },
  close: { label: 'قريب من الترقية', style: 'bg-amber-100 text-amber-900' },
  none: null,
};

export const EmployeesListScreen: React.FC<EmployeesListScreenProps> = ({
  teams,
  departments,
  companySkills,
  onSelectEmployee,
  onAddEmployee,
  pendingHires,
  onOnboardHire,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  // إكمال ملف موظف لينكدإن: من يُسحب ملفه الآن، ومن تُرفع سيرته
  const [pulling, setPulling] = useState<string | null>(null);
  const [cvFor, setCvFor] = useState<ExternalCandidate | null>(null);

  // فريق الموظف الجديد يؤخذ من المشروع الذي رُشّح له
  const teamOf = (candidate: ExternalCandidate): Department =>
    departments.find(d => d === candidate.department) || departments[0];

  // سحب تجريبي: يبني الملف من بيانات المرشح الظاهرة في الترشيح
  const pullFromLinkedin = (candidate: ExternalCandidate) => {
    setPulling(candidate.id);
    window.setTimeout(() => {
      const stamp = Date.now();
      onOnboardHire(candidate.id, {
        id: `emp-linkedin-${stamp}`,
        name: candidate.name,
        title: candidate.headline,
        department: teamOf(candidate),
        experienceYears: candidate.years,
        skills: (candidate.profileSkills || candidate.skills).map((name, i) => ({
          id: `sk-${stamp}-${i}`,
          name,
          level: candidate.skills.includes(name) ? 4 : 3,
        })),
        reviews: [],
        projects: [],
        courses: (candidate.profileCourses || []).map((c, i) => ({ ...c, id: `c-${stamp}-${i}` })),
        lastPromotionDate: null,
        source: 'linkedin',
      });
      setPulling(null);
      setQuery(candidate.name);
      setFilter('all');
    }, 1400);
  };

  const total = teams.reduce((sum, t) => sum + t.members.length, 0);
  const readyCount = teams.reduce((sum, t) => sum + t.ready.length, 0);

  // الموظفون مجمّعون حسب الفريق بعد تطبيق البحث والفلتر
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teams
      .filter(t => filter === 'all' || filter === 'ready' || t.department === filter)
      .map(t => ({
        department: t.department,
        people: t.evaluations.filter(e => {
          if (filter === 'ready' && e.status !== 'ready') return false;
          if (q === '') return true;
          return (
            e.employee.name.toLowerCase().includes(q) ||
            e.employee.title.toLowerCase().includes(q) ||
            e.employee.skills.some(s => s.name.toLowerCase().includes(q))
          );
        }),
      }))
      .filter(g => g.people.length > 0);
  }, [teams, query, filter]);

  const shown = groups.reduce((sum, g) => sum + g.people.length, 0);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: `الكل (${total})` },
    { key: 'ready', label: `يستحقون الترقية (${readyCount})` },
    ...teams.map(t => ({ key: t.department as Filter, label: t.department })),
  ];

  return (
    <div className="space-y-6 pb-20 text-right">
      <h1 className="type-1 text-slate-900">الموظفون</h1>

      <FloatingAddButton label="إضافة موظف" onClick={() => setIsAddOpen(true)} />

      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث بالاسم أو المسمى أو المهارة"
          className="w-full min-h-[48px] pr-10 pl-3 bg-surface border border-slate-300 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-700"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`px-3 min-h-[44px] rounded-full text-sm font-semibold border transition-colors ${
              filter === f.key
                ? 'bg-brand-800 text-white border-brand-800'
                : 'bg-surface text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* موظفون جدد من لينكدإن ينتظرون إكمال ملفهم */}
      {pendingHires.map(candidate => (
        <div key={candidate.id} className="bg-surface rounded-2xl border border-royal p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3">
            <PersonAvatar name={candidate.name} fromLinkedin />
            <div className="flex-1 min-w-0">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="type-3 text-slate-900">{candidate.name}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-50 text-link">
                  موظف جديد من لينكدإن
                </span>
              </span>
              <p className="text-sm text-slate-600">
                {candidate.headline}
                {` · ${teamOf(candidate)}`}
                {candidate.projectTitle ? ` · مشروع ${candidate.projectTitle}` : ''}
              </p>
            </div>
            <a
              href={candidate.profileUrl || LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`صفحة ${candidate.name} في لينكدإن`}
              className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-[#0A66C2] hover:bg-slate-100"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          <p className="type-4 text-slate-900">كيف تبي تكمل ملفه؟</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => pullFromLinkedin(candidate)}
              disabled={pulling !== null}
              className="flex-1 min-h-[48px] px-4 bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              {pulling === candidate.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{pulling === candidate.id ? 'جارٍ سحب الملف...' : 'اسحب بياناته من لينكدإن'}</span>
            </button>
            <button
              onClick={() => setCvFor(candidate)}
              disabled={pulling !== null}
              className="flex-1 min-h-[48px] px-4 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <FileUp className="w-4 h-4" />
              <span>ارفع سيرته الذاتية</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">السحب محاكاة للعرض: يستخدم بيانات محفوظة في النموذج، لا اتصالاً مباشراً بلينكدإن.</p>
        </div>
      ))}

      {shown === 0 ? (
        <p className="text-base text-slate-600 bg-surface border border-slate-200 rounded-2xl p-6 text-center">
          لا يوجد موظفون مطابقون. جرّب كلمة بحث أخرى أو غيّر الفلتر.
        </p>
      ) : (
        groups.map(group => (
          <section key={group.department} className="space-y-2">
            <h2 className="type-3 text-slate-900">
              {group.department} <span className="text-slate-400 font-semibold tabular-nums">({group.people.length})</span>
            </h2>

            <div className="bg-surface rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {group.people.map(evaluation => {
                const { employee } = evaluation;
                const status = STATUS[evaluation.status];
                const lastScore = evaluation.recentReviews[evaluation.recentReviews.length - 1]?.score;
                return (
                  <button
                    key={employee.id}
                    onClick={() => onSelectEmployee(employee)}
                    className="w-full flex items-center gap-3 p-4 text-right hover:bg-slate-50 transition-colors"
                  >
                    <PersonAvatar name={employee.name} fromLinkedin={employee.source === 'linkedin'} />

                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="type-3 text-slate-900">{employee.name}</span>
                        {status && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${status.style}`}>{status.label}</span>
                        )}
                      </span>
                      <span className="text-sm text-slate-600 block">{employee.title}</span>
                      {/* Numbers under the name on phones */}
                      <span className="sm:hidden text-sm text-slate-500 block mt-1 tabular-nums">
                        تقييم {lastScore ?? '-'}
                        {evaluation.taskCompletion !== null && ` · إنجاز ${evaluation.taskCompletion}%`}
                      </span>
                    </span>

                    {/* Numbers in columns on wider screens */}
                    <span className="hidden sm:block shrink-0 w-20 text-center">
                      <span className="type-2 text-slate-900 tabular-nums block leading-tight">
                        {lastScore ?? '-'}
                      </span>
                      <span className="text-xs text-slate-500">آخر تقييم</span>
                    </span>
                    <span className="hidden sm:block shrink-0 w-20 text-center">
                      <span className="type-2 text-slate-900 tabular-nums block leading-tight">
                        {evaluation.taskCompletion !== null ? `${evaluation.taskCompletion}%` : '-'}
                      </span>
                      <span className="text-xs text-slate-500">إنجاز المهام</span>
                    </span>

                    <ChevronLeft className="w-5 h-5 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </section>
        ))
      )}

      <AddEmployeeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        departments={departments}
        companySkills={companySkills}
        onAdd={employee => {
          onAddEmployee(employee);
          setQuery(employee.name);
          setFilter('all');
        }}
      />

      {/* رفع سيرة موظف لينكدإن: نفس نافذة الإضافة مع تعبئة ما نعرفه عنه */}
      <AddEmployeeModal
        isOpen={cvFor !== null}
        onClose={() => setCvFor(null)}
        departments={departments}
        companySkills={companySkills}
        initial={
          cvFor
            ? {
                name: cvFor.name,
                title: cvFor.headline,
                experienceYears: cvFor.years,
                skills: cvFor.skills,
                department: teamOf(cvFor),
              }
            : null
        }
        onAdd={employee => {
          if (cvFor) onOnboardHire(cvFor.id, employee);
          setQuery(employee.name);
          setFilter('all');
        }}
      />
    </div>
  );
};
