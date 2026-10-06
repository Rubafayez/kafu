import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

// تطبيق Express فيه كل مسارات الذكاء الاصطناعي. يُشغَّل محلياً من server.ts، وعلى Netlify من netlify/functions/api.ts
export const app = express();

// اسم موديل Gemini: يمكن تغييره بمتغير البيئة GEMINI_MODEL بدون تعديل الكود
// الافتراضي هو الأسرع في القياس على الموقع المنشور (حوالي نصف ثانية للطلب الصغير)
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// الحد مرفوع لأن ملفات PDF تُرسل داخل الطلب
app.use(express.json({ limit: '20mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    timeout: 50000, // لا ننتظر Gemini أكثر من 50 ثانية
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// لو الموديل الأساسي مزدحم أو غير متاح للمفتاح، نجرّب الذي بعده بدل أن يفشل الطلب.
// القائمة تُغيَّر بمتغير البيئة GEMINI_FALLBACK_MODELS (أسماء مفصولة بفواصل).
const MODELS = [
  MODEL,
  ...(process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.8-flash,gemini-3.5-flash')
    .split(',')
    .map(m => m.trim())
    .filter(m => m && m !== MODEL),
];
const RETRYABLE = /503|UNAVAILABLE|high demand|overloaded|429|RESOURCE_EXHAUSTED|404|NOT_FOUND/i;

type GenerateParams = Omit<Parameters<typeof ai.models.generateContent>[0], 'model'>;

async function generate(params: GenerateParams) {
  let lastError: unknown;
  for (const model of MODELS) {
    try {
      return await ai.models.generateContent({ ...params, model });
    } catch (error: any) {
      lastError = error;
      if (!RETRYABLE.test(String(error?.message))) throw error;
      console.warn(`Gemini model ${model} unavailable, trying the next one.`);
    }
  }
  throw lastError;
}

/**
 * AI hiring profile for a team's uncovered skills: why now, hire or develop, the role, interview questions, and a ready post
 */
app.post('/api/generate-hiring-profile', async (req, res) => {
  try {
    const { department, teamSize, coverageBefore, coverageAfter, capacity, skills } = req.body;

    if (!department || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: 'اختر مهارة واحدة على الأقل لكتابة مواصفات الوظيفة.' });
    }

    const prompt = `أنت مستشار توظيف في منصة "كفء". فريق "${department}" عدد أعضائه ${teamSize}.

المهارات المطلوبة في الموظف الجديد (المستوى من 5):
${JSON.stringify(skills)}

شرح الحقول: status = missing لا أحد يتقنها، thin شخص واحد فقط، custom أضافها المدير. internalLearners موظفون عندهم المهارة بمستوى أقل من المطلوب. developable = true إذا كان أحدهم ينقصه مستوى واحد فقط.

تغطية مهارات الفريق: ${coverageBefore}% الآن، وتصير ${coverageAfter}% بعد التوظيف.
طاقة الفريق: ${capacity ? JSON.stringify(capacity) : 'غير متوفرة'}
(typicalDailyCompleted ما ينجزه الفريق يومياً، averageDailyAssigned ما يُسند إليه، daysAboveCapacity عدد الأيام فوق الطاقة من totalDays)

اكتب ملف توظيف يساعد المدير على القرار، لا مجرد وصف وظيفي:

1. whyNow: لماذا يحتاج الفريق هذا الموظف الآن، في جملتين، بأرقام من المعطيات (التغطية، أو الأيام فوق الطاقة، أو مهارة عند شخص واحد).
2. recommendation: قرار صريح.
   - "develop" إذا كانت كل المهارات المختارة developable = true: التطوير الداخلي يكفي، واذكر من يُطوَّر.
   - "both" إذا كان بعضها developable وبعضها لا: وظّف للمهارات المفقودة وطوّر الباقي داخلياً، واذكر أيها.
   - "hire" إذا لم تكن أي منها developable.
   السبب في جملة أو جملتين.
3. title: مسمى وظيفي واحد واقعي يجمع هذه المهارات. إذا كانت المهارات متباعدة لا يجمعها شخص واحد عادةً، قل ذلك في السبب واقترح المسمى للمجموعة الأهم.
4. seniority: مبتدئ أو متوسط أو أول، بحسب المستويات المطلوبة (4 فأعلى = أول). و experienceYears رقم مناسب للمستوى.
5. responsibilities: من 3 إلى 5 مهام، كل واحدة مرتبطة بمهارة من القائمة.
6. mustHave: من 3 إلى 5 متطلبات أساسية. niceToHave: حتى 3 متطلبات إضافية، أو قائمة فارغة.
7. postText: نص إعلان الوظيفة جاهز للنشر، من 60 إلى 90 كلمة، يبدأ بالمسمى، ثم ما سيعمله الموظف، ثم المتطلبات باختصار. بدون رموز تعبيرية وبدون ذكر راتب.

قواعد حاسمة:
- اعتمد فقط على المعطيات. لا تضف مهارات أو شهادات أو أرقاماً من عندك.
- لا تذكر العمر أو الجنس أو الجنسية في أي جزء.
- عربية بسيطة وجمل قصيرة.`;

    const response = await generate({
      contents: prompt,
      config: {
        systemInstruction: 'أنت مستشار توظيف موضوعي يلتزم بالمعطيات فقط، يعطي قراراً صريحاً، ويكتب بالعربية بصيغة JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            seniority: { type: Type.STRING, description: 'مبتدئ أو متوسط أو أول' },
            experienceYears: { type: Type.INTEGER },
            whyNow: { type: Type.STRING },
            recommendation: {
              type: Type.OBJECT,
              properties: {
                decision: { type: Type.STRING, enum: ['hire', 'develop', 'both'] },
                reason: { type: Type.STRING },
              },
              required: ['decision', 'reason'],
            },
            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            mustHave: { type: Type.ARRAY, items: { type: Type.STRING } },
            niceToHave: { type: Type.ARRAY, items: { type: Type.STRING } },
            postText: { type: Type.STRING },
          },
          required: [
            'title',
            'seniority',
            'experienceYears',
            'whyNow',
            'recommendation',
            'responsibilities',
            'mustHave',
            'niceToHave',
            'postText',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('لم يتم استلام نص من نموذج الذكاء الاصطناعي.');
    }

    const data = JSON.parse(text);
    if (
      typeof data.title !== 'string' ||
      !data.recommendation ||
      !Array.isArray(data.responsibilities) ||
      !Array.isArray(data.mustHave) ||
      typeof data.postText !== 'string'
    ) {
      throw new Error('صيغة الرد غير متوقعة.');
    }
    return res.json({
      ...data,
      niceToHave: Array.isArray(data.niceToHave) ? data.niceToHave : [],
    });
  } catch (error: any) {
    console.error('Error in generate-hiring-profile:', error);
    return res.status(500).json({
      error: 'تعذر كتابة مواصفات الوظيفة بالذكاء الاصطناعي. حاول مرة أخرى.',
      details: error.message,
    });
  }
});

/**
 * AI analysis of a team's work tracking. The numbers are computed in code (facts); the model finds what they mean.
 */
app.post('/api/analyze-workflow', async (req, res) => {
  try {
    const { department, facts } = req.body;

    if (!department || !facts || !Array.isArray(facts.weekdays) || facts.weekdays.length === 0) {
      return res.status(400).json({ error: 'لا توجد بيانات مهام كافية للتحليل.' });
    }

    const prompt = `أنت محلل أداء في منصة "كفء". هذه حقائق محسوبة عن سير عمل فريق "${department}":

${JSON.stringify(facts)}

شرح الحقول:
- weekdays: نسبة الإنجاز لكل يوم من أيام الأسبوع عبر كل الأسابيع.
- weeks: نسبة الإنجاز لكل أسبوع بالترتيب الزمني.
- heaviestDays و lightestDays: أكثر الأيام وأقلها تكليفاً مع نسبة الإنجاز فيها.
- load: متوسط المهام اليومية المسندة لكل موظف ونسبة إنجازه.
- capacity: typicalDailyCompleted عدد المهام التي ينجزها الفريق في اليوم عادةً (طاقته الفعلية)، averageDailyAssigned متوسط ما يُسند إليه يومياً، daysAboveCapacity عدد الأيام التي أُسند فيها أكثر من طاقته من أصل totalDays.
- unfinished: المهام التي لم تُنجز في الفترة كلها، ومتوسطها في الأسبوع.
- rebalance: إعادة توزيع محسوبة مسبقاً (من أي يوم إلى أي يوم وكم مهمة). قد تكون null.
- potentialGain: عدد المهام الإضافية التي يمكن إنجازها في الفترة لو نُقل الزائد عن طاقة الفريق من الأيام المزدحمة إلى الأيام التي فيها متسع. رقم محافظ، لا يفترض أن الفريق ينجز أكثر من طاقته.

المدير يرى على الشاشة مسبقاً: نسبة الإنجاز العامة، وعدد المهام، ونسبة كل موظف. لا تكرر هذه الأرقام. مهمتك أن تخبره بما لا يراه.

ابحث عن هذه الأنماط واذكر منها ما تدعمه الأرقام فقط:
1. نمط أسبوعي: هل يوم معيّن من الأسبوع ينخفض فيه الإنجاز بشكل متكرر؟ قارن أدنى يوم بأعلى يوم.
2. علاقة الحمل بالإنجاز: هل تنخفض النسبة في الأيام الأعلى تكليفاً مقارنة بالأقل تكليفاً؟
3. الاتجاه: هل النسبة تتحسن أم تتراجع أم ثابتة من أسبوع لآخر؟
4. توزيع الحمل: هل المهام موزعة بالتساوي بين الموظفين أم هناك فرق واضح في المتوسط اليومي؟
5. الطاقة مقابل التكليف: هل يُسند للفريق أكثر مما ينجز عادةً؟ كم يوماً؟ وكم مهمة تتراكم دون إنجاز أسبوعياً؟
6. نقطة قوة واحدة إن وُجدت.

قواعد حاسمة:
- من 2 إلى 3 ملاحظات فقط، الأهم أولاً.
- كل ملاحظة: عنوان قصير (حتى 6 كلمات)، دليل في جملة واحدة فيها الأرقام، ثم معناها للمدير في جملة واحدة.
- لا ترتّب الموظفين ولا تصف أحداً بأنه الأضعف أو الأقل. تحدث عن توزيع المهام لا عن الأشخاص.
- لا تختلق أسباباً غير موجودة في البيانات. إذا لم يكن السبب معروفاً فقل ما يحتاج المدير أن يتحقق منه.
- الإجراء يجب أن يكون قابلاً للتنفيذ غداً وبأرقام من الحقائق: استخدم rebalance (من أي يوم إلى أي يوم وكم مهمة) إن وُجد، واقترح سقفاً يومياً للتكليف قريباً من typicalDailyCompleted. من خطوة إلى ثلاث خطوات قصيرة.
- الأثر المتوقع (impact): جملة واحدة فيها رقم من potentialGain أو unfinished، مثل عدد المهام الإضافية المتوقع إنجازها شهرياً. لا تبالغ ولا تعد بنسبة لم تُحسب.
- لا تكتب ملاحظة يعرفها المدير من نظرة على الشاشة. كل ملاحظة يجب أن تغيّر قراراً: ماذا يُسند، ومتى، ولمن.
- عربية بسيطة وجمل قصيرة يفهمها غير المتخصص.`;

    const response = await generate({
      contents: prompt,
      config: {
        systemInstruction: 'أنت محلل أداء موضوعي يلتزم بالأرقام المعطاة فقط، يبحث عن الأنماط لا عن الأشخاص، ويكتب بالعربية بصيغة JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: {
              type: Type.STRING,
              description: 'جملة واحدة قصيرة تقول أهم ما اكتُشف، بدون تكرار نسبة الإنجاز العامة',
            },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kind: {
                    type: Type.STRING,
                    enum: ['pattern', 'load', 'trend', 'strength'],
                    description: 'pattern نمط أسبوعي، load علاقة الحمل أو توزيعه، trend الاتجاه عبر الأسابيع، strength نقطة قوة',
                  },
                  title: { type: Type.STRING, description: 'عنوان قصير حتى 6 كلمات' },
                  evidence: { type: Type.STRING, description: 'الدليل في جملة واحدة فيها الأرقام' },
                  meaning: { type: Type.STRING, description: 'ماذا يعني هذا للمدير، في جملة واحدة' },
                },
                required: ['kind', 'title', 'evidence', 'meaning'],
              },
            },
            action: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'الإجراء المقترح في عبارة قصيرة' },
                steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'من خطوة إلى ثلاث خطوات محددة بأرقام' },
                impact: { type: Type.STRING, description: 'الأثر المتوقع في جملة واحدة فيها رقم من الحقائق' },
              },
              required: ['title', 'steps', 'impact'],
            },
          },
          required: ['headline', 'findings', 'action'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('لم يتم استلام نص من نموذج الذكاء الاصطناعي.');
    }

    const data = JSON.parse(text);
    if (
      typeof data.headline !== 'string' ||
      !Array.isArray(data.findings) ||
      data.findings.length === 0 ||
      !data.action ||
      !Array.isArray(data.action.steps)
    ) {
      throw new Error('صيغة الرد غير متوقعة.');
    }
    return res.json(data);
  } catch (error: any) {
    console.error('Error in analyze-workflow:', error);
    return res.status(500).json({
      error: 'تعذر تحليل سير العمل بالذكاء الاصطناعي. حاول مرة أخرى.',
      details: error.message,
    });
  }
});

