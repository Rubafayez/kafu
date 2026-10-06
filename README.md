<p align="center">
  <img src="kafu-logo.png" width="300" alt="Kafu logo">
</p>

<h1 align="center">Kafu — كفء</h1>

<p align="center">
  <b>لوحة للمدير توضّح ما ينقص كل فريق من مهارات،<br>
  وتقترح من يُوظَّف ومن يُرقّى ومن يناسب كل مشروع.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white">
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white">
</p>

<p align="center">
  <a href="https://kafu-app.netlify.app"><b>جرّب اللوحة →</b></a>
</p>

---

## المشكلة

المدير يعرف أن فريقه متأخر، لكنه لا يعرف **أي مهارة بالتحديد** هي السبب. فيوظّف بناءً على انطباع، ويرقّي بناءً على أقدمية، ويوزّع المشاريع على من يملك وقتاً لا على من يملك المهارة.

كفء يحوّل هذا إلى أرقام: يقيس تغطية كل مهارة في الفريق، ويبيّن الفجوة، ثم يكتب ملف الشخص الذي يسدّها.

نموذج أولي بُني في هاكاثون BUILDx (مسار مهارة).

## ماذا يفعل

- **المتابعة:** إنجاز المهام يومياً لكل فريق، والمهارات الناقصة، ومن يستحق الترقية.
- **صفحة الفريق:** تحليل سير العمل، ورسم يبيّن من يتقن كل مهارة، وأثر توظيف شخص جديد على تغطية المهارات.
- **المشاريع:** ترفع وصف المشروع (PDF أو نص) فيرشّح فريقاً يغطي مهاراته، ويبيّن ما لا يتقنه أحد في الشركة.
- **الترقيات:** المؤهلون لكل منصب ومقارنتهم، وخطة «كيف يوصل؟» لمن ينقصه شيء.
- **الموظفون:** الملفات، وإضافة موظف من سيرته الذاتية (PDF).

## الذكاء الاصطناعي

الأرقام والقرارات تُحسب في الكود. الذكاء الاصطناعي (Gemini) يكتب ويفسّر فقط:

| الميزة | ماذا يفعل |
|---|---|
| تحليل سير العمل | يقرأ حقائق المهام المحسوبة ويستخرج الأنماط وإجراءً مقترحاً |
| ملف التوظيف | يكتب لماذا التوظيف الآن، والتوصية، والمهام، والمتطلبات، ونص الإعلان |
| قراءة ملف المشروع | يستخرج العنوان وحجم الفريق والمهارات من PDF أو نص |
| قراءة السيرة الذاتية | يستخرج الاسم والمسمى والخبرة والمهارات من PDF |
| خطة الترقية | يحوّل نواقص الموظف إلى خطة من ثلاث خطوات |

## ما هو محاكاة

هذا نموذج أولي ببيانات تجريبية محفوظة في المتصفح. البحث عن مرشحين في لينكدإن وسحب بياناتهم ونشر الوظيفة محاكاة للعرض، ولا يوجد ربط فعلي مع لينكدإن أو أنظمة ERP.

## التقنيات

React 19، TypeScript، Tailwind CSS 4، Vite، Express، `@google/genai`، Netlify Functions.

## التشغيل محلياً

```bash
npm install
cp .env.example .env   # ثم ضع مفتاح Gemini في GEMINI_API_KEY
npm run dev
```

يفتح على http://localhost:3000. المفتاح يبقى في الخادم ولا يصل إلى المتصفح.

## النشر

المشروع مهيأ لـ Netlify: الواجهة ملفات ثابتة، ومسارات `/api` دالة واحدة (`netlify/functions/api.ts`).
أضف `GEMINI_API_KEY` في متغيرات البيئة للموقع. يمكن تغيير الموديل بـ `GEMINI_MODEL`.
