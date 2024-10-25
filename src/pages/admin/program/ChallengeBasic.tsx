import {
  ChallengeParticipationType,
  ChallengeType,
  CreateChallengeReq,
  ProgramClassification,
  UpdateChallengeReq,
} from '@/schema';
import {
  challengeTypes,
  challengeTypeToText,
  programClassificationToText,
  programParticipationTypeToText,
} from '@/utils/convert';
import Input from '@components/ui/input/Input';
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';

interface ChallengeBasicProps<
  T extends CreateChallengeReq | UpdateChallengeReq,
> {
  input: Omit<T, 'desc'>;
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

export default function ChallengeBasic<
  T extends CreateChallengeReq | UpdateChallengeReq,
>({ input, setInput }: ChallengeBasicProps<T>) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <FormControl size="small">
        <InputLabel id="programType">프로그램 분류</InputLabel>
        <Select
          labelId="programTypeInfo"
          label="프로그램 분류"
          id="programTypeInfo"
          name="programTypeInfo"
          multiple
          value={input.programTypeInfo?.map(
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
      <FormControl size="small">
        <InputLabel>챌린지 구분</InputLabel>
        <Select
          label="챌린지 구분"
          value={input.challengeType}
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
      {/* (임시) 가격 구분 삭제 */}
      {input.priceInfo !== undefined && input.priceInfo.length > 0 && (
        <FormControl size="small">
          <InputLabel>참여 형태</InputLabel>
          <Select
            label="참여 형태"
            value={input.priceInfo[0].challengeParticipationType}
            onChange={(e) => {
              setInput({
                ...input,
                priceInfo: [
                  {
                    ...input.priceInfo![0],
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
      )}
      <Input
        label="제목"
        type="text"
        name="title"
        placeholder="제목을 입력해주세요"
        size="small"
        onChange={onChange}
      />
      <Input
        label="한 줄 설명"
        type="text"
        name="shortDesc"
        size="small"
        placeholder="한 줄 설명을 입력해주세요"
        onChange={onChange}
      />
      <Input
        label="정원"
        type="number"
        name="participationCount"
        size="small"
        placeholder="총 정원 수를 입력해주세요"
        onChange={onChange}
      />
      <Input
        label="카카오톡 오픈채팅 링크"
        name="chatLink"
        size="small"
        placeholder="카카오톡 오픈채팅 링크를 입력하세요"
        onChange={onChange}
      />
      <Input
        label="카카오톡 오픈채팅 비밀번호"
        name="chatPassword"
        size="small"
        placeholder="카카오톡 오픈채팅 비밀번호를 입력하세요"
        onChange={onChange}
      />
    </div>
  );
}
