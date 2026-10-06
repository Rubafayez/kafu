import { RoleCandidate } from './teamInsights';

/**
 * ما ينقص الموظف ليتأهل للمنصب، بالأرقام: المعايير التي لم تتحقق ثم مهارات المنصب الناقصة.
 * يُحسب في الكود، والذكاء الاصطناعي يكتب الخطة فقط من هذه القائمة.
 */
export function buildPromotionGaps(candidate: RoleCandidate): string[] {
  const criteria = candidate.evaluation.checks.filter(c => !c.met).map(c => `${c.label} (${c.detail})`);
  const skills = candidate.missingSkills.map(s =>
    s.currentLevel === 0
      ? `يتعلم «${s.name}» حتى المستوى ${s.neededLevel} من 5`
      : `يرفع «${s.name}» من المستوى ${s.currentLevel} إلى ${s.neededLevel}`
  );
  return [...criteria, ...skills];
}
