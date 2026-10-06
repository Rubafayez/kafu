import React from 'react';
import { Code2, LucideIcon, Megaphone, Truck, Users } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'الهندسة والتقنية': Code2,
  'العمليات وسلاسل الإمداد': Truck,
  'التسويق والمبيعات': Megaphone,
  'الموارد البشرية والإدارة': Users,
};

/**
 * أيقونة دائرية لكل فريق، بنفس شكل دائرة الحرف الأول في قائمة الموظفين.
 */
export const TeamIcon: React.FC<{ department: string }> = ({ department }) => {
  const Icon = ICONS[department] ?? Users;
  return (
    <span
      aria-hidden="true"
      className="shrink-0 w-11 h-11 rounded-full bg-brand-50 text-link flex items-center justify-center"
    >
      <Icon className="w-5 h-5" />
    </span>
  );
};
