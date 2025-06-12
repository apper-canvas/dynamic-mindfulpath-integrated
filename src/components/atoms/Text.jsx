import React from 'react';

const Text = ({ as = 'p', children, className = '', ...props }) => {
  const Component = as;
  const baseStyles = {
    h1: 'text-3xl font-heading font-bold text-gray-800',
    h2: 'text-2xl font-bold text-gray-800',
    h3: 'text-xl font-semibold text-gray-800',
    h4: 'text-lg font-semibold text-gray-800',
    p: 'text-gray-600',
    span: 'text-base text-gray-700',
    label: 'block text-sm font-medium text-gray-700',
    small: 'text-xs text-gray-500',
  };

  const mergedClassName = `${baseStyles[as]} ${className}`;

  return (
    <Component className={mergedClassName} {...props}>
      {children}
    </Component>
  );
};

export default Text;