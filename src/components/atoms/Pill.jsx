import React from 'react';

const Pill = ({ children, className = '', color = 'primary', ...props }) => {
  const baseStyle = 'px-3 py-1 rounded-full text-sm font-medium';
  const colorStyles = {
    primary: 'bg-primary/10 text-primary',
    warning: 'bg-warning/10 text-warning',
    success: 'bg-success/10 text-success',
    gray: 'bg-gray-100 text-gray-700',
  };

  const mergedClassName = `${baseStyle} ${colorStyles[color] || colorStyles.gray} ${className}`;

  return (
    <span className={mergedClassName} {...props}>
      {children}
    </span>
  );
};

export default Pill;