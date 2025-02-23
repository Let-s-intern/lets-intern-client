import { CurationBodyType } from '@/api/curation';
import dayjs from '@/lib/dayjs';
import Heading3 from '@components/admin/ui/heading/Heading3';
import Input from '@components/ui/input/Input';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import {
  DateTimePicker,
  DateTimePickerSlotProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

interface CurationVisibleSectionProps {
  form: CurationBodyType;
  setForm: React.Dispatch<React.SetStateAction<CurationBodyType>>;
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

const CurationVisibleSection = ({
  form,
  setForm,
}: CurationVisibleSectionProps) => {
  const [showMoreButton, setShowMoreButton] = useState(false);

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
            value={form.startDate ? dayjs(form.startDate) : null}
            onChange={(date) => {
              setForm({ ...form, startDate: dateForm(date) });
            }}
          />
          <DateTimePicker
            label="종료 일자"
            name="endDate"
            format="YYYY.MM.DD(dd) HH:mm"
            ampm={false}
            slotProps={dateTimePickerSlotProps}
            value={form.endDate ? dayjs(form.endDate) : null}
            onChange={(date) => {
              setForm({ ...form, endDate: dateForm(date) });
            }}
          />
        </LocalizationProvider>
      </div>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          label="모집 마감 5일 남은 프로그램 자동 노출 여부"
          value={form.showImminentList}
          onChange={() =>
            setForm({ ...form, showImminentList: !form.showImminentList })
          }
        />
        <FormControlLabel
          control={<Checkbox />}
          label="더보기 버튼 노출 여부"
          value={showMoreButton}
          onChange={() => {
            setShowMoreButton(!showMoreButton);
            setForm({ ...form, moreUrl: '' });
          }}
        />
        <Input
          label="더보기 URL"
          type="text"
          name="moreUrl"
          placeholder="더보기 버튼 URL을 입력하세요"
          size="small"
          disabled={!showMoreButton}
          value={form.moreUrl}
          onChange={onChangeForm}
        />
      </FormGroup>
    </div>
  );
};

export default CurationVisibleSection;
