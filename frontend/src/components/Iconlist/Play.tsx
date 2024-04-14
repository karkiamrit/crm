import React from 'react';

interface IconProps {
  color?: string;
  height?: number;
  width?: number;
}

const PlayIcon: React.FC<IconProps> = ({ color = 'currentColor', height, width }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-play">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="10 8 16 12 10 16 10 8"/>
  </svg>
);

export default PlayIcon;