import {
  CurationBodyType,
  CurationEditBodyType,
  CurationInfoType,
  CurationLocationType,
  CurationLocationTypeValues,
} from '@/api/curation';
import { convertCurationLocationTypeToText } from '@/utils/convert';
import Heading3 from '@components/admin/ui/heading/Heading3';
import Input from '@components/ui/input/Input';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Dispatch } from 'react';

interface CurationInfoSectionProps<
  T extends CurationBodyType | CurationEditBodyType,
> {
  defaultValue?: CurationInfoType;
  setLocationType: Dispatch<React.SetStateAction<CurationLocationType>>;
  setForm: Dispatch<React.SetStateAction<T>>;
}

const CurationInfoSection = <
  T extends CurationBodyType | CurationEditBodyType,
>({
  defaultValue,
  setLocationType,
  setForm,
}: CurationInfoSectionProps<T>) => {
  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
          defaultValue={
            defaultValue?.locationType || CurationLocationTypeValues[0]
          }
          onChange={(e) =>
            setLocationType(e.target.value as CurationLocationType)
          }
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
        defaultValue={defaultValue?.title || ''}
        onChange={onChangeForm}
      />
      <Input
        label="소제목"
        type="text"
        name="subTitle"
        placeholder="소제목을 입력하세요"
        size="small"
        defaultValue={defaultValue?.subTitle || ''}
        onChange={onChangeForm}
      />
    </div>
  );
};

export default CurationInfoSection;
