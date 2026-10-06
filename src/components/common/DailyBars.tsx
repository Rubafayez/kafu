import React, { useMemo, useState } from 'react';
import { WorkDay } from '../../utils/workTracking';
import { CalendarDays, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

interface DailyBarsProps {
  days: WorkDay[];
  height?: number;
}

const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
// أسبوع العمل: الأحد إلى الخميس
const WORK_DAYS = 5;

function parse(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function key(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

function addDays(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
}

function weekStart(date: Date): Date {
  return addDays(date, -date.getDay());
}

/**
 * مهام الفريق المنجزة: عرض أسبوعي بأعمدة مع التنقل بين الأسابيع، وعرض شهري كتقويم.
 * في الأعمدة: العمود الفاتح = المهام المسندة، والغامق = المنجزة.
 */
export const DailyBars: React.FC<DailyBarsProps> = ({ days, height = 140 }) => {
  const byDate = useMemo(() => new Map(days.map(d => [d.date, d])), [days]);
  const first = days.length > 0 ? parse(days[0].date) : new Date();
  const last = days.length > 0 ? parse(days[days.length - 1].date) : new Date();

  const [view, setView] = useState<'week' | 'month'>('week');
  const [cursor, setCursor] = useState<Date>(weekStart(last)); // بداية الأسبوع المعروض
  const [selected, setSelected] = useState<string | null>(days.length > 0 ? days[days.length - 1].date : null);

  if (days.length === 0) {
    return <p className="text-sm text-slate-500">لا توجد بيانات مهام يومية.</p>;
  }

  // حدود التنقل: من أول أسبوع فيه بيانات إلى الأسبوع الذي يلي آخر بيانات
  const minWeek = weekStart(first);
  const maxWeek = addDays(weekStart(last), 7);
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);

  const canPrev =
    view === 'week' ? cursor > minWeek : monthStart > new Date(first.getFullYear(), first.getMonth(), 1);
  const canNext =
    view === 'week' ? cursor < maxWeek : monthStart < new Date(last.getFullYear(), last.getMonth(), 1);

  const move = (direction: 1 | -1) => {
    if (view === 'week') {
      setCursor(addDays(cursor, 7 * direction));
    } else {
      setCursor(weekStart(new Date(cursor.getFullYear(), cursor.getMonth() + direction, 1)));
    }
  };

  const week = Array.from({ length: WORK_DAYS }, (_, i) => addDays(cursor, i));
  const weekData = week.map(d => byDate.get(key(d)) || null);
  const weekHasData = weekData.some(Boolean);
  const max = Math.max(...days.map(d => d.assigned), 1);

  const weekEnd = week[WORK_DAYS - 1];
  const rangeLabel =
    view === 'week'
      ? week[0].getMonth() === weekEnd.getMonth()
        ? `${week[0].getDate()} – ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]}`
        : `${week[0].getDate()} ${MONTHS[week[0].getMonth()]} – ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]}`
      : `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;

  const shown = selected ? byDate.get(selected) || null : null;
  const shownDate = shown ? parse(shown.date) : null;

  // Month grid: leading blanks, then every day of the month
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const monthCells: (Date | null)[] = [
    ...Array.from({ length: monthStart.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];
  const monthPercents = monthCells.flatMap(d => (d && byDate.get(key(d)) ? [byDate.get(key(d))!.percent] : []));
  const lo = monthPercents.length > 0 ? Math.min(...monthPercents) : 0;
  const hi = monthPercents.length > 0 ? Math.max(...monthPercents) : 100;

  const iconButton =
    'w-11 h-11 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700';

  return (
    <div>
      {/* Controls: previous / range / next, and the week-month switch */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => move(-1)}
            disabled={!canPrev}
            aria-label={view === 'week' ? 'الأسبوع الماضي' : 'الشهر الماضي'}
            title={view === 'week' ? 'الأسبوع الماضي' : 'الشهر الماضي'}
            className={iconButton}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="type-4 text-slate-900 tabular-nums min-w-[9.5rem] text-center">{rangeLabel}</span>
          <button
            onClick={() => move(1)}
            disabled={!canNext}
            aria-label={view === 'week' ? 'الأسبوع القادم' : 'الشهر القادم'}
            title={view === 'week' ? 'الأسبوع القادم' : 'الشهر القادم'}
            className={iconButton}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setView(view === 'week' ? 'month' : 'week')}
          aria-label={view === 'week' ? 'عرض الشهر كاملاً' : 'عرض الأسبوع'}
          title={view === 'week' ? 'عرض الشهر كاملاً' : 'عرض الأسبوع'}
          aria-pressed={view === 'month'}
          className={`${iconButton} ${view === 'month' ? 'bg-brand-50 text-link' : ''}`}
        >
          {view === 'week' ? <CalendarDays className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
        </button>
      </div>

      {/* Readout for the selected day */}
      <p className="text-sm text-slate-600 mb-3 min-h-[1.6rem]" aria-live="polite">
        {shown && shownDate ? (
          <>
            <span className="font-bold text-slate-900">
              {WEEKDAYS[shownDate.getDay()]} {shownDate.getDate()} {MONTHS[shownDate.getMonth()]}:
            </span>{' '}
            <span className="tabular-nums">
              {shown.completed} من {shown.assigned} مهمة ({shown.percent}%)
            </span>
          </>
        ) : (
          'اختر يوماً لترى تفاصيله.'
        )}
      </p>

      {view === 'week' ? (
        <>
          <div className="relative flex items-end gap-2 sm:gap-4" style={{ height }}>
            {week.map((date, i) => {
              const day = weekData[i];
              const isSelected = day !== null && day.date === selected;
              return (
                <button
                  key={key(date)}
                  type="button"
                  disabled={!day}
                  onMouseEnter={() => day && setSelected(day.date)}
                  onFocus={() => day && setSelected(day.date)}
                  onClick={() => day && setSelected(day.date)}
                  aria-label={
                    day
                      ? `${WEEKDAYS[date.getDay()]} ${date.getDate()}: ${day.completed} من ${day.assigned} مهمة`
                      : `${WEEKDAYS[date.getDay()]} ${date.getDate()}: لا توجد بيانات`
                  }
                  className="group flex-1 h-full flex items-end justify-center focus:outline-none"
                >
                  {/* العمود له عرض أقصى حتى لا يتمدد على الشاشات الواسعة */}
                  {day ? (
                    <span className="relative h-full w-full max-w-[64px] flex items-end">
                      <span
                        className="absolute bottom-0 inset-x-0 rounded-t bg-slate-100"
                        style={{ height: `${(day.assigned / max) * 100}%` }}
                      />
                      <span
                        className={`relative w-full rounded-t transition-colors ${
                          isSelected ? 'bg-chart-1-strong' : 'bg-chart-1 group-hover:bg-chart-1-strong'
                        }`}
                        style={{ height: `${(day.completed / max) * 100}%` }}
                      />
                    </span>
                  ) : (
                    <span className="w-full max-w-[64px] h-1 rounded bg-slate-200" />
                  )}
                </button>
              );
            })}

            {!weekHasData && (
              <p className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
                لا توجد بيانات لهذا الأسبوع بعد.
              </p>
            )}
          </div>

          <div className="flex gap-2 sm:gap-4 mt-1 border-t border-slate-200 pt-1.5">
            {week.map((date, i) => {
              const isSelected = weekData[i] !== null && weekData[i]!.date === selected;
              return (
                <span
                  key={key(date)}
                  className={`flex-1 text-center text-xs leading-tight ${
                    isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  <span className="block">{WEEKDAYS[date.getDay()]}</span>
                  <span className="tabular-nums">{date.getDate()}</span>
                </span>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Month calendar: each working day shaded by its completion */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {WEEKDAYS.map(name => (
              <span key={name} className="text-center text-xs text-slate-500 pb-1 truncate">
                {name}
              </span>
            ))}
            {monthCells.map((date, i) => {
              if (!date) return <span key={`blank-${i}`} />;
              const day = byDate.get(key(date)) || null;
              if (!day) {
                return (
                  <span
                    key={key(date)}
                    className="aspect-square sm:aspect-auto sm:h-14 rounded-lg flex items-center justify-center text-sm text-slate-300 tabular-nums"
                  >
                    {date.getDate()}
                  </span>
                );
              }
              // تدرّج لون واحد: الأفتح أقل إنجازاً والأغمق أكثر، بحسب أيام هذا الشهر
              const strength = hi === lo ? 70 : 20 + ((day.percent - lo) / (hi - lo)) * 80;
              // النص الأبيض فقط على الدرجات الغامقة كفاية ليبقى مقروءاً
              const dark = strength > 75;
              const isSelected = day.date === selected;
              return (
                <button
                  key={key(date)}
                  type="button"
                  onClick={() => {
                    setSelected(day.date);
                    setCursor(weekStart(date));
                  }}
                  onMouseEnter={() => setSelected(day.date)}
                  aria-label={`${WEEKDAYS[date.getDay()]} ${date.getDate()}: ${day.completed} من ${day.assigned} مهمة (${day.percent}%)`}
                  className={`aspect-square sm:aspect-auto sm:h-14 rounded-lg flex flex-col items-center justify-center leading-tight focus:outline-none ${
                    isSelected ? 'ring-2 ring-offset-2 ring-offset-surface ring-brand-800' : ''
                  }`}
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--color-chart-1) ${strength}%, transparent)`,
                    color: dark ? '#ffffff' : 'var(--color-slate-900)',
                  }}
                >
                  <span className="text-xs tabular-nums opacity-80">{date.getDate()}</span>
                  <span className="text-xs sm:text-sm font-bold tabular-nums">{day.percent}%</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span>أقل إنجازاً</span>
            <span className="flex gap-0.5" aria-hidden="true">
              {[20, 40, 60, 80, 100].map(s => (
                <span
                  key={s}
                  className="w-5 h-2.5 rounded-sm"
                  style={{ backgroundColor: `color-mix(in srgb, var(--color-chart-1) ${s}%, transparent)` }}
                />
              ))}
            </span>
            <span>أكثر إنجازاً</span>
          </div>
        </>
      )}
    </div>
  );
};
