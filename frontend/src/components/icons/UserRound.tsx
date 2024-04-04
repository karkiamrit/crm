import React from 'react';

interface IconProps {
  color?: string;
  height?: number;
  width?: number;
  className?: string;
  strokeWidth?: number;
}

const UsersRoundIcon: React.FC<IconProps> = ({
  color = 'currentColor',
  height = 17,
  width = 17,
  className = "lucide lucide-users-round",
  strokeWidth = 2
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 21a8 8 0 0 0-16 0" />
    <circle cx="10" cy="8" r="5" />
    <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
  </svg>
);

export default UsersRoundIcon;