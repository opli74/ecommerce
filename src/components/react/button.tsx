// src/components/Button.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Loader } from './loader';

type ButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  size?: 'small' | 'large';
  onClick?(): void;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  size = 'large',
  onClick,
  type = 'submit',
  disabled = false,
}) => {
  // Define dimensions based on size
  const buttonHeight = size === 'small' ? '40px' : '50px';
  const loaderSize = size === 'small' ? 24 : 24; // Adjust loader size as needed
  const loaderMargin = 8; // Space between loader and text

  const textRef = useRef<HTMLDivElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.offsetWidth;
      setTextWidth(width);
    }
  }, [children]);

  return (
    <button
    className={`bg-slate-900 text-white rounded-2xl px-5 py-2 text-lg md:text-xl font-medium w-full ${
      size === 'small' ? 'max-w-[250px]' : 'max-w-[500px]'
    } flex gap-3 justify-center mt-8 cursor-pointer hover:bg-slate-800 min-w-[175px]`}
      disabled={loading || disabled}
      onClick={onClick}
      type={type}
      aria-busy={loading}
    >
      <div
        className="absolute"
        style={{
          marginLeft: textWidth+24+20
        }}
      >
        {loading && <Loader variant="small" size={loaderSize} aria-label="Loading" />}
      </div>
      <div
        ref={textRef}
      >
        {children}
      </div>
    </button>
  );
};
