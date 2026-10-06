import { CompanyProject, Employee, JobRole } from '../types';

export const INITIAL_OPEN_ROLES: JobRole[] = [
  {
    id: 'role-1',
    title: 'مدير هندسة برمجيات أول',
    department: 'الهندسة والتقنية',
    minExperienceYears: 5,
    description: 'قيادة الفرق الهندسية التقنية وتوجيه المعمارية البرمجية، وربط الأهداف التقنية باستراتيجية المنتج وإدارة دورة حياة الأنظمة.',
    isOpen: true,
    requiredSkills: [
      { name: 'قيادة الفرق الهندسية', level: 4, importance: 'essential' },
      { name: 'معمارية النظم السحابية', level: 4, importance: 'essential' },
      { name: 'إدارة مشاريع Agile', level: 3, importance: 'essential' },
      { name: 'تطوير البرمجيات الحديثة', level: 4, importance: 'essential' },
      { name: 'التوجيه والإرشاد التقني', level: 3, importance: 'desirable' },
      { name: 'أمن المعلومات', level: 2, importance: 'desirable' },
    ],
  },
  {
    id: 'role-2',
    title: 'مدير منتج رئيسي',
    department: 'الهندسة والتقنية',
    minExperienceYears: 4,
    description: 'تحديد رؤية وخارطة طريق المنتجات الرقمية، والتعاون مع فرق التصميم والبرمجة والتسويق لإطلاق ميزات تزيد من نمو المستخدمين.',
    isOpen: true,
    requiredSkills: [
      { name: 'استراتيجية المنتجات الرقمية', level: 4, importance: 'essential' },
      { name: 'تحليل متطلبات المستخدم', level: 4, importance: 'essential' },
      { name: 'إدارة أولويات المهام', level: 4, importance: 'essential' },
      { name: 'تحليل البيانات والمقاييس', level: 3, importance: 'essential' },
      { name: 'التواصل مع أصحاب المصلحة', level: 4, importance: 'desirable' },
    ],
  },
  {
    id: 'role-3',
    title: 'قائد فريق العمليات وسلاسل الإمداد',
    department: 'العمليات وسلاسل الإمداد',
    minExperienceYears: 4,
    description: 'إدارة وتنسيق العمليات التشغيلية اليومية، وتطوير كفاءة المستودعات وسلاسل الإمداد وخفض التكاليف وتحسين سرعة التسليم.',
    isOpen: true,
    requiredSkills: [
      { name: 'تحسين العمليات وإعادة هندستها', level: 4, importance: 'essential' },
      { name: 'إدارة سلاسل الإمداد والتوريد', level: 4, importance: 'essential' },
      { name: 'إدارة فرق العمل الميدانية', level: 3, importance: 'essential' },
      { name: 'إدارة ميزانيات التشغيل', level: 3, importance: 'essential' },
      { name: 'منهجية لين وسيكس سيغما', level: 3, importance: 'desirable' },
    ],
  },
  {
    id: 'role-4',
    title: 'رئيس قسم ذكاء الأعمال وتحليل البيانات',
    department: 'الهندسة والتقنية',
    minExperienceYears: 4,
    description: 'بناء البنية التحتية لتحليلات البيانات وإعداد لوحات المؤشرات التفاعلية، وتزويد الإدارة العليا بالرؤى التنبؤية لدعم القرار.',
    isOpen: true,
    requiredSkills: [
      { name: 'تحليل البيانات المتقدم', level: 4, importance: 'essential' },
      { name: 'بناء لوحات Power BI و Tableau', level: 4, importance: 'essential' },
      { name: 'قواعد بيانات SQL', level: 4, importance: 'essential' },
      { name: 'النمذجة التنبؤية والإحصاء', level: 3, importance: 'essential' },
      { name: 'عرض البيانات للقيادة', level: 3, importance: 'desirable' },
    ],
  },
  {
    id: 'role-5',
    title: 'مدير استقطاب المواهب وتطوير الكفاءات',
    department: 'الموارد البشرية والإدارة',
    minExperienceYears: 5,
    description: 'قيادة مبادرات التوظيف الاستراتيجي، وبناء مسارات التطوير الوظيفي للموظفين وبرامج التعاقب الوظيفي الداخلي.',
    isOpen: true,
    requiredSkills: [
      { name: 'استقطاب الكفاءات والمواهب', level: 4, importance: 'essential' },
      { name: 'تخطيط التعاقب الوظيفي', level: 4, importance: 'essential' },
      { name: 'إدارة الأداء والتطوير', level: 4, importance: 'essential' },
      { name: 'مقابلات التقييم المعتمدة', level: 3, importance: 'essential' },
      { name: 'تحليلات الموارد البشرية', level: 3, importance: 'desirable' },
    ],
  },
  {
    id: 'role-6',
    title: 'مدير نجاح العملاء وحسابات الشركات',
    department: 'التسويق والمبيعات',
    minExperienceYears: 4,
    description: 'إدارة علاقات كبار العملاء والشركاء، وضمان تحقيق العائد واستبقاء العملاء والتوسع في مبيعات الاشتراكات السنوية.',
    isOpen: true,
    requiredSkills: [
      { name: 'إدارة علاقات العملاء الاستراتيجيين', level: 4, importance: 'essential' },
      { name: 'التفاوض وإبرام الصفقات', level: 4, importance: 'essential' },
      { name: 'حل المشكلات وإدارة الأزمات', level: 4, importance: 'essential' },
      { name: 'تحليل مؤشرات الاستبقاء والتسرب', level: 3, importance: 'essential' },
      { name: 'العروض التقديمية والبيع الاستشاري', level: 3, importance: 'desirable' },
    ],
  },
];

