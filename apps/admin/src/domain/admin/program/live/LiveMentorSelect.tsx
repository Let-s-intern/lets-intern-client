import { MenuItem, SelectChangeEvent } from '@mui/material';

import { useAdminUserMentorListQuery } from '@/api/mentor/mentor';
import SelectFormControl from '@/domain/admin/program/ui/form/SelectFormControl';

interface Props {
  value?: number | null;
  onChange: (mentorId: number) => void;
}

/**
 * 라이브에 멘토 계정을 연결한다. 멘토 프로필 후기는 이 연결로 모인다.
 * 서버가 연결 해제를 받지 않아(mentorId null 은 무시) "선택 안 함" 옵션은 두지 않는다.
 */
function LiveMentorSelect({ value, onChange }: Props) {
  const { data } = useAdminUserMentorListQuery();

  const handleChange = (e: SelectChangeEvent<number | ''>) => {
    if (e.target.value === '') return;
    onChange(Number(e.target.value));
  };

  return (
    <SelectFormControl<number | ''>
      labelId="live-mentor-select-label"
      label="멘토 계정 연결"
      value={data ? (value ?? '') : ''}
      onChange={handleChange}
    >
      {data?.mentorList.map((mentor) => (
        <MenuItem key={mentor.id} value={mentor.id}>
          {mentor.name} ({mentor.email ?? '이메일 없음'})
        </MenuItem>
      ))}
    </SelectFormControl>
  );
}

export default LiveMentorSelect;
