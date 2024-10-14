// src/components/Button.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Loader } from './loader';
import Spinner from './spinner';

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
    className={`bg-slate-900 text-white rounded-full px-5 py-2 text-lg md:text-xl font-medium w-full ${
      size === 'small' ? 'max-w-[250px]' : 'max-w-[500px]'
    } flex gap-3 justify-center items-center cursor-pointer hover:bg-slate-700 min-w-[175px] text-center`}
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
        { loading && <Spinner size={20} colorMode='light'/>}
      </div>
      <div
        ref={textRef}
      >
        {children}
      </div>
    </button>
  );
};
