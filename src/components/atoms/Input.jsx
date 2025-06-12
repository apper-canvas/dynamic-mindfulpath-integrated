import React from 'react';

const Input = ({ type = 'text', className = '', ...props }) => {
  const baseStyle = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent';
  const mergedClassName = `${baseStyle} ${className}`;

  if (type === 'textarea') {
    return (
      <textarea
        className={`${baseStyle} resize-none ${className}`}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      className={mergedClassName}
      {...props}
    />
  );
};

export default Input;