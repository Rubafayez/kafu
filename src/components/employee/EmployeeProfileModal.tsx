import React, { useEffect, useState } from 'react';
import { PersonAvatar } from '../common/PersonAvatar';
import { Employee, PromotionEvaluation } from '../../types';
import { sortReviews } from '../../utils/teamInsights';
import { ShareWithEmployeeModal } from './ShareWithEmployeeModal';
import { X, CheckCircle, XCircle, Share, ChevronDown, Trash2 } from 'lucide-react';

interface EmployeeProfileModalProps {
  employee: Employee | null;
  evaluation: PromotionEvaluation | null;
  onClose: () => void;
  onDelete?: (employeeId: string) => void;
}

const STATUS_BADGE: Record<PromotionEvaluation['status'], { label: string; style: string }> = {
  ready: { label: 'يستحق الترقية', style: 'bg-emerald-100 text-emerald-900' },
  close: { label: 'قريب من الترقية', style: 'bg-amber-100 text-amber-900' },
  none: { label: 'لم يحقق المعايير بعد', style: 'bg-slate-100 text-slate-700' },
};

const QUARTER_LABEL = { Q1: 'الربع 1', Q2: 'الربع 2', Q3: 'الربع 3', Q4: 'الربع 4' };

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
    <span className="type-stat text-link tabular-nums block leading-tight">{value}</span>
    <span className="text-xs sm:text-sm text-slate-700">{label}</span>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h3 className="type-3 text-slate-900">{title}</h3>
    {children}
  </section>
);

// قسم مطوي: يظهر عنوانه وعدده فقط حتى يُفتح
const Collapsible: React.FC<{ title: string; count: number; children: React.ReactNode }> = ({
  title,
  count,
  children,
}) => {
  const [open, setOpen] = useState(false);
  if (count === 0) return null;
  return (
    <section className="border border-slate-200 rounded-xl">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 p-4 text-right min-h-[48px]"
      >
        <span className="type-3 text-slate-900">
          {title} <span className="text-slate-400 font-semibold tabular-nums">({count})</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </section>
  );
};

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employee,
  evaluation,
  onClose,
  onDelete,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  // نافذة المشاركة تُغلق عند تغيير الموظف أو إغلاق ملفه
  useEffect(() => {
    setIsShareOpen(false);
  }, [employee?.id]);

  if (!employee) return null;

  const reviews = sortReviews(employee.reviews).slice(-4);
  const latest = reviews[reviews.length - 1];
  const skills = [...employee.skills].sort((a, b) => b.level - a.level);
  const badge = evaluation ? STATUS_BADGE[evaluation.status] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full text-right my-auto">
        {/* Header */}
        <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <PersonAvatar name={employee.name} fromLinkedin={employee.source === 'linkedin'} large />
            <div className="min-w-0">
              <h2 className="type-2 text-slate-900">{employee.name}</h2>
              <p className="text-sm text-slate-600">
                {employee.title} · {employee.department}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق الملف"
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5 space-y-6">
          {/* Headline numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Stat label="آخر تقييم" value={latest ? latest.score : '-'} />
            <Stat
              label="إنجاز المهام"
              value={evaluation && evaluation.taskCompletion !== null ? `${evaluation.taskCompletion}%` : '-'}
            />
            <Stat label="دورات السنة" value={evaluation ? evaluation.coursesLastYear : employee.courses.length} />
            <Stat label="سنوات الخبرة" value={employee.experienceYears} />
          </div>

          {/* Promotion status */}
          {evaluation && badge && (
            <Section title="الترقية">
              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <span className={`inline-block text-sm font-bold px-2.5 py-1 rounded-md ${badge.style}`}>
                  {badge.label}
                </span>
                <ul className="space-y-2">
                  {evaluation.checks.map(check => (
                    <li key={check.key} className="flex items-start gap-2 text-sm">
                      {check.met ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      )}
                      <span className={check.met ? 'text-slate-700' : 'text-amber-900 font-semibold'}>
                        {check.label}
                        <span className="text-slate-500 font-normal"> ({check.detail})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          )}

          {/* Performance */}
          {reviews.length > 0 && (
            <Section title="تقييم الأداء (من 5)">
              <div className="grid grid-cols-4 gap-2">
                {reviews.map((review, i) => {
                  const isLatest = i === reviews.length - 1;
                  return (
                    <div
                      key={`${review.year}-${review.quarter}`}
                      className={`rounded-xl border p-3 text-center ${
                        isLatest ? 'border-brand-700 bg-brand-50/50' : 'border-slate-200'
                      }`}
                    >
                      <span className="type-2 text-slate-900 tabular-nums block">{review.score}</span>
                      <span className="text-xs text-slate-500 block">{QUARTER_LABEL[review.quarter]}</span>
                      <span className="text-xs text-slate-400 tabular-nums">{review.year}</span>
                    </div>
                  );
                })}
              </div>
              {latest?.feedback && (
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="font-bold text-slate-900">آخر ملاحظة: </span>
                  {latest.feedback}
                </p>
              )}
            </Section>
          )}

          {/* Skills */}
          <Section title={`المهارات (${skills.length})`}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {skills.map(skill => (
                <li key={skill.id} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-900 min-w-0">{skill.name}</span>
                  <span className="shrink-0 flex items-center gap-2">
                    <span className="flex gap-0.5" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span
                          key={n}
                          className={`w-3.5 h-2 rounded-sm ${n <= skill.level ? 'bg-brand-700' : 'bg-slate-200'}`}
                        />
                      ))}
                    </span>
                    <span className="w-8 type-4 text-slate-900 tabular-nums text-left">{skill.level}/5</span>
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Projects and courses: collapsed until asked for */}
          <Collapsible title="المشاريع" count={employee.projects.length}>
            <ul className="space-y-3">
              {employee.projects.map(project => (
                <li key={project.id} className="text-sm">
                  <span className="font-bold text-slate-900 block">
                    {project.title} <span className="text-slate-400 font-normal tabular-nums">· {project.year}</span>
                  </span>
                  <span className="text-slate-600 block">{project.role}</span>
                  <span className="text-slate-700 block mt-0.5 leading-relaxed">{project.outcome}</span>
                </li>
              ))}
            </ul>
          </Collapsible>

          <Collapsible title="الدورات" count={employee.courses.length}>
            <ul className="space-y-3">
              {employee.courses.map(course => (
                <li key={course.id} className="text-sm">
                  <span className="font-bold text-slate-900 block">{course.title}</span>
                  <span className="text-slate-600 tabular-nums">
                    {course.provider} · {course.completionDate}
                  </span>
                </li>
              ))}
            </ul>
          </Collapsible>
        </div>

        {onDelete && employee.id.startsWith('emp-added-') && (
          <div className="px-5 sm:px-6 pb-4">
            <button
              onClick={() => onDelete(employee.id)}
              className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف هذا الموظف</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 min-h-[44px] text-sm font-semibold text-slate-700 bg-surface border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            إغلاق
          </button>
          {evaluation && (
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-5 min-h-[44px] text-sm font-bold text-white bg-brand-800 hover:bg-brand-900 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Share className="w-4 h-4" />
              <span>شارك مع الموظف</span>
            </button>
          )}
        </div>
      </div>

      <ShareWithEmployeeModal evaluation={isShareOpen ? evaluation : null} onClose={() => setIsShareOpen(false)} />
    </div>
  );
};
