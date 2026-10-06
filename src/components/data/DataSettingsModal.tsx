import React, { useState } from 'react';
import { Employee } from '../../types';
import { INITIAL_EMPLOYEES } from '../../data/initialData';
import { X, Upload, Download, RefreshCw, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface DataSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onUpdateEmployees: (employees: Employee[]) => void;
}

export const DataSettingsModal: React.FC<DataSettingsModalProps> = ({
  isOpen,
  onClose,
  employees,
  onUpdateEmployees,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Restore sample data
  const handleUseSampleData = () => {
    onUpdateEmployees(INITIAL_EMPLOYEES);
    setSuccessMessage('تمت استعادة البيانات التجريبية (25 موظفاً).');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // CSV Template download
  const handleDownloadTemplate = () => {
    const csvHeader = 'الاسم,المسمى الوظيفي,القسم,سنوات الخبرة,المهارات,متوسط التقييم\n';
    const sampleRows = [
      'سارة العتيبي,مطورة واجهات أمامية أولى,الهندسة والتقنية,5.5,"تطوير البرمجيات الحديثة (5); معمارية النظم السحابية (4); قيادة الفرق (4)",4.9',
      'عمر الزهراني,أخصائي تحسين عمليات أول,العمليات وسلاسل الإمداد,4.8,"تحسين العمليات (5); إدارة سلاسل الإمداد (4); لين وسيكس سيغما (4)",4.85',
      'نورة الشمري,محللة ذكاء أعمال أولى,الهندسة والتقنية,4.2,"تحليل البيانات (5); Power BI (5); SQL (5)",4.85',
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'نموذج_بيانات_الموظفين_كفء.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('الملف فارغ.');

        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          throw new Error('الملف لا يحتوي على بيانات كافية.');
        }

        // Parse rows
        const parsedEmployees: Employee[] = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',');
          if (parts.length >= 3) {
            const name = parts[0]?.replace(/"/g, '').trim();
            const title = parts[1]?.replace(/"/g, '').trim();
            const department = (parts[2]?.replace(/"/g, '').trim() as any) || 'الهندسة والتقنية';
            const exp = parseFloat(parts[3]) || 3;

            if (name && title) {
              parsedEmployees.push({
                id: `emp-csv-${Date.now()}-${i}`,
                name,
                title,
                department,
                experienceYears: exp,
                skills: [
                  { id: `sk-${i}-1`, name: 'إدارة المهام والعمليات', level: 4 },
                  { id: `sk-${i}-2`, name: 'التواصل والقيادة', level: 3 },
                  { id: `sk-${i}-3`, name: 'حل المشكلات', level: 4 },
                  { id: `sk-${i}-4`, name: 'تحليل البيانات', level: 3 },
                ],
                reviews: [
                  { quarter: 'Q1', year: 2025, score: 4.3, feedback: 'التزام متميز بالأهداف.', strengths: ['الإنتاجية'] },
                  { quarter: 'Q2', year: 2025, score: 4.4, feedback: 'تطور ملحوظ في الأداء الجماعي.', strengths: ['روح الفريق'] },
                  { quarter: 'Q3', year: 2025, score: 4.6, feedback: 'مبادرات إيجابية وسرعة إنجاز.', strengths: ['المبادرة'] },
                  { quarter: 'Q4', year: 2025, score: 4.7, feedback: 'أداء راسخ ومرشح للتطور.', strengths: ['الكفاءة'] },
                ],
                projects: [
                  {
                    id: `proj-csv-${i}`,
                    title: 'مشروع تطوير سير العمل الداخلي',
                    role: 'منسق رئيسي',
                    outcome: 'تحسين كفاءة الفريق بنسبة 20%.',
                    skillsUsed: ['إدارة المهام والعمليات', 'التواصل والقيادة'],
                    year: '2025',
                  },
                ],
                courses: [
                  { id: `c-csv-${i}`, title: 'إدارة المشاريع الفعالة', provider: 'المركز المهني', completionDate: '2024-10' },
                ],
                lastPromotionDate: null,
              });
            }
          }
        }

        if (parsedEmployees.length > 0) {
          onUpdateEmployees(parsedEmployees);
          setSuccessMessage(`تم استيراد ${parsedEmployees.length} موظف بنجاح.`);
          setTimeout(() => setSuccessMessage(null), 3500);
        } else {
          throw new Error('لم يتم العثور على سجلات موظفين صالحة بالملف.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'حدث خطأ أثناء قراءة ملف الـ CSV.');
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden transition-all text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="type-2 text-slate-900">
              بيانات الموظفين
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ارفع ملف موظفيك أو ارجع للبيانات التجريبية
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {(
            // Data Tab
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      قاعدة بيانات الموظفين الحالية
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      يوجد حالياً {employees.length} موظف مسجل في النظام
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseSampleData}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg transition-colors min-h-[36px]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-link" />
                    <span>استخدم بيانات تجريبية (25 موظف)</span>
                  </button>
                </div>
              </div>

              {/* Upload CSV */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center space-y-3">
                <div className="mx-auto w-10 h-10 rounded-full bg-brand-50 text-link flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                    رفع ملف CSV يحتوي على موظفي شركتك
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    يدعم ملفات Excel و Google Sheets بصيغة CSV المشفرة بـ UTF-8
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <label className="cursor-pointer px-4 py-2 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold rounded-lg transition-colors min-h-[40px] inline-flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>اختيار ملف CSV</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-4 py-2 bg-surface border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors min-h-[40px] inline-flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل نموذج CSV الجاهز</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-surface border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors min-h-[44px]"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
