import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import { employeeTypeSchema } from '@/api/career/careerSchema';

export interface CareerEditValues {
  company: string;
  job: string;
  field: string;
  position: string;
  department: string;
  employmentType: string;
  /** `YYYY-MM` */
  startDate: string;
  /** `YYYY-MM`. 비어 있으면 재직 중 */
  endDate: string;
  isRepresentative: boolean;
}

// 「기타(직접입력)」 은 멘토 앱 입력 방식이라 빼고, 지금 값이 목록 밖이면 그 값을 함께 보인다
const EMPLOYMENT_TYPES = employeeTypeSchema.options.filter(
  (type) => type !== '기타(직접입력)',
);

interface Props {
  initialValues: CareerEditValues;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: CareerEditValues) => void;
}

/**
 * 경력 수정. 회사·직무·업무분야·직책·부서·고용형태·기간과 대표 경력 지정.
 * 열 때마다 새로 마운트해 `initialValues` 로 시작한다.
 */
export default function CareerEditDialog({
  initialValues,
  isSaving,
  onClose,
  onSubmit,
}: Props) {
  const [values, setValues] = useState(initialValues);

  const set = (patch: Partial<CareerEditValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const employmentTypes = EMPLOYMENT_TYPES.includes(
    values.employmentType as (typeof EMPLOYMENT_TYPES)[number],
  )
    ? EMPLOYMENT_TYPES
    : [...EMPLOYMENT_TYPES, values.employmentType].filter(Boolean);

  const isPeriodInvalid =
    values.endDate !== '' && values.endDate < values.startDate;
  const isInvalid =
    !values.company.trim() ||
    !values.job.trim() ||
    !values.employmentType ||
    !values.startDate ||
    isPeriodInvalid;

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-base font-semibold">경력 수정</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
          <TextField
            size="small"
            label="회사"
            required
            value={values.company}
            onChange={(e) => set({ company: e.target.value })}
          />
          <TextField
            size="small"
            label="직무"
            required
            value={values.job}
            onChange={(e) => set({ job: e.target.value })}
          />
          <TextField
            size="small"
            label="업무분야"
            value={values.field}
            onChange={(e) => set({ field: e.target.value })}
          />
          <TextField
            size="small"
            label="직책"
            value={values.position}
            onChange={(e) => set({ position: e.target.value })}
          />
          <TextField
            size="small"
            label="부서"
            value={values.department}
            onChange={(e) => set({ department: e.target.value })}
          />
          <TextField
            select
            size="small"
            label="고용형태"
            required
            value={values.employmentType}
            onChange={(e) => set({ employmentType: e.target.value })}
          >
            {employmentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            type="month"
            label="시작"
            required
            InputLabelProps={{ shrink: true }}
            value={values.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
          />
          <TextField
            size="small"
            type="month"
            label="종료"
            InputLabelProps={{ shrink: true }}
            value={values.endDate}
            error={isPeriodInvalid}
            helperText={
              isPeriodInvalid
                ? '종료는 시작 이후여야 합니다.'
                : '재직 중이면 비워 두세요.'
            }
            onChange={(e) => set({ endDate: e.target.value })}
          />
        </div>
        <FormControlLabel
          className="mt-4"
          control={
            <Checkbox
              checked={values.isRepresentative}
              // 대표 해제 API 는 없다. 다른 경력을 대표로 지정하면 해제된다
              disabled={initialValues.isRepresentative}
              onChange={(e) => set({ isRepresentative: e.target.checked })}
            />
          }
          label="대표 경력으로 설정 (웹 멘토 카드의 회사·직무가 이 경력으로 바뀝니다)"
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="contained"
          disabled={isInvalid || isSaving}
          onClick={() => onSubmit(values)}
        >
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
