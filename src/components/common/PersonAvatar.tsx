import React from 'react';
import { Linkedin } from 'lucide-react';

interface PersonAvatarProps {
  name: string;
  fromLinkedin?: boolean;
  large?: boolean;
}

/**
 * صورة الشخص: دائرة فيها الحرف الأول من اسمه، أو شعار لينكدإن إن كان قادماً من ترشيح لينكدإن.
 */
export const PersonAvatar: React.FC<PersonAvatarProps> = ({ name, fromLinkedin = false, large = false }) => {
  const size = large ? 'w-12 h-12' : 'w-11 h-11';
  return fromLinkedin ? (
    <span
      title="من لينكدإن"
      className={`shrink-0 ${size} rounded-full bg-[#0A66C2] text-white flex items-center justify-center`}
    >
      <Linkedin className="w-5 h-5" />
    </span>
  ) : (
    <span className={`shrink-0 ${size} rounded-full bg-brand-50 text-link flex items-center justify-center type-2`}>
      {name.charAt(0)}
    </span>
  );
};
