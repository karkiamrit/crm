// PencilIcon.tsx
import React from 'react';

interface IconProps {
  color?: string;
  height?: number;
  width?: number;
}

const PencilIcon: React.FC<IconProps> = ({ color = 'currentColor', height, width }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    <path d="m15 5 4 4"/>
  </svg>
);

export default PencilIcon;