const BASE_EMPLOYEES: Employee[] = [
  // Obvious Hidden Talent 1: سارة العتيبي (Engineering)
  {
    id: 'emp-01',
    name: 'سارة العتيبي',
    title: 'مطورة واجهات أمامية أولى',
    department: 'الهندسة والتقنية',
    experienceYears: 5.5,
    lastPromotionDate: null, // Never promoted despite exceptional trajectory
    isHiddenTalent: true,
    hiddenTalentReason: 'أداء متصاعد قياسي (4.4 ← 4.95) خلال الفصول الأربعة، تقود معمارية الواجهات وتوجه 4 مطورين دون مسمى قيادي رسمي.',
    skills: [
      { id: 'sk-1', name: 'تطوير البرمجيات الحديثة', level: 5 },
      { id: 'sk-2', name: 'معمارية النظم السحابية', level: 4 },
      { id: 'sk-3', name: 'قيادة الفرق الهندسية', level: 4 },
      { id: 'sk-4', name: 'التوجيه والإرشاد التقني', level: 4 },
      { id: 'sk-5', name: 'إدارة مشاريع Agile', level: 3 },
      { id: 'sk-6', name: 'أمن المعلومات', level: 3 },
      { id: 'sk-7', name: 'تحسين أداء الأنظمة', level: 5 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.4, feedback: 'تسليم متقن لجميع مهام واجهة المستخدم، وتنسيق تقني ممتاز.', strengths: ['جودة الكود', 'الالتزام بالمواعيد'] },
      { quarter: 'Q2', year: 2025, score: 4.6, feedback: 'بادرت بإعادة هيكلة الكود الأساسي مما خفض زمن التحميل بنسبة 40%.', strengths: ['المبادرة التقنية', 'حل المشكلات'] },
      { quarter: 'Q3', year: 2025, score: 4.8, feedback: 'قامت بتوجيه ومساعدة المطورين الجدد بنجاح لافت، ولعبت دور القائد الفعلي.', strengths: ['التوجيه والإرشاد', 'القيادة غير الرسمية'] },
      { quarter: 'Q4', year: 2025, score: 4.95, feedback: 'أداء قيادي استثنائي ومرجع هندسي للفريق بأكمله، جاهزة لمنصب قيادي تنفيذي.', strengths: ['الرؤية المعمارية', 'التأثير الإيجابي على الفريق'] },
    ],
    projects: [
      {
        id: 'proj-01',
        title: 'إعادة بناء منصة العملاء بالكامل',
        role: 'قائدة المعمارية التقنية للواجهات',
        outcome: 'رفع سرعة استجابة المنصة 45% وتحسين رضا المستخدمين إلى 94%.',
        skillsUsed: ['تطوير البرمجيات الحديثة', 'معمارية النظم السحابية', 'تحسين أداء الأنظمة'],
        year: '2025',
      },
      {
        id: 'proj-02',
        title: 'نظام التصميم الموحد للشركة (Design System)',
        role: 'المالك الهندسي للمشروع',
        outcome: 'توحيد واجهات 6 أنظمة داخلية وتقليل وقت إنتاج الميزات الجديدة بمقدار النصف.',
        skillsUsed: ['تطوير البرمجيات الحديثة', 'قيادة الفرق الهندسية', 'التوجيه والإرشاد التقني'],
        year: '2024',
      },
      {
        id: 'proj-03',
        title: 'ترقية معايير الأمان والتوافقية للواجهات',
        role: 'المشرفة التقنية',
        outcome: 'اجتياز تدقيق الأمان السنوي دون أي ملاحظة حرجة.',
        skillsUsed: ['أمن المعلومات', 'إدارة مشاريع Agile'],
        year: '2024',
      },
    ],
    courses: [
      { id: 'c-01', title: 'AWS Certified Solutions Architect', provider: 'Amazon Web Services', completionDate: '2025-05' },
      { id: 'c-02', title: 'Engineering Leadership & Team Dynamics', provider: 'MIT Professional Education', completionDate: '2025-10' },
      { id: 'c-03', title: 'Agile Project Management Masterclass', provider: 'Scrum Alliance', completionDate: '2024-03' },
    ],
  },

  // Obvious Hidden Talent 2: عمر الزهراني (Operations)
  {
    id: 'emp-02',
    name: 'عمر الزهراني',
    title: 'أخصائي أول تحسين عمليات',
    department: 'العمليات وسلاسل الإمداد',
    experienceYears: 4.8,
    lastPromotionDate: null,
    isHiddenTalent: true,
    hiddenTalentReason: 'أداء تصاعدي ممتاز (4.3 ← 4.9) قاد مشروع أتمتة المستودعات وفر 30% من النفقات، يمتلك مهارات قيادية دون ترقية سابقة.',
    skills: [
      { id: 'sk-11', name: 'تحسين العمليات وإعادة هندستها', level: 5 },
      { id: 'sk-12', name: 'إدارة سلاسل الإمداد والتوريد', level: 4 },
      { id: 'sk-13', name: 'منهجية لين وسيكس سيغما', level: 4 },
      { id: 'sk-14', name: 'إدارة فرق العمل الميدانية', level: 4 },
      { id: 'sk-15', name: 'إدارة ميزانيات التشغيل', level: 3 },
      { id: 'sk-16', name: 'تحليل البيانات التشغيلية', level: 4 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.3, feedback: 'دقة عالية في مراقبة سلاسل الإمداد وحل إشكالات الموردين سريعاً.', strengths: ['المتابعة الدقيقة', 'التنسيق الميداني'] },
      { quarter: 'Q2', year: 2025, score: 4.5, feedback: 'قدم مقترحاً لإعادة تخطيط مسارات التوزيع في المستودعات المركزية.', strengths: ['التفكير التحليلي', 'ابتكار الحلول'] },
      { quarter: 'Q3', year: 2025, score: 4.75, feedback: 'قاد فريقاً ميدانياً من 8 موظفين لتطبيق أتمتة الجرد بنجاح تام.', strengths: ['إدارة الفريق الميداني', 'تحمل المسؤولية'] },
      { quarter: 'Q4', year: 2025, score: 4.9, feedback: 'أداء قيادي استثنائي انعكس على تقليل هدر الميزانية بنسبة 25%.', strengths: ['القيادة التشغيلية', 'التوفير المالي'] },
    ],
    projects: [
      {
        id: 'proj-04',
        title: 'أتمتة الفرز والجرد اللوجستي',
        role: 'مدير المشروع التشغيلي',
        outcome: 'خفض دورة معالجة الطلبات من 48 ساعة إلى 14 ساعة وتوفير 320,000 ريال سنوياً.',
        skillsUsed: ['تحسين العمليات وإعادة هندستها', 'إدارة سلاسل الإمداد والتوريد', 'تحليل البيانات التشغيلية'],
        year: '2025',
      },
      {
        id: 'proj-05',
        title: 'برنامج تقليل الهدر بالمستودعات المركزية',
        role: 'قائد مبادرة الجودة',
        outcome: 'تقليل نسبة التلفيات في المواد المخزنة بنسبة 70%.',
        skillsUsed: ['منهجية لين وسيكس سيغما', 'إدارة فرق العمل الميدانية'],
        year: '2024',
      },
    ],
    courses: [
      { id: 'c-04', title: 'Lean Six Sigma Black Belt Certification', provider: 'ASQ', completionDate: '2025-02' },
      { id: 'c-05', title: 'Supply Chain Operations & Logistics Management', provider: 'APICS', completionDate: '2024-08' },
    ],
  },

  // Obvious Hidden Talent 3: نورة الشمري (Data / Tech)
  {
    id: 'emp-03',
    name: 'نورة الشمري',
    title: 'محللة بيانات وذكاء أعمال أولى',
    department: 'الهندسة والتقنية',
    experienceYears: 4.2,
    lastPromotionDate: null,
    isHiddenTalent: true,
    hiddenTalentReason: 'أداء تصاعدي لافت (4.2 ← 4.9) بنت بمفردها لوحات القرار للرؤساء التنفيذيين ونموذج تنبؤ بتسرب العملاء.',
    skills: [
      { id: 'sk-21', name: 'تحليل البيانات المتقدم', level: 5 },
      { id: 'sk-22', name: 'بناء لوحات Power BI و Tableau', level: 5 },
      { id: 'sk-23', name: 'قواعد بيانات SQL', level: 5 },
      { id: 'sk-24', name: 'النمذجة التنبؤية والإحصاء', level: 4 },
      { id: 'sk-25', name: 'عرض البيانات للقيادة', level: 4 },
      { id: 'sk-26', name: 'لغة البرمجة بايثون لتحليل البيانات', level: 4 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.2, feedback: 'تسليم منتظم للتقارير الأسبوعية ودقة حسابية متناهية.', strengths: ['الدقة الإحصائية', 'قواعد البيانات'] },
      { quarter: 'Q2', year: 2025, score: 4.5, feedback: 'بناء لوحة مؤشرات تفاعلية للإدارة التنفيذية أحدثت نقلة في سرعة اتخاذ القرار.', strengths: ['تصميم اللوحات', 'الفهم التجاري'] },
      { quarter: 'Q3', year: 2025, score: 4.8, feedback: 'ابتكرت نموذجاً تنبؤياً ذكياً ساعد قسم المبيعات على استبقاء 35 عميلاً.', strengths: ['النمذجة التنبؤية', 'التواصل مع الفرق'] },
      { quarter: 'Q4', year: 2025, score: 4.9, feedback: 'مرجع لا غنى عنه في تحليل البيانات وتوجيه بقية المحللين في الشركة.', strengths: ['القيادة الفكرية في البيانات', 'العرض التنفيذي'] },
    ],
    projects: [
      {
        id: 'proj-06',
        title: 'نظام التنبؤ بمؤشرات تسرب واحتفاظ العملاء',
        role: 'المحللة الإحصائية الرئيسية',
        outcome: 'دقة تنبؤ بلغت 89% أسهمت في حماية 1.2 مليون ريال من الإيرادات المتكررة.',
        skillsUsed: ['النمذجة التنبؤية والإحصاء', 'تحليل البيانات المتقدم', 'قواعد بيانات SQL'],
        year: '2025',
      },
      {
        id: 'proj-07',
        title: 'لوحة القيادة الموحدة للإدارة العليا (Executive BI)',
        role: 'مصممة ومطورة اللوحة',
        outcome: 'توحيد مصادر 5 قواعد بيانات وعرض مؤشرات الربحية لحظياً.',
        skillsUsed: ['بناء لوحات Power BI و Tableau', 'عرض البيانات للقيادة'],
        year: '2024',
      },
    ],
    courses: [
      { id: 'c-06', title: 'Microsoft Certified: Data Analyst Associate', provider: 'Microsoft', completionDate: '2024-11' },
      { id: 'c-07', title: 'Advanced Predictive Analytics & Machine Learning', provider: 'Stanford Online', completionDate: '2025-06' },
    ],
  },

  // Employee 4: فهد القحطاني
  {
    id: 'emp-04',
    name: 'فهد القحطاني',
    title: 'مهندس نظم وبنية تحتية أول',
    department: 'الهندسة والتقنية',
    experienceYears: 6.0,
    lastPromotionDate: '2023-01',
    skills: [
      { id: 'sk-31', name: 'معمارية النظم السحابية', level: 5 },
      { id: 'sk-32', name: 'أمن المعلومات', level: 4 },
      { id: 'sk-33', name: 'تطوير البرمجيات الحديثة', level: 3 },
      { id: 'sk-34', name: 'إدارة مشاريع Agile', level: 3 },
      { id: 'sk-35', name: 'قيادة الفرق الهندسية', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.6, feedback: 'جاهزية السيرفرات 99.98% خلال فترة الذروة.', strengths: ['الاستقرار التقني'] },
      { quarter: 'Q2', year: 2025, score: 4.5, feedback: 'تطبيق خطة التعافي من الكوارث بنجاح.', strengths: ['الأمان والنسخ الاحتياطي'] },
      { quarter: 'Q3', year: 2025, score: 4.4, feedback: 'مجهود ممتاز في خفض فاتورة البنية السحابية.', strengths: ['ترشيد التكاليف'] },
      { quarter: 'Q4', year: 2025, score: 4.6, feedback: 'استقرار تشغيلي متميز وتوجيه للمهندسين المبتدئين.', strengths: ['الموثوقية'] },
    ],
    projects: [
      { id: 'proj-08', title: 'نقل البنية التحتية إلى بيئة سحابية هجينة', role: 'قائد البنية التحتية', outcome: 'تخفيض التكاليف التشغيلية بنسبة 28%.', skillsUsed: ['معمارية النظم السحابية', 'أمن المعلومات'], year: '2024' },
      { id: 'proj-09', title: 'أتمتة خطوط النشر المستمر CI/CD', role: 'مهندس DevOps الرئيسي', outcome: 'تقليص وقت نشر التحديثات البرمجية من ساعات إلى دقائق.', skillsUsed: ['تطوير البرمجيات الحديثة'], year: '2025' },
    ],
    courses: [
      { id: 'c-08', title: 'Certified Kubernetes Administrator (CKA)', provider: 'Linux Foundation', completionDate: '2024-04' },
    ],
  },

  // Employee 5: ريم الدوسري
  {
    id: 'emp-05',
    name: 'ريم الدوسري',
    title: 'أخصائية أولى تجربة وتصميم المنتجات',
    department: 'الهندسة والتقنية',
    experienceYears: 4.5,
    lastPromotionDate: '2023-09',
    skills: [
      { id: 'sk-41', name: 'تحليل متطلبات المستخدم', level: 5 },
      { id: 'sk-42', name: 'استراتيجية المنتجات الرقمية', level: 4 },
      { id: 'sk-43', name: 'إدارة أولويات المهام', level: 3 },
      { id: 'sk-44', name: 'التواصل مع أصحاب المصلحة', level: 4 },
      { id: 'sk-45', name: 'تحليل البيانات والمقاييس', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.5, feedback: 'أبحاث مستخدمين متعمقة كشفت فرصاً لتحسين التدفق.', strengths: ['أبحاث المستخدمين'] },
      { quarter: 'Q2', year: 2025, score: 4.7, feedback: 'تصميم مسار شراء بديهي قلص معدل التراجع 22%.', strengths: ['التصميم الوظيفي'] },
      { quarter: 'Q3', year: 2025, score: 4.6, feedback: 'إدارة نقاشات متوازنة بين فريق التطوير والتسويق.', strengths: ['التواصل الفعال'] },
      { quarter: 'Q4', year: 2025, score: 4.8, feedback: 'تطور ملحوظ في قيادة خارطة طريق الميزات.', strengths: ['التفكير الاستراتيجي للمنتج'] },
    ],
    projects: [
      { id: 'proj-10', title: 'إعادة تصميم تطبيق الهاتف للمستهلكين', role: 'قائدة تصميم وتجربة المنتج', outcome: 'ارتفاع تقييم التطبيق في المتاجر من 3.6 إلى 4.7 نجوم.', skillsUsed: ['تحليل متطلبات المستخدم', 'استراتيجية المنتجات الرقمية'], year: '2025' },
    ],
    courses: [
      { id: 'c-09', title: 'Product Management Certificate', provider: 'Product School', completionDate: '2025-01' },
    ],
  },

  // Employee 6: خالد الغامدي
  {
    id: 'emp-06',
    name: 'خالد الغامدي',
    title: 'مطور برمجيات خلفية رئيسي',
    department: 'الهندسة والتقنية',
    experienceYears: 6.2,
    lastPromotionDate: '2022-12',
    skills: [
      { id: 'sk-51', name: 'تطوير البرمجيات الحديثة', level: 5 },
      { id: 'sk-52', name: 'معمارية النظم السحابية', level: 4 },
      { id: 'sk-53', name: 'أمن المعلومات', level: 4 },
      { id: 'sk-54', name: 'قواعد بيانات SQL', level: 4 },
      { id: 'sk-55', name: 'قيادة الفرق الهندسية', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.4, feedback: 'بناء واجهات برمجية متينة وموثوقة.', strengths: ['قوة المعمارية'] },
      { quarter: 'Q2', year: 2025, score: 4.4, feedback: 'إنجاز تكامل بوابات الدفع بأعلى معايير الحماية.', strengths: ['الأمان الإلكتروني'] },
      { quarter: 'Q3', year: 2025, score: 4.5, feedback: 'سرعة استجابة ومعالجة لأي اختناق في قواعد البيانات.', strengths: ['استكشاف الأخطاء'] },
      { quarter: 'Q4', year: 2025, score: 4.5, feedback: 'أداء تقني راسخ.', strengths: ['الاستمرارية'] },
    ],
    projects: [
      { id: 'proj-11', title: 'نواة محرك المدفوعات والمعاملات المالية', role: 'كبير مهندسي الواجهات الخلفية', outcome: 'معالجة ما يزيد عن نصف مليون معاملة دون أي خطأ محاسبي.', skillsUsed: ['تطوير البرمجيات الحديثة', 'أمن المعلومات', 'قواعد بيانات SQL'], year: '2024' },
    ],
    courses: [
      { id: 'c-10', title: 'Microservices Architecture Design', provider: 'Coursera', completionDate: '2023-11' },
    ],
  },

  // Employee 7: لطيفة الحارثي
  {
    id: 'emp-07',
    name: 'لطيفة الحارثي',
    title: 'أخصائية استقطاب مواهب أولى',
    department: 'الموارد البشرية والإدارة',
    experienceYears: 5.0,
    lastPromotionDate: '2023-04',
    skills: [
      { id: 'sk-61', name: 'استقطاب الكفاءات والمواهب', level: 5 },
      { id: 'sk-62', name: 'مقابلات التقييم المعتمدة', level: 4 },
      { id: 'sk-63', name: 'تخطيط التعاقب الوظيفي', level: 3 },
      { id: 'sk-64', name: 'إدارة الأداء والتطوير', level: 4 },
      { id: 'sk-65', name: 'تحليلات الموارد البشرية', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.5, feedback: 'إغلاق 18 شاغراً نوعياً في وقت قياسي.', strengths: ['سرعة الاستقطاب'] },
      { quarter: 'Q2', year: 2025, score: 4.6, feedback: 'تطبيق منهجية المقابلات السلوكية المبنية على الكفاءات.', strengths: ['دقة التقييم'] },
      { quarter: 'Q3', year: 2025, score: 4.7, feedback: 'مبادرة متميزة في بناء مصفوفة المهارات للكفاءات التقنية.', strengths: ['تطوير النظم'] },
      { quarter: 'Q4', year: 2025, score: 4.8, feedback: 'رؤية استراتيجية واضحة في ربط التوظيف باحتياجات النمو.', strengths: ['التخطيط الوظيفي'] },
    ],
    projects: [
      { id: 'proj-12', title: 'بوابة استقطاب الكفاءات الرقمية ونظام التقييم', role: 'قائدة المبادرة', outcome: 'تقليل وقت التوظيف من 65 يوماً إلى 28 يوماً.', skillsUsed: ['استقطاب الكفاءات والمواهب', 'تحليلات الموارد البشرية'], year: '2024' },
      { id: 'proj-13', title: 'برنامج تأهيل الموظفين الجدد (Onboarding)', role: 'مصممة البرنامج', outcome: 'رفع نسبة استقرار الموظفين في الأشهر الستة الأولى إلى 96%.', skillsUsed: ['إدارة الأداء والتطوير'], year: '2025' },
    ],
    courses: [
      { id: 'c-11', title: 'SHRM Certified Professional (SHRM-CP)', provider: 'SHRM', completionDate: '2024-05' },
    ],
  },

  // Employee 8: ماجد السبيعي
  {
    id: 'emp-08',
    name: 'ماجد السبيعي',
    title: 'مشرف أول عمليات لوجستية',
    department: 'العمليات وسلاسل الإمداد',
    experienceYears: 5.2,
    lastPromotionDate: '2023-06',
    skills: [
      { id: 'sk-71', name: 'إدارة سلاسل الإمداد والتوريد', level: 4 },
      { id: 'sk-72', name: 'إدارة فرق العمل الميدانية', level: 4 },
      { id: 'sk-73', name: 'تحسين العمليات وإعادة هندستها', level: 3 },
      { id: 'sk-74', name: 'إدارة ميزانيات التشغيل', level: 3 },
      { id: 'sk-75', name: 'منهجية لين وسيكس سيغما', level: 2 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.3, feedback: 'إدارة فريق التوزيع بروح إيجابية والتزام.', strengths: ['إدارة الأفراد'] },
      { quarter: 'Q2', year: 2025, score: 4.4, feedback: 'معالجة فورية لاختناقات أوقات الذروة والمواسم.', strengths: ['المرونة التشغيلية'] },
      { quarter: 'Q3', year: 2025, score: 4.4, feedback: 'انضباط في متابعة أسطول النقل ومواعيد التسليم.', strengths: ['الانضباط الميداني'] },
      { quarter: 'Q4', year: 2025, score: 4.5, feedback: 'أداء مستقر وعلاقات ممتازة مع السائقين والموزعين.', strengths: ['العلاقات الميدانية'] },
    ],
    projects: [
      { id: 'proj-14', title: 'إعادة جدولة ورديات التوزيع وتتبع المركبات', role: 'مشرف التوزيع', outcome: 'خفض تكلفة استهلاك الوقود بنسبة 18%.', skillsUsed: ['إدارة سلاسل الإمداد والتوريد', 'إدارة فرق العمل الميدانية'], year: '2024' },
    ],
    courses: [
      { id: 'c-12', title: 'Certified Logistics Associate (CLA)', provider: 'MSSC', completionDate: '2023-09' },
    ],
  },

  // Employee 9: هدى المطيري
  {
    id: 'emp-09',
    name: 'هدى المطيري',
    title: 'أخصائية نجاح عملاء رئيسية',
    department: 'التسويق والمبيعات',
    experienceYears: 4.8,
    lastPromotionDate: '2023-10',
    skills: [
      { id: 'sk-81', name: 'إدارة علاقات العملاء الاستراتيجيين', level: 5 },
      { id: 'sk-82', name: 'حل المشكلات وإدارة الأزمات', level: 4 },
      { id: 'sk-83', name: 'تحليل مؤشرات الاستبقاء والتسرب', level: 4 },
      { id: 'sk-84', name: 'التفاوض وإبرام الصفقات', level: 3 },
      { id: 'sk-85', name: 'العروض التقديمية والبيع الاستشاري', level: 4 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.6, feedback: 'تحقيق أعلى معدل رضا للعملاء الاستراتيجيين بنسبة 98%.', strengths: ['خدمة العملاء', 'بناء الثقة'] },
      { quarter: 'Q2', year: 2025, score: 4.7, feedback: 'إقناع 12 عميلاً رئيسياً بتجديد عقودهم السنوية مبكراً.', strengths: ['التجديد والاستبقاء'] },
      { quarter: 'Q3', year: 2025, score: 4.7, feedback: 'حل نزاع تجاري معقد مع شريك استراتيجي وتحويله لفرصة نمو.', strengths: ['إدارة الأزمات'] },
      { quarter: 'Q4', year: 2025, score: 4.85, feedback: 'تفكير قيادي متميز في تصميم برنامج تجربة العميل الشامل.', strengths: ['القيادة الاستشارية'] },
    ],
    projects: [
      { id: 'proj-15', title: 'برنامج الشركاء الاستراتيجيين (VIP Accounts)', role: 'مديرة البرنامج', outcome: 'تحقيق معدل استبقاء 100% لأهم 20 شريكاً بالشركة.', skillsUsed: ['إدارة علاقات العملاء الاستراتيجيين', 'تحليل مؤشرات الاستبقاء والتسرب'], year: '2025' },
    ],
    courses: [
      { id: 'c-13', title: 'Strategic Account Management Excellence', provider: 'SAMA Institute', completionDate: '2024-12' },
    ],
  },

  // Employee 10: طارق العمري
  {
    id: 'emp-10',
    name: 'طارق العمري',
    title: 'أخصائي تطوير أعمال ومبيعات شركات',
    department: 'التسويق والمبيعات',
    experienceYears: 4.0,
    lastPromotionDate: null,
    skills: [
      { id: 'sk-91', name: 'التفاوض وإبرام الصفقات', level: 4 },
      { id: 'sk-92', name: 'العروض التقديمية والبيع الاستشاري', level: 4 },
      { id: 'sk-93', name: 'إدارة علاقات العملاء الاستراتيجيين', level: 3 },
      { id: 'sk-94', name: 'تحليل مؤشرات الاستبقاء والتسرب', level: 2 },
      { id: 'sk-95', name: 'حل المشكلات وإدارة الأزمات', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.2, feedback: 'تحقيق 110% من المستهدف البيعي للربع الأول.', strengths: ['إغلاق الصفقات'] },
      { quarter: 'Q2', year: 2025, score: 4.3, feedback: 'علاقات قوية مع مديري المشتريات بالشركات المستهدفة.', strengths: ['التواصل التجاري'] },
      { quarter: 'Q3', year: 2025, score: 4.5, feedback: 'إبرام عقد شراكة استراتيجية بـ 850,000 ريال.', strengths: ['التفاوض عالي المستوى'] },
      { quarter: 'Q4', year: 2025, score: 4.6, feedback: 'مساهمة فاعلة في خطة نمو المبيعات للعام الجديد.', strengths: ['التركيز على النتائج'] },
    ],
    projects: [
      { id: 'proj-16', title: 'حملة استقطاب حسابات القطاع الحكومي وشبه الحكومي', role: 'مسؤول المبيعات الرئيسي', outcome: 'ضم 8 جهات كبرى إلى المنصة وزيادة الإيرادات بنسبة 35%.', skillsUsed: ['التفاوض وإبرام الصفقات', 'العروض التقديمية والبيع الاستشاري'], year: '2025' },
    ],
    courses: [
      { id: 'c-14', title: 'Consultative B2B Sales Mastery', provider: 'Miller Heiman Group', completionDate: '2024-06' },
    ],
  },

  // Employee 11: منى الحربي
  {
    id: 'emp-11',
    name: 'منى الحربي',
    title: 'أخصائية تدريب وتطوير وظيفي',
    department: 'الموارد البشرية والإدارة',
    experienceYears: 4.6,
    lastPromotionDate: null,
    skills: [
      { id: 'sk-101', name: 'إدارة الأداء والتطوير', level: 4 },
      { id: 'sk-102', name: 'تخطيط التعاقب الوظيفي', level: 4 },
      { id: 'sk-103', name: 'استقطاب الكفاءات والمواهب', level: 3 },
      { id: 'sk-104', name: 'تحليلات الموارد البشرية', level: 3 },
      { id: 'sk-105', name: 'مقابلات التقييم المعتمدة', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.3, feedback: 'تنفيذ خطة التدريب السنوية بنسبة التزام 95%.', strengths: ['التنظيم والمتابعة'] },
      { quarter: 'Q2', year: 2025, score: 4.5, feedback: 'تصميم ورش عمل تفاعلية للقيادات الواعدة في الشركة.', strengths: ['تصميم الحقائب التدريبية'] },
      { quarter: 'Q3', year: 2025, score: 4.6, feedback: 'بناء إطار الكفاءات السلوكية والفنية لكافة الأقسام.', strengths: ['التطوير المؤسسي'] },
      { quarter: 'Q4', year: 2025, score: 4.75, feedback: 'مبادرات ملموسة ساعدت في رفع مؤشر ارتباط الموظفين.', strengths: ['الارتباط الوظيفي'] },
    ],
    projects: [
      { id: 'proj-17', title: 'أكاديمية التعليم الداخلي للشركة (Kafu Academy)', role: 'مديرة المشروع التعليمي', outcome: 'إكمال 140 موظفاً لمسارات الترقية والتدريب التخصصي.', skillsUsed: ['إدارة الأداء والتطوير', 'تخطيط التعاقب الوظيفي'], year: '2025' },
    ],
    courses: [
      { id: 'c-15', title: 'ATD Certified Professional in Talent Development (CPTD)', provider: 'ATD', completionDate: '2024-09' },
    ],
  },

  // Employee 12: عبدالله الشهري
  {
    id: 'emp-12',
    name: 'عبدالله الشهري',
    title: 'مهندس جودة واختبار برمجيات أول',
    department: 'الهندسة والتقنية',
    experienceYears: 4.8,
    lastPromotionDate: '2023-03',
    skills: [
      { id: 'sk-111', name: 'تطوير البرمجيات الحديثة', level: 4 },
      { id: 'sk-112', name: 'إدارة مشاريع Agile', level: 3 },
      { id: 'sk-113', name: 'أمن المعلومات', level: 3 },
      { id: 'sk-114', name: 'تحسين أداء الأنظمة', level: 4 },
      { id: 'sk-115', name: 'قيادة الفرق الهندسية', level: 2 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.2, feedback: 'أتمتة 70% من سيناريوهات الاختبار الحرجة.', strengths: ['أتمتة الاختبارات'] },
      { quarter: 'Q2', year: 2025, score: 4.3, feedback: 'اكتشاف ثغرات أداء حاسمة قبل مرحلة الإطلاق العام.', strengths: ['عين فاحصة ودقيقة'] },
      { quarter: 'Q3', year: 2025, score: 4.4, feedback: 'تعاون وثيق مع فرق الواجهات والخلفيات البرمجية.', strengths: ['العمل الجماعي'] },
      { quarter: 'Q4', year: 2025, score: 4.5, feedback: 'ثبات وجودة عالية في مخرجات كل تحديث تطبيقي.', strengths: ['ضمان الجودة'] },
    ],
    projects: [
      { id: 'proj-18', title: 'إطار الاختبارات المؤتمتة الشاملة (End-to-End)', role: 'مهندس الجودة الرئيسي', outcome: 'تقليل الأخطاء البرمجية بعد الإطلاق بنسبة 85%.', skillsUsed: ['تطوير البرمجيات الحديثة', 'تحسين أداء الأنظمة'], year: '2024' },
    ],
    courses: [
      { id: 'c-16', title: 'ISTQB Certified Tester Advanced Level', provider: 'ISTQB', completionDate: '2023-05' },
    ],
  },

  // Employee 13: ياسر النعمي
  {
    id: 'emp-13',
    name: 'ياسر النعمي',
    title: 'محلل مالي واستثماري أول',
    department: 'الموارد البشرية والإدارة',
    experienceYears: 5.5,
    lastPromotionDate: '2023-01',
    skills: [
      { id: 'sk-121', name: 'إدارة ميزانيات التشغيل', level: 5 },
      { id: 'sk-122', name: 'تحليل البيانات المتقدم', level: 4 },
      { id: 'sk-123', name: 'النمذجة التنبؤية والإحصاء', level: 4 },
      { id: 'sk-124', name: 'عرض البيانات للقيادة', level: 3 },
      { id: 'sk-125', name: 'التفاوض وإبرام الصفقات', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.4, feedback: 'تدقيق الميزانيات التقديرية بدقة متناهية.', strengths: ['التحليل المالي'] },
      { quarter: 'Q2', year: 2025, score: 4.5, feedback: 'بناء نموذج تدفقات نقدية تنبؤي دقيق.', strengths: ['النمذجة المالية'] },
      { quarter: 'Q3', year: 2025, score: 4.5, feedback: 'مراجعة عقود الموردين وتحقيق وفورات جيدة.', strengths: ['الترشيد المالي'] },
      { quarter: 'Q4', year: 2025, score: 4.6, feedback: 'تقارير مالية تنفيذية ساعدت في تسريع قرارات التوسع.', strengths: ['التقارير التحليلية'] },
    ],
    projects: [
      { id: 'proj-19', title: 'نظام تخطيط الميزانيات الذكي والمراقبة اللحظية', role: 'المشرف المالي للمشروع', outcome: 'تنبؤ دقيق بالانحرافات المالية قبل حدوثها بشهرين.', skillsUsed: ['إدارة ميزانيات التشغيل', 'النمذجة التنبؤية والإحصاء'], year: '2024' },
    ],
    courses: [
      { id: 'c-17', title: 'Chartered Financial Analyst (CFA Level 2)', provider: 'CFA Institute', completionDate: '2024-07' },
    ],
  },

  // Employee 14: ناصر البلوي
  {
    id: 'emp-14',
    name: 'ناصر البلوي',
    title: 'أخصائي إدارة مخزون ومشتريات',
    department: 'العمليات وسلاسل الإمداد',
    experienceYears: 3.8,
    lastPromotionDate: null,
    skills: [
      { id: 'sk-131', name: 'إدارة سلاسل الإمداد والتوريد', level: 4 },
      { id: 'sk-132', name: 'تحسين العمليات وإعادة هندستها', level: 3 },
      { id: 'sk-133', name: 'التفاوض وإبرام الصفقات', level: 3 },
      { id: 'sk-134', name: 'إدارة ميزانيات التشغيل', level: 3 },
      { id: 'sk-135', name: 'تحليل البيانات التشغيلية', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.1, feedback: 'انتظام في توريد المواد الأولية وتجنب نفاد المخزون.', strengths: ['المتابعة اليومية'] },
      { quarter: 'Q2', year: 2025, score: 4.2, feedback: 'تجديد عقود التوريد بأسعار منافسة.', strengths: ['التفاوض'] },
      { quarter: 'Q3', year: 2025, score: 4.3, feedback: 'مراقبة ممتازة لفترات الصلاحية ودوران المخزون.', strengths: ['الدقة'] },
      { quarter: 'Q4', year: 2025, score: 4.4, feedback: 'تحسن مستمر في الأداء الميداني والتقني.', strengths: ['التطور'] },
    ],
    projects: [
      { id: 'proj-20', title: 'خوارزمية إعادة الطلب الآلي للمواد الحيوية', role: 'منسق المشروع', outcome: 'صفر حالات نفاد مخزون طارئة طوال الربع الأخير.', skillsUsed: ['إدارة سلاسل الإمداد والتوريد', 'تحسين العمليات وإعادة هندستها'], year: '2025' },
    ],
    courses: [
      { id: 'c-18', title: 'Certified in Production and Inventory Management (CPIM)', provider: 'ASCM', completionDate: '2024-10' },
    ],
  },

  // Employee 15: بشاير العجلان
  {
    id: 'emp-15',
    name: 'بشاير العجلان',
    title: 'أخصائية تسويق رقمي ونمو أولى',
    department: 'التسويق والمبيعات',
    experienceYears: 4.2,
    lastPromotionDate: null,
    skills: [
      { id: 'sk-141', name: 'استراتيجية المنتجات الرقمية', level: 4 },
      { id: 'sk-142', name: 'تحليل البيانات والمقاييس', level: 4 },
      { id: 'sk-143', name: 'العروض التقديمية والبيع الاستشاري', level: 3 },
      { id: 'sk-144', name: 'تحليل متطلبات المستخدم', level: 3 },
      { id: 'sk-145', name: 'إدارة أولويات المهام', level: 4 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.4, feedback: 'حملات تسويقية أثمرت عن زيادة 40% في عدد الزوار المؤهلين.', strengths: ['التسويق الموجه'] },
      { quarter: 'Q2', year: 2025, score: 4.6, feedback: 'تحليل سلوك المستخدمين على الموقع وتحسين التحويل بنسبة 28%.', strengths: ['تحليل مسار التحويل'] },
      { quarter: 'Q3', year: 2025, score: 4.7, feedback: 'تطبيق تجارب النمو السريع (Growth Experiments) بنجاح فائق.', strengths: ['ابتكار أفكار النمو'] },
      { quarter: 'Q4', year: 2025, score: 4.75, feedback: 'تكامل ممتاز بين خطة التسويق وأهداف المنتج والمبيعات.', strengths: ['التنسيق متعدد الفرق'] },
    ],
    projects: [
      { id: 'proj-21', title: 'حملة إطلاق النسخة الجديدة من التطبيق', role: 'قائدة الحملة الرقمية', outcome: 'اكتساب 45,000 مستخدم نشط في أول شهر من الإطلاق.', skillsUsed: ['استراتيجية المنتجات الرقمية', 'تحليل البيانات والمقاييس'], year: '2025' },
    ],
    courses: [
      { id: 'c-19', title: 'Growth Series Certification', provider: 'Reforge', completionDate: '2025-03' },
    ],
  },

  // Employee 16: زياد المالكي
  {
    id: 'emp-16',
    name: 'زياد المالكي',
    title: 'أخصائي علاقات حكومية وشؤون إدارية',
    department: 'الموارد البشرية والإدارة',
    experienceYears: 5.8,
    lastPromotionDate: '2022-06',
    skills: [
      { id: 'sk-151', name: 'حل المشكلات وإدارة الأزمات', level: 4 },
      { id: 'sk-152', name: 'التواصل مع أصحاب المصلحة', level: 5 },
      { id: 'sk-153', name: 'إدارة ميزانيات التشغيل', level: 3 },
      { id: 'sk-154', name: 'التفاوض وإبرام الصفقات', level: 3 },
      { id: 'sk-155', name: 'إدارة فرق العمل الميدانية', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.3, feedback: 'إنهاء كافة المعاملات والتراخيص الحكومية بلا أي تأخير.', strengths: ['سرعة المعاملات'] },
      { quarter: 'Q2', year: 2025, score: 4.4, feedback: 'تجديد التراخيص البيئية والبلدية لجميع المنشآت بسلاسة.', strengths: ['الامتثال النظامي'] },
      { quarter: 'Q3', year: 2025, score: 4.3, feedback: 'إدارة العلاقات مع الجهات الرسمية بكفاءة عالية.', strengths: ['العلاقات الخارجية'] },
      { quarter: 'Q4', year: 2025, score: 4.4, feedback: 'انضباط واستقرار إداري موثوق.', strengths: ['الموثوقية'] },
    ],
    projects: [
      { id: 'proj-22', title: 'أتمتة التراخيص والتصاريح السنوية عبر المنصات الرقمية', role: 'قائد المشروع الإداري', outcome: 'صفر مخالفات بلدية أو حكومية للعام الثاني على التوالي.', skillsUsed: ['حل المشكلات وإدارة الأزمات', 'التواصل مع أصحاب المصلحة'], year: '2024' },
    ],
    courses: [
      { id: 'c-20', title: 'Corporate Compliance & Legal Regulations', provider: 'King Saud University', completionDate: '2023-10' },
    ],
  },

  // Employee 17: أسماء السالم
  {
    id: 'emp-17',
    name: 'أسماء السالم',
    title: 'أخصائية تجربة عملاء ودعم فني أولى',
    department: 'التسويق والمبيعات',
    experienceYears: 3.5,
    lastPromotionDate: null,
    skills: [
      { id: 'sk-161', name: 'حل المشكلات وإدارة الأزمات', level: 4 },
      { id: 'sk-162', name: 'إدارة علاقات العملاء الاستراتيجيين', level: 3 },
      { id: 'sk-163', name: 'تحليل مؤشرات الاستبقاء والتسرب', level: 3 },
      { id: 'sk-164', name: 'التواصل مع أصحاب المصلحة', level: 4 },
      { id: 'sk-165', name: 'تحليل متطلبات المستخدم', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.2, feedback: 'متوسط وقت الرد على التذاكر أقل من 4 دقائق.', strengths: ['سرعة الاستجابة'] },
      { quarter: 'Q2', year: 2025, score: 4.4, feedback: 'تلقي إشادات متكررة من كبار العملاء على الصبر والاحترافية.', strengths: ['التعامل الإيجابي'] },
      { quarter: 'Q3', year: 2025, score: 4.5, feedback: 'تحليل بلاغات الدعم وتلخيص أهم 5 أخطاء لفريق المنتج لإصلاحها.', strengths: ['الربط بين العميل والمنتج'] },
      { quarter: 'Q4', year: 2025, score: 4.6, feedback: 'مستوى نضج عالٍ في احتواء العملاء الغاضبين وتحويلهم لداعمين.', strengths: ['إدارة شكاوى العملاء'] },
    ],
    projects: [
      { id: 'proj-23', title: 'قاعدة المعرفة الذاتية للعملاء (Help Center)', role: 'معدة المحتوى الرئيسي', outcome: 'انخفاض تذاكر الدعم المتكررة بنسبة 35%.', skillsUsed: ['حل المشكلات وإدارة الأزمات', 'التواصل مع أصحاب المصلحة'], year: '2025' },
    ],
    courses: [
      { id: 'c-21', title: 'Customer Experience Management (CXM)', provider: 'CXPA', completionDate: '2024-05' },
    ],
  },

  // Employee 18: حسام القاضي
  {
    id: 'emp-18',
    name: 'حسام القاضي',
    title: 'مهندس أمن سيبراني أول',
    department: 'الهندسة والتقنية',
    experienceYears: 5.0,
    lastPromotionDate: '2023-08',
    skills: [
      { id: 'sk-171', name: 'أمن المعلومات', level: 5 },
      { id: 'sk-172', name: 'معمارية النظم السحابية', level: 4 },
      { id: 'sk-173', name: 'تطوير البرمجيات الحديثة', level: 3 },
      { id: 'sk-174', name: 'حل المشكلات وإدارة الأزمات', level: 4 },
      { id: 'sk-175', name: 'إدارة مشاريع Agile', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.6, feedback: 'تأمين كامل ضد هجمات الاختراق وحجب الخدمة.', strengths: ['الحماية الاستباقية'] },
      { quarter: 'Q2', year: 2025, score: 4.5, feedback: 'تدريب الموظفين على التصدي لهجمات الهندسة الاجتماعية.', strengths: ['التوعية الأمنية'] },
      { quarter: 'Q3', year: 2025, score: 4.7, feedback: 'الحصول على شهادة الآيزو لأمن المعلومات ISO 27001.', strengths: ['الامتثال الأمني'] },
      { quarter: 'Q4', year: 2025, score: 4.7, feedback: 'أداء أمني صارم واحترافي على كافة المستويات.', strengths: ['حماية البيانات'] },
    ],
    projects: [
      { id: 'proj-24', title: 'مشروع شهادة ISO 27001 ومعايير الهيئة الوطنية للأمن السيبراني', role: 'قائد المشروع الأمني', outcome: 'الامتثال الكامل بنسبة 100% دون أي بند عدم مطابقة.', skillsUsed: ['أمن المعلومات', 'معمارية النظم السحابية'], year: '2025' },
    ],
    courses: [
      { id: 'c-22', title: 'Certified Information Systems Security Professional (CISSP)', provider: 'ISC2', completionDate: '2024-02' },
    ],
  },

  // Employee 19: شهد التميمي
  {
    id: 'emp-19',
    name: 'شهد التميمي',
    title: 'أخصائية عمليات موارد بشرية',
    department: 'الموارد البشرية والإدارة',
    experienceYears: 3.2,
    lastPromotionDate: null,
    skills: [
      { id: 'sk-181', name: 'تحليلات الموارد البشرية', level: 4 },
      { id: 'sk-182', name: 'إدارة الأداء والتطوير', level: 3 },
      { id: 'sk-183', name: 'استقطاب الكفاءات والمواهب', level: 3 },
      { id: 'sk-184', name: 'قواعد بيانات SQL', level: 3 },
      { id: 'sk-185', name: 'التواصل مع أصحاب المصلحة', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.2, feedback: 'انضباط تام في مسيرات الرواتب والمستحقات.', strengths: ['الدقة الإجرائية'] },
      { quarter: 'Q2', year: 2025, score: 4.3, feedback: 'أتمتة طلبات الإجازات والشهادات الإدارية عبر النظام.', strengths: ['التحول الرقمي للـ HR'] },
      { quarter: 'Q3', year: 2025, score: 4.4, feedback: 'إعداد تقارير دورية دقيقة عن معدل الدوران الوظيفي والتوطين.', strengths: ['التقارير التحليلية'] },
      { quarter: 'Q4', year: 2025, score: 4.5, feedback: 'تطور سريع في فهم استراتيجيات إدارة رأس المال البشري.', strengths: ['سرعة التعلم'] },
    ],
    projects: [
      { id: 'proj-25', title: 'تحديث نظام إدارة الموارد البشرية وإطلاق بوابة الخدمة الذاتية', role: 'المشرفة التقنية على النظام', outcome: 'تقليل المعاملات الورقية بنسبة 90% وتسريع الرد على الموظفين.', skillsUsed: ['تحليلات الموارد البشرية', 'التواصل مع أصحاب المصلحة'], year: '2024' },
    ],
    courses: [
      { id: 'c-23', title: 'HR Analytics in Practice', provider: 'AIHR', completionDate: '2025-04' },
    ],
  },

  // Employee 20: بندر القرني
  {
    id: 'emp-20',
    name: 'بندر القرني',
    title: 'مشرف تخطيط ومتابعة عمليات',
    department: 'العمليات وسلاسل الإمداد',
    experienceYears: 4.5,
    lastPromotionDate: '2023-05',
    skills: [
      { id: 'sk-191', name: 'تحسين العمليات وإعادة هندستها', level: 4 },
      { id: 'sk-192', name: 'إدارة سلاسل الإمداد والتوريد', level: 3 },
      { id: 'sk-193', name: 'تحليل البيانات التشغيلية', level: 4 },
      { id: 'sk-194', name: 'إدارة ميزانيات التشغيل', level: 3 },
      { id: 'sk-195', name: 'إدارة فرق العمل الميدانية', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.3, feedback: 'مراقبة ممتازة لسلامة شحنات البضائع والالتزام بالجدول.', strengths: ['المتابعة المستمرة'] },
      { quarter: 'Q2', year: 2025, score: 4.4, feedback: 'اكتشاف سبب التأخير في مرحلة التعبئة ومعالجته.', strengths: ['تحليل المشكلات'] },
      { quarter: 'Q3', year: 2025, score: 4.5, feedback: 'تطبيق لوحة متابعة مؤشرات أداء المشغلين الميدانيين.', strengths: ['إدارة الأداء الميداني'] },
      { quarter: 'Q4', year: 2025, score: 4.5, feedback: 'استقرار تشغيلي وروح قيادية واضحة.', strengths: ['الروح القيادية'] },
    ],
    projects: [
      { id: 'proj-26', title: 'لوحة قياس مؤشرات التوصيل في الوقت المحدد (OTD)', role: 'قائد المشروع التحليلي', outcome: 'رفع نسبة التوصيل في الموعد من 81% إلى 94.5%.', skillsUsed: ['تحسين العمليات وإعادة هندستها', 'تحليل البيانات التشغيلية'], year: '2024' },
    ],
    courses: [
      { id: 'c-24', title: 'Project Management Professional (PMP)', provider: 'PMI', completionDate: '2025-02' },
    ],
  },

  // Employee 21: رانيا الفهد
  {
    id: 'emp-21',
    name: 'رانيا الفهد',
    title: 'أخصائية تسويق محتوى وهوية بصرية',
    department: 'التسويق والمبيعات',
    experienceYears: 3.6,
    lastPromotionDate: null,
    skills: [
      { id: 'sk-201', name: 'العروض التقديمية والبيع الاستشاري', level: 4 },
      { id: 'sk-202', name: 'التواصل مع أصحاب المصلحة', level: 4 },
      { id: 'sk-203', name: 'استراتيجية المنتجات الرقمية', level: 3 },
      { id: 'sk-204', name: 'تحليل متطلبات المستخدم', level: 3 },
      { id: 'sk-205', name: 'تحليل البيانات والمقاييس', level: 2 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.3, feedback: 'كتابة محتوى متقن وقصص نجاح عملاء مقنعة.', strengths: ['السرد القصصي والمحتوى'] },
      { quarter: 'Q2', year: 2025, score: 4.3, feedback: 'توحيد الرسائل التسويقية عبر كافة القنوات والمنصات.', strengths: ['تناغم الهوية'] },
      { quarter: 'Q3', year: 2025, score: 4.5, feedback: 'إطلاق النشرة البريدية المتخصصة واشتراك 8,000 متخصص.', strengths: ['بناء الجمهور'] },
      { quarter: 'Q4', year: 2025, score: 4.5, feedback: 'إبداع مستمر وحرص على تميز مظهر الشركة.', strengths: ['الإبداع التسويقي'] },
    ],
    projects: [
      { id: 'proj-27', title: 'سلسلة دراسات الحالة لقصص نجاح كبرى الشركات مع المنصة', role: 'كاتبة ومنسقة السلسلة', outcome: 'استخدام المواد من قبل فريق المبيعات لإغلاق 14 صفقة رئيسية.', skillsUsed: ['العروض التقديمية والبيع الاستشاري', 'التواصل مع أصحاب المصلحة'], year: '2025' },
    ],
    courses: [
      { id: 'c-25', title: 'Content Strategy for Professionals', provider: 'Northwestern University', completionDate: '2024-03' },
    ],
  },

  // Employee 22: سلمان الخالدي
  {
    id: 'emp-22',
    name: 'سلمان الخالدي',
    title: 'مطور تطبيقات هواتف ذكية رئيسي',
    department: 'الهندسة والتقنية',
    experienceYears: 5.1,
    lastPromotionDate: '2023-04',
    skills: [
      { id: 'sk-211', name: 'تطوير البرمجيات الحديثة', level: 5 },
      { id: 'sk-212', name: 'تحسين أداء الأنظمة', level: 4 },
      { id: 'sk-213', name: 'إدارة مشاريع Agile', level: 3 },
      { id: 'sk-214', name: 'معمارية النظم السحابية', level: 3 },
      { id: 'sk-215', name: 'التوجيه والإرشاد التقني', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.4, feedback: 'كود عالي الكفاءة واستهلاك منخفض لبطارية الهاتف.', strengths: ['كفاءة الأداء'] },
      { quarter: 'Q2', year: 2025, score: 4.5, feedback: 'تحديث تطبيق iOS و Android تزامناً مع إطلاق ميزات المتجر.', strengths: ['السرعة والالتزام'] },
      { quarter: 'Q3', year: 2025, score: 4.6, feedback: 'حل مشكلة إشعارات التطبيق الحرجة بنجاح تام.', strengths: ['التشخيص التقني'] },
      { quarter: 'Q4', year: 2025, score: 4.6, feedback: 'توجيه المطورين المبتدئين في الفريق بكل احتراف.', strengths: ['روح الفريق'] },
    ],
    projects: [
      { id: 'proj-28', title: 'تطبيق التوصيل السريع للسائقين والميدانيين', role: 'كبير مهندسي التطبيقات', outcome: 'انخفاض معدل الأعطال والانهيار إلى أقل من 0.05%.', skillsUsed: ['تطوير البرمجيات الحديثة', 'تحسين أداء الأنظمة'], year: '2024' },
    ],
    courses: [
      { id: 'c-26', title: 'Advanced Mobile Architecture (Flutter & Native)', provider: 'Google Developers', completionDate: '2023-12' },
    ],
  },

  // Employee 23: ليلى باوزير
  {
    id: 'emp-23',
    name: 'ليلى باوزير',
    title: 'أخصائية استراتيجية وتخطيط مؤسسي',
    department: 'الموارد البشرية والإدارة',
    experienceYears: 4.7,
    lastPromotionDate: '2023-11',
    skills: [
      { id: 'sk-221', name: 'تخطيط التعاقب الوظيفي', level: 4 },
      { id: 'sk-222', name: 'تحليلات الموارد البشرية', level: 4 },
      { id: 'sk-223', name: 'التواصل مع أصحاب المصلحة', level: 4 },
      { id: 'sk-224', name: 'إدارة الأداء والتطوير', level: 4 },
      { id: 'sk-225', name: 'تحليل البيانات المتقدم', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.5, feedback: 'مراجعة أهداف الشركة وربطها بمؤشرات أداء الأقسام (OKRs).', strengths: ['التخطيط الاستراتيجي'] },
      { quarter: 'Q2', year: 2025, score: 4.5, feedback: 'تحديد فجوات الكفاءات المطلوبة لمشاريع التوسع القادمة.', strengths: ['تحليل الفجوات'] },
      { quarter: 'Q3', year: 2025, score: 4.7, feedback: 'عرض دراسة جدوى استبقاء الكفاءات على مجلس الإدارة.', strengths: ['العرض التنفيذي'] },
      { quarter: 'Q4', year: 2025, score: 4.75, feedback: 'مبادرات مؤسسية ذات أثر مالي وتشغيلي إيجابي.', strengths: ['الأثر الاستراتيجي'] },
    ],
    projects: [
      { id: 'proj-29', title: 'خارطة التعاقب القيادي للكفاءات الحيوية (Succession Plan)', role: 'المصممة الرئيسية للخطة', outcome: 'تحديد 18 بديلاً جاهزاً للمناصب الحساسة بالشركة.', skillsUsed: ['تخطيط التعاقب الوظيفي', 'تحليلات الموارد البشرية', 'التواصل مع أصحاب المصلحة'], year: '2025' },
    ],
    courses: [
      { id: 'c-27', title: 'Balanced Scorecard & Strategy Execution', provider: 'Palladium Institute', completionDate: '2024-04' },
    ],
  },

  // Employee 24: فيصل الدوسري
  {
    id: 'emp-24',
    name: 'فيصل الدوسري',
    title: 'مشرف مراقبة جودة وسلامة مهنية',
    department: 'العمليات وسلاسل الإمداد',
    experienceYears: 4.0,
    lastPromotionDate: null,
    skills: [
      { id: 'sk-231', name: 'تحسين العمليات وإعادة هندستها', level: 3 },
      { id: 'sk-232', name: 'إدارة فرق العمل الميدانية', level: 4 },
      { id: 'sk-233', name: 'حل المشكلات وإدارة الأزمات', level: 4 },
      { id: 'sk-234', name: 'منهجية لين وسيكس سيغما', level: 3 },
      { id: 'sk-235', name: 'إدارة سلاسل الإمداد والتوريد', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.2, feedback: 'تطبيق صارم لاشتراطات السلامة والبيئة في المستودعات.', strengths: ['السلامة المهنية'] },
      { quarter: 'Q2', year: 2025, score: 4.3, feedback: 'تنفيذ تدريبات إخلاء وهمية وتوعية كاملة للفريق.', strengths: ['التدريب العملي'] },
      { quarter: 'Q3', year: 2025, score: 4.4, feedback: 'تسجيل صفر إصابات عمل خلال الربع الثالث.', strengths: ['النتائج الإيجابية'] },
      { quarter: 'Q4', year: 2025, score: 4.4, feedback: 'انضباط ميداني يستحق التقدير.', strengths: ['المتابعة الحثيثة'] },
    ],
    projects: [
      { id: 'proj-30', title: 'نظام التدقيق الرقمي لمعايير السلامة والصحة المهنية (OSHA)', role: 'مشرف الامتثال', outcome: 'اجتياز التفتيش الرقابي دون أي مخالفة تشغيلية.', skillsUsed: ['حل المشكلات وإدارة الأزمات', 'إدارة فرق العمل الميدانية'], year: '2024' },
    ],
    courses: [
      { id: 'c-28', title: 'NEBOSH International General Certificate', provider: 'NEBOSH', completionDate: '2023-08' },
    ],
  },

  // Employee 25: أميرة الصالح
  {
    id: 'emp-25',
    name: 'أميرة الصالح',
    title: 'أخصائية مبيعات استراتيجية وشراكات',
    department: 'التسويق والمبيعات',
    experienceYears: 4.4,
    lastPromotionDate: '2023-07',
    skills: [
      { id: 'sk-241', name: 'التفاوض وإبرام الصفقات', level: 4 },
      { id: 'sk-242', name: 'إدارة علاقات العملاء الاستراتيجيين', level: 4 },
      { id: 'sk-243', name: 'العروض التقديمية والبيع الاستشاري', level: 4 },
      { id: 'sk-244', name: 'تحليل مؤشرات الاستبقاء والتسرب', level: 3 },
      { id: 'sk-245', name: 'حل المشكلات وإدارة الأزمات', level: 3 },
    ],
    reviews: [
      { quarter: 'Q1', year: 2025, score: 4.5, feedback: 'فتح قنوات شراكة مع 4 بنوك كبرى لدعم خدمات الدفع.', strengths: ['توسيع الشراكات'] },
      { quarter: 'Q2', year: 2025, score: 4.5, feedback: 'تجاوز الهدف المالي الفصلي بنسبة 115%.', strengths: ['تحقيق المبيعات'] },
      { quarter: 'Q3', year: 2025, score: 4.6, feedback: 'مهارة فائقة في التفاوض على الشروط التجارية الصعبة.', strengths: ['التفاوض المالي'] },
      { quarter: 'Q4', year: 2025, score: 4.7, feedback: 'شخصية قيادية ملهمة ومرجع لفريق المبيعات في صفقات العقود الكبرى.', strengths: ['التأثير والقيادة'] },
    ],
    projects: [
      { id: 'proj-31', title: 'اتفاقية الربط الحصري مع شبكة المتاجر الوطنية', role: 'قائدة المفاوضات التجارية', outcome: 'تأمين إيرادات سنوية مضمونة تتجاوز 2.4 مليون ريال.', skillsUsed: ['التفاوض وإبرام الصفقات', 'إدارة علاقات العملاء الاستراتيجيين'], year: '2025' },
    ],
    courses: [
      { id: 'c-29', title: 'Strategic Negotiation & Dealmaking', provider: 'Harvard Division of Continuing Education', completionDate: '2024-11' },
    ],
  },
];

