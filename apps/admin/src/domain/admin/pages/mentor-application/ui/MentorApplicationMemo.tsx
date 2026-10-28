import { usePatchAdminMentorApplicationMemo } from '@/api/mentor-application/mentorApplication';
import { MENTOR_APPLICATION_MEMO_MAX_LENGTH } from '@/api/mentor-application/mentorApplicationSchema';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, TextField } from '@mui/material';

interface Props {
  applicationId: number;
  value: string;
  isDirty: boolean;
  onChange: (value: string) => void;
  onSaved: () => void;
}

/** 신청서 모달 위쪽의 운영 메모. 입력값은 모달이 들고 있다(닫을 때 저장 여부를 묻기 위해) */
export default function MentorApplicationMemo({
  applicationId,
  value,
  isDirty,
  onChange,
  onSaved,
}: Props) {
  const { snackbar } = useAdminSnackbar();
  const patchMemo = usePatchAdminMentorApplicationMemo();

  const handleSave = async () => {
    try {
      await patchMemo.mutateAsync({ id: applicationId, memo: value });
      onSaved();
      snackbar('운영 메모가 저장되었습니다.');
    } catch (err) {
      snackbar(`문제가 발생했습니다: ${err}`);
    }
  };

  return (
    <div className="bg-neutral-95 flex flex-col gap-2 rounded-md p-4">
      <label
        htmlFor="mentor-application-memo"
        className="text-xsmall14 text-neutral-0 font-semibold"
      >
        운영 메모
        <span className="text-neutral-40 font-normal">
          {' '}
          · 지원자에게는 보이지 않습니다
        </span>
      </label>
      <TextField
        id="mentor-application-memo"
        multiline
        minRows={3}
        fullWidth
        size="small"
        placeholder="검토 내용, 연락한 기록 등"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ maxLength: MENTOR_APPLICATION_MEMO_MAX_LENGTH }}
        sx={{ backgroundColor: 'white' }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xsmall12 text-neutral-40">
          {value.length} / {MENTOR_APPLICATION_MEMO_MAX_LENGTH}
        </span>
        <Button
          variant="contained"
          size="small"
          disabled={!isDirty || patchMemo.isPending}
          onClick={handleSave}
        >
          메모 저장
        </Button>
      </div>
    </div>
  );
}
