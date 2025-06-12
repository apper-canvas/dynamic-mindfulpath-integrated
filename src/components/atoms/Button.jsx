import React from 'react';

const Button = ({ children, className = '', variant = 'primary', size = 'medium', ...props }) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-primary',
    secondary: 'bg-secondary text-gray-700 hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-secondary',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-gray-300',
    ghost: 'text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-gray-300',
    danger: 'bg-error text-white hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-error',
    success: 'bg-success text-white hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-success',
    warning: 'bg-warning text-gray-900 hover:bg-warning/90 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-warning',
  };

  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const mergedClassName = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={mergedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;