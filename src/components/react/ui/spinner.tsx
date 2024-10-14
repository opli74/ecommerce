// src/components/Spinner.tsx
import React, { useId } from 'react';

interface SpinnerProps {
  size: number; // Size of the spinner in pixels
  colorMode: 'light' | 'dark'; // Current color mode
  dashLength?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size, 
  colorMode, 
  dashLength=120 
}) => 
{
  const uniqueId = useId();

  const radius = 28;
  const circumference = 2 * Math.PI * radius; 

  const gapLength = circumference - dashLength;

  return (
    <svg
      className={`animate-spin`}
      viewBox="0 0 64 64"
      fill="none"
      width={size}
      height={size}
      aria-label="Loading"
      role="img"
      style={{ shapeRendering: 'geometricPrecision' }} // Enhances rendering quality
    >
      {/* Define Gradients with Unique IDs */}
      <defs>
        <linearGradient id={`spinner-gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            stopColor={colorMode === 'light' ? '#fff' : '#000'}
            stopOpacity="1"
          />
          <stop
            offset="100%"
            stopColor={colorMode === 'light' ? '#fff' : '#000'}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <circle
        cx="32"
        cy="32"
        r={radius}
        stroke={colorMode === 'light' ? '#ccc' : '#555'}
        strokeWidth="2"
        opacity={0.1}
      />

      <circle
        cx="32"
        cy="32"
        r={radius}
        stroke={`url(#spinner-gradient-${uniqueId})`}
        strokeWidth="4"
        strokeDasharray={`${dashLength} ${gapLength}`}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
    </svg>
  );
};

export default Spinner;
