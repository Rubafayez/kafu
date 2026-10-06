// لو تأخر الذكاء الاصطناعي أكثر من هذا، نوقف الانتظار ونعرض رسالة الخطأ مع زر إعادة المحاولة
const AI_TIMEOUT_MS = 60000;

export interface HiringProfileResponse {
  title: string;
  seniority: string; // مبتدئ، متوسط، أول
  experienceYears: number;
  whyNow: string; // سبب الحاجة بالأرقام
  recommendation: { decision: 'hire' | 'develop' | 'both'; reason: string };
  responsibilities: string[];
  mustHave: string[];
  niceToHave: string[];
  postText: string; // نص إعلان جاهز للنشر
}

export interface HiringProfileRequest {
  department: string;
  teamSize: number;
  coverageBefore: number;
  coverageAfter: number;
  // طاقة الفريق مقابل ما يُسند إليه، إن توفرت بيانات المهام
  capacity: { typicalDailyCompleted: number; averageDailyAssigned: number; daysAboveCapacity: number; totalDays: number } | null;
  skills: {
    name: string;
    level: number;
    status: string; // missing | thin | custom
    // موظفون عندهم المهارة بمستوى أقل من المطلوب
    internalLearners: { name: string; level: number }[];
    developable: boolean; // هل يوجد من ينقصه مستوى واحد فقط
  }[];
}

/**
 * Call server-side Gemini API to write a hiring profile for a team's uncovered skills
 */
export async function generateHiringProfile(payload: HiringProfileRequest): Promise<HiringProfileResponse> {
  const response = await fetch('/api/generate-hiring-profile', {
    method: 'POST',
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'تعذر كتابة مواصفات الوظيفة.');
  }

  return response.json();
}

export interface WorkFinding {
  kind: 'pattern' | 'load' | 'trend' | 'strength';
  title: string; // عنوان قصير للملاحظة
  evidence: string; // الدليل بالأرقام
  meaning: string; // ماذا يعني للمدير
}

export interface WorkAnalysisResponse {
  headline: string;
  findings: WorkFinding[];
  action: { title: string; steps: string[]; impact: string };
}

/**
 * Call server-side Gemini API to analyze a team's work tracking, from facts computed in code
 */
export async function analyzeWorkflow(payload: { department: string; facts: unknown }): Promise<WorkAnalysisResponse> {
  const response = await fetch('/api/analyze-workflow', {
    method: 'POST',
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'تعذر تحليل سير العمل.');
  }

  return response.json();
}

export interface PromotionPlanResponse {
  summary: string;
  // kind نوع الخطوة لاختيار أيقونتها ولونها، وقد يغيب في ردود قديمة
  steps: { kind?: 'course' | 'mentoring' | 'project' | 'practice'; title: string; action: string; duration: string; doneWhen: string }[];
}

/**
 * Call server-side Gemini API to write a short plan from the gaps (computed in code) that keep an employee from a role
 */
export async function generatePromotionPlan(payload: {
  employeeName: string;
  roleTitle: string;
  gaps: string[];
}): Promise<PromotionPlanResponse> {
  const response = await fetch('/api/promotion-plan', {
    method: 'POST',
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'تعذر كتابة الخطة.');
  }

  return response.json();
}

export interface ExtractedProject {
  title: string;
  summary: string;
  teamSize: number;
  skills: { name: string; level: number }[];
}

/**
 * Call server-side Gemini API to read a project brief (PDF or text) and extract what the project needs
 */
export async function extractProject(payload: {
  text?: string;
  pdfBase64?: string;
  knownSkills: string[];
}): Promise<ExtractedProject> {
  const response = await fetch('/api/extract-project', {
    method: 'POST',
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'تعذر قراءة المشروع.');
  }

  return response.json();
}

export interface ExtractedCv {
  name: string;
  title: string;
  department: string;
  experienceYears: number;
  skills: { name: string; level: number }[];
  projects: { title: string; role: string; outcome: string; year: string }[];
  courses: { title: string; provider: string; completionDate: string }[];
}

/**
 * Call server-side Gemini API to read a CV (PDF) and extract the data needed to build an employee profile
 */
export async function extractCv(payload: {
  pdfBase64: string;
  knownSkills: string[];
  departments: string[];
}): Promise<ExtractedCv> {
  const response = await fetch('/api/extract-cv', {
    method: 'POST',
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'تعذر قراءة السيرة الذاتية.');
  }

  return response.json();
}
