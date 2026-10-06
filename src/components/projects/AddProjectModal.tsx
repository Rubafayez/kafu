import React, { useEffect, useRef, useState } from 'react';
import { CompanyProject } from '../../types';
import { extractProject } from '../../services/api';
import { AlertTriangle, FileUp, Loader2, Plus, Sparkles, X } from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  companySkills: string[];
  onAdd: (project: CompanyProject) => void;
}

const MAX_PDF_BYTES = 10 * 1024 * 1024;

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, companySkills, onAdd }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [teamSize, setTeamSize] = useState(3);
  const [skills, setSkills] = useState<{ name: string; level: number }[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSummary('');
      setTeamSize(3);
      setSkills([]);
      setCustomSkill('');
      setFileName(null);
      setLoading(false);
      setError(null);
      setExtracted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const runExtraction = async (payload: { text?: string; pdfBase64?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await extractProject({ ...payload, knownSkills: companySkills });
      setTitle(result.title);
      setSummary(result.summary);
      setTeamSize(result.teamSize);
      setSkills(result.skills);
      setExtracted(true);
    } catch {
      setError('تعذرت القراءة بالذكاء الاصطناعي. أعد المحاولة، أو أكمل البيانات يدوياً من الأسفل.');
    } finally {
      setLoading(false);
    }
  };

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
    try {
      await runExtraction({ pdfBase64: await readAsBase64(file) });
    } catch {
      setError('تعذر فتح الملف. جرّب ملفاً آخر.');
    }
  };

  const selected = skills.map(s => s.name);
  const options = [...companySkills, ...selected.filter(s => !companySkills.includes(s))];
  const isValid = title.trim().length > 0 && skills.length > 0;

  const toggle = (name: string) =>
    setSkills(prev => (prev.some(s => s.name === name) ? prev.filter(s => s.name !== name) : [...prev, { name, level: 3 }]));

  const addCustom = () => {
    const name = customSkill.trim();
    if (name && !selected.includes(name)) setSkills(prev => [...prev, { name, level: 3 }]);
    setCustomSkill('');
  };

  const handleSave = () => {
    onAdd({
      id: `project-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      teamSize,
      skills,
    });
    onClose();
  };

  const inputClass =
    'w-full min-h-[44px] px-3 border border-slate-300 rounded-lg text-base text-slate-900 bg-surface focus:outline-none focus:border-brand-700';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full text-right my-auto">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <h2 className="type-2 text-slate-900">مشروع جديد</h2>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Step 1: let AI read the brief */}
          <div className="rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-4 space-y-3">
            <input ref={fileInput} type="file" accept="application/pdf" onChange={handleFile} className="hidden" />
            <button
              onClick={() => fileInput.current?.click()}
              disabled={loading}
              className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
              <span>{loading ? 'الذكاء الاصطناعي يقرأ المشروع...' : 'ارفع ملف المشروع (PDF)'}</span>
            </button>
            <p className="text-sm text-slate-600 text-center">
              {fileName ? `الملف: ${fileName}` : 'الذكاء الاصطناعي يستخرج الاسم والمهارات وحجم الفريق من الملف.'}
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
              تمت القراءة. راجع البيانات وعدّلها قبل الحفظ.
            </p>
          )}

          {/* Step 2: review or fill by hand */}
          <label className="block">
            <span className="type-4 text-slate-900 block mb-1.5">اسم المشروع</span>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
          </label>

          <div>
            <label className="block">
              <span className="type-4 text-slate-900 block mb-1.5">وصف المشروع</span>
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                rows={3}
                placeholder="اكتب وصفاً قصيراً، أو الصق وصف المشروع هنا"
                className={`${inputClass} py-2 leading-relaxed`}
              />
            </label>
            <button
              onClick={() => runExtraction({ text: `${title}\n${summary}` })}
              disabled={loading || summary.trim().length < 15}
              className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-link disabled:text-slate-400 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>استخرج المهارات من الوصف</span>
            </button>
          </div>

          <div>
            <span className="type-4 text-slate-900 block mb-1.5">
              المهارات المطلوبة {skills.length > 0 && <span className="tabular-nums">({skills.length})</span>}
            </span>
            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto">
              {options.map(name => {
                const checked = selected.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggle(name)}
                    aria-pressed={checked}
                    className={`px-3 min-h-[40px] rounded-full text-sm font-semibold border transition-colors ${
                      checked
                        ? 'bg-brand-800 text-white border-brand-800'
                        : 'bg-surface text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustom();
                  }
                }}
                placeholder="مهارة أخرى"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addCustom}
                disabled={customSkill.trim().length === 0}
                aria-label="أضف المهارة"
                className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg border border-slate-300 text-link hover:bg-slate-50 disabled:opacity-40"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <label className="block">
            <span className="type-4 text-slate-900 block mb-1.5">عدد أعضاء الفريق</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={10}
              value={teamSize}
              onChange={e => setTeamSize(Math.min(10, Math.max(1, Math.round(Number(e.target.value)) || 1)))}
              className={`${inputClass} w-28`}
            />
          </label>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleSave}
            disabled={!isValid || loading}
            className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-base transition-colors"
          >
            احفظ ورشّح الفريق
          </button>
          {!isValid && (
            <p className="text-sm text-slate-500 text-center mt-2">يلزم اسم المشروع ومهارة واحدة على الأقل.</p>
          )}
        </div>
      </div>
    </div>
  );
};
