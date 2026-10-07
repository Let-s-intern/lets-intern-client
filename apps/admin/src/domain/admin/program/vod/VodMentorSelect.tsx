import { Autocomplete, TextField } from '@mui/material';

import { useAdminUserMentorListQuery } from '@/api/mentor/mentor';
import { AdminUserMentorList } from '@/api/mentor/mentorSchema';

type Mentor = AdminUserMentorList['mentorList'][number];

interface Props {
  value?: number | null;
  onChange: (mentorId: number) => void;
}

/** 운영자는 멘토를 닉네임으로 알고, 실명은 동명이인이 있어 둘 다 보여준다 */
const toLabel = (mentor: Mentor) => {
  const name = mentor.nickname
    ? `${mentor.nickname} (${mentor.name})`
    : mentor.name;
  return `${name} · ${mentor.email ?? '이메일 없음'}`;
};

/**
 * VOD 에 멘토 계정을 연결한다. 멘토 정산은 이 연결을 기준으로 한다.
 * 닉네임·실명·이메일 어느 것으로도 검색된다.
 * 서버가 연결 해제를 받지 않아(mentorId null 은 무시) 지우기 버튼은 두지 않는다.
 */
function VodMentorSelect({ value, onChange }: Props) {
  const { data } = useAdminUserMentorListQuery();
  const mentors = data?.mentorList ?? [];
  const selected = mentors.find((mentor) => mentor.id === value) ?? null;

  return (
    <Autocomplete
      size="small"
      options={mentors}
      value={selected}
      getOptionLabel={toLabel}
      isOptionEqualToValue={(option, target) => option.id === target.id}
      onChange={(_, mentor) => {
        if (mentor) onChange(mentor.id);
      }}
      disableClearable={selected !== null}
      noOptionsText="일치하는 멘토가 없습니다"
      renderInput={(params) => (
        <TextField
          {...params}
          label="멘토 계정 연결"
          placeholder="닉네임, 이름, 이메일로 검색"
        />
      )}
    />
  );
}

export default VodMentorSelect;
