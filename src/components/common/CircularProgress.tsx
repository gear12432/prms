import React from 'react';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress?: number; // 0 to 100 or indeterminate
  color?: string;
  label?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 64,
  strokeWidth = 6,
  progress,
  color = '#397EF5',
  label
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const isIndeterminate = progress === undefined;

  const strokeDashoffset = isIndeterminate 
    ? 0 
    : circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className={`transform -rotate-90 ${isIndeterminate ? 'animate-spin' : ''}`} width={size} height={size}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        {!isIndeterminate && (
          <span className="absolute text-xs font-bold text-gray-800">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      {label && <p className="text-xs font-medium text-gray-600 animate-pulse">{label}</p>}
    </div>
  );
};
