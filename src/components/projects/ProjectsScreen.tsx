import React, { useMemo, useState } from 'react';
import { CompanyProject, Employee } from '../../types';
import { allCompanySkills, alternativesFor, recommendTeam, TeamMemberPick, whoHasSkill } from '../../utils/projectTeam';
import { ExternalCandidate, LINKEDIN_URL, sampleExternalCandidates } from '../../utils/externalCandidates';
import { PersonAvatar } from '../common/PersonAvatar';
import { AddProjectModal } from './AddProjectModal';
import { FloatingAddButton } from '../common/FloatingAddButton';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Linkedin,
  Loader2,
  Repeat,
  RotateCcw,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';

interface ProjectsScreenProps {
  projects: CompanyProject[];
  employees: Employee[];
  onAddProject: (project: CompanyProject) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectEmployee: (employee: Employee) => void;
  // مرشحو لينكدإن لكل مشروع، محفوظون في التطبيق حتى تظهر حالتهم في صفحة الموظفين
  externalHires: Record<string, ExternalCandidate[]>;
  onCompleteHire: () => void; // يفتح صفحة الموظفين لإكمال ملف من وُظّف من لينكدإن
  onChangeExternalHires: React.Dispatch<React.SetStateAction<Record<string, ExternalCandidate[]>>>;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  employees,
  onAddProject,
  onDeleteProject,
  onSelectEmployee,
  externalHires,
  onChangeExternalHires: setExternalHires,
  onCompleteHire,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // لكل مشروع: استبدالات اختارها المدير (العضو الأصلي ← البديل)
  const [swaps, setSwaps] = useState<Record<string, Record<string, string>>>({});
  // العضو الذي يُعرض له البدلاء الآن
  const [swapTarget, setSwapTarget] = useState<TeamMemberPick | null>(null);
  // البحث الخارجي (محاكاة): حالته لكل مشروع
  const [externalSearch, setExternalSearch] = useState<Record<string, 'searching' | 'done'>>({});

  const companySkills = useMemo(() => allCompanySkills(employees), [employees]);
  const withTeams = useMemo(
    () =>
      projects.map(project => ({
        project,
        team: recommendTeam(project, employees, swaps[project.id] || {}),
      })),
    [projects, employees, swaps],
  );
  const selected = withTeams.find(p => p.project.id === selectedId) || null;

