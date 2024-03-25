import React from 'react';

interface IconProps {
  color?: string;
  height?: number;
  width?: number;
}

const ListFilterIcon: React.FC<IconProps> = ({ color = 'currentColor', height, width}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-filter">
    <path d="M3 6h18"/>
    <path d="M7 12h10"/>
    <path d="M10 18h4"/>
  </svg>
);

export default ListFilterIcon;