// بيانات مهام شهرية تجريبية (آخر 6 أشهر من 2025) مشتقة من تقييم كل ربع، حتى تكون متسقة مع بقية البيانات
const SAMPLE_MONTHS: { month: string; quarter: 'Q3' | 'Q4' }[] = [
  { month: '2025-07', quarter: 'Q3' },
  { month: '2025-08', quarter: 'Q3' },
  { month: '2025-09', quarter: 'Q3' },
  { month: '2025-10', quarter: 'Q4' },
  { month: '2025-11', quarter: 'Q4' },
  { month: '2025-12', quarter: 'Q4' },
];

// أيام العمل (الأحد إلى الخميس) من 1 إلى 25 ديسمبر 2025
const SAMPLE_WORK_DAYS = [
  '2025-12-01', '2025-12-02', '2025-12-03', '2025-12-04',
  '2025-12-07', '2025-12-08', '2025-12-09', '2025-12-10', '2025-12-11',
  '2025-12-14', '2025-12-15', '2025-12-16', '2025-12-17', '2025-12-18',
  '2025-12-21', '2025-12-22', '2025-12-23', '2025-12-24', '2025-12-25',
];

// حجم العمل وتفاوت الإنجاز يختلفان من يوم لآخر حتى تظهر الحركة في اللوحة
const SAMPLE_DAY_LOAD = [2, 3, 1, 2, 0, 3, 2, 1, 3, 2];
const SAMPLE_DAY_SHIFT = [0.02, -0.1, 0.05, -0.18, 0.06, 0, -0.07, 0.07, -0.12, 0.04];

