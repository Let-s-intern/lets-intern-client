import {
  CurationBodyType,
  CurationEditBodyType,
  CurationInfoType,
} from '@/api/curation';
import Input from '@/common/input/Input';
import Heading3 from '@/domain/admin/ui/heading/Heading3';
import dayjs from '@/lib/dayjs';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import {
  DateTimePicker,
  DateTimePickerSlotProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

interface CurationVisibleSectionProps<
  T extends CurationBodyType | CurationEditBodyType,
> {
  defaultValue?: CurationInfoType;
  setForm: React.Dispatch<React.SetStateAction<T>>;
}

const dateTimePickerSlotProps: DateTimePickerSlotProps<Dayjs, false> = {
  textField: {
    size: 'small',
    sx: {
      fontSize: '14px',
      width: '100%',
    },
  },
};

const CurationVisibleSection = <
  T extends CurationBodyType | CurationEditBodyType,
>({
  defaultValue,
  setForm,
}: CurationVisibleSectionProps<T>) => {
  const [showMoreButton, setShowMoreButton] = useState(
    defaultValue?.moreUrl !== '' && typeof defaultValue?.moreUrl === 'string',
  );

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const dateForm = (date: Dayjs | null) => {
    return date?.format('YYYY-MM-DDTHH:mm:ss') || '';
  };

  return (
    <div className="flex flex-1 flex-col gap-y-2.5">
      <Heading3>노출 기간</Heading3>
      <div className="flex w-full gap-x-5">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DateTimePicker
            label="시작 일자"
            name="startDate"
            format="YYYY.MM.DD(dd) HH:mm"
            ampm={false}
            slotProps={dateTimePickerSlotProps}
            defaultValue={
              defaultValue?.startDate ? dayjs(defaultValue.startDate) : null
            }
            onChange={(date) => {
              setForm((prev) => ({ ...prev, startDate: dateForm(date) }));
            }}
          />
          <DateTimePicker
            label="종료 일자"
            name="endDate"
            format="YYYY.MM.DD(dd) HH:mm"
            ampm={false}
            slotProps={dateTimePickerSlotProps}
            defaultValue={
              defaultValue?.endDate ? dayjs(defaultValue.endDate) : null
            }
            onChange={(date) => {
              setForm((prev) => ({ ...prev, endDate: dateForm(date) }));
            }}
          />
        </LocalizationProvider>
      </div>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={defaultValue?.showImminentList}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  showImminentList: e.target.checked,
                }))
              }
            />
          }
          label="모집 마감 5일 남은 프로그램 자동 노출 여부"
        />
        <FormControlLabel
          control={<Checkbox checked={showMoreButton} />}
          label="더보기 버튼 노출 여부"
          onChange={() => {
            setShowMoreButton(!showMoreButton);
            setForm((prev) => ({ ...prev, moreUrl: '' }));
          }}
        />
        <Input
          label="더보기 URL"
          type="text"
          name="moreUrl"
          placeholder="더보기 버튼 URL을 입력하세요"
          size="small"
          disabled={!showMoreButton}
          defaultValue={defaultValue?.moreUrl || ''}
          onChange={onChangeForm}
        />
      </FormGroup>
    </div>
  );
};

export default CurationVisibleSection;
