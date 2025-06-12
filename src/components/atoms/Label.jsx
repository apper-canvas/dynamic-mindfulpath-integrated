import React from 'react';

const Label = ({ children, className = '', ...props }) => {
  const baseStyle = 'block text-sm font-medium text-gray-700 mb-2';
  const mergedClassName = `${baseStyle} ${className}`;

  return (
    <label className={mergedClassName} {...props}>
      {children}
    </label>
  );
};

export default Label;