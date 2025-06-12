import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, type, value, onChange, placeholder, rows, required, className, ...props }) => {
  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        {...props}
      />
    </div>
  );
};

export default FormField;