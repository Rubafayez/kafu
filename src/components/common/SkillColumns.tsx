import React, { useState } from 'react';
import { TeamSkillCoverage } from '../../types';

interface SkillColumnsProps {
  skills: TeamSkillCoverage[];
  selected: string[]; // مهارات الموظف الجديد
}

const SERIES = [
  { key: 'holders', label: 'يتقنها', color: 'bg-chart-1' },
  { key: 'learners', label: 'يحتاج تطويراً', color: 'bg-chart-2' },
  // الموظف الجديد غير موجود بعد، فيُرسم إطاراً متقطعاً ليتميز بالشكل لا باللون فقط
  { key: 'hire', label: 'الموظف الجديد', color: 'box-border border-2 border-dashed border-royal bg-royal/15' },
] as const;

const PLOT_HEIGHT = 240;
const COLUMN_WIDTH = 88; // عرض كل مهارة؛ إذا لم تكفِ الشاشة يُسحب الرسم أفقياً

/**
 * أعمدة مكدّسة: مهارة على المحور الأفقي وعدد الموظفين على العمودي.
 * فوق كل عمود عدد من يتقن المهارة، وتحت اسمها تنبيه إن كانت ناقصة أو عند شخص واحد.
 * المرور أو الضغط على العمود يعرض أسماء من يتقن المهارة ومن يحتاج تطويراً.
 */
export const SkillColumns: React.FC<SkillColumnsProps> = ({ skills, selected }) => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  // الناقصة أولاً ثم المغطاة
  const order = { missing: 0, thin: 1, covered: 2 };
  const sorted = [...skills].sort((a, b) => order[a.status] - order[b.status]);
  const rawMax = Math.max(...skills.map(s => s.holders.length + s.learners.length + 1), 2);
  const step = rawMax > 8 ? 2 : 1;
  const max = Math.ceil(rawMax / step) * step;
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step);
  // بدون اختيار نعرض أول مهارة (الأشد نقصاً) حتى لا يبقى مربع الأسماء فارغاً
  const active = sorted.find(s => s.skillName === activeSkill) || sorted[0] || null;

  return (
    <div className="bg-surface rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
      <div>
        <h3 className="type-3 text-slate-900">كم موظفاً يتقن كل مهارة؟</h3>
        <p className="text-sm text-slate-600 mt-0.5">كل عمود مهارة، وارتفاعه عدد الموظفين.</p>
      </div>
      <div className="overflow-x-auto pt-5">
        <div className="flex" style={{ minWidth: sorted.length * COLUMN_WIDTH + 28 }}>
          {/* Y axis */}
          <div className="sticky right-0 z-10 bg-surface relative w-7 shrink-0" style={{ height: PLOT_HEIGHT }}>
            {ticks.map(t => (
              <span
                key={t}
                className="absolute right-0 text-sm text-slate-400 tabular-nums translate-y-1/2"
                style={{ bottom: `${(t / max) * 100}%` }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex-1">
            {/* Plot */}
            <div className="relative border-b border-slate-300" style={{ height: PLOT_HEIGHT }}>
              {ticks.slice(1).map(t => (
                <span
                  key={t}
                  className="absolute inset-x-0 border-t border-slate-100"
                  style={{ bottom: `${(t / max) * 100}%` }}
                />
              ))}

              <div className="absolute inset-0 flex">
                {sorted.map(skill => {
                  const hired = skill.status !== 'covered' && selected.includes(skill.skillName);
                  const counts = [skill.holders.length, skill.learners.length, hired ? 1 : 0];
                  const isActive = skill.skillName === active?.skillName;
                  return (
                    <button
                      key={skill.skillName}
                      type="button"
                      onMouseEnter={() => setActiveSkill(skill.skillName)}
                      onFocus={() => setActiveSkill(skill.skillName)}
                      onClick={() => setActiveSkill(skill.skillName)}
                      aria-label={`${skill.skillName}: يتقنها ${counts[0]}، يحتاج تطويراً ${counts[1]}`}
                      className={`flex-1 h-full flex flex-col-reverse items-center gap-0.5 focus:outline-none ${
                        isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      {SERIES.map((series, i) => (
                        <span
                          key={series.key}
                          className={`${counts[i] === 0 ? 'hidden' : series.color} w-11 rounded-md transition-all duration-500 ease-out`}
                          style={{ height: `${(counts[i] / max) * 100}%`, marginTop: counts[i] === 0 ? -2 : 0 }}
                        />
                      ))}
                      {/* عدد من يتقنها فوق العمود */}
                      <span
                        className={`text-sm font-bold tabular-nums pb-0.5 ${
                          counts[0] === 0 ? 'text-rose-700' : 'text-slate-700'
                        }`}
                      >
                        {counts[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* X labels */}
            <div className="flex pt-2">
              {sorted.map(skill => (
                <span
                  key={skill.skillName}
                  className={`flex-1 px-1.5 text-center text-[13px] leading-snug ${
                    skill.skillName === active?.skillName ? 'text-slate-900 font-bold' : 'text-slate-600'
                  }`}
                >
                  {skill.skillName}
                  {skill.status !== 'covered' && (
                    <span
                      className={`block mt-1 font-bold whitespace-nowrap ${skill.status === 'missing' ? 'text-rose-700' : 'text-royal'}`}
                    >
                      {skill.status === 'missing' ? 'ناقصة' : 'شخص واحد'}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {SERIES.map(s => (
          <span key={s.key} className="flex items-center gap-1.5 text-sm text-slate-700">
            <span className={`w-3 h-3 rounded-sm ${s.color}`} />
            <span>{s.label}</span>
          </span>
        ))}
      </div>

      {/* Names for the hovered / tapped column */}
      {active && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 sm:p-5 space-y-4" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <p className="type-3 text-slate-900">{active.skillName}</p>
            {active.status !== 'covered' && (
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                  active.status === 'missing' ? 'bg-rose-50 text-rose-800' : 'bg-brand-50 text-link'
                }`}
              >
                {active.status === 'missing' ? 'ناقصة' : 'عند شخص واحد'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="w-3 h-3 rounded-sm bg-chart-1" />
                <span>يتقنها</span>
                <span className="text-slate-500 font-normal tabular-nums">({active.holders.length})</span>
              </p>
              {active.holders.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {active.holders.map(h => (
                    <span
                      key={h.employee.id}
                      className="px-3 py-1.5 rounded-full bg-surface border border-slate-200 text-sm text-slate-900"
                    >
                      {h.employee.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">لا أحد</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="w-3 h-3 rounded-sm bg-chart-2" />
                <span>يحتاج تطويراً</span>
                <span className="text-slate-500 font-normal tabular-nums">({active.learners.length})</span>
              </p>
              {active.learners.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {active.learners.map(l => (
                    <span
                      key={l.employee.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-slate-200 text-sm text-slate-900"
                    >
                      <span>{l.employee.name}</span>
                      <span className="text-xs font-semibold text-slate-500 tabular-nums">
                        {l.level} من {active.neededLevel}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">لا أحد</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
