import React from 'react';
interface IconProps {
    color?: string;
    height?: number;
    width?: number;
  }

const CheckCircleIcon: React.FC<IconProps> = ({ color = 'currentColor', height, width }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export default CheckCircleIcon;