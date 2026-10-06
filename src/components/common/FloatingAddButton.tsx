import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  label: string;
  onClick: () => void;
}

/**
 * زر إضافة عائم ثابت في زاوية الشاشة: دائرة فيها + تتمدد عند المرور أو التركيز لتُظهر اسم الإجراء.
 * على الجوال يجلس فوق شريط التنقل السفلي.
 */
export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="group fixed z-30 bottom-20 md:bottom-8 right-5 sm:right-8 h-14 min-w-14 px-4 flex items-center justify-center rounded-full bg-brand-800 hover:bg-brand-900 text-white shadow-lg shadow-black/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-700"
  >
    <Plus className="w-6 h-6 shrink-0" />
    <span className="overflow-hidden whitespace-nowrap font-bold text-base max-w-0 opacity-0 transition-all duration-300 ease-out group-hover:max-w-[14rem] group-hover:opacity-100 group-hover:mr-2 group-focus-visible:max-w-[14rem] group-focus-visible:opacity-100 group-focus-visible:mr-2">
      {label}
    </span>
  </button>
);
