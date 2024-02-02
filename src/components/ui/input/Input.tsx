import { useState } from 'react';
import cn from 'classnames';

import TextField from '@mui/material/TextField';

interface InputProps {
  type?: string;
  placeholder?: string;
  name?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  type = 'text',
  name,
  placeholder,
  value,
  label,
  disabled,
  multiline,
  rows,
  maxLength,
  className,
  onChange,
}: InputProps) => {
  const [focused, setFocused] = useState(false);

  let inputProps = {};

  if (maxLength) {
    inputProps = { ...inputProps, maxLength };
  }

  const textFieldStyle = {
    backgroundColor: 'white',
    '& .MuiOutlinedInput-root': {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#6963f6',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#6963f6',
      },
    },
    '& label.Mui-focused': {
      color: '#6963F6',
    },
  };

  const textField = (
    <TextField
      type={type}
      label={label}
      placeholder={placeholder}
      name={name}
      value={value}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      onChange={onChange}
      autoComplete="off"
      fullWidth
      className={className}
      inputProps={inputProps}
      sx={textFieldStyle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
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
