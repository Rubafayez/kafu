import {
  Department,
  Employee,
  JobRole,
  PerformanceReview,
  PromotionCriteria,
  PromotionEvaluation,
  CriterionCheck,
  SkillCoverageStatus,
  TeamInsight,
  TeamSkillCoverage,
} from '../types';
import { isSkillMatch } from './matchingEngine';

export const DEPARTMENTS: Department[] = [
  'الهندسة والتقنية',
  'العمليات وسلاسل الإمداد',
  'التسويق والمبيعات',
  'الموارد البشرية والإدارة',
];

export const DEFAULT_PROMOTION_CRITERIA: PromotionCriteria = {
  minScore: 4.7,
  consecutiveQuarters: 2,
  minExperienceYears: 3,
  minMonthsSinceLastPromotion: 12,
  minTaskCompletion: 85,
  minCoursesPerYear: 1,
};

// موظف ينقصه هذا الفارق أو أقل في التقييم يُعتبر «قريباً» من المعايير
const NEAR_SCORE_MARGIN = 0.1;

const QUARTER_ORDER: Record<PerformanceReview['quarter'], number> = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };

export function sortReviews(reviews: PerformanceReview[]): PerformanceReview[] {
  return [...reviews].sort((a, b) => a.year - b.year || QUARTER_ORDER[a.quarter] - QUARTER_ORDER[b.quarter]);
}

function monthsSince(dateStr: string, now: Date): number {
  const [year, month] = dateStr.split('-').map(Number);
  return (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - (month || 1));
}

export function describeCriteria(criteria: PromotionCriteria): string {
  const months = criteria.consecutiveQuarters * 3;
  return `تقييم ${criteria.minScore} أو أعلى وإنجاز ${criteria.minTaskCompletion}% من المهام في آخر ${months} أشهر، ودورات مكتملة في السنة: ${criteria.minCoursesPerYear} على الأقل، وخبرة ${criteria.minExperienceYears} سنوات.`;
}

/**
 * تاريخ آخر بيانات متوفرة (نهاية آخر ربع فيه تقييمات)، حتى تُحسب المدد من تاريخ البيانات لا من تاريخ اليوم
 */
export function getDataAsOf(employees: Employee[]): Date {
  let latest = 0;
  for (const e of employees) {
    for (const r of e.reviews) {
      latest = Math.max(latest, r.year * 12 + QUARTER_ORDER[r.quarter] * 3);
    }
  }
  if (latest === 0) return new Date();
  return new Date(Math.floor((latest - 1) / 12), (latest - 1) % 12, 28);
}

export function taskCompletionPercent(employee: Employee, months: number): number | null {
  const recent = [...(employee.monthlyTasks || [])].sort((a, b) => a.month.localeCompare(b.month)).slice(-months);
  const assigned = recent.reduce((sum, m) => sum + m.assigned, 0);
  if (assigned === 0) return null;
  return Math.round((recent.reduce((sum, m) => sum + m.completed, 0) / assigned) * 100);
}

export function coursesInLastYear(employee: Employee, asOf: Date): number {
  return employee.courses.filter(c => {
    const since = monthsSince(c.completionDate, asOf);
    return since >= 0 && since < 12;
  }).length;
}

/**
 * يطبق معايير المدير على موظف واحد ويرجع نتيجة كل معيار مع دليله
 */