/**
 * API endpoint to write a short development plan from the gaps (computed in code) that keep an employee from a promotion
 */
app.post('/api/promotion-plan', async (req, res) => {
  try {
    const { employeeName, roleTitle, gaps } = req.body;

    if (!employeeName || !roleTitle || !Array.isArray(gaps) || gaps.length === 0) {
      return res.status(400).json({ error: 'لا توجد نواقص لكتابة خطة.' });
    }

    const prompt = `أنت مستشار تطوير مهني في منصة "كفء". الموظف "${employeeName}" مرشح لمنصب "${roleTitle}" لكنه لم يتأهل بعد.

هذه كل النواقص التي تفصله عن المنصب، محسوبة من معايير الشركة:
${gaps.map((g: string, i: number) => `${i + 1}. ${g}`).join('\n')}

اكتب خطة قصيرة تساعد مديره على إيصاله للمنصب:

1. summary: جملة واحدة قصيرة تبدأ بـ "باقي له" ثم عدد النواقص، ثم أهمها. مثال على الصيغة فقط: "باقي له 3 نواقص، أهمها رفع مهارة القيادة."
2. steps: ثلاث خطوات بالضبط، مرتبة من الأسهل والأسرع إلى الأطول. كل خطوة:
   - kind: نوع الخطوة: course إذا كانت دورة أو تدريباً، mentoring إذا كانت توجيهاً من مدير أو زميل، project إذا كانت مشروعاً أو مهمة عملية يقودها، practice إذا كانت ممارسة ضمن عمله اليومي.
   - title: عنوان قصير حتى 5 كلمات.
   - action: ماذا يفعل الموظف أو مديره بالتحديد، في جملة أو جملتين. اربطها بنقص محدد من القائمة.
   - duration: مدة تقريبية واقعية مثل "أسبوعان" أو "شهران".
   - doneWhen: كيف نعرف أن الخطوة اكتملت، بمعيار يمكن التحقق منه، ويفضّل أن يستخدم رقماً من القائمة.
   إذا كانت النواقص أقل من ثلاث، قسّم أكبرها إلى مراحل. إذا كانت أكثر، اجمع المتشابه.

قواعد حاسمة:
- اعتمد فقط على النواقص المذكورة. لا تضف شروطاً أو مهارات أو أرقاماً من عندك.
- لا تذكر أسماء دورات أو شهادات أو جهات تدريب محددة، ولا تصفها بأوصاف مثل "معتمدة" أو "متقدمة". قل نوع النشاط فقط (دورة، مشروع عملي، توجيه من زميل).
- action جملة واحدة قصيرة حتى 20 كلمة، و doneWhen حتى 12 كلمة، لأنها تُعرض في مسار مختصر.
- لا تعِد بالترقية. الخطة تؤهله للترشيح، والقرار للإدارة.
- عربية بسيطة وجمل قصيرة.`;

    const response = await generate({
      contents: prompt,
      config: {
        systemInstruction: 'أنت مستشار تطوير مهني عملي يلتزم بالمعطيات فقط، ويكتب بالعربية بصيغة JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'جملة واحدة تلخص ما يفصله عن المنصب' },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kind: {
                    type: Type.STRING,
                    enum: ['course', 'mentoring', 'project', 'practice'],
                    description: 'course دورة أو تدريب، mentoring توجيه، project مشروع عملي، practice ممارسة يومية',
                  },
                  title: { type: Type.STRING, description: 'عنوان قصير حتى 5 كلمات' },
                  action: { type: Type.STRING, description: 'ماذا يُفعل بالتحديد، في جملة واحدة قصيرة' },
                  duration: { type: Type.STRING, description: 'مدة تقريبية' },
                  doneWhen: { type: Type.STRING, description: 'معيار اكتمال يمكن التحقق منه' },
                },
                required: ['kind', 'title', 'action', 'duration', 'doneWhen'],
              },
            },
          },
          required: ['summary', 'steps'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('لم يتم استلام نص من نموذج الذكاء الاصطناعي.');
    }

    const data = JSON.parse(text);
    if (typeof data.summary !== 'string' || !Array.isArray(data.steps) || data.steps.length === 0) {
      throw new Error('صيغة الرد غير متوقعة.');
    }
    return res.json(data);
  } catch (error: any) {
    console.error('Error in promotion-plan:', error);
    return res.status(500).json({
      error: 'تعذر كتابة الخطة بالذكاء الاصطناعي. حاول مرة أخرى.',
      details: error.message,
    });
  }
});

