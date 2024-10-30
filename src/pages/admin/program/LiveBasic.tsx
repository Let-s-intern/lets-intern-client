import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import {
  CreateLiveReq,
  LiveIdSchema,
  liveJob,
  LiveProgressType,
  ProgramClassification,
  UpdateLiveReq,
} from '@/schema';
import {
  liveProgressTypeToText,
  programClassificationToText,
} from '@/utils/convert';
import Input from '@components/ui/input/Input';

interface LiveBasicProps<T extends CreateLiveReq | UpdateLiveReq> {
  defaultValue?: Pick<
    LiveIdSchema,
    | 'classificationInfo'
    | 'job'
    | 'title'
    | 'shortDesc'
    | 'participationCount'
    | 'progressType'
  >;
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

export default function LiveBasic<T extends CreateLiveReq | UpdateLiveReq>({
  defaultValue,
  setInput,
}: LiveBasicProps<T>) {
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent,
  ) => {
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
          defaultValue={
            defaultValue?.classificationInfo
              ? defaultValue.classificationInfo.map(
                  (info) => info.programClassification,
                )
              : []
          }
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
        <InputLabel id="progressType">온/오프라인 여부</InputLabel>
        <Select
          labelId="progressType"
          id="progressType"
          label="온/오프라인 여부"
          name="progressType"
          defaultValue={defaultValue?.progressType ?? undefined}
          onChange={onChange}
        >
          {Object.keys(liveProgressTypeToText).map((key) => (
            <MenuItem key={key} value={key}>
              {liveProgressTypeToText[key as LiveProgressType]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small">
        <InputLabel id="job">직무</InputLabel>
        <Select
          labelId="job"
          id="job"
          label="직무"
          name="job"
          defaultValue={defaultValue?.job}
          onChange={onChange}
        >
          {Object.keys(liveJob.enum).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Input
        label="제목"
        type="text"
        name="title"
        placeholder="제목을 입력해주세요"
        defaultValue={defaultValue?.title}
        size="small"
        onChange={onChange}
      />
      <Input
        label="한 줄 설명"
        type="text"
        name="shortDesc"
        size="small"
        defaultValue={defaultValue?.shortDesc}
        placeholder="한 줄 설명을 입력해주세요"
        onChange={onChange}
      />
      <Input
        label="정원"
        type="number"
        name="participationCount"
        size="small"
        defaultValue={String(defaultValue?.participationCount)}
        placeholder="총 정원 수를 입력해주세요"
        onChange={onChange}
      />
    </div>
  );
}
