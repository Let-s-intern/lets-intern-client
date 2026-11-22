import { InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { slugError } from '../utils/tagUtils';

/** 주소 칸의 오류 문구. required 면 빈 값도 오류다 */
export const pageAddressError = (value: string, required: boolean) =>
  required && value === '' ? '페이지 주소가 필요합니다' : slugError(value);

/**
 * 키(slug) 입력. 운영자에게는 사이트 주소 /category/{키} 로 보인다.
 * 오류는 칸을 한 번 건드렸거나(포커스 이탈) 저장을 눌렀을 때(showErrors)만 보인다
 */
const PageAddressField = ({
  value,
  onChange,
  required = false,
  showErrors = false,
  helperText,
  externalError,
}: {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  showErrors?: boolean;
  helperText?: string;
  /** 칸 밖에서 판단한 오류 (예: 이미 쓰는 주소). showErrors 일 때만 보인다 */
  externalError?: string;
}) => {
  const [touched, setTouched] = useState(false);
  const error =
    (touched || showErrors ? pageAddressError(value, required) : undefined) ??
    (showErrors ? externalError : undefined);
  return (
    <TextField
      size="small"
      label="페이지 주소"
      placeholder="resume"
      value={value}
      onChange={(e) => onChange(e.target.value.trim())}
      onBlur={() => setTouched(true)}
      error={Boolean(error)}
      helperText={error ?? helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">/category/</InputAdornment>
        ),
      }}
      sx={{ minWidth: 280 }}
    />
  );
};

export default PageAddressField;
