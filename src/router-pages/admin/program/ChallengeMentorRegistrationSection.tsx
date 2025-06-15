import { useAdminUserMentorListQuery } from '@/api/mentor';
import SelectFormControl from '@components/admin/program/SelectFormControl';
import Heading2 from '@components/admin/ui/heading/Heading2';
import {
  Checkbox,
  ListItemText,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';

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

function ChallengeMentorRegistrationSection() {
  const { data } = useAdminUserMentorListQuery();
  const [selectedMentorIds, setSelectedMentorIds] = useState<number[]>([]);

  const handleChange = (e: SelectChangeEvent<number[]>) => {
    setSelectedMentorIds(e.target.value as number[]);
  };

  return (
    <section className="flex flex-col gap-2">
      <Heading2>멘토 등록</Heading2>
      <SelectFormControl<number[]>
        labelId="multiple-mentor-checkbox-label"
        label="멘토 목록"
        value={selectedMentorIds}
        renderValue={(selected) => <SelectedMentorNames selected={selected} />}
        onChange={handleChange}
      >
        {data?.mentorList.map((item) => (
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
