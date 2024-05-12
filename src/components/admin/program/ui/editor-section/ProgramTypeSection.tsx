import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { challengeTopicToText } from '../../../../../utils/convert';

interface Props {
  values: any;
  setValues: (values: any) => void;
  handleFAQIdListReset: () => void;
}

const ProgramTypeSection = ({
  values,
  setValues,
  handleFAQIdListReset,
}: Props) => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="type">프로그램 분류</InputLabel>
        <Select
          labelId="type"
          id="type"
          label="프로그램 분류"
          value={values.type ? values.type : ''}
          onChange={(e) => {
            setValues({ ...values, type: e.target.value });
            handleFAQIdListReset();
          }}
        >
          <MenuItem value="CHALLENGE_FULL">챌린지(전체)</MenuItem>
          <MenuItem value="CHALLENGE_HALF">챌린지(일부)</MenuItem>
          <MenuItem value="BOOTCAMP">부트캠프</MenuItem>
          <MenuItem value="LETS_CHAT">렛츠챗</MenuItem>
        </Select>
      </FormControl>
      {(values.type === 'CHALLENGE_FULL' ||
        values.type === 'CHALLENGE_HALF') && (
        <FormControl fullWidth>
          <InputLabel id="topic">챌린지 주제</InputLabel>
          <Select
            labelId="topic"
            id="topic"
            label="챌린지 주제"
            value={values.topic ? values.topic : ''}
            onChange={(e) => setValues({ ...values, topic: e.target.value })}
          >
            {Object.keys(challengeTopicToText).map((topic: any) => (
              <MenuItem value={topic}>{challengeTopicToText[topic]}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default ProgramTypeSection;
