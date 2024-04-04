import React from 'react';

interface IconProps {
  color?: string;
  height?: number;
  width?: number;
}

interface IconProps {
    color?: string;
    height?: number;
    width?: number;
    className?: string; // Add className property
}

interface IconProps {
    color?: string;
    height?: number;
    width?: number;
    className?: string;
    strokeWidth?: number; // Add strokeWidth property
    d?: string;
}

const MailIcon: React.FC<IconProps> = ({
        color = 'currentColor',
        height,
        width,
        className = "w-4 h-4 mr-2",
        strokeWidth = 2,
        d = "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
      d={d}
    />
  </svg>
);

export default MailIcon;