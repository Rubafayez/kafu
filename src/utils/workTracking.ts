import { DailyTasks, Employee } from '../types';

export interface WorkDay extends DailyTasks {
  percent: number;
}

export interface EmployeeWork {
  employee: Employee;
  todayCompleted: number;
  todayAssigned: number;
  completed: number;
  assigned: number;
  percent: number;
}

export interface WorkSummary {
  days: WorkDay[];
  completed: number;
  assigned: number;
  percent: number;
  today: WorkDay | null;
  perEmployee: EmployeeWork[];
}

function percentOf(completed: number, assigned: number): number {
  return assigned === 0 ? 0 : Math.round((completed / assigned) * 100);
}

/**
 * يجمع مهام الموظفين اليومية: سلسلة أيام للفريق، وإجمالي الفترة، وأرقام كل موظف
 */
export function summarizeWork(members: Employee[]): WorkSummary {
  const byDate = new Map<string, { assigned: number; completed: number }>();
  for (const member of members) {
    for (const day of member.dailyTasks || []) {
      const entry = byDate.get(day.date) || { assigned: 0, completed: 0 };
      entry.assigned += day.assigned;
      entry.completed += day.completed;
      byDate.set(day.date, entry);
    }
  }

  const days: WorkDay[] = [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v, percent: percentOf(v.completed, v.assigned) }));

  const lastDate = days.length > 0 ? days[days.length - 1].date : null;

  const perEmployee: EmployeeWork[] = members
    .filter(m => (m.dailyTasks || []).length > 0)
    .map(employee => {
      const tasks = employee.dailyTasks || [];
      const completed = tasks.reduce((sum, d) => sum + d.completed, 0);
      const assigned = tasks.reduce((sum, d) => sum + d.assigned, 0);
      const today = tasks.find(d => d.date === lastDate);
      return {
        employee,
        todayCompleted: today?.completed ?? 0,
        todayAssigned: today?.assigned ?? 0,
        completed,
        assigned,
        percent: percentOf(completed, assigned),
      };
    })
    .sort((a, b) => b.percent - a.percent);

  const completed = days.reduce((sum, d) => sum + d.completed, 0);
  const assigned = days.reduce((sum, d) => sum + d.assigned, 0);

  return {
    days,
    completed,
    assigned,
    percent: percentOf(completed, assigned),
    today: days.length > 0 ? days[days.length - 1] : null,
    perEmployee,
  };
}

const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function formatDay(date: string): { weekday: string; dayOfMonth: number } {
  const [y, m, d] = date.split('-').map(Number);
  return { weekday: WEEKDAYS[new Date(y, m - 1, d).getDay()], dayOfMonth: d };
}

export interface WorkFacts {
  overallPercent: number;
  totalAssigned: number;
  totalCompleted: number;
  // نسبة الإنجاز لكل يوم من أيام الأسبوع عبر كل الأسابيع
  weekdays: { weekday: string; days: number; assigned: number; completed: number; percent: number }[];
  // نسبة الإنجاز لكل أسبوع بالترتيب الزمني
  weeks: { from: string; to: string; assigned: number; completed: number; percent: number }[];
  // الأيام الأعلى تكليفاً والأيام الأقل، مع نسبة الإنجاز فيها
  heaviestDays: { date: string; weekday: string; assigned: number; percent: number }[];
  lightestDays: { date: string; weekday: string; assigned: number; percent: number }[];
  // توزيع الحمل بين الموظفين: متوسط المهام اليومية لكل واحد
  load: { name: string; dailyAverage: number; percent: number }[];
  // طاقة الفريق الفعلية: كم مهمة ينجز في اليوم عادةً، وكم يوماً أُسند إليه أكثر منها
  capacity: { typicalDailyCompleted: number; averageDailyAssigned: number; daysAboveCapacity: number; totalDays: number };
  // المهام التي لم تُنجز في الفترة
  unfinished: { total: number; perWeek: number };
  // إعادة توزيع مقترحة محسوبة: من اليوم الأعلى تكليفاً في الأسبوع إلى الأقل
  rebalance: { fromWeekday: string; toWeekday: string; tasksToMove: number } | null;
  // مهام إضافية يمكن إنجازها في الفترة لو نُقل الزائد عن طاقة الفريق إلى الأيام التي فيها متسع
  potentialGain: number;
}

/**
 * يحسب الحقائق التي يُبنى عليها التحليل: أنماط أيام الأسبوع، الاتجاه عبر الأسابيع، علاقة الحمل بالإنجاز، وتوزيع المهام.
 */