export function evaluatePromotion(
  employee: Employee,
  criteria: PromotionCriteria,
  asOf: Date = new Date()
): PromotionEvaluation {
  const now = asOf;
  const recentReviews = sortReviews(employee.reviews).slice(-criteria.consecutiveQuarters);
  const months = criteria.consecutiveQuarters * 3;
  const scoresText = recentReviews.map(r => r.score).join(' ثم ');
  const scoreMet =
    recentReviews.length >= criteria.consecutiveQuarters && recentReviews.every(r => r.score >= criteria.minScore);

  const checks: CriterionCheck[] = [
    {
      key: 'score',
      label: `تقييم ${criteria.minScore} أو أعلى في آخر ${months} أشهر`,
      met: scoreMet,
      detail:
        recentReviews.length < criteria.consecutiveQuarters
          ? 'لا توجد تقييمات كافية'
          : `التقييمات: ${scoresText}`,
    },
  ];

  // معيار المهام يُطبق فقط إذا كانت بيانات المهام متوفرة لهذا الموظف
  const taskCompletion = taskCompletionPercent(employee, months);
  if (taskCompletion !== null) {
    checks.push({
      key: 'tasks',
      label: `إنجاز ${criteria.minTaskCompletion}% من المهام أو أكثر في آخر ${months} أشهر`,
      met: taskCompletion >= criteria.minTaskCompletion,
      detail: `نسبة الإنجاز ${taskCompletion}%`,
    });
  }

  const coursesLastYear = coursesInLastYear(employee, asOf);
  checks.push(
    {
      key: 'courses',
      label: `دورات مكتملة في آخر 12 شهراً: ${criteria.minCoursesPerYear} على الأقل`,
      met: coursesLastYear >= criteria.minCoursesPerYear,
      detail: `المكتمل ${coursesLastYear}`,
    },
    {
      key: 'experience',
      label: `خبرة ${criteria.minExperienceYears} سنوات أو أكثر`,
      met: employee.experienceYears >= criteria.minExperienceYears,
      detail: `الخبرة ${employee.experienceYears} سنوات`,
    }
  );

  if (employee.lastPromotionDate) {
    const since = monthsSince(employee.lastPromotionDate, now);
    checks.push({
      key: 'lastPromotion',
      label: `مرّ ${criteria.minMonthsSinceLastPromotion} شهراً على آخر ترقية`,
      met: since >= criteria.minMonthsSinceLastPromotion,
      detail: `آخر ترقية قبل ${since} شهراً`,
    });
  } else {
    checks.push({
      key: 'lastPromotion',
      label: `مرّ ${criteria.minMonthsSinceLastPromotion} شهراً على آخر ترقية`,
      met: true,
      detail: 'لا توجد ترقية سابقة',
    });
  }

  const unmet = checks.filter(c => !c.met);
  const scoreIsNear =
    recentReviews.length >= criteria.consecutiveQuarters &&
    recentReviews.every(r => r.score >= criteria.minScore - NEAR_SCORE_MARGIN - 1e-9);
  const isClose = unmet.length === 1 && (unmet[0].key !== 'score' || scoreIsNear);
  const status = unmet.length === 0 ? 'ready' : isClose ? 'close' : 'none';

  return { employee, status, checks, recentReviews, taskCompletion, coursesLastYear };
}

/**
 * المهارات التي يحتاجها الفريق = مهارات مناصب هذه الإدارة (بدون تكرار)
 */
export function getTeamNeededSkills(department: Department, roles: JobRole[]): { name: string; level: number }[] {
  const needed: { name: string; level: number }[] = [];
  for (const role of roles.filter(r => r.department === department)) {
    for (const req of role.requiredSkills) {
      const existing = needed.find(n => isSkillMatch(n.name, req.name));
      if (existing) {
        existing.level = Math.max(existing.level, req.level);
      } else {
        needed.push({ name: req.name, level: req.level });
      }
    }
  }
  return needed;
}

function coverageStatus(holdersCount: number): SkillCoverageStatus {
  if (holdersCount === 0) return 'missing';
  if (holdersCount === 1) return 'thin';
  return 'covered';
}

export function computeSkillCoverage(
  members: Employee[],
  neededSkills: { name: string; level: number }[]
): TeamSkillCoverage[] {
  return neededSkills.map(needed => {
    const withSkill = members
      .map(employee => {
        const skill = employee.skills.find(s => isSkillMatch(s.name, needed.name));
        return skill ? { employee, level: skill.level } : null;
      })
      .filter((h): h is { employee: Employee; level: number } => h !== null)
      .sort((a, b) => b.level - a.level);

    // holders: يتقنونها بالمستوى المطلوب، learners: عندهم المهارة بمستوى أقل ويمكن تطويرهم
    const holders = withSkill.filter(h => h.level >= needed.level);
    const learners = withSkill.filter(h => h.level < needed.level);

    return {
      skillName: needed.name,
      neededLevel: needed.level,
      holders,
      learners,
      status: coverageStatus(holders.length),
    };
  });
}

// مهارة يتقنها شخصان فأكثر = مغطاة بالكامل، شخص واحد = نصف تغطية، لا أحد = صفر
export function coveragePercent(skills: TeamSkillCoverage[]): number {
  if (skills.length === 0) return 100;
  const earned = skills.reduce((sum, s) => sum + (s.status === 'covered' ? 1 : s.status === 'thin' ? 0.5 : 0), 0);
  return Math.round((earned / skills.length) * 100);
}

