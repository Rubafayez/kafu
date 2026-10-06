import { CompanyProject, Employee } from '../types';
import { isSkillMatch } from './matchingEngine';

// من هذا المستوى فأعلى يُعتبر الموظف قادراً على تغطية المهارة في مشروع
const MIN_PROJECT_LEVEL = 3;
// موظف مهامه اليومية أعلى من المتوسط بهذه النسبة يُنبَّه على حمله
const HIGH_LOAD_RATIO = 1.1;
const MAX_ALTERNATIVES = 3;

export interface TeamMemberPick {
  employee: Employee;
  covers: string[]; // مهارات المشروع التي يتقنها
  dailyLoad: number | null; // متوسط مهامه اليومية الحالية
  highLoad: boolean;
  replaces?: Employee; // إذا دخل الفريق بديلاً عن عضو آخر
}

export interface ProjectTeam {
  members: TeamMemberPick[];
  coveredSkills: string[];
  uncoveredSkills: string[];
  coveragePercent: number;
}

function levelFor(employee: Employee, skillName: string): number {
  return employee.skills.find(s => isSkillMatch(s.name, skillName))?.level ?? 0;
}

function coveredBy(employee: Employee, project: CompanyProject): string[] {
  return project.skills.filter(s => levelFor(employee, s.name) >= MIN_PROJECT_LEVEL).map(s => s.name);
}

function strength(employee: Employee, skills: string[]): number {
  return skills.reduce((sum, s) => sum + levelFor(employee, s), 0);
}

export function dailyLoad(employee: Employee): number | null {
  const days = employee.dailyTasks || [];
  if (days.length === 0) return null;
  return Math.round((days.reduce((sum, d) => sum + d.assigned, 0) / days.length) * 10) / 10;
}

function averageLoad(employees: Employee[]): number | null {
  const loads = employees.map(dailyLoad).filter((l): l is number => l !== null);
  return loads.length > 0 ? loads.reduce((a, b) => a + b, 0) / loads.length : null;
}

function toPick(employee: Employee, project: CompanyProject, avgLoad: number | null): TeamMemberPick {
  const load = dailyLoad(employee);
  return {
    employee,
    covers: coveredBy(employee, project),
    dailyLoad: load,
    highLoad: load !== null && avgLoad !== null && load > avgLoad * HIGH_LOAD_RATIO,
  };
}

function summarize(project: CompanyProject, members: TeamMemberPick[]): ProjectTeam {
  const covered = new Set(members.flatMap(m => m.covers));
  const coveredSkills = project.skills.map(s => s.name).filter(s => covered.has(s));
  const uncoveredSkills = project.skills.map(s => s.name).filter(s => !covered.has(s));
  const coveragePercent =
    project.skills.length === 0 ? 0 : Math.round((coveredSkills.length / project.skills.length) * 100);
  return { members, coveredSkills, uncoveredSkills, coveragePercent };
}

/**
 * يختار فريقاً متكاملاً للمشروع: في كل خطوة يضيف من يغطي أكثر مهارات لم تُغطَّ بعد،
 * فالنتيجة فريق يكمّل بعضه لا مجرد أقوى الأفراد. الاختيار من كل الأقسام.
 * swaps: استبدالات اختارها المدير (العضو الأصلي ← البديل) تُطبَّق على الترشيح.
 */
export function recommendTeam(
  project: CompanyProject,
  employees: Employee[],
  swaps: Record<string, string> = {}
): ProjectTeam {
  const avgLoad = averageLoad(employees);
  const remaining = new Set(project.skills.map(s => s.name));
  const pool = employees.filter(e => coveredBy(e, project).length > 0);
  const picked: Employee[] = [];

  while (picked.length < project.teamSize && pool.length > 0) {
    // الأولوية لمن يغطي مهارات جديدة، ثم لمجموع مستواه في مهارات المشروع
    pool.sort((a, b) => {
      const newA = coveredBy(a, project).filter(s => remaining.has(s));
      const newB = coveredBy(b, project).filter(s => remaining.has(s));
      return (
        newB.length - newA.length ||
        strength(b, coveredBy(b, project)) - strength(a, coveredBy(a, project))
      );
    });
    const employee = pool.shift()!;
    coveredBy(employee, project).forEach(s => remaining.delete(s));
    picked.push(employee);
  }

  const members = picked.map(original => {
    const replacement = employees.find(e => e.id === swaps[original.id]);
    return replacement
      ? { ...toPick(replacement, project, avgLoad), replaces: original }
      : toPick(original, project, avgLoad);
  });

  return summarize(project, members);
}

/**
 * بدائل عضو في الفريق: من خارج الفريق، مرتبين بحسب ما يغطونه من مهارات العضو نفسه في المشروع
 */
export function alternativesFor(
  project: CompanyProject,
  employees: Employee[],
  team: ProjectTeam,
  member: TeamMemberPick
): TeamMemberPick[] {
  const avgLoad = averageLoad(employees);
  const inTeam = new Set(team.members.flatMap(m => [m.employee.id, m.replaces?.id]));
  const target = member.covers;

  return employees
    .filter(e => !inTeam.has(e.id))
    .map(e => ({
      pick: toPick(e, project, avgLoad),
      shared: target.filter(s => levelFor(e, s) >= MIN_PROJECT_LEVEL).length,
      power: strength(e, target),
    }))
    .filter(x => x.pick.covers.length > 0)
    .sort((a, b) => b.shared - a.shared || b.pick.covers.length - a.pick.covers.length || b.power - a.power)
    .slice(0, MAX_ALTERNATIVES)
    .map(x => x.pick);
}

/**
 * من في الشركة يتقن هذه المهارة بمستوى يكفي للمشاريع
 */
export function whoHasSkill(employees: Employee[], skillName: string): Employee[] {
  return employees.filter(e => levelFor(e, skillName) >= MIN_PROJECT_LEVEL);
}

/**
 * كل مهارات موظفي الشركة بدون تكرار، لاقتراحها عند إضافة مشروع
 */
export function allCompanySkills(employees: Employee[]): string[] {
  const names: string[] = [];
  for (const e of employees) {
    for (const s of e.skills) {
      if (!names.some(n => isSkillMatch(n, s.name))) names.push(s.name);
    }
  }
  return names;
}
