import { InputAdornment, TextField } from '@mui/material';
import { slugError } from '../utils/placementUtils';

/** 키(slug) 입력. 운영자에게는 사이트 주소 /category/{키} 로 보인다 */
const PageAddressField = ({
  value,
  onChange,
  required = false,
  helperText,
}: {
  value: string;
  onChange: (value: string) => void;
  /** 랜딩 페이지 주소처럼 비우면 안 되는 칸 */
  required?: boolean;
  /** 오류가 없을 때 아래에 보이는 안내 */
  helperText: string;
}) => {
  const error =
    required && value === '' ? '페이지 주소가 필요합니다' : slugError(value);
  return (
    <TextField
      size="small"
      label="페이지 주소"
      placeholder="resume"
      value={value}
      onChange={(e) => onChange(e.target.value.trim())}
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
