import {
  useAdminChallengeMentorListQuery,
  useAdminUserMentorListQuery,
} from '@/api/mentor/mentor';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

const useMentorSelect = () => {
  const params = useParams<{ challengeId: string }>();
  const { challengeId } = params;
  const { data: challengeData } = useAdminChallengeMentorListQuery(challengeId);

  const defaultMentorIds = useMemo(
    () => challengeData?.mentorList.map((item) => item.userId) ?? [],
    [challengeData],
  );

  // 사용자가 고르기 전에는 서버 목록을 그대로 보여 주고, 고른 뒤에는 그 값을 유지한다
  const [pickedMentorIds, setSelectedMentorIds] = useState<number[] | null>(
    null,
  );
  const selectedMentorIds = pickedMentorIds ?? defaultMentorIds;

  return {
    selectedMentorIds,
    setSelectedMentorIds,
  };
};

interface Props {
  onChange?: (value: number[]) => void;
}

function ChallengeMentorRegistrationSection({ onChange }: Props) {
  const { challengeId } = useParams();
  const { data: userData } = useAdminUserMentorListQuery();
  const { selectedMentorIds, setSelectedMentorIds } = useMentorSelect();

  const mentorList = useMemo(() => userData?.mentorList ?? [], [userData]);
  // Autocomplete 는 value 참조가 바뀔 때마다 입력창을 비우므로 참조를 유지한다
  const selectedMentors = useMemo(
    () => mentorList.filter((mentor) => selectedMentorIds.includes(mentor.id)),
    [mentorList, selectedMentorIds],
  );

  const handleChange = (_: unknown, mentors: typeof mentorList) => {
    // 전체 목록에 없는 기존 멘토는 화면에는 없지만 선택에서 빠지지 않게 유지한다
    const hiddenIds = selectedMentorIds.filter(
      (id) => !mentorList.some((mentor) => mentor.id === id),
    );
    const ids = [...hiddenIds, ...mentors.map((mentor) => mentor.id)];
    setSelectedMentorIds(ids);
    if (onChange) onChange(ids);
  };

  return (
    <section className="flex flex-col gap-2">
      <Heading2>멘토 등록</Heading2>
      {!challengeId && (
        <span className="text-xxsmall12 text-system-error">
          *챌린지 생성 후 멘토 등록이 가능합니다.
        </span>
      )}
      <Autocomplete
        multiple
        size="small"
        fullWidth
        disableCloseOnSelect
        disabled={!challengeId}
        options={mentorList}
        value={selectedMentors}
        getOptionLabel={(mentor) => `${mentor.id} ${mentor.name}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={handleChange}
        noOptionsText="검색 결과가 없습니다"
        renderOption={(props, mentor, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox checked={selected} sx={{ mr: 1 }} />
              {`${mentor.id} ${mentor.name}`}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="멘토 목록 (이름 또는 id 검색)" />
        )}
      />
    </section>
  );
}

export default ChallengeMentorRegistrationSection;