export function buildWorkFacts(summary: WorkSummary): WorkFacts {
  const dayOf = (date: string) => {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const byWeekday = new Map<number, { days: number; assigned: number; completed: number }>();
  const byWeek = new Map<string, { from: string; to: string; assigned: number; completed: number }>();

  for (const day of summary.days) {
    const date = dayOf(day.date);
    const wd = byWeekday.get(date.getDay()) || { days: 0, assigned: 0, completed: 0 };
    wd.days += 1;
    wd.assigned += day.assigned;
    wd.completed += day.completed;
    byWeekday.set(date.getDay(), wd);

    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
    const key = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`;
    const wk = byWeek.get(key) || { from: day.date, to: day.date, assigned: 0, completed: 0 };
    wk.to = day.date;
    wk.assigned += day.assigned;
    wk.completed += day.completed;
    byWeek.set(key, wk);
  }

  const sortedByLoad = [...summary.days].sort((a, b) => b.assigned - a.assigned);
  const describe = (d: WorkDay) => ({
    date: d.date,
    weekday: WEEKDAYS[dayOf(d.date).getDay()],
    assigned: d.assigned,
    percent: d.percent,
  });

  // الطاقة الفعلية = الوسيط لعدد المهام المنجزة يومياً
  const completedSorted = summary.days.map(d => d.completed).sort((a, b) => a - b);
  const typicalDailyCompleted =
    completedSorted.length === 0 ? 0 : completedSorted[Math.floor(completedSorted.length / 2)];
  const totalDays = summary.days.length;
  const averageDailyAssigned = totalDays === 0 ? 0 : Math.round(summary.assigned / totalDays);
  const heavy = summary.days.filter(d => d.assigned > typicalDailyCompleted * 1.1);
  // الكسب الواقعي من إعادة التوزيع: المهام الزائدة عن الطاقة في الأيام المزدحمة،
  // بحدّ ما تتسع له الأيام الخفيفة. لا نفترض أن الفريق ينجز أكثر من طاقته.
  const overflow = summary.days.reduce((sum, d) => sum + Math.max(0, d.assigned - typicalDailyCompleted), 0);
  const spare = summary.days.reduce((sum, d) => sum + Math.max(0, typicalDailyCompleted - d.assigned), 0);
  const potentialGain = Math.min(overflow, spare);

  // مصدر النقل: اليوم الأضعف إنجازاً من بين الأيام التي تكليفها فوق المتوسط. الوجهة: أخف يوم تكليفاً.
  // الكمية: نصف الفرق بين متوسطي التكليف في اليومين.
  const weekdayLoad = [...byWeekday.entries()].map(([wd, v]) => ({
    weekday: WEEKDAYS[wd],
    average: v.assigned / v.days,
    percent: percentOf(v.completed, v.assigned),
  }));
  const overallAverage = totalDays === 0 ? 0 : summary.assigned / totalDays;
  const busy = weekdayLoad.filter(w => w.average >= overallAverage);
  const heaviest = (busy.length > 0 ? busy : weekdayLoad).sort((x, y) => x.percent - y.percent)[0];
  const lightest = [...weekdayLoad].sort((x, y) => x.average - y.average)[0];
  const tasksToMove = heaviest && lightest ? Math.round((heaviest.average - lightest.average) / 2) : 0;

  const unfinishedTotal = summary.assigned - summary.completed;

  return {
    capacity: { typicalDailyCompleted, averageDailyAssigned, daysAboveCapacity: heavy.length, totalDays },
    unfinished: { total: unfinishedTotal, perWeek: byWeek.size === 0 ? 0 : Math.round(unfinishedTotal / byWeek.size) },
    rebalance: tasksToMove >= 2 ? { fromWeekday: heaviest.weekday, toWeekday: lightest.weekday, tasksToMove } : null,
    potentialGain,
    overallPercent: summary.percent,
    totalAssigned: summary.assigned,
    totalCompleted: summary.completed,
    weekdays: [...byWeekday.entries()]
      .sort(([a], [b]) => a - b)
      .map(([wd, v]) => ({ weekday: WEEKDAYS[wd], ...v, percent: percentOf(v.completed, v.assigned) })),
    weeks: [...byWeek.values()].map(w => ({ ...w, percent: percentOf(w.completed, w.assigned) })),
    heaviestDays: sortedByLoad.slice(0, 3).map(describe),
    lightestDays: sortedByLoad.slice(-3).reverse().map(describe),
    load: summary.perEmployee.map(e => ({
      name: e.employee.name,
      dailyAverage: Math.round((e.assigned / Math.max(1, (e.employee.dailyTasks || []).length)) * 10) / 10,
      percent: e.percent,
    })),
  };
}
