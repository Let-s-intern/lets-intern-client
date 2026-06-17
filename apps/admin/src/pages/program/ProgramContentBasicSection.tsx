import Input from '@/common/input/v1/Input';
import SelectFormControl from '@/domain/admin/program/ui/form/SelectFormControl';
import {
  liveAndVodJob,
  ProgramAdminClassification,
  ProgramAdminClassificationEnum,
  ProgramClassification,
} from '@/schema';
import { programClassificationToText } from '@/utils/convert';
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import type React from 'react';
import { useCallback } from 'react';

import type { ContentProgramFormInput } from './programContentTypes';

interface ProgramContentBasicSectionProps {
  input: ContentProgramFormInput;
  setInput: React.Dispatch<React.SetStateAction<ContentProgramFormInput>>;
}

const ProgramContentBasicSection: React.FC<ProgramContentBasicSectionProps> = ({
  input,
  setInput,
}) => {
  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [setInput],
  );

  const onChangeSelect = useCallback(
    (e: SelectChangeEvent) => {
      setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [setInput],
  );

  return (
    <section className="flex flex-col gap-3">
      <FormControl size="small">
        <InputLabel id="programTypeInfo">프로그램 분류</InputLabel>
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
                  classificationInfo: { programClassification: item },
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

      <SelectFormControl
        labelId="adminProgramTypeInfo"
        label="B2 타입"
        multiple
        value={input.adminProgramTypeInfo.map(
          (info) => info.classificationInfo.programAdminClassification,
        )}
        onChange={(e) =>
          setInput((prev) => ({
            ...prev,
            adminProgramTypeInfo: (
              e.target.value as ProgramAdminClassification[]
            ).map((item) => ({
              classificationInfo: { programAdminClassification: item },
            })),
          }))
        }
        renderValue={(selectedList) => (
          <div className="flex flex-wrap gap-2">
            {selectedList.map((selected) => (
              <Chip
                key={selected}
                label={
                  ProgramAdminClassificationEnum.enum[
                    selected as ProgramAdminClassification
                  ]
                }
              />
            ))}
          </div>
        )}
      >
        {Object.values(ProgramAdminClassificationEnum.enum).map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </SelectFormControl>

      <FormControl size="small">
        <InputLabel id="job">직무</InputLabel>
        <Select
          labelId="job"
          id="job"
          label="직무"
          name="job"
          value={input.job}
          onChange={onChangeSelect}
        >
          {Object.keys(liveAndVodJob.enum).map((key) => (
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
        size="small"
        value={input.title}
        onChange={onChangeText}
      />
      <Input
        label="한 줄 설명"
        type="text"
        name="shortDesc"
        size="small"
        placeholder="한 줄 설명을 입력해주세요"
        value={input.shortDesc}
        onChange={onChangeText}
      />
      <Input
        label="자료 구성"
        type="text"
        name="contentComposition"
        size="small"
        placeholder="자료 구성을 입력해주세요"
        value={input.contentComposition}
        onChange={onChangeText}
      />
      <Input
        label="열람 방식"
        type="text"
        name="accessMethod"
        size="small"
        placeholder="열람 방식을 입력해주세요"
        value={input.accessMethod}
        onChange={onChangeText}
      />
      <Input
        label="추천 대상"
        type="text"
        name="recommendedFor"
        size="small"
        placeholder="추천 대상을 입력해주세요"
        value={input.recommendedFor}
        onChange={onChangeText}
      />
    </section>
  );
};

export default ProgramContentBasicSection;
