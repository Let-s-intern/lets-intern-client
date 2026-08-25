import cn from 'classnames';
import { useState } from 'react';

import TextField from '@mui/material/TextField';

interface InputProps {
  type?: string;
  size?: 'small' | 'medium';
  placeholder?: string;
  name?: string;
  label?: string;
  value?: string | null;
  defaultValue?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  error?: boolean;
  fullWidth?: boolean;
  // 라벨을 항상 위로 띄워둔다. 브라우저 자동완성은 React의 onChange 없이
  // DOM 값만 채워서, MUI가 "값이 비어있다"고 판단해 라벨을 안 띄우는 경우가
  // 있다 — 그 결과 라벨 글자와 자동완성된 값이 겹쳐 보인다(SsoLoginPage에서
  // 실제로 발견됨). 라벨을 상시 고정하면 이 겹침이 애초에 생기지 않는다.
  alwaysShrinkLabel?: boolean;
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
  alwaysShrinkLabel = false,
  onChange,
  onKeyDown,
}: InputProps) => {
  const [focused, setFocused] = useState(false);

  let inputProps = {};

  if (maxLength) {
    inputProps = { ...inputProps, maxLength };
  }

  // 크롬이 자동완성한 인풋은 배경을 파란빛으로 강제로 칠한다(box-shadow
  // 트릭으로만 덮어쓸 수 있다) — 흰 배경으로 되돌려서 나머지 인풋과 색이
  // 어긋나지 않게 한다.
  const autofillStyle = {
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px white inset',
      WebkitTextFillColor: 'inherit',
    },
  };

  const textFieldStyle = !error
    ? {
        ...autofillStyle,
        backgroundColor: 'white',
        '& .Mui-disabled': {
          backgroundColor: '#f9f9f9',
        },
        '& .MuiOutlinedInput-root': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976D2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976D2',
          },
        },
        '& .MuiOutlinedInput-root.Mui-disabled': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976D2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976D2',
          },
        },
        '& label.Mui-focused': {
          color: '#1976D2',
        },
      }
    : autofillStyle;

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
      onKeyDown={onKeyDown}
      autoComplete="off"
      fullWidth={fullWidth}
      className={className}
      inputProps={inputProps}
      slotProps={
        alwaysShrinkLabel ? { inputLabel: { shrink: true } } : undefined
      }
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
