'use client';
import {
  CreateChallengeReq,
  CreateLiveReq,
  UpdateChallengeReq,
  UpdateLiveReq,
} from '@/schema';
import {
  DateTimePicker,
  DateTimePickerSlotProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

const dateTimePickerSlotProps: DateTimePickerSlotProps<Dayjs, false> = {
  textField: {
    size: 'small',
    sx: {
      fontSize: '14px',
      width: '100%',
    },
  },
};

interface ScheduleProps<
  T extends
    | CreateChallengeReq
    | UpdateChallengeReq
    | CreateLiveReq
    | UpdateLiveReq,
> {
  defaultValue?: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    beginning: Dayjs | null;
    deadline: Dayjs | null;
  };
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
  onDeadlineChange: (value: Dayjs | null) => void;
}
export default function ProgramSchedule<
  T extends
    | CreateChallengeReq
    | UpdateChallengeReq
    | CreateLiveReq
    | UpdateLiveReq,
>({ defaultValue, setInput, onDeadlineChange }: ScheduleProps<T>) {
  return (
    <div className="flex flex-col items-center gap-3">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DateTimePicker
          label="시작 일자"
          name="startDate"
          format="YYYY.MM.DD(dd) HH:mm"
          ampm={false}
          slotProps={dateTimePickerSlotProps}
          defaultValue={defaultValue?.startDate}
          onChange={(value) =>
            setInput((prev) => ({
              ...prev,
              startDate: value?.format('YYYY-MM-DDTHH:mm'),
            }))
          }
        />

        <DateTimePicker
          label="종료 일자"
          name="endDate"
          format="YYYY.MM.DD(dd) HH:mm"
          ampm={false}
          slotProps={dateTimePickerSlotProps}
          defaultValue={defaultValue?.endDate}
          onChange={(value) =>
            setInput((prev) => ({
              ...prev,
              endDate: value?.format('YYYY-MM-DDTHH:mm'),
            }))
          }
        />

        <DateTimePicker
          label="모집 시작 일자"
          name="beginning"
          format="YYYY.MM.DD(dd) HH:mm"
          ampm={false}
          slotProps={dateTimePickerSlotProps}
          defaultValue={defaultValue?.beginning}
          onChange={(value) =>
            setInput((prev) => ({
              ...prev,
              beginning: value?.format('YYYY-MM-DDTHH:mm'),
            }))
          }
        />

        <DateTimePicker
          label="모집 마감 일자"
          name="deadline"
          format="YYYY.MM.DD(dd) HH:mm"
          ampm={false}
          slotProps={dateTimePickerSlotProps}
          defaultValue={defaultValue?.deadline}
          onChange={(value) => {
            setInput((prev) => ({
              ...prev,
              deadline: value?.format('YYYY-MM-DDTHH:mm'),
            }));
            onDeadlineChange(value);
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
