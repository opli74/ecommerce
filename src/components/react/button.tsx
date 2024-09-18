// src/components/Button.tsx
import React from 'react';

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
  loading,
  size = 'large',
  onClick,
  type = 'submit',
  disabled,
}) => {
  return (
    <button
      className={`bg-slate-900 text-white rounded-2xl px-5 py-2 text-lg md:text-xl font-medium w-full ${
        size === 'small' ? 'max-w-[250px]' : 'max-w-[500px]'
      } flex gap-3 justify-center mt-8 cursor-pointer hover:bg-slate-800`}
      disabled={loading || disabled}
      onClick={onClick}
      type={type}
    >
      {children} {loading && <span className="loader">Loading...</span>}
    </button>
  );
};
