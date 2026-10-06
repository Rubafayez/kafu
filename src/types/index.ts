export type Department = 
  | 'الهندسة والتقنية'
  | 'العمليات وسلاسل الإمداد'
  | 'التسويق والمبيعات'
  | 'الموارد البشرية والإدارة';

export interface Skill {
  id: string;
  name: string;
  level: number; // 1 to 5 (1: مبتدئ, 2: متوسط, 3: كفء, 4: متقدم, 5: خبير/قيادي)
  category?: string;
}

export interface PerformanceReview {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  score: number; // out of 5 (e.g., 4.8)
  feedback: string;
  strengths: string[];
}

export interface Project {
  id: string;
  title: string;
  role: string;
  outcome: string;
  skillsUsed: string[];
  year: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  completionDate: string;
  credential?: string;
}

export interface MonthlyTasks {
  month: string; // YYYY-MM
  assigned: number;
  completed: number;
}

export interface DailyTasks {
  date: string; // YYYY-MM-DD
  assigned: number;
  completed: number;
}

export interface Employee {
  id: string;
  name: string;
  title: string;
  department: Department;
  experienceYears: number;
  skills: Skill[];
  reviews: PerformanceReview[];
  projects: Project[];
  courses: Course[];
  lastPromotionDate: string | null;
  source?: 'linkedin'; // وُظّف من ترشيح لينكدإن
  monthlyTasks?: MonthlyTasks[];
  dailyTasks?: DailyTasks[];
  isHiddenTalent?: boolean;
  hiddenTalentReason?: string;
}

export interface RequiredSkill {
  name: string;
  level: number; // 1 to 5
  importance: 'essential' | 'desirable'; // ضرورية أو مرغوبة
}

export interface JobRole {
  id: string;
  title: string;
  department: Department;
  minExperienceYears: number;
  description: string;
  requiredSkills: RequiredSkill[];
  isOpen: boolean;
}

// معايير الترقية يحددها المدير، والنظام يطبقها كما هي
export interface PromotionCriteria {
  minScore: number; // أقل تقييم ربعي مقبول (من 5)
  consecutiveQuarters: number; // عدد الأرباع المتتالية (2 = آخر 6 أشهر)
  minExperienceYears: number;
  minMonthsSinceLastPromotion: number;
  minTaskCompletion: number; // أقل نسبة إنجاز مهام (%) خلال نفس المدة
  minCoursesPerYear: number; // أقل عدد دورات مكتملة في آخر 12 شهراً
}

export interface CriterionCheck {
  key: 'score' | 'tasks' | 'courses' | 'experience' | 'lastPromotion';
  label: string;
  met: boolean;
  detail: string;
}

export type PromotionStatus = 'ready' | 'close' | 'none';

export interface PromotionEvaluation {
  employee: Employee;
  status: PromotionStatus;
  checks: CriterionCheck[];
  recentReviews: PerformanceReview[];
  taskCompletion: number | null; // نسبة إنجاز المهام خلال المدة، null إذا لا توجد بيانات مهام
  coursesLastYear: number;
}

export type SkillCoverageStatus = 'covered' | 'thin' | 'missing';

export interface TeamSkillCoverage {
  skillName: string;
  neededLevel: number;
  holders: { employee: Employee; level: number }[];
  learners: { employee: Employee; level: number }[];
  status: SkillCoverageStatus;
}

export interface TeamInsight {
  department: Department;
  members: Employee[];
  skills: TeamSkillCoverage[];
  coveragePercent: number;
  evaluations: PromotionEvaluation[];
  ready: PromotionEvaluation[];
  close: PromotionEvaluation[];
  gaps: TeamSkillCoverage[];
}

export interface CompanyProject {
  id: string;
  title: string;
  summary: string;
  skills: { name: string; level: number }[];
  teamSize: number;
}
