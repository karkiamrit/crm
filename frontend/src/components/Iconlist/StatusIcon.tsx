import React from 'react';

interface IconProps {
  color?: string;
  height?: number;
  width?: number;
  className?: string;
  strokeWidth?: number;
}

const StatusIcon: React.FC<IconProps> = ({
  color = 'currentColor',
  height = 24,
  width = 24,
  className = "w-4 h-4 mr-2 text-gray-400",
  strokeWidth = 2
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth={strokeWidth}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default StatusIcon;
