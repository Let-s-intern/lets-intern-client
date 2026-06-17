import { TextField } from '@mui/material';
import { ChangeEvent, memo } from 'react';

interface TextFieldLimitProps {
  type: string;
  label: string;
  placeholder?: string;
  name: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  fullWidth?: boolean;
  maxLength: number;
  multiline?: boolean;
  minRows?: number;
  helperText?: string;
  focused?: boolean;
  error?: boolean;
  required?: boolean;
  size?: 'small' | 'medium';
  autoFocus?: boolean;
}

const TextFieldLimit = ({
  type,
  label,
  placeholder,
  name,
  value,
  onChange,
  autoComplete,
  fullWidth,
  maxLength,
  multiline = false,
  minRows = 1,
  helperText = '',
  focused = false,
  error = false,
  required,
  size = 'small',
  autoFocus,
}: TextFieldLimitProps) => {
  return (
    <div className="flex flex-col items-end gap-1">
      <TextField
        autoFocus={autoFocus}
        inputProps={{ maxLength }}
        type={type}
        label={label}
        placeholder={placeholder}
        name={name}
        size={size}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        fullWidth={fullWidth}
        multiline={multiline}
        minRows={minRows}
        helperText={helperText}
        focused={focused}
        error={error}
      />
      <span className="text-0.875 text-neutral-40">
        {value.length} / {maxLength}
      </span>
    </div>
  );
};

export default memo(TextFieldLimit);