/**
 * AI extraction of a project's needs from a PDF brief or a free-text description
 */
app.post('/api/extract-project', async (req, res) => {
  try {
    const { text, pdfBase64, knownSkills } = req.body;
    const hasText = typeof text === 'string' && text.trim().length > 0;
    const hasPdf = typeof pdfBase64 === 'string' && pdfBase64.length > 0;

    if (!hasText && !hasPdf) {
      return res.status(400).json({ error: 'ارفع ملف المشروع أو اكتب وصفه.' });
    }

    const prompt = `أنت محلل مشاريع في منصة "كفء". اقرأ ${hasPdf ? 'ملف المشروع المرفق' : 'وصف المشروع التالي'} واستخرج ما يحتاجه المشروع من فريق العمل.
${hasText ? `\nوصف المشروع:\n${text}\n` : ''}
مهارات موظفي الشركة الحالية:
${JSON.stringify(Array.isArray(knownSkills) ? knownSkills : [])}

قواعد حاسمة:
1. استخرج المهارات التي يحتاجها تنفيذ المشروع فعلاً، من 3 إلى 8 مهارات.
2. إذا كانت المهارة موجودة في قائمة مهارات الشركة أو تطابقها في المعنى، استخدم اسمها من القائمة حرفياً. وإذا لم تكن موجودة، اكتب اسماً عربياً قصيراً وواضحاً لها.
3. حدد مستوى كل مهارة من 3 إلى 5 (3 جيد، 4 متقدم، 5 خبير).
4. اقترح حجم الفريق من 2 إلى 6 أشخاص بحسب حجم العمل المذكور. إذا ذُكر العدد صراحة فاستخدمه.
5. لا تختلق تفاصيل غير موجودة في ${hasPdf ? 'الملف' : 'الوصف'}.`;

    const parts: any[] = [];
    if (hasPdf) {
      parts.push({ inlineData: { mimeType: 'application/pdf', data: pdfBase64 } });
    }
    parts.push({ text: prompt });

    const response = await generate({
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: 'أنت محلل مشاريع دقيق يستخرج المتطلبات من المستندات كما هي ويكتب بالعربية بصيغة JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'اسم المشروع بالعربية' },
            summary: { type: Type.STRING, description: 'جملتان تلخصان هدف المشروع' },
            teamSize: { type: Type.INTEGER, description: 'عدد أعضاء الفريق المقترح' },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'اسم المهارة' },
                  level: { type: Type.INTEGER, description: 'المستوى المطلوب من 3 إلى 5' },
                },
                required: ['name', 'level'],
              },
            },
          },
          required: ['title', 'summary', 'teamSize', 'skills'],
        },
      },
    });

    const raw = response.text;
    if (!raw) {
      throw new Error('لم يتم استلام نص من نموذج الذكاء الاصطناعي.');
    }

    const data = JSON.parse(raw);
    if (typeof data.title !== 'string' || !Array.isArray(data.skills) || data.skills.length === 0) {
      throw new Error('صيغة الرد غير متوقعة.');
    }
    return res.json({
      title: data.title,
      summary: typeof data.summary === 'string' ? data.summary : '',
      teamSize: Math.min(6, Math.max(2, Number(data.teamSize) || 3)),
      skills: data.skills
        .filter((s: any) => s && typeof s.name === 'string' && s.name.trim().length > 0)
        .map((s: any) => ({ name: s.name.trim(), level: Math.min(5, Math.max(3, Number(s.level) || 3)) })),
    });
  } catch (error: any) {
    console.error('Error in extract-project:', error);
    return res.status(500).json({
      error: 'تعذر قراءة المشروع بالذكاء الاصطناعي. حاول مرة أخرى، أو أدخل البيانات يدوياً.',
      details: error.message,
    });
  }
});