function withSampleTasks(employee: Employee, index: number): Employee {
  const monthlyTasks = SAMPLE_MONTHS.map(({ month, quarter }, m) => {
    const score = employee.reviews.find(r => r.quarter === quarter && r.year === 2025)?.score ?? 4.3;
    const assigned = 18 + ((index * 7 + m * 3) % 8);
    const rate = Math.min(1, Math.max(0.6, 0.6 + (score - 4.0) * 0.42 + (((index + m) % 3) - 1) * 0.02));
    return { month, assigned, completed: Math.round(assigned * rate) };
  });
  // المهام اليومية لشهر ديسمبر 2025 حتى يوم 25
  const q4Score = employee.reviews.find(r => r.quarter === 'Q4' && r.year === 2025)?.score ?? 4.3;
  const dailyTasks = SAMPLE_WORK_DAYS.map((date, d) => {
    const p = (d - (SAMPLE_WORK_DAYS.length - 10) + 10) % 10; // نمط يتكرر كل 10 أيام عمل
    const assigned = 3 + SAMPLE_DAY_LOAD[p] + ((index + p) % 2);
    const rate = Math.min(
      1,
      Math.max(0.4, 0.6 + (q4Score - 4.0) * 0.42 + SAMPLE_DAY_SHIFT[p] + (((index * 3 + p) % 4) - 1.5) * 0.05)
    );
    return { date, assigned, completed: Math.min(assigned, Math.round(assigned * rate)) };
  });

  return { ...employee, monthlyTasks, dailyTasks };
}

