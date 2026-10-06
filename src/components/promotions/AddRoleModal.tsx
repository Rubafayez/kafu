import React, { useEffect, useMemo, useState } from 'react';
import { Department, JobRole, TeamInsight } from '../../types';
import { isSkillMatch } from '../../utils/matchingEngine';
import { Plus, X } from 'lucide-react';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamInsight[];
  onAdd: (role: JobRole) => void;
}

const LEVELS = [
  { value: 3, label: 'جيد (3 من 5)' },
  { value: 4, label: 'متقدم (4 من 5)' },
  { value: 5, label: 'خبير (5 من 5)' },
];

export const AddRoleModal: React.FC<AddRoleModalProps> = ({ isOpen, onClose, teams, onAdd }) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>(teams[0]?.department);
  const [experience, setExperience] = useState(3);
  const [level, setLevel] = useState(4);
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDepartment(teams[0]?.department);
      setExperience(3);
      setLevel(4);
      setSkills([]);
      setCustomSkill('');
    }
  }, [isOpen]);

  // مهارات مقترحة: كل ما يملكه موظفو الفريق المختار، بدون تكرار
  const suggested = useMemo(() => {
    const team = teams.find(t => t.department === department);
    const names: string[] = [];
    for (const member of team?.members || []) {
      for (const skill of member.skills) {
        if (!names.some(n => isSkillMatch(n, skill.name))) names.push(skill.name);
      }
    }
    return names;
  }, [teams, department]);

  if (!isOpen) return null;

  const options = [...suggested, ...skills.filter(s => !suggested.includes(s))];
  const isValid = title.trim().length > 0 && skills.length > 0;

  const toggle = (name: string) =>
    setSkills(prev => (prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]));

  const addCustom = () => {
    const name = customSkill.trim();
    if (name && !skills.includes(name)) setSkills(prev => [...prev, name]);
    setCustomSkill('');
  };

  const handleSave = () => {
    onAdd({
      id: `role-custom-${Date.now()}`,
      title: title.trim(),
      department,
      minExperienceYears: experience,
      description: '',
      isOpen: true,
      requiredSkills: skills.map(name => ({ name, level, importance: 'essential' })),
    });
    onClose();
  };

  const inputClass =
    'w-full min-h-[44px] px-3 border border-slate-300 rounded-lg text-base text-slate-900 bg-surface focus:outline-none focus:border-brand-700';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full text-right my-auto">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <h2 className="type-2 text-slate-900">إضافة ترقية</h2>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <label className="block">
            <span className="type-4 text-slate-900 block mb-1.5">المنصب المرقّى إليه</span>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثال: مدير قسم المالية"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="type-4 text-slate-900 block mb-1.5">الفريق</span>
            <select
              value={department}
              onChange={e => {
                setDepartment(e.target.value as Department);
                setSkills([]);
              }}
              className={inputClass}
            >
              {teams.map(t => (
                <option key={t.department} value={t.department}>
                  {t.department}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="type-4 text-slate-900 block mb-1.5">
              المهارات المطلوبة {skills.length > 0 && <span className="tabular-nums">({skills.length})</span>}
            </span>
            <div className="flex flex-wrap gap-2">
              {options.map(name => {
                const checked = skills.includes(name);
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

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="type-4 text-slate-900 block mb-1.5">مستوى المهارات</span>
              <select value={level} onChange={e => setLevel(Number(e.target.value))} className={inputClass}>
                {LEVELS.map(l => (
                  <option key={l.value} value={l.value}>
                    {l.label}
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
                max={40}
                value={experience}
                onChange={e => setExperience(Number(e.target.value))}
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 disabled:bg-slate-300 text-white rounded-xl font-bold text-base transition-colors"
          >
            أضف واعرض المؤهلين
          </button>
          {!isValid && (
            <p className="text-sm text-slate-500 text-center mt-2">اكتب المنصب المرقّى إليه واختر مهارة واحدة على الأقل.</p>
          )}
        </div>
      </div>
    </div>
  );
};
