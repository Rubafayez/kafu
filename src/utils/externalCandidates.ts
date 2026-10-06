/**
 * مرشحون خارجيون تجريبيون لعرض الفكرة فقط.
 * الأسماء والملفات مختلقة وليست لأشخاص حقيقيين. الربط الفعلي يتطلب اتفاقاً رسمياً مع لينكدإن.
 */
export interface ExternalCandidate {
  id: string;
  name: string;
  headline: string;
  city: string;
  years: number;
  skills: string[];
  // nominated رُشّح للمشروع، hired تم توظيفه وينتظر إكمال ملفه، onboarded صار في قائمة الموظفين
  status?: 'nominated' | 'hired' | 'onboarded';
  projectTitle?: string;
  profileUrl?: string; // رابط صفحته في لينكدإن إن وُجد، وإلا يُفتح لينكدإن نفسه
  // ما في ملفه غير مهارة المشروع: يُستخدم عند سحب بياناته
  profileSkills?: string[];
  profileCourses?: { title: string; provider: string; completionDate: string }[];
  department?: string; // فريقه: يؤخذ تلقائياً من أغلب فريق المشروع الذي رُشّح له
}

// المرشحون تجريبيون وليس لهم صفحات حقيقية، فالزر يفتح لينكدإن نفسه
export const LINKEDIN_URL = 'https://www.linkedin.com/';

const SAMPLE_PEOPLE = [
  { name: 'جود الراشد', city: 'الرياض', years: 5 },
  { name: 'مازن العبدالله', city: 'جدة', years: 7 },
  { name: 'لمى الفيصل', city: 'الرياض', years: 4 },
  { name: 'تركي الصالح', city: 'الدمام', years: 6 },
  { name: 'دانة المنصور', city: 'الرياض', years: 3 },
  { name: 'راكان الحمد', city: 'الخبر', years: 8 },
];

// صاحبة المشروع نفسها: بياناتها من ملفها المهني، وتظهر مرشحة حين يحتاج المشروع مهارة من مهاراتها الفعلية.
const REAL_PROFILE = {
  id: 'external-ruba',
  name: 'ربى فايز',
  headline: 'مهندسة برمجيات · أتمتة بالذكاء الاصطناعي',
  city: 'الرياض',
  profileUrl: 'https://www.linkedin.com/in/rubafayez',
  skills: [
    'أتمتة سير العمل بالذكاء الاصطناعي',
    'بناء وكلاء الذكاء الاصطناعي',
    'تحليل الأعمال',
    'اختبار البرمجيات',
    'تطوير الويب المتكامل',
  ],
  courses: [] as { title: string; provider: string; completionDate: string }[],
};

const PER_SKILL = 2;

function hash(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * مرشحان تجريبيان لكل مهارة غير مغطاة. النتيجة ثابتة لنفس المهارة حتى لا تتغير بين عرض وآخر.
 */
export function sampleExternalCandidates(uncoveredSkills: string[]): ExternalCandidate[] {
  const used = new Set<number>();
  const result: ExternalCandidate[] = [];

  // صاحبة الصفحة الحقيقية تظهر أولاً إذا كان المشروع يحتاج إحدى مهاراتها
  const realMatch = uncoveredSkills.filter(skill => REAL_PROFILE.skills.includes(skill));
  if (realMatch.length > 0) {
    result.push({
      id: REAL_PROFILE.id,
      name: REAL_PROFILE.name,
      headline: REAL_PROFILE.headline,
      city: REAL_PROFILE.city,
      years: 0,
      skills: realMatch,
      profileUrl: REAL_PROFILE.profileUrl,
      profileSkills: REAL_PROFILE.skills,
      profileCourses: REAL_PROFILE.courses,
    });
  }

  for (const skill of uncoveredSkills) {
    let index = hash(skill) % SAMPLE_PEOPLE.length;
    for (let n = 0; n < PER_SKILL; n++) {
      while (used.has(index)) index = (index + 1) % SAMPLE_PEOPLE.length;
      if (used.size >= SAMPLE_PEOPLE.length) break;
      used.add(index);
      const person = SAMPLE_PEOPLE[index];
      result.push({
        id: `external-${index}`,
        name: person.name,
        headline: `مختص في ${skill}`,
        city: person.city,
        years: person.years,
        skills: [skill],
      });
    }
  }

  return result;
}
