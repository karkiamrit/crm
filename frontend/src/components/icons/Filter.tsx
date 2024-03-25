// FilterIcon.tsx
import React from 'react';

interface FilterIconProps {
  color?: string;
  width?: number;
  height?: number;
}

const FilterIcon: React.FC<FilterIconProps> = ({ color = 'currentColor', width = 24, height = 24 }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
};

export default FilterIcon;