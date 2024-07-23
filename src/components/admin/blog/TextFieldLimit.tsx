import { TextField } from '@mui/material';
import { ChangeEvent, useEffect, useRef } from 'react';

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
}

export default function TextFieldLimit({
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
}: TextFieldLimitProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // maxlength 설정
    if (ref.current) {
      ref.current.maxLength = maxLength;
    }
  });

  return (
    <div className="flex flex-col items-end gap-1">
      <TextField
        inputRef={ref}
        type={type}
        label={label}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        fullWidth={fullWidth}
        multiline={multiline}
        minRows={minRows}
      />
      <span className="text-0.875 text-neutral-40">
        {value.length} / {maxLength}
      </span>
    </div>
  );
}
