/**
 * Standardize and normalize Arabic / English skill names for equitable matching
 */
export function normalizeSkillName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[ـ]/g, '') // remove tatweel
    .replace(/[أإآ]/g, 'ا') // normalize alef
    .replace(/ة/g, 'ه') // normalize taa marbouta
    .replace(/[\.\,\-\_\/]/g, ' ')
    .replace(/\s+/g, ' ');
}

// Canonical skill semantic cluster mapping
const SKILL_CLUSTERS: Record<string, string[]> = {
  'قيادة الفرق': ['قياده الفرق', 'قياده الفرق الهندسيه', 'اداره فرق العمل', 'اداره الفرق الميدانيه', 'leadership', 'team leadership', 'اداره الافراد', 'التوجيه والارشاد التقني'],
  'معمارية النظم السحابية': ['معماريه النظم السحابيه', 'cloud architecture', 'aws', 'kubernetes', 'البنيه التحتيه السحابيه', 'هندسه السحابه'],
  'تطوير البرمجيات الحديثة': ['تطوير البرمجيات الحديثه', 'software engineering', 'برمجه', 'تطوير التطبيقات', 'react', 'typescript', 'frontend', 'backend', 'بايثون'],
  'إدارة مشاريع Agile': ['اداره مشاريع agile', 'agile', 'scrum', 'project management', 'اداره المشاريع', 'pmp'],
  'أمن المعلومات': ['امن المعلومات', 'الامن السيبراني', 'cybersecurity', 'cissp', 'حمايه البيانات'],
  'تحسين أداء الأنظمة': ['تحسين اداء الانظمه', 'performance optimization', 'تحسين الكود', 'استقرار الانظمه'],
  'استراتيجية المنتجات الرقمية': ['استراتيجيه المنتجات الرقميه', 'product strategy', 'اداره المنتجات', 'product management', 'خارطه طريق المنتج'],
  'تحليل متطلبات المستخدم': ['تحليل متطلبات المستخدم', 'ux research', 'user requirements', 'ابحاث المستخدمين', 'تصميم التجربه'],
  'إدارة أولويات المهام': ['اداره اولويات المهام', 'prioritization', 'تحديد الاولويات', 'التنظيم'],
  'تحليل البيانات والمقاييس': ['تحليل البيانات والمقاييس', 'data analytics', 'metrics', 'مؤشرات الاداء', 'تحليل البيانات'],
  'التواصل مع أصحاب المصلحة': ['التواصل مع اصحاب المصلحه', 'stakeholder management', 'التواصل المؤسسي', 'التواصل التجاري'],
  'تحسين العمليات وإعادة هندستها': ['تحسين العمليات واعاده هندستها', 'process improvement', 'هندسه العمليات', 'operations', 'لين وسيكس سيغما', 'منهجيه لين وسيكس سيغما'],
  'إدارة سلاسل الإمداد والتوريد': ['اداره سلاسل الامداد والتوريد', 'supply chain', 'لوجستيات', 'اداره المخزون', 'المشتريات'],
  'إدارة ميزانيات التشغيل': ['اداره ميزانيات التشغيل', 'budgeting', 'الميزانيه الماليه', 'التحليل المالي', 'ترشيد التكاليف'],
  'إدارة فرق العمل الميدانية': ['اداره فرق العمل الميدانيه', 'field operations', 'الاشراف الميداني', 'قياده الموزعين'],
  'تحليل البيانات المتقدم': ['تحليل البيانات المتقدم', 'advanced analytics', 'ذكاء الاعمال', 'data analysis', 'الاحصاء'],
  'بناء لوحات Power BI و Tableau': ['بناء لوحات power bi و tableau', 'power bi', 'tableau', 'لوحات المؤشرات', 'تصميم اللوحات'],
  'قواعد بيانات SQL': ['قواعد بيانات sql', 'sql', 'databases', 'مستودعات البيانات'],
  'النمذجة التنبؤية والإحصاء': ['النمذجه التنبؤيه والاحصاء', 'predictive modeling', 'machine learning', 'علم البيانات', 'تعلم الاله'],
  'عرض البيانات للقيادة': ['عرض البيانات للقياده', 'executive reporting', 'سرد البيانات', 'العروض التنفيذيه'],
  'استقطاب الكفاءات والمواهب': ['استقطاب الكفاءات والمواهب', 'talent acquisition', 'التوظيف', 'recruitment', 'استقطاب المواهب'],
  'تخطيط التعاقب الوظيفي': ['تخطيط التعاقب الوظيفي', 'succession planning', 'التطوير التنظيمي', 'مسارات الترقيه'],
  'إدارة الأداء والتطوير': ['اداره الاداء والتطوير', 'performance management', 'تدريب الموظفين', 'تقييم الاداء'],
  'مقابلات التقييم المعتمدة': ['مقابلات التقييم المعتمده', 'structured interviews', 'المقابلات السلوكيه', 'تقييم الكفاءات'],
  'تحليلات الموارد البشرية': ['تحليلات الموارد البشريه', 'hr analytics', 'مؤشرات الموارد البشريه', 'people analytics'],
  'إدارة علاقات العملاء الاستراتيجيين': ['اداره علاقات العملاء الاستراتيجيين', 'key account management', 'علاقات العملاء', 'crm', 'خدمه كبار العملاء'],
  'التفاوض وإبرام الصفقات': ['التفاوض وابرام الصفقات', 'negotiation', 'اغلاق المبيعات', 'العقود التجارية'],
  'حل المشكلات وإدارة الأزمات': ['حل المشكلات واداره الازمات', 'crisis management', 'حل النزاعات', 'المرونه التشغيليه'],
  'تحليل مؤشرات الاستبقاء والتسرب': ['تحليل مؤشرات الاستبقاء والتسرب', 'churn analysis', 'معدل الاستبقاء', 'retention rate'],
  'العروض التقديمية والبيع الاستشاري': ['العروض التقديميه والبيع الاستشاري', 'consultative selling', 'العروض البيعيه', 'pitching'],
};

/**
 * Checks if candidate skill matches required skill (exact, substring, or semantic cluster)
 */
// نتيجة المطابقة لكل زوج مهارات تُحفظ: المقارنة تُطلب آلاف المرات عند ترشيح الفرق، وحسابها من جديد كل مرة يبطّئ الصفحة
const matchCache = new Map<string, boolean>();

export function isSkillMatch(candidateSkill: string, reqSkill: string): boolean {
  const key = `${candidateSkill}\u0000${reqSkill}`;
  const cached = matchCache.get(key);
  if (cached !== undefined) return cached;
  const result = computeSkillMatch(candidateSkill, reqSkill);
  matchCache.set(key, result);
  return result;
}

function computeSkillMatch(candidateSkill: string, reqSkill: string): boolean {
  const normCand = normalizeSkillName(candidateSkill);
  const normReq = normalizeSkillName(reqSkill);

  if (normCand === normReq) return true;
  if (normCand.includes(normReq) || normReq.includes(normCand)) return true;

  // Check cluster membership
  for (const [canonical, aliases] of Object.entries(SKILL_CLUSTERS)) {
    const normCanonical = normalizeSkillName(canonical);
    const inClusterCand = normCand === normCanonical || aliases.some(a => normCand.includes(normalizeSkillName(a)) || normalizeSkillName(a).includes(normCand));
    const inClusterReq = normReq === normCanonical || aliases.some(a => normReq.includes(normalizeSkillName(a)) || normalizeSkillName(a).includes(normReq));

    if (inClusterCand && inClusterReq) {
      return true;
    }
  }

  return false;
}