export const INITIAL_EMPLOYEES: Employee[] = BASE_EMPLOYEES.map(withSampleTasks);

// مشروع تجريبي واحد حتى لا تبدأ صفحة المشاريع فارغة
export const INITIAL_PROJECTS: CompanyProject[] = [
  {
    id: 'project-sample-1',
    title: 'لوحة مؤشرات المبيعات للإدارة',
    summary: 'بناء لوحة تجمع بيانات المبيعات من قواعد البيانات وتعرضها للإدارة العليا بمؤشرات واضحة.',
    teamSize: 3,
    skills: [
      { name: 'قواعد بيانات SQL', level: 4 },
      { name: 'بناء لوحات Power BI و Tableau', level: 4 },
      { name: 'تحليل البيانات والمقاييس', level: 3 },
      { name: 'التواصل مع أصحاب المصلحة', level: 3 },
      { name: 'إدارة مشاريع Agile', level: 3 },
    ],
  },
  {
    id: 'project-sample-2',
    title: 'مساعد ذكي لخدمة العملاء',
    summary: 'بناء مساعد محادثة يجيب على استفسارات العملاء تلقائياً ويؤتمت تحويلها، مع ربطه بنظام علاقات العملاء.',
    teamSize: 3,
    skills: [
      { name: 'أتمتة سير العمل بالذكاء الاصطناعي', level: 3 },
      { name: 'تطوير البرمجيات الحديثة', level: 4 },
      { name: 'إدارة علاقات العملاء الاستراتيجيين', level: 3 },
      { name: 'أمن المعلومات', level: 3 },
    ],
  },
];
