import React from 'react';
import { LOGO_DATA_URI } from './logoData';

interface LogoProps {
  size?: number; // الارتفاع بالبكسل، والعرض يتبع نسبة الصورة
}

/**
 * شعار «كفء»: صورة فيها الاسم نفسه، فلا يُكتب الاسم بجانبها.
 * الصورة مضمّنة في logoData.ts.
 */
export const Logo: React.FC<LogoProps> = ({ size = 40 }) => (
  <img src={LOGO_DATA_URI} alt="كفء" height={size} style={{ height: size, width: 'auto' }} className="block" />
);
