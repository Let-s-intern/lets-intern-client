import {
  useAdminChallengeMentorListQuery,
  useAdminUserMentorListQuery,
} from '@/api/mentor';
import SelectFormControl from '@components/admin/program/SelectFormControl';
import Heading2 from '@components/admin/ui/heading/Heading2';
import {
  Checkbox,
  ListItemText,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SelectedMentorNames = ({ selected }: { selected: number[] }) => {
  const { data } = useAdminUserMentorListQuery();

  return (
    <>
      {selected
        .map((id) => {
          const target = data?.mentorList.find((mentor) => mentor.id === id);
          return target?.name;
        })
        .join(', ')}
    </>
  );
};

const useMentorSelect = () => {
  const { challengeId } = useParams();
  const { data: challengeData } = useAdminChallengeMentorListQuery(challengeId);

  const [selectedMentorIds, setSelectedMentorIds] = useState<number[]>([]);

  useEffect(() => {
    const defaultMentorIds =
      challengeData?.mentorList.map((item) => item.userId) ?? [];
    setSelectedMentorIds(defaultMentorIds);
    return () => setSelectedMentorIds([]);
  }, [challengeData]);

  return {
    selectedMentorIds,
    setSelectedMentorIds,
  };
};

interface Props {
  onChange: (value: number[]) => void;
}

function ChallengeMentorRegistrationSection({ onChange }: Props) {
  const { challengeId } = useParams();
  const { data: userData } = useAdminUserMentorListQuery();
  const { selectedMentorIds, setSelectedMentorIds } = useMentorSelect();

  const handleChange = (e: SelectChangeEvent<number[]>) => {
    const ids = e.target.value as number[];
    setSelectedMentorIds(ids);
    onChange(ids);
  };

  return (
    <section className="flex flex-col gap-2">
      <Heading2>멘토 등록</Heading2>
      {!challengeId && (
        <span className="text-xxsmall12 text-system-error">
          *챌린지 생성 후 멘토 등록이 가능합니다.
        </span>
      )}
      <SelectFormControl<number[]>
        labelId="multiple-mentor-checkbox-label"
        label="멘토 목록"
        value={selectedMentorIds}
        renderValue={(selected) => <SelectedMentorNames selected={selected} />}
        onChange={handleChange}
        disabled={!challengeId}
      >
        {userData?.mentorList.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            <Checkbox
              checked={selectedMentorIds.some((id) => id === item.id)}
            />
            <ListItemText primary={`${item.id} ${item.name}`} />
          </MenuItem>
        ))}
      </SelectFormControl>
    </section>
  );
}

export default ChallengeMentorRegistrationSection;
