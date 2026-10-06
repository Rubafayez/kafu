import React, { useEffect, useState } from 'react';
import { PromotionEvaluation } from '../../types';
import { buildEmployeeMessage } from '../../utils/employeeMessage';
import { Check, Copy, X } from 'lucide-react';

interface ShareWithEmployeeModalProps {
  evaluation: PromotionEvaluation | null;
  onClose: () => void;
}

export const ShareWithEmployeeModal: React.FC<ShareWithEmployeeModalProps> = ({ evaluation, onClose }) => {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (evaluation) {
      setMessage(buildEmployeeMessage(evaluation));
      setCopied(false);
    }
  }, [evaluation]);

  if (!evaluation) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full text-right my-auto">
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="type-2 text-slate-900">رسالة إلى {evaluation.employee.name}</h2>
            <p className="text-sm text-slate-600 mt-1">راجعها وعدّلها قبل الإرسال. فيها بيانات الموظف فقط.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={14}
            aria-label="نص الرسالة"
            className="w-full p-3 border border-slate-300 rounded-xl text-sm leading-relaxed text-slate-900 bg-surface focus:outline-none focus:border-brand-700"
          />
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleCopy}
            className="w-full min-h-[48px] bg-brand-800 hover:bg-brand-900 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'تم النسخ' : 'انسخ الرسالة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
