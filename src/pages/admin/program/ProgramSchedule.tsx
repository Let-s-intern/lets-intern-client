import {
  CreateChallengeReq,
  CreateLiveReq,
  UpdateChallengeReq,
  UpdateLiveReq,
} from '@/schema';
import { SxProps } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

const dateTimePickerSx: SxProps = {
  width: '100%',
  label: {
    fontSize: '0.875rem',
    // color: '#4C4F56',
  },
  '.MuiInputBase-formControl': {
    fontSize: '0.875rem',
  },

  '& .MuiInputBase-input': {
    padding: '8px 12px',
    borderRadius: '0.25rem',
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
}
export default function ProgramSchedule<
  T extends
    | CreateChallengeReq
    | UpdateChallengeReq
    | CreateLiveReq
    | UpdateLiveReq,
>({ defaultValue, setInput }: ScheduleProps<T>) {
  return (
    <div className="flex flex-col items-center gap-3">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DateTimePicker
          label="시작 일자"
          name="startDate"
          sx={dateTimePickerSx}
          format="YYYY.MM.DD(dd) HH:mm"
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
          sx={dateTimePickerSx}
          format="YYYY.MM.DD(dd) HH:mm"
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
          sx={dateTimePickerSx}
          format="YYYY.MM.DD(dd) HH:mm"
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
          sx={dateTimePickerSx}
          format="YYYY.MM.DD(dd) HH:mm"
          defaultValue={defaultValue?.deadline}
          onChange={(value) =>
            setInput((prev) => ({
              ...prev,
              deadline: value?.format('YYYY-MM-DDTHH:mm'),
            }))
          }
        />
      </LocalizationProvider>
    </div>
  );
}
