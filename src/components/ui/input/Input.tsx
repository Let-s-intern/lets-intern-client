import cn from 'classnames';
import { useState } from 'react';

import TextField from '@mui/material/TextField';

interface InputProps {
  type?: string;
  size?: 'small' | 'medium';
  placeholder?: string;
  name?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  error?: boolean;
  fullWidth?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input = ({
  type = 'text',
  size,
  name,
  placeholder,
  value,
  defaultValue,
  label,
  disabled,
  multiline,
  rows,
  maxLength,
  className,
  error,
  fullWidth = true,
  onChange,
}: InputProps) => {
  const [focused, setFocused] = useState(false);

  let inputProps = {};

  if (maxLength) {
    inputProps = { ...inputProps, maxLength };
  }

  const textFieldStyle = !error
    ? {
        backgroundColor: 'white',
        '& .Mui-disabled': {
          backgroundColor: '#f9f9f9',
        },
        '& .MuiOutlinedInput-root': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6963f6',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6963f6',
          },
        },
        '& .MuiOutlinedInput-root.Mui-disabled': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#B9B9B9',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#B9B9B9',
          },
        },
        '& label.Mui-focused': {
          color: '#6963F6',
        },
      }
    : {};

  const textField = (
    <TextField
      type={type}
      size={size}
      label={label}
      placeholder={placeholder}
      name={name}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      onChange={onChange}
      autoComplete="off"
      fullWidth={fullWidth}
      className={className}
      inputProps={inputProps}
      sx={textFieldStyle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      error={error}
    />
  );

  if (!maxLength) {
    return textField;
  }

  return (
    <div>
      {textField}
      <div className="mr-2 mt-1 text-right text-xs">
        <span
          className={cn({
            'text-primary': focused,
            'text-neutral-gray': !focused,
          })}
        >
          {value?.length || 0} / {maxLength}
        </span>
      </div>
    </div>
  );
};

export default Input;