  /* ---------- Project detail: the recommended team ---------- */
  if (selected) {
    const { project, team } = selected;
    const externals = externalHires[project.id] || [];
    const externalSkills = new Set(externals.flatMap(x => x.skills));
    // التغطية = ما يغطيه الفريق الداخلي + ما يضيفه المرشحون الخارجيون المختارون
    const covered = project.skills
      .map(sk => sk.name)
      .filter(n => team.coveredSkills.includes(n) || externalSkills.has(n));
    const uncovered = project.skills.map(sk => sk.name).filter(n => !covered.includes(n));
    const searchState = externalSearch[project.id];
    // غير مغطاة لأن لا أحد في الشركة يتقنها (تحتاج توظيفاً) مقابل موجودة عند موظف خارج الفريق
    const missingInCompany = uncovered.filter(n => whoHasSkill(employees, n).length === 0);
    const outsideTeam = uncovered
      .filter(n => !missingInCompany.includes(n))
      .map(n => ({ skill: n, people: whoHasSkill(employees, n) }));
    const externalResults = sampleExternalCandidates(missingInCompany);
    const runExternalSearch = () => {
      setExternalSearch(prev => ({ ...prev, [project.id]: 'searching' }));
      window.setTimeout(() => setExternalSearch(prev => ({ ...prev, [project.id]: 'done' })), 1600);
    };
    // فريق المرشح الخارجي = الفريق الأكثر حضوراً بين أعضاء المشروع
    const departmentCounts: Record<string, number> = {};
    team.members.forEach(m => {
      departmentCounts[m.employee.department] = (departmentCounts[m.employee.department] || 0) + 1;
    });
    const mainDepartment = Object.entries(departmentCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const addExternal = (candidate: ExternalCandidate) =>
      setExternalHires(prev => ({
        ...prev,
        [project.id]: [
          ...(prev[project.id] || []),
          {
            ...candidate,
            id: `${project.id}-${candidate.id}`,
            status: 'nominated',
            projectTitle: project.title,
            department: mainDepartment,
          },
        ],
      }));
    const markHired = (id: string) =>
      setExternalHires(prev => ({
        ...prev,
        [project.id]: (prev[project.id] || []).map(x => (x.id === id ? { ...x, status: 'hired' } : x)),
      }));
    const removeExternal = (id: string) =>
      setExternalHires(prev => ({
        ...prev,
        [project.id]: (prev[project.id] || []).filter(x => x.id !== id),
      }));
    const hasSwaps = Object.keys(swaps[project.id] || {}).length > 0;
    const resetSwaps = () => setSwaps(prev => ({ ...prev, [project.id]: {} }));
    const alternatives = swapTarget ? alternativesFor(project, employees, team, swapTarget) : [];
    const chooseAlternative = (replacement: Employee) => {
      if (!swapTarget) return;
      // المفتاح دائماً العضو الأصلي في الترشيح، حتى لو كان المعروض الآن بديلاً عنه
      const originalId = swapTarget.replaces?.id ?? swapTarget.employee.id;
      setSwaps(prev => ({
        ...prev,
        [project.id]: {
          ...(prev[project.id] || {}),
          [originalId]: replacement.id,
        },
      }));
      setSwapTarget(null);
    };
    return (
      <div className="space-y-6 pb-20 text-right max-w-4xl mx-auto">
        <div>
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-1.5 text-sm font-semibold text-link hover:underline min-h-[44px]"
          >
            <ArrowRight className="w-4 h-4" />
            <span>كل المشاريع</span>
          </button>
          <h1 className="type-1 text-slate-900">{project.title}</h1>
          {project.summary && <p className="text-base text-slate-600 mt-1 leading-relaxed">{project.summary}</p>}
        </div>

        {/* Skills the project needs, and whether the team covers them */}
        <section className="bg-surface rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="type-3 text-slate-900">مهارات المشروع</h2>
            <span className="text-sm text-slate-600">
              الفريق يغطي{' '}
              <span className="type-2 text-slate-900 tabular-nums">
                {covered.length} من {project.skills.length}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.skills.map(skill => {
              const isCovered = covered.includes(skill.name);
              return (
                <span
                  key={skill.name}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1.5 rounded-lg border ${
                    isCovered
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {isCovered ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {skill.name}
                </span>
              );
            })}
          </div>
          {outsideTeam.length > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 space-y-1">
              <p className="text-sm font-semibold text-amber-900">الفريق الحالي لا يغطي:</p>
              {outsideTeam.map(item => (
                <p key={item.skill} className="text-sm text-amber-950 leading-relaxed">
                  {item.skill}. يتقنها في الشركة: {item.people.map(e => e.name).join('، ')}.
                </p>
              ))}
            </div>
          )}

          {missingInCompany.length > 0 && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 space-y-3">
              <p className="text-sm text-rose-900 leading-relaxed">
                لا يوجد في الشركة من يتقن: {missingInCompany.join('، ')}.
              </p>
              {searchState !== 'done' && (
                <button
                  onClick={runExternalSearch}
                  disabled={searchState === 'searching'}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-4 min-h-[48px] bg-[#0A66C2] hover:bg-[#004182] disabled:opacity-70 text-white rounded-lg font-bold text-sm"
                >
                  {searchState === 'searching' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Linkedin className="w-5 h-5" />
                  )}
                  <span>{searchState === 'searching' ? 'الوكيل يبحث في لينكدإن...' : 'ابحث عن مرشح في لينكدإن'}</span>
                </button>
              )}
            </div>
          )}

          {/* External candidates (simulated agent search) */}
          {searchState === 'done' && missingInCompany.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-10 h-10 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center">
                  <Linkedin className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="type-3 text-slate-900">مرشحون من لينكدإن، منفتحون على العمل</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ملفات تجريبية لعرض الفكرة. الربط الفعلي يتطلب اتفاقاً رسمياً مع لينكدإن.
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
                {externalResults.map(candidate => (
                  <li key={candidate.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="type-4 text-slate-900 block">{candidate.name}</span>
                      <span className="text-sm text-slate-600 block">{candidate.headline}</span>
                      <span className="text-sm text-slate-500 tabular-nums">
                        {[candidate.city, candidate.years > 0 ? `خبرة ${candidate.years} سنوات` : '']
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </div>
                    <div className="shrink-0 flex flex-wrap justify-end gap-2">
                      <a
                        href={candidate.profileUrl || LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-sm font-semibold text-white"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>شوف ملفه</span>
                      </a>
                      <button
                        onClick={() => addExternal(candidate)}
                        className="shrink-0 flex items-center gap-1.5 px-3 min-h-[44px] rounded-lg bg-brand-800 hover:bg-brand-900 text-sm font-bold text-white"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>رشّحه</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Recommended team */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="type-2 text-slate-900">
              الفريق المقترح{' '}
              <span className="text-slate-400 font-semibold tabular-nums">
                (
                {team.members.length +
                  externals.filter(c => !team.members.some(m => m.employee.name === c.name)).length}
                )
              </span>
            </h2>
            {hasSwaps && (
              <button
                onClick={resetSwaps}
                className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-link min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>رجوع للترشيح الأول</span>
              </button>
            )}
          </div>

          {team.members.length === 0 ? (
            <p className="text-sm text-slate-600 bg-surface border border-slate-200 rounded-2xl p-5">
              لا يوجد موظفون يتقنون مهارات هذا المشروع.
            </p>
          ) : (
            <div className="space-y-3">
              {team.members.map(member => (
                <div
                  key={member.employee.id}
                  className="bg-surface rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <PersonAvatar name={member.employee.name} fromLinkedin={member.employee.source === 'linkedin'} />
                    <div className="flex-1 min-w-0">
                      <h3 className="type-3 text-slate-900">{member.employee.name}</h3>
                      <p className="text-sm text-slate-600">
                        {member.employee.title} · {member.employee.department}
                      </p>
                      {member.replaces && (
                        <p className="text-sm text-link font-semibold">بديل عن {member.replaces.name}</p>
                      )}
                    </div>
                    <button
                      onClick={() => onSelectEmployee(member.employee)}
                      className="shrink-0 flex items-center gap-1 text-sm font-semibold text-link min-h-[44px]"
                    >
                      <span>الملف</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="type-4 text-slate-900 block mb-1.5">يغطي في المشروع:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.covers.map(skill => (
                        <span key={skill} className="text-sm bg-brand-50 text-slate-900 px-2.5 py-1 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* بدون سطر المهام اليومية (موظف جديد) يُرفع الزر ليحاذي المهارات بدل أن يبقى وحده في سطر */}
                  <div
                    className={`flex items-center justify-between gap-3 ${member.dailyLoad === null ? 'pt-1 sm:pt-0 sm:-mt-14' : 'pt-1'}`}
                  >
                    <span className={`text-sm ${member.highLoad ? 'text-amber-900 font-semibold' : 'text-slate-600'}`}>
                      {member.dailyLoad !== null && (
                        <>
                          مهامه اليومية الحالية: <span className="tabular-nums">{member.dailyLoad}</span>
                          {member.highLoad && ' (أعلى من المتوسط)'}
                        </>
                      )}
                    </span>
                    <button
                      onClick={() => setSwapTarget(member)}
                      className="shrink-0 flex items-center gap-1.5 px-3 min-h-[44px] rounded-lg border border-slate-300 bg-surface hover:bg-slate-50 text-sm font-semibold text-link"
                    >
                      <Repeat className="w-4 h-4" />
                      <span>أريد بديلاً</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* بعد التوظيف يصير مثل بقية أعضاء الفريق، ويبقى شعار لينكدإن صورته */}
              {externals
                .filter(c => c.status === 'hired' || c.status === 'onboarded')
                // إذا اكتمل ملفه ودخل الفريق كموظف فبطاقته موجودة أعلاه
                .filter(c => !team.members.some(m => m.employee.name === c.name))
                .map(candidate => (
                  <div
                    key={candidate.id}
                    className="bg-surface rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <PersonAvatar name={candidate.name} fromLinkedin />
                      <div className="flex-1 min-w-0">
                        <h3 className="type-3 text-slate-900">{candidate.name}</h3>
                        <p className="text-sm text-slate-600">
                          {candidate.headline}
                          {candidate.department ? ` · ${candidate.department}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          // صار موظفاً: افتح ملفه. لم يُكمل ملفه بعد: اذهب لصندوقه في صفحة الموظفين
                          const employee = employees.find(e => e.source === 'linkedin' && e.name === candidate.name);
                          if (employee) onSelectEmployee(employee);
                          else onCompleteHire();
                        }}
                        className="shrink-0 flex items-center gap-1 text-sm font-semibold text-link min-h-[44px]"
                      >
                        <span>الملف</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <span className="type-4 text-slate-900 block mb-1.5">يغطي في المشروع:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.map(skill => (
                          <span key={skill} className="text-sm bg-brand-50 text-slate-900 px-2.5 py-1 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

              {externals
                .filter(c => c.status !== 'hired' && c.status !== 'onboarded')
                .map(candidate => (
                  <div key={candidate.id} className="bg-surface rounded-2xl border border-royal p-4 sm:p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 w-11 h-11 rounded-full bg-[#0A66C2] text-white flex items-center justify-center">
                        <Linkedin className="w-5 h-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="type-3 text-slate-900">{candidate.name}</h3>
                        <p className="text-sm text-slate-600">
                          {[candidate.headline, candidate.city].filter(Boolean).join(' · ')}
                        </p>
                        <span className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-md bg-brand-50 text-link">
                          مرشح خارجي، بانتظار التوظيف
                        </span>
                      </div>
                      <button
                        onClick={() => removeExternal(candidate.id)}
                        aria-label={`إزالة ${candidate.name}`}
                        className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.map(skill => (
                          <span key={skill} className="text-sm bg-brand-50 text-slate-900 px-2.5 py-1 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={candidate.profileUrl || LINKEDIN_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] px-4 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm flex items-center gap-2"
                        >
                          <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                          <span>صفحته في لينكدإن</span>
                        </a>
                        <button
                          onClick={() => markHired(candidate.id)}
                          className="min-h-[44px] px-4 bg-brand-800 hover:bg-brand-900 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>تم توظيفه</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        <p className="text-xs text-slate-500 text-center">ترشيح مساند مبني على المهارات، والقرار لمدير المشروع.</p>

        {/* Alternatives for one team member */}
        {swapTarget && (
          <div className="fixed inset-0 z-[45] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6">
            <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full text-right my-auto">
              <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h2 className="type-2 plain-title text-slate-900">بدلاء {swapTarget.employee.name}</h2>
                <button
                  onClick={() => setSwapTarget(null)}
                  aria-label="إغلاق"
                  className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {alternatives.length === 0 ? (
                <p className="p-6 text-sm text-slate-600">لا يوجد خارج الفريق من يتقن مهارات هذا المشروع.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {alternatives.map(alt => {
                    const lost = swapTarget.covers.filter(s => !alt.covers.includes(s));
                    return (
                      <li key={alt.employee.id} className="p-5 sm:px-6 space-y-3">
                        <div>
                          <h3 className="type-3 text-slate-900">{alt.employee.name}</h3>
                          <p className="text-sm text-slate-600">
                            {alt.employee.title} · {alt.employee.department}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {alt.covers.map(skill => (
                            <span key={skill} className="text-sm bg-brand-50 text-slate-900 px-2.5 py-1 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                        {lost.length > 0 && <p className="text-sm text-amber-900">لا يغطي: {lost.join('، ')}</p>}
                        {alt.dailyLoad !== null && (
                          <p className={`text-sm ${alt.highLoad ? 'text-amber-900 font-semibold' : 'text-slate-600'}`}>
                            مهامه اليومية الحالية: <span className="tabular-nums">{alt.dailyLoad}</span>
                            {alt.highLoad && ' (أعلى من المتوسط)'}
                          </p>
                        )}
                        <div className="flex gap-3">
                          <button
                            onClick={() => chooseAlternative(alt.employee)}
                            className="flex-1 min-h-[44px] bg-brand-800 hover:bg-brand-900 text-white rounded-lg font-bold text-sm"
                          >
                            اختره بديلاً
                          </button>
                          <button
                            onClick={() => onSelectEmployee(alt.employee)}
                            className="flex-1 min-h-[44px] bg-surface border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-lg font-semibold text-sm"
                          >
                            شوف ملفه
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            onDeleteProject(project.id);
            setSelectedId(null);
          }}
          className="mx-auto flex items-center gap-1.5 text-sm font-semibold text-rose-700 min-h-[44px]"
        >
          <Trash2 className="w-4 h-4" />
          <span>حذف هذا المشروع</span>
        </button>
      </div>
    );
  }

  /* ---------- Projects list ---------- */
  return (
    <div className="space-y-6 pb-20 text-right">
      <h1 className="type-1 text-slate-900">المشاريع</h1>

      <FloatingAddButton label="مشروع جديد" onClick={() => setIsAddOpen(true)} />

      {withTeams.length === 0 ? (
        <p className="text-base text-slate-600 bg-surface border border-slate-200 rounded-2xl p-6 text-center">
          لا توجد مشاريع بعد. أضف مشروعاً ليرشّح لك كفء أنسب فريق له.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {withTeams.map(({ project, team }) => {
            // من رُشّحوا أو وُظّفوا من لينكدإن يُحسبون مع الفريق، كما في صفحة المشروع
            const externals = (externalHires[project.id] || []).filter(
              c => !team.members.some(m => m.employee.name === c.name),
            );
            const names = [...team.members.map(m => m.employee.name), ...externals.map(c => c.name)];
            const externalSkills = new Set((externalHires[project.id] || []).flatMap(c => c.skills));
            const coveredCount = project.skills.filter(
              sk => team.coveredSkills.includes(sk.name) || externalSkills.has(sk.name),
            ).length;
            return (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedId(project.id);
                  window.scrollTo({ top: 0 });
                }}
                className="group text-right bg-surface rounded-2xl border border-slate-200 hover:border-brand-700 p-5 space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="type-3 text-slate-900">{project.title}</h2>
                  <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-brand-700 transition-colors shrink-0" />
                </div>
                <p className="text-sm text-slate-600">الفريق المقترح: {names.join('، ') || 'لا أحد'}</p>
                <span
                  className={`inline-block text-sm font-semibold px-2 py-1 rounded-md ${
                    coveredCount === project.skills.length
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-900'
                  }`}
                >
                  يغطي {coveredCount} من {project.skills.length} مهارات
                </span>
              </button>
            );
          })}
        </div>
      )}

      <AddProjectModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        companySkills={companySkills}
        onAdd={project => {
          onAddProject(project);
          setSelectedId(project.id);
          window.scrollTo({ top: 0 });
        }}
      />
    </div>
  );
};
