import { twMerge } from '@/lib/twMerge';
import {
  ChallengeIdSchema,
  ChallengeParticipationType,
  CreateChallengeReq,
  ProgramAdminClassification,
  ProgramAdminClassificationEnum,
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
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import SelectFormControl from './SelectFormControl';

interface ChallengeBasicProps<
  T extends CreateChallengeReq | UpdateChallengeReq,
> {
  defaultValue?: Pick<
    ChallengeIdSchema,
    | 'adminClassificationInfo'
    | 'classificationInfo'
    | 'challengeType'
    | 'priceInfo'
    | 'title'
    | 'shortDesc'
    | 'participationCount'
    | 'chatLink'
    | 'chatPassword'
  >;
  className?: string;
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

const ChallengeBasic = React.memo(
  <T extends CreateChallengeReq | UpdateChallengeReq>({
    className,
    defaultValue,
    setInput,
  }: ChallengeBasicProps<T>) => {
    const onChange = (e: SelectChangeEvent) => {
      setInput((prev) => ({ ...prev, [e.target!.name]: e.target!.value }));
    };

    return (
      <div className={twMerge('flex w-full flex-col gap-3', className)}>
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
                programTypeInfo: (
                  e.target.value as ProgramClassification[]
                ).map((item) => ({
                  classificationInfo: {
                    programClassification: item,
                  },
                })),
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

        {/* B2 타입 */}
        <SelectFormControl
          labelId="adminProgramTypeInfo"
          label="B2 타입"
          defaultValue={
            defaultValue?.adminClassificationInfo
              ? defaultValue.adminClassificationInfo.map(
                  (info) => info.programAdminClassification,
                )
              : []
          }
          onChange={(e) =>
            setInput((prev) => ({
              ...prev,
              adminProgramTypeInfo: (
                e.target.value as ProgramAdminClassification[]
              ).map((item) => ({
                classificationInfo: {
                  programAdminClassification: item,
                },
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
          <InputLabel>챌린지 구분</InputLabel>
          <Select
            label="챌린지 구분"
            name="challengeType"
            defaultValue={defaultValue?.challengeType}
            onChange={onChange}
          >
            {challengeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {challengeTypeToText[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {defaultValue?.priceInfo && defaultValue.priceInfo.length > 0 && (
          <FormControl size="small">
            <InputLabel>참여 형태</InputLabel>
            <Select
              label="참여 형태"
              defaultValue={
                defaultValue.priceInfo[0].challengeParticipationType
              }
              onChange={(e) => {
                setInput((prev) => ({
                  ...prev,
                  priceInfo: [
                    {
                      ...prev.priceInfo?.[0],
                      challengeParticipationType: e.target
                        .value as ChallengeParticipationType,
                    },
                  ],
                }));
              }}
            >
              {Object.keys(programParticipationTypeToText).map(
                (type: string) => (
                  <MenuItem key={type} value={type}>
                    {programParticipationTypeToText[type]}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        )}
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
        <Input
          label="카카오톡 오픈채팅 링크"
          name="chatLink"
          size="small"
          placeholder="카카오톡 오픈채팅 링크를 입력하세요"
          defaultValue={defaultValue?.chatLink}
          onChange={onChange}
        />
        <Input
          label="카카오톡 오픈채팅 비밀번호"
          name="chatPassword"
          size="small"
          placeholder="카카오톡 오픈채팅 비밀번호를 입력하세요"
          defaultValue={defaultValue?.chatPassword}
          onChange={onChange}
        />
      </div>
    );
  },
) as (<T extends CreateChallengeReq | UpdateChallengeReq>(
  props: ChallengeBasicProps<T>,
) => React.ReactElement) & { displayName: string };

ChallengeBasic.displayName = 'ChallengeBasic';

export default ChallengeBasic;