/**
 * AI extraction of an employee profile from a CV (PDF)
 */
app.post('/api/extract-cv', async (req, res) => {
  try {
    const { pdfBase64, knownSkills, departments } = req.body;

    if (typeof pdfBase64 !== 'string' || pdfBase64.length === 0) {
      return res.status(400).json({ error: 'ارفع ملف السيرة الذاتية بصيغة PDF.' });
    }

    const prompt = `أنت مختص موارد بشرية في منصة "كفء". اقرأ السيرة الذاتية المرفقة واستخرج منها ما يلزم لبناء ملف موظف.

أقسام الشركة:
${JSON.stringify(Array.isArray(departments) ? departments : [])}

مهارات موظفي الشركة الحالية:
${JSON.stringify(Array.isArray(knownSkills) ? knownSkills : [])}

قواعد حاسمة:
1. استخرج فقط ما هو مكتوب في السيرة. لا تختلق مهارات أو مشاريع أو دورات أو أرقاماً.
2. المهارات: من 4 إلى 10 مهارات مهنية. إذا كانت المهارة موجودة في قائمة مهارات الشركة أو تطابقها في المعنى، استخدم اسمها من القائمة حرفياً. وإلا اكتب اسماً عربياً قصيراً لها.
3. مستوى كل مهارة من 1 إلى 5 بحسب ما تدل عليه السيرة: سنوات استخدامها، ودوره فيها (منفّذ، قائد)، والشهادات. إذا لم يكن هناك دليل كافٍ فاجعله 3.
4. سنوات الخبرة: احسبها من تواريخ الوظائف في السيرة.
5. القسم: اختر الأنسب من أقسام الشركة المذكورة حرفياً.
6. لا تستخرج العمر أو الجنس أو الجنسية أو الحالة الاجتماعية أو أرقام التواصل أو العنوان.
7. اكتب كل شيء بالعربية ما عدا أسماء التقنيات والشهادات.`;

    const response = await generate({
      contents: [
        {
          role: 'user',
          parts: [{ inlineData: { mimeType: 'application/pdf', data: pdfBase64 } }, { text: prompt }],
        },
      ],
      config: {
        systemInstruction: 'أنت مختص موارد بشرية دقيق يستخرج البيانات من السير الذاتية كما هي دون إضافة، بصيغة JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'اسم صاحب السيرة' },
            title: { type: Type.STRING, description: 'آخر مسمى وظيفي' },
            department: { type: Type.STRING, description: 'القسم الأنسب من أقسام الشركة' },
            experienceYears: { type: Type.NUMBER, description: 'إجمالي سنوات الخبرة' },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.INTEGER, description: 'من 1 إلى 5' },
                },
                required: ['name', 'level'],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  role: { type: Type.STRING },
                  outcome: { type: Type.STRING, description: 'النتيجة كما وردت في السيرة' },
                  year: { type: Type.STRING },
                },
                required: ['title', 'role', 'outcome', 'year'],
              },
            },
            courses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  provider: { type: Type.STRING },
                  completionDate: { type: Type.STRING, description: 'بصيغة YYYY-MM' },
                },
                required: ['title', 'provider', 'completionDate'],
              },
            },
          },
          required: ['name', 'title', 'department', 'experienceYears', 'skills', 'projects', 'courses'],
        },
      },
    });

    const raw = response.text;
    if (!raw) {
      throw new Error('لم يتم استلام نص من نموذج الذكاء الاصطناعي.');
    }

    const data = JSON.parse(raw);
    if (typeof data.name !== 'string' || !Array.isArray(data.skills) || data.skills.length === 0) {
      throw new Error('صيغة الرد غير متوقعة.');
    }
    return res.json({
      name: data.name.trim(),
      title: typeof data.title === 'string' ? data.title.trim() : '',
      department: typeof data.department === 'string' ? data.department : '',
      experienceYears: Math.max(0, Math.round((Number(data.experienceYears) || 0) * 10) / 10),
      skills: data.skills
        .filter((s: any) => s && typeof s.name === 'string' && s.name.trim().length > 0)
        .map((s: any) => ({ name: s.name.trim(), level: Math.min(5, Math.max(1, Number(s.level) || 3)) })),
      projects: Array.isArray(data.projects) ? data.projects : [],
      courses: Array.isArray(data.courses) ? data.courses : [],
    });
  } catch (error: any) {
    console.error('Error in extract-cv:', error);
    return res.status(500).json({
      error: 'تعذر قراءة السيرة الذاتية بالذكاء الاصطناعي. حاول مرة أخرى، أو أدخل البيانات يدوياً.',
      details: error.message,
    });
  }
});
