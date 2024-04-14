import React from 'react';

interface IconProps {
  color?: string;
  height?: number;
  width?: number;
  className?: string;
  strokeWidth?: number;
}

const PhoneIcon: React.FC<IconProps> = ({
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
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

export default PhoneIcon;