export function buildTeamInsight(
  department: Department,
  employees: Employee[],
  roles: JobRole[],
  criteria: PromotionCriteria
): TeamInsight {
  const members = employees.filter(e => e.department === department);
  const skills = computeSkillCoverage(members, getTeamNeededSkills(department, roles));
  const asOf = getDataAsOf(employees);
  const evaluations = members.map(e => evaluatePromotion(e, criteria, asOf));

  return {
    department,
    members,
    skills,
    coveragePercent: coveragePercent(skills),
    evaluations,
    ready: evaluations.filter(e => e.status === 'ready'),
    close: evaluations.filter(e => e.status === 'close'),
    // المهارات غير الموجودة أولاً، ثم التي عند شخص واحد
    gaps: skills
      .filter(s => s.status !== 'covered')
      .sort((a, b) => Number(b.status === 'missing') - Number(a.status === 'missing')),
  };
}

export function buildAllTeamInsights(
  employees: Employee[],
  roles: JobRole[],
  criteria: PromotionCriteria
): TeamInsight[] {
  return DEPARTMENTS.map(d => buildTeamInsight(d, employees, roles, criteria)).filter(t => t.members.length > 0);
}

/**
 * حالة كل مهارة لو وظفنا شخصاً يتقن المهارات المحددة
 */
export function simulateHireSkills(team: TeamInsight, hiredSkillNames: string[]): TeamSkillCoverage[] {
  return team.skills.map(s => {
    if (!hiredSkillNames.includes(s.skillName)) return s;
    return { ...s, status: coverageStatus(s.holders.length + 1) };
  });
}

/**
 * لو وظفنا شخصاً يتقن هذه المهارات، كم تصير تغطية الفريق؟
 */
export function simulateHire(team: TeamInsight, hiredSkillNames: string[]): number {
  return coveragePercent(simulateHireSkills(team, hiredSkillNames));
}

/**
 * لو ترقّى الموظف وترك مكانه، أي مهارات تضعف في الفريق؟
 */
export function skillsWeakenedIfLeaves(team: TeamInsight, employeeId: string): TeamSkillCoverage[] {
  return team.skills
    .map(s => {
      const holders = s.holders.filter(h => h.employee.id !== employeeId);
      return { ...s, holders, status: coverageStatus(holders.length), before: s.status };
    })
    .filter(s => s.status !== s.before && s.status !== 'covered')
    .map(({ before: _before, ...rest }) => rest);
}

export interface RoleCandidate {
  evaluation: PromotionEvaluation;
  matchedSkills: string[];
  missingSkills: { name: string; neededLevel: number; currentLevel: number }[];
  skillPercent: number;
  qualified: boolean;
}

// مؤهل للمنصب = حقق معايير الترقية + يتقن نصف مهارات المنصب على الأقل
const MIN_SKILL_PERCENT = 50;

/**
 * مرشحو منصب معيّن: موظفو نفس الفريق الذين حققوا معايير الترقية أو قاربوها، مع مطابقة مهاراتهم للمنصب
 */
export function getRoleCandidates(role: JobRole, teams: TeamInsight[]): RoleCandidate[] {
  const team = teams.find(t => t.department === role.department);
  if (!team) return [];

  return team.evaluations
    .filter(e => e.status !== 'none')
    .map(evaluation => {
      const matchedSkills: string[] = [];
      const missingSkills: RoleCandidate['missingSkills'] = [];
      for (const req of role.requiredSkills) {
        const skill = evaluation.employee.skills.find(s => isSkillMatch(s.name, req.name));
        if (skill && skill.level >= req.level) {
          matchedSkills.push(req.name);
        } else {
          missingSkills.push({ name: req.name, neededLevel: req.level, currentLevel: skill?.level ?? 0 });
        }
      }
      const skillPercent =
        role.requiredSkills.length === 0 ? 0 : Math.round((matchedSkills.length / role.requiredSkills.length) * 100);
      return {
        evaluation,
        matchedSkills,
        missingSkills,
        skillPercent,
        qualified: evaluation.status === 'ready' && skillPercent >= MIN_SKILL_PERCENT,
      };
    })
    .filter(c => c.skillPercent > 0)
    .sort((a, b) => Number(b.qualified) - Number(a.qualified) || b.skillPercent - a.skillPercent);
}
