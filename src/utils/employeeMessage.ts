import { CriterionCheck, PromotionEvaluation } from '../types';

// الخطوة المقترحة لكل معيار ناقص
const NEXT_STEP: Record<CriterionCheck['key'], string> = {
  score: 'رفع تقييم الأداء في الربع القادم.',
  tasks: 'رفع نسبة إنجاز المهام المسندة.',
  courses: 'إكمال دورة تدريبية.',
  experience: 'يتحقق مع زيادة سنوات الخبرة.',
  lastPromotion: 'يتحقق مع مرور المدة المطلوبة على آخر ترقية.',
};

/**
 * رسالة للموظف عن مستواه وموقفه من معايير الترقية.
 * تُبنى من بياناته هو فقط: لا مقارنة مع زملاء، ولا وعد بالترقية.
 */
export function buildEmployeeMessage(evaluation: PromotionEvaluation): string {
  const { employee, checks, recentReviews, taskCompletion, coursesLastYear } = evaluation;
  const firstName = employee.name.split(' ')[0];
  const lastScore = recentReviews[recentReviews.length - 1]?.score;
  const met = checks.filter(c => c.met);
  const unmet = checks.filter(c => !c.met);

  const lines: string[] = [`مرحباً ${firstName}،`, '', 'هذا ملخص مستواك الحالي:'];
  if (lastScore !== undefined) lines.push(`• آخر تقييم أداء: ${lastScore} من 5`);
  if (taskCompletion !== null) lines.push(`• نسبة إنجاز المهام: ${taskCompletion}%`);
  lines.push(`• الدورات المكتملة في آخر 12 شهراً: ${coursesLastYear}`);

  lines.push('', `معايير الترقية: تحقق ${met.length} من ${checks.length}.`);
  for (const check of met) lines.push(`✓ ${check.label}`);

  if (unmet.length === 0) {
    lines.push('', 'كل المعايير متحققة، واسمك ضمن المرشحين للترقية.');
  } else {
    lines.push('', 'المتبقي:');
    for (const check of unmet) lines.push(`• ${check.label} (${check.detail})`);
    lines.push('', 'الخطوة المقترحة:');
    for (const check of unmet) lines.push(`• ${NEXT_STEP[check.key]}`);
  }

  lines.push('', 'تحقيق المعايير يجعل الموظف مرشحاً للترقية، والقرار النهائي للإدارة.');
  return lines.join('\n');
}
