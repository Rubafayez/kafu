import React, { useEffect, useRef, useState } from 'react';
import { Department, Employee } from '../../types';
import { extractCv } from '../../services/api';
import { AlertTriangle, FileUp, Loader2, Plus, X } from 'lucide-react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  companySkills: string[];
  onAdd: (employee: Employee) => void;
  // بيانات مبدئية لموظف قادم من لينكدإن: تُعبّأ في النموذج ويُحفظ مصدره
  initial?: { name: string; title: string; experienceYears: number; skills: string[]; department?: Department } | null;
}

const MAX_PDF_BYTES = 10 * 1024 * 1024;

type Draft = Pick<Employee, 'name' | 'title' | 'experienceYears' | 'skills' | 'projects' | 'courses'> & {
  department: Department;
};

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  departments,
  companySkills,
  onAdd,
  initial = null,
}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const empty: Draft = {
    name: '',
    title: '',
    department: departments[0],
    experienceYears: 0,
    skills: [],
    projects: [],
    courses: [],
  };
  const [draft, setDraft] = useState<Draft>(empty);
  const [newSkill, setNewSkill] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(
        initial
          ? {
              ...empty,
              name: initial.name,
              title: initial.title,
              department: initial.department || departments[0],
              experienceYears: initial.experienceYears,
              skills: initial.skills.map((name, i) => ({ id: `sk-init-${i}`, name, level: 3 })),
            }
          : empty
      );
      setNewSkill('');
      setFileName(null);
      setLoading(false);
      setError(null);
      setExtracted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('الملف يجب أن يكون بصيغة PDF.');
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setError('حجم الملف أكبر من 10 ميجابايت.');
      return;
    }
    setFileName(file.name);
    setLoading(true);
    setError(null);
    try {
      const result = await extractCv({
        pdfBase64: await readAsBase64(file),
        knownSkills: companySkills,
        departments,
      });
      const stamp = Date.now();
      setDraft({
        name: initial ? initial.name : result.name,
        title: result.title,
        department:
          initial?.department ||
          (departments.includes(result.department as Department) ? (result.department as Department) : departments[0]),
        experienceYears: result.experienceYears,
        skills: result.skills.map((s, i) => ({ id: `sk-${stamp}-${i}`, name: s.name, level: s.level })),
        projects: result.projects.map((p, i) => ({ ...p, id: `proj-${stamp}-${i}`, skillsUsed: [] })),
        courses: result.courses.map((c, i) => ({ ...c, id: `c-${stamp}-${i}` })),
      });
      setExtracted(true);
    } catch {
      setError('تعذرت قراءة السيرة بالذكاء الاصطناعي. أعد المحاولة، أو أدخل البيانات يدوياً من الأسفل.');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    const name = newSkill.trim();
    if (name && !draft.skills.some(s => s.name === name)) {
      setDraft({ ...draft, skills: [...draft.skills, { id: `sk-${Date.now()}`, name, level: 3 }] });
    }
    setNewSkill('');
  };

  const isValid = draft.name.trim().length > 0 && draft.title.trim().length > 0 && draft.skills.length > 0;

  const handleSave = () => {
    onAdd({
      id: `emp-added-${Date.now()}`,
      name: draft.name.trim(),
      title: draft.title.trim(),
      department: draft.department,
      experienceYears: draft.experienceYears,
      skills: draft.skills,
      reviews: [],
      projects: draft.projects,
      courses: draft.courses,
      lastPromotionDate: null,
      ...(initial ? { source: 'linkedin' as const } : {}),
    });
    onClose();
  };

  const inputClass =
    'w-full min-h-[44px] px-3 border border-slate-300 rounded-lg text-base text-slate-900 bg-surface focus:outline-none focus:border-brand-700';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full text-right my-auto">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <h2 className="type-2 text-slate-900">إضافة موظف</h2>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Step 1: let AI read the CV */}
          <div className="rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-4 space-y-3">
            <input ref={fileInput} type="file" accept="application/pdf" onChange={handleFile} className="hidden" />
            <button
              onClick={() => fileInput.current?.click()}
              disabled={loading}
              className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
              <span>{loading ? 'الذكاء الاصطناعي يقرأ السيرة...' : 'ارفع السيرة الذاتية (PDF)'}</span>
            </button>
            <p className="text-sm text-slate-600 text-center">
              {fileName ? `الملف: ${fileName}` : 'الذكاء الاصطناعي يستخرج الاسم والمسمى والمهارات والخبرة ليبني الملف.'}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-3">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-900">{error}</p>
            </div>
          )}

          {extracted && (
            <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              تمت القراءة: {draft.skills.length} مهارات، {draft.projects.length} مشاريع، {draft.courses.length} دورات.
              راجع البيانات وعدّلها قبل الحفظ.
            </p>
          )}

          {/* Step 2: review or fill by hand */}
          <label className="block">
            <span className="type-4 text-slate-900 block mb-1.5">الاسم</span>
            <input
              type="text"
              value={draft.name}
              onChange={e => setDraft({ ...draft, name: e.target.value })}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="type-4 text-slate-900 block mb-1.5">المسمى الوظيفي</span>
            <input
              type="text"
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
              className={inputClass}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="type-4 text-slate-900 block mb-1.5">الفريق</span>
              <select
                value={draft.department}
                onChange={e => setDraft({ ...draft, department: e.target.value as Department })}
                className={inputClass}
              >
                {departments.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="type-4 text-slate-900 block mb-1.5">سنوات الخبرة</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={50}
                step={0.5}
                value={draft.experienceYears}
                onChange={e => setDraft({ ...draft, experienceYears: Math.max(0, Number(e.target.value) || 0) })}
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <span className="type-4 text-slate-900 block mb-1.5">
              المهارات {draft.skills.length > 0 && <span className="tabular-nums">({draft.skills.length})</span>}
            </span>

            {draft.skills.length > 0 && (
              <ul className="border border-slate-200 rounded-xl divide-y divide-slate-100 mb-3">
                {draft.skills.map(skill => (
                  <li key={skill.id} className="flex items-center gap-2 p-2 pr-3">
                    <span className="flex-1 min-w-0 text-sm text-slate-900">{skill.name}</span>
                    <select
                      value={skill.level}
                      aria-label={`مستوى ${skill.name}`}
                      onChange={e =>
                        setDraft({
                          ...draft,
                          skills: draft.skills.map(s => (s.id === skill.id ? { ...s, level: Number(e.target.value) } : s)),
                        })
                      }
                      className="shrink-0 min-h-[40px] px-2 border border-slate-300 rounded-lg text-sm bg-surface text-slate-900 tabular-nums"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>
                          {n} من 5
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setDraft({ ...draft, skills: draft.skills.filter(s => s.id !== skill.id) })}
                      aria-label={`حذف ${skill.name}`}
                      className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                list="company-skills"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="أضف مهارة"
                className={inputClass}
              />
              <datalist id="company-skills">
                {companySkills.map(name => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={addSkill}
                disabled={newSkill.trim().length === 0}
                aria-label="أضف المهارة"
                className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg border border-slate-300 text-link hover:bg-slate-50 disabled:opacity-40"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleSave}
            disabled={!isValid || loading}
            className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-base transition-colors"
          >
            أضف الموظف
          </button>
          {!isValid && (
            <p className="text-sm text-slate-500 text-center mt-2">يلزم الاسم والمسمى ومهارة واحدة على الأقل.</p>
          )}
        </div>
      </div>
    </div>
  );
};
