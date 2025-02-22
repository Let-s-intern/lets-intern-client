import { CurationLocationTypeValues } from '@/api/curation';
import { convertCurationLocationTypeToText } from '@/utils/convert';
import Heading3 from '@components/admin/ui/heading/Heading3';
import Input from '@components/ui/input/Input';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CurationInfoSection = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <Heading3>기본 정보</Heading3>
      <FormControl
        size="small"
        // outline 등 primary 색상 적용
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#6963f6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6963f6',
            },
          },
        }}
      >
        <InputLabel
          id="locationType"
          sx={{
            '&.Mui-focused': {
              color: '#6963F6',
            },
          }}
        >
          노출 영역 선택
        </InputLabel>
        <Select
          labelId="locationType"
          label="노출 영역 선택"
          id="locationType"
          name="locationType"
          defaultValue={CurationLocationTypeValues[0]}
        >
          {CurationLocationTypeValues.map((locationType) => (
            <MenuItem key={locationType} value={locationType}>
              {convertCurationLocationTypeToText(locationType)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Input
        label="제목"
        type="text"
        name="title"
        placeholder="제목을 입력하세요"
        size="small"
      />
      <Input
        label="소제목"
        type="text"
        name="subTitle"
        placeholder="소제목을 입력하세요"
        size="small"
      />
    </div>
  );
};

export default CurationInfoSection;
