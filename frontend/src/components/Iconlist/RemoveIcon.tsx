import React from 'react';

interface IconProps {
  color?: string;
  height?: number;
  width?: number;
  className?: string;
  strokeWidth?: number;
}

const RemoveIcon: React.FC<IconProps> = ({
  color = 'currentColor',
  height = 24,
  width = 24,
  className = "w-5 h-5 mr-2 -ml-1",
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default RemoveIcon;
