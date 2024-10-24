import {
  ChallengeParticipationType,
  ChallengeType,
  CreateChallengeReq,
  ProgramClassification,
} from '@/schema';
import {
  challengeTypes,
  challengeTypeToText,
  programClassificationToText,
  programParticipationTypeToText,
} from '@/utils/convert';
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';

interface ChallengeBasicProps {
  input: Omit<CreateChallengeReq, 'desc'>;
  setInput: React.Dispatch<
    React.SetStateAction<Omit<CreateChallengeReq, 'desc'>>
  >;
}

export default function ChallengeBasic({
  input,
  setInput,
}: ChallengeBasicProps) {
  console.log(input);

  return (
    <>
      <FormControl fullWidth size="small">
        <InputLabel>챌린지 구분</InputLabel>
        <Select
          label="챌린지 구분"
          defaultValue={input.challengeType}
          onChange={(e) => {
            setInput({
              ...input,
              challengeType: e.target.value as ChallengeType,
            });
          }}
        >
          {challengeTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {challengeTypeToText[type]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="programType">프로그램 분류</InputLabel>
        <Select
          labelId="programTypeInfo"
          label="프로그램 분류"
          id="programTypeInfo"
          name="programTypeInfo"
          multiple
          value={input.programTypeInfo.map(
            (info) => info.classificationInfo.programClassification,
          )}
          onChange={(e) =>
            setInput((prev) => ({
              ...prev,
              programTypeInfo: (e.target.value as ProgramClassification[]).map(
                (item) => ({
                  classificationInfo: {
                    programClassification: item,
                  },
                }),
              ),
            }))
          }
          input={<OutlinedInput label="프로그램 분류" />}
          renderValue={(selectedList) => (
            <div className="flex flex-wrap gap-2">
              {selectedList.map((selected) => (
                <Chip
                  key={selected}
                  label={
                    programClassificationToText[
                      selected as ProgramClassification
                    ]
                  }
                />
              ))}
            </div>
          )}
        >
          {Object.keys(programClassificationToText).map((type) => (
            <MenuItem key={type} value={type}>
              {programClassificationToText[type as ProgramClassification]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>참여 형태</InputLabel>
        <Select
          label="참여 형태"
          size="small"
          defaultValue={input.priceInfo[0].challengeParticipationType}
          onChange={(e) => {
            setInput({
              ...input,
              priceInfo: [
                {
                  ...input.priceInfo[0],
                  challengeParticipationType: e.target
                    .value as ChallengeParticipationType,
                },
              ],
            });
          }}
        >
          {Object.keys(programParticipationTypeToText).map((type: string) => (
            <MenuItem key={type} value={type}>
              {programParticipationTypeToText[type